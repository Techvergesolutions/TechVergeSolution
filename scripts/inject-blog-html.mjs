/**
 * Inject blog listing + article HTML into dist shells so content is visible
 * without JavaScript (Playwright may overwrite with richer React HTML later).
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./load-env.mjs";
import { collectBlogPosts } from "./collect-blog-posts.mjs";

const DIST = path.join(ROOT, "dist");
const GENERATED = path.join(ROOT, "src", "generated", "blog-posts.json");

function formatBlogDate(isoDate) {
  const match = String(isoDate ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return String(isoDate ?? "");
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return String(isoDate ?? "");
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function outputPathForRoute(routePath) {
  if (routePath === "/") return path.join(DIST, "index.html");
  const segments = routePath.replace(/^\//, "").split("/");
  return path.join(DIST, ...segments, "index.html");
}

function injectRoot(html, inner) {
  if (!/<div\s+id=["']root["'][^>]*>/i.test(html)) {
    throw new Error("Missing #root in HTML shell");
  }
  return html.replace(
    /<div\s+id=["']root["'][^>]*>[\s\S]*?<\/div>/i,
    `<div id="root">${inner}</div>`,
  );
}

function blogIndexHtml(posts) {
  const categories = Array.from(
    new Set(posts.map((p) => p.category).filter(Boolean)),
  ).sort();
  const filters = ["All", ...categories]
    .map((c) => `<span>${escapeHtml(c)}</span>`)
    .join(" · ");
  const items = posts
    .map(
      (post) => `<article>
  <p>${escapeHtml(post.category || "Blog")}</p>
  <h2><a href="/blog/${escapeHtml(post.slug)}">${escapeHtml(post.title)}</a></h2>
  <p>${escapeHtml(post.excerpt || post.description)}</p>
  <p><time datetime="${escapeHtml(post.datePublished)}">${escapeHtml(formatBlogDate(post.datePublished))}</time></p>
</article>`,
    )
    .join("\n");

  return `<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> / Blog</nav>
  <h1>Practical Guides on AI Voice Agents &amp; Automation</h1>
  <p>Clear writing on AI voice agents, lead follow-up, and workflow automation for small and service businesses. Each guide is meant to answer a real operating question—without invented metrics or tool hype.</p>
  <p>Categories: ${filters}</p>
  ${items}
</main>`;
}

function blogFaqHtml(faq) {
  if (!faq?.length) return "";
  const items = faq
    .map(
      (item) => `<details>
  <summary>${escapeHtml(item.question)}</summary>
  <p>${escapeHtml(item.answer)}</p>
</details>`,
    )
    .join("\n");
  return `<section aria-labelledby="blog-faq-heading">
  <h2 id="blog-faq-heading">Frequently asked questions</h2>
  ${items}
</section>`;
}

function blogTocHtml(toc) {
  if (!toc?.length) return "";
  const items = toc
    .map(
      (item) =>
        `<li><a href="#${escapeHtml(item.id)}">${escapeHtml(item.text)}</a></li>`,
    )
    .join("\n");
  return `<nav aria-label="Table of contents"><p>On this page</p><ol>${items}</ol></nav>`;
}

function blogPostHtml(post) {
  const full = JSON.parse(fs.readFileSync(GENERATED, "utf8")).find(
    (p) => p.slug === post.slug,
  );
  const body = full?.bodyHtml || `<p>${escapeHtml(post.description)}</p>`;
  const author = post.author || full?.author || "TechVerge Solution";
  const faq = post.faq || full?.faq || [];
  const toc = full?.toc || [];
  const quick = full?.quickAnswer || post.excerpt || post.description;
  const cta = full?.cta;
  const related = (full?.relatedSlugs || [])
    .map((slug) => {
      const other = JSON.parse(fs.readFileSync(GENERATED, "utf8")).find(
        (p) => p.slug === slug,
      );
      if (!other) return "";
      return `<li><a href="/blog/${escapeHtml(other.slug)}">${escapeHtml(other.title)}</a></li>`;
    })
    .filter(Boolean)
    .join("\n");

  return `<main>
  <article>
    <header>
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a> / ${escapeHtml(post.title)}</nav>
      <p><time datetime="${escapeHtml(post.datePublished)}">${escapeHtml(formatBlogDate(post.datePublished))}</time>
      · Updated <time datetime="${escapeHtml(post.dateModified || post.datePublished)}">${escapeHtml(formatBlogDate(post.dateModified || post.datePublished))}</time>
      · By <a href="/about">${escapeHtml(author)}</a></p>
      <h1>${escapeHtml(post.title)}</h1>
      <aside aria-label="Quick answer"><p><strong>Quick answer</strong></p><p>${escapeHtml(quick)}</p></aside>
    </header>
    <img src="${escapeHtml(post.imagePath)}" alt="${escapeHtml(post.imageAlt)}" width="${full?.featuredImage?.width || 1400}" height="${full?.featuredImage?.height || 934}" />
    ${blogTocHtml(toc)}
    <div class="article-body">${body}</div>
    ${blogFaqHtml(faq)}
    ${related ? `<section><h2>Related guides</h2><ul>${related}</ul></section>` : ""}
    ${
      cta
        ? `<aside><h2>Ready to put this into practice?</h2><p>${escapeHtml(cta.description || "")}</p><p><a href="${escapeHtml(cta.path)}">${escapeHtml(cta.label)}</a></p></aside>`
        : ""
    }
  </article>
</main>`;
}

export async function injectBlogHtml() {
  const posts = await collectBlogPosts();
  if (!posts.length) {
    console.warn("[inject-blog-html] No posts to inject");
    return { injected: [] };
  }

  const injected = [];

  const indexPath = outputPathForRoute("/blog");
  if (fs.existsSync(indexPath)) {
    const html = injectRoot(
      fs.readFileSync(indexPath, "utf8"),
      blogIndexHtml(posts),
    );
    fs.writeFileSync(indexPath, html, "utf8");
    injected.push("/blog");
  }

  for (const post of posts) {
    const route = `/blog/${post.slug}`;
    const out = outputPathForRoute(route);
    if (!fs.existsSync(out)) continue;
    const html = injectRoot(fs.readFileSync(out, "utf8"), blogPostHtml(post));
    fs.writeFileSync(out, html, "utf8");
    injected.push(route);
  }

  console.log(`[inject-blog-html] Injected HTML into ${injected.length} blog pages`);
  return { injected };
}

import { pathToFileURL } from "node:url";
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  injectBlogHtml().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
