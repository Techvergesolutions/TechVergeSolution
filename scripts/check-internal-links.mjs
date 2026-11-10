/**
 * Validate internal hrefs in compiled blog HTML and guide link slugs.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT } from "./load-env.mjs";
import { collectBlogPosts } from "./collect-blog-posts.mjs";

const INTERNAL_LINKS_PATH = path.join(ROOT, "src/data/internalLinks.ts");
const SERVICE_SLUGS = new Set([
  "ai-automation",
  "ai-voice-agents",
  "business-automation",
  "ai-saas-development",
  "custom-website-development",
  "mobile-app-development",
]);

const STATIC_PATHS = new Set([
  "/",
  "/about",
  "/ai-facts",
  "/services",
  "/portfolio",
  "/blog",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
]);

function fail(message) {
  console.error(`\n[check-internal-links] FAIL: ${message}\n`);
  process.exit(1);
}

function extractGuideSlugs(source) {
  const slugs = [];
  for (const m of source.matchAll(/slug:\s*"([^"]+)"/g)) slugs.push(m[1]);
  return slugs;
}

function isValidInternal(href) {
  if (!href.startsWith("/") || href.startsWith("//")) return true;
  if (href.startsWith("/api/") || href.startsWith("/studio")) return true;

  const [pathname] = href.split(/[?#]/);
  if (STATIC_PATHS.has(pathname)) return true;

  if (pathname.startsWith("/blog/")) {
    const slug = pathname.slice("/blog/".length);
    return Boolean(slug && !slug.includes("/"));
  }
  if (pathname.startsWith("/services/")) {
    const slug = pathname.slice("/services/".length);
    return SERVICE_SLUGS.has(slug);
  }
  if (pathname.startsWith("/markets/")) return true;

  return false;
}

export async function checkInternalLinks() {
  const posts = await collectBlogPosts();
  const postSlugs = new Set(posts.map((p) => p.slug));

  const guideSource = fs.readFileSync(INTERNAL_LINKS_PATH, "utf8");
  for (const slug of extractGuideSlugs(guideSource)) {
    if (!postSlugs.has(slug)) {
      fail(`internalLinks.ts references missing blog slug: ${slug}`);
    }
  }

  const blogJson = path.join(ROOT, "src/generated/blog-posts.json");
  if (fs.existsSync(blogJson)) {
    const compiled = JSON.parse(fs.readFileSync(blogJson, "utf8"));
    for (const post of compiled) {
      const html = post.bodyHtml || "";
      for (const m of html.matchAll(/href="(\/[^"#?][^"]*)"/g)) {
        const href = m[1].replace(/&amp;/g, "&");
        if (!isValidInternal(href)) {
          fail(`Broken internal link in /blog/${post.slug}: ${href}`);
        }
      }
    }
  }

  console.log(
    `[check-internal-links] OK — ${postSlugs.size} posts, guide slugs, and blog hrefs verified`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await checkInternalLinks();
}
