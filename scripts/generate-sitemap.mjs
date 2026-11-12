/**
 * Auto-generate sitemap.xml (homepage, services, about, contact, portfolio,
 * /blog, and every blog post). Excludes privacy-policy and terms-of-service.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./load-env.mjs";
import { collectBlogPosts } from "./collect-blog-posts.mjs";

const SITE_URL = "https://www.techvergesolution.com";

/** Core marketing routes — legal pages intentionally omitted from sitemap. */
const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: "2026-10-12" },
  { path: "/about", changefreq: "monthly", priority: "0.8", lastmod: "2026-10-12" },
  { path: "/ai-facts", changefreq: "monthly", priority: "0.6", lastmod: "2026-10-30" },
  { path: "/services", changefreq: "weekly", priority: "0.8", lastmod: "2026-10-12" },
  {
    path: "/services/ai-automation",
    changefreq: "monthly",
    priority: "0.8",
    lastmod: "2026-10-12",
  },
  {
    path: "/services/ai-voice-agents",
    changefreq: "monthly",
    priority: "0.8",
    lastmod: "2026-10-12",
  },
  {
    path: "/services/business-automation",
    changefreq: "monthly",
    priority: "0.8",
    lastmod: "2026-10-12",
  },
  {
    path: "/services/ai-saas-development",
    changefreq: "monthly",
    priority: "0.8",
    lastmod: "2026-10-12",
  },
  {
    path: "/services/custom-website-development",
    changefreq: "monthly",
    priority: "0.8",
    lastmod: "2026-10-12",
  },
  {
    path: "/services/mobile-app-development",
    changefreq: "monthly",
    priority: "0.8",
    lastmod: "2026-10-12",
  },
  { path: "/portfolio", changefreq: "monthly", priority: "0.8", lastmod: "2026-10-12" },
  { path: "/blog", changefreq: "weekly", priority: "0.8", lastmod: null },
  { path: "/locations", changefreq: "monthly", priority: "0.7", lastmod: "2026-11-12" },
  { path: "/contact", changefreq: "monthly", priority: "0.8", lastmod: "2026-10-12" },
];

function loc(routePath) {
  if (!routePath || routePath === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${routePath.startsWith("/") ? routePath : `/${routePath}`}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Prefer ISO date (YYYY-MM-DD). */
function normalizeLastmod(value, fallback) {
  if (!value) return fallback;
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return fallback;
}

export async function generateSitemap() {
  const posts = await collectBlogPosts();
  const today = new Date().toISOString().slice(0, 10);
  const postDates = posts
    .map((p) => normalizeLastmod(p.dateModified || p.datePublished, today))
    .sort();
  const newestPost = postDates.at(-1) || today;

  const urls = [];

  for (const route of STATIC_ROUTES) {
    const lastmod =
      route.path === "/blog"
        ? newestPost
        : normalizeLastmod(route.lastmod, today);
    urls.push({
      loc: loc(route.path),
      lastmod,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }

  for (const post of posts) {
    urls.push({
      loc: loc(`/blog/${post.slug}`),
      lastmod: normalizeLastmod(
        post.dateModified || post.datePublished,
        newestPost,
      ),
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  const seen = new Set();
  const unique = urls.filter((u) => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

  // Guard: never include legal pages in sitemap priority set
  const blocked = ["/privacy-policy", "/terms-of-service"];
  for (const pathSuffix of blocked) {
    if (unique.some((u) => u.loc.endsWith(pathSuffix))) {
      throw new Error(
        `[generate-sitemap] Refusing to include ${pathSuffix} in sitemap`,
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${escapeXml(u.lastmod)}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  const distDir = path.join(ROOT, "dist");
  const publicDir = path.join(ROOT, "public");
  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf8");
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf8");

  console.log(`[generate-sitemap] Wrote ${unique.length} URLs (legal pages excluded)`);
  return { urls: unique, posts };
}
