/**
 * Export Sanity posts missing from content/blog into Markdown files.
 * Body/meta of existing MD files are kept; FAQ frontmatter is refreshed from Sanity.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { loadEnvFiles, ROOT } from "./load-env.mjs";
import { portableTextToMarkdown } from "./lib/portable-text-to-markdown.mjs";

loadEnvFiles();

const CONTENT_DIR = path.join(ROOT, "content", "blog");

function yamlEscape(value) {
  const s = String(value ?? "");
  if (/[:#{}[\],&*!|>'"%@`?]/.test(s) || s.includes("\n") || /^\d+\./.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}

function faqYamlBlock(faqs) {
  if (!faqs?.length) return "";
  const lines = ["faq:"];
  for (const item of faqs) {
    lines.push(`  - question: ${yamlEscape(item.question)}`);
    lines.push(`    answer: ${yamlEscape(item.answer)}`);
  }
  return lines.join("\n");
}

/** Refresh only the `faq` frontmatter field; leave body + other meta untouched. */
function upsertFaqFrontMatter(raw, faqs) {
  const parsed = matter(raw);
  const prev = JSON.stringify(parsed.data.faq ?? null);
  const next = faqs.length ? faqs : undefined;
  if (JSON.stringify(next ?? null) === prev) return null;
  const data = { ...parsed.data };
  if (next) data.faq = next;
  else delete data.faq;
  return matter.stringify(parsed.content.replace(/^\n/, ""), data);
}

function toFrontMatter(meta) {
  const lines = ["---"];
  lines.push(`title: ${yamlEscape(meta.title)}`);
  lines.push(`description: ${yamlEscape(meta.description)}`);
  lines.push(`slug: ${meta.slug}`);
  lines.push(`date: ${JSON.stringify(meta.date)}`);
  lines.push(`updated: ${JSON.stringify(meta.updated)}`);
  lines.push(`author: ${yamlEscape(meta.author)}`);
  lines.push(`category: ${yamlEscape(meta.category)}`);
  lines.push("tags:");
  for (const tag of meta.tags || []) lines.push(`  - ${yamlEscape(tag)}`);
  lines.push(`heroImage: ${meta.heroImage}`);
  lines.push(`heroImageAlt: ${yamlEscape(meta.heroImageAlt)}`);
  if (meta.excerpt) lines.push(`excerpt: ${yamlEscape(meta.excerpt)}`);
  if (meta.readingTimeMinutes) {
    lines.push(`readingTimeMinutes: ${meta.readingTimeMinutes}`);
  }
  const faqBlock = faqYamlBlock(meta.faq);
  if (faqBlock) lines.push(faqBlock);
  lines.push("---", "");
  return lines.join("\n");
}

function isoDateOnly(iso) {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return String(iso).slice(0, 10);
}

export async function syncSanityBlogToMd() {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });

  const existing = new Set(
    fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/i, "")),
  );

  const projectId = process.env.VITE_SANITY_PROJECT_ID?.trim();
  if (!projectId) {
    console.log("[sync-sanity-blog] No Sanity project — skipping");
    return { written: [] };
  }

  const client = createClient({
    projectId,
    dataset: process.env.VITE_SANITY_DATASET?.trim() || "production",
    apiVersion: process.env.VITE_SANITY_API_VERSION?.trim() || "2024-01-01",
    token: process.env.VITE_SANITY_TOKEN?.trim() || undefined,
    useCdn: !process.env.VITE_SANITY_TOKEN?.trim(),
  });
  const builder = imageUrlBuilder(client);

  const rows = await client.fetch(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    excerpt,
    description,
    publishedAt,
    _updatedAt,
    readingTimeMinutes,
    tags,
    mainImage { asset, alt },
    body,
    faqs[] { question, answer }
  }`);

  const written = [];
  const faqsUpdated = [];
  for (const row of rows || []) {
    if (!row?.slug) continue;

    const faqs = (row.faqs || []).filter((f) => f?.question && f?.answer);

    if (existing.has(row.slug)) {
      const out = path.join(CONTENT_DIR, `${row.slug}.md`);
      const raw = fs.readFileSync(out, "utf8");
      const next = upsertFaqFrontMatter(raw, faqs);
      if (next && next !== raw) {
        fs.writeFileSync(out, next, "utf8");
        faqsUpdated.push(row.slug);
      }
      continue;
    }

    let heroImage = "/og-image.webp";
    if (row.mainImage?.asset) {
      try {
        heroImage = builder.image(row.mainImage).width(1400).quality(85).url();
      } catch {
        /* keep default */
      }
    }

    const bodyBlocks = (row.body || []).map((block) => {
      if (block?._type === "image" && block.asset) {
        try {
          return {
            ...block,
            _resolvedUrl: builder.image(block).width(1200).quality(85).url(),
          };
        } catch {
          return block;
        }
      }
      return block;
    });

    const excerpt =
      row.excerpt?.trim() ||
      row.description?.trim() ||
      "Read the full article on the TechVerge Solutions blog.";
    const description =
      row.description?.trim() || excerpt.slice(0, 160) || row.title;

    const md =
      toFrontMatter({
        title: row.title,
        description,
        slug: row.slug,
        date: isoDateOnly(row.publishedAt),
        updated: isoDateOnly(row._updatedAt ?? row.publishedAt),
        author: "TechVerge Solutions",
        category: "Automation",
        tags: row.tags || [],
        heroImage,
        heroImageAlt: row.mainImage?.alt?.trim() || row.title,
        excerpt,
        readingTimeMinutes: row.readingTimeMinutes || undefined,
        faq: faqs,
      }) + portableTextToMarkdown(bodyBlocks);

    const out = path.join(CONTENT_DIR, `${row.slug}.md`);
    fs.writeFileSync(out, md, "utf8");
    written.push(row.slug);
    existing.add(row.slug);
  }

  console.log(
    `[sync-sanity-blog] Wrote ${written.length} Markdown file(s)${
      written.length ? `: ${written.join(", ")}` : ""
    }; refreshed FAQs on ${faqsUpdated.length}`,
  );
  return { written, faqsUpdated };
}

import { pathToFileURL } from "node:url";
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  syncSanityBlogToMd().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
