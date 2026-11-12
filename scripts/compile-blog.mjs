/**
 * Compile content/blog/*.md → src/generated/blog-posts.json
 * (meta + HTML body for runtime + prerender injection).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { createClient } from "@sanity/client";
import { loadEnvFiles, ROOT } from "./load-env.mjs";
import { syncSanityBlogToMd } from "./sync-sanity-blog-to-md.mjs";

loadEnvFiles();

const CONTENT_DIR = path.join(ROOT, "content", "blog");
const OUT_DIR = path.join(ROOT, "src", "generated");
const OUT_FILE = path.join(OUT_DIR, "blog-posts.json");

marked.setOptions({
  gfm: true,
  breaks: false,
});

function stripBlogExcerptLabel(value) {
  return String(value ?? "").replace(/^\s*blog excerpt:\s*/i, "").trim();
}

function estimateReadingMinutes(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function sanityFaqsFit(title, slug, faqs) {
  if (!faqs?.length) return false;
  const topic = `${title} ${slug}`.toLowerCase();
  if (!/voice|receptionist|phone/.test(topic)) return true;
  const questions = faqs.map((item) => item.question).join(" ").toLowerCase();
  return /voice|receptionist|phone|call/.test(questions);
}

function normalizeFaq(faq) {
  if (!Array.isArray(faq)) return [];
  return faq
    .filter((item) => item?.question?.trim() && item?.answer?.trim())
    .map((item) => ({
      question: String(item.question).trim(),
      answer: String(item.answer).trim(),
    }))
    .slice(0, 12);
}

function slugifyHeading(text) {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/gi, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function addHeadingIdsAndExtractToc(html) {
  const toc = [];
  const used = new Map();

  const withIds = html.replace(
    /<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (_match, level, attrs = "", inner) => {
      const text = String(inner)
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!text) {
        return `<h${level}${attrs || ""}>${inner}</h${level}>`;
      }

      let id = slugifyHeading(text) || `section-${toc.length + 1}`;
      const count = used.get(id) || 0;
      used.set(id, count + 1);
      if (count > 0) id = `${id}-${count + 1}`;

      toc.push({ id, text, level: Number(level) });

      if (/\sid\s*=/.test(attrs)) {
        return `<h${level}${attrs}>${inner}</h${level}>`;
      }
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: withIds, toc };
}

function enhanceHtml(html) {
  // Add classes for typography consistency with existing blog CSS
  let out = html
    .replace(
      /<h2(\s[^>]*)?>/gi,
      '<h2$1 class="font-display text-2xl md:text-3xl font-bold text-foreground pt-4 scroll-mt-28">',
    )
    .replace(
      /<h3(\s[^>]*)?>/gi,
      '<h3$1 class="font-display text-xl md:text-2xl font-bold text-foreground pt-3 scroll-mt-28">',
    )
    .replace(/<p>/g, '<p class="text-muted-foreground leading-relaxed">')
    .replace(
      /<ul>/g,
      '<ul class="list-disc pl-6 space-y-2 text-muted-foreground">',
    )
    .replace(
      /<ol>/g,
      '<ol class="list-decimal pl-6 space-y-2 text-muted-foreground">',
    )
    .replace(/<a /g, '<a class="text-primary underline underline-offset-2" ')
    .replace(
      /<table>/g,
      '<div class="my-8 overflow-x-auto rounded-xl border border-border/50"><table class="w-full min-w-[36rem] text-left text-sm md:text-base">',
    )
    .replace(/<\/table>/g, "</table></div>")
    .replace(
      /<img src="([^"]+)" alt="([^"]*)"(?: title="([^"]*)")? ?\/?>/g,
      (_m, src, alt, title) => {
        const caption = title
          ? `<figcaption class="mt-3 text-sm text-muted-foreground text-center">${title}</figcaption>`
          : "";
        return `<figure class="my-8"><div class="overflow-hidden rounded-xl border border-border/50 bg-muted/30"><img src="${src}" alt="${alt}" loading="lazy" decoding="async" class="h-full w-full object-cover" width="1200" height="800" /></div>${caption}</figure>`;
      },
    );

  // Merge duplicate class attributes if id was inserted before class replacement
  out = out.replace(
    /<(h[23])([^>]*?)class="([^"]*)"([^>]*?)class="([^"]*)"/gi,
    '<$1$2class="$3 $5"$4',
  );

  return out;
}

function normalizeRelated(related) {
  if (!Array.isArray(related)) return [];
  return related.map(String).map((s) => s.trim()).filter(Boolean);
}

function normalizeCta(cta, category) {
  if (cta && typeof cta === "object" && cta.path) {
    return {
      label: String(cta.label || "Talk with TechVerge").trim(),
      path: String(cta.path).trim(),
      description: cta.description
        ? String(cta.description).trim()
        : undefined,
    };
  }

  const cat = String(category || "").toLowerCase();
  if (cat.includes("voice")) {
    return {
      label: "Explore AI Voice Agents",
      path: "/services/ai-voice-agents",
      description:
        "See how we design inbound agents that answer calls, qualify callers, and book jobs with clear human handoffs.",
    };
  }
  if (cat.includes("n8n") || cat.includes("process")) {
    return {
      label: "Explore Business Automation",
      path: "/services/business-automation",
      description:
        "Connect forms, CRM, email, and calendars so routine work stops living in copy-paste.",
    };
  }
  return {
    label: "Explore AI Automation",
    path: "/services/ai-automation",
    description:
      "Design lead follow-up and back-office automation that responds before opportunities go cold.",
  };
}

async function fetchSanityFaqMap() {
  const projectId = process.env.VITE_SANITY_PROJECT_ID?.trim();
  if (!projectId) return new Map();
  try {
    const client = createClient({
      projectId,
      dataset: process.env.VITE_SANITY_DATASET?.trim() || "production",
      apiVersion: process.env.VITE_SANITY_API_VERSION?.trim() || "2024-01-01",
      useCdn: true,
    });
    const rows = await client.fetch(
      `*[_type == "post" && defined(slug.current)]{
        "slug": slug.current,
        faqs[]{ question, answer }
      }`,
    );
    const map = new Map();
    for (const row of rows || []) {
      if (!row?.slug) continue;
      map.set(row.slug, normalizeFaq(row.faqs));
    }
    return map;
  } catch (err) {
    console.warn("[compile-blog] Sanity FAQ overlay skipped:", err?.message || err);
    return new Map();
  }
}

export async function compileBlog() {
  await syncSanityBlogToMd();

  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const sanityFaqs = await fetchSanityFaqMap();

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const posts = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = String(data.slug || file.replace(/\.md$/i, "")).trim();
    if (!slug || !data.title) {
      console.warn(`[compile-blog] Skipping ${file}: missing title/slug`);
      continue;
    }

    const parsedHtml = marked.parse(content || "");
    const { html: withIds, toc } = addHeadingIdsAndExtractToc(parsedHtml);
    const bodyHtml = enhanceHtml(withIds);
    const datePublished = String(data.date || "").slice(0, 10);
    const dateModified = String(data.updated || data.date || "").slice(0, 10);
    const heroImage = String(data.heroImage || "/og-image.webp");
    const heroImageAlt = String(data.heroImageAlt || data.title);
    const description = stripBlogExcerptLabel(data.description || data.excerpt || data.title);
    const excerpt = stripBlogExcerptLabel(data.excerpt || description);
    const category = String(data.category || "Blog");
    const quickAnswer = data.quickAnswer
      ? stripBlogExcerptLabel(data.quickAnswer)
      : excerpt;

    posts.push({
      slug,
      title: String(data.title),
      description,
      excerpt,
      quickAnswer,
      datePublished,
      dateModified,
      author: String(data.author || "TechVerge Solution"),
      category,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      readingTimeMinutes:
        Number(data.readingTimeMinutes) ||
        estimateReadingMinutes(content || ""),
      featuredImage: {
        src: heroImage,
        alt: heroImageAlt,
        width: Number(data.heroImageWidth) || 1400,
        height: Number(data.heroImageHeight) || 934,
      },
      ogImage: heroImage,
      ogImageAlt: String(data.ogImageAlt || heroImageAlt),
      faq: sanityFaqsFit(String(data.title), slug, sanityFaqs.get(slug))
        ? sanityFaqs.get(slug)
        : normalizeFaq(data.faq),
      toc,
      relatedSlugs: normalizeRelated(data.related),
      cta: normalizeCta(data.cta, category),
      bodyHtml,
      source: "markdown",
    });
  }

  posts.sort((a, b) => b.datePublished.localeCompare(a.datePublished));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(posts, null, 2), "utf8");
  console.log(
    `[compile-blog] Wrote ${posts.length} posts → ${path.relative(ROOT, OUT_FILE)}`,
  );
  return posts;
}

import { pathToFileURL } from "node:url";
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  compileBlog().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
