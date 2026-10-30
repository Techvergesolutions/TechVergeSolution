/**
 * Write sitemap.xml to dist/ (and public/ for repo sync) from static routes + blog posts.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./load-env.mjs";
import { collectBlogPosts } from "./collect-blog-posts.mjs";

const SITE_URL = "https://www.techvergesolution.com";

const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: "2026-10-12" },
  { path: "/about", changefreq: "monthly", priority: "0.8", lastmod: "2026-10-12" },
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
  { path: "/portfolio", changefreq: "monthly", priority: "0.8", lastmod: "2026-10-12" },
  { path: "/blog", changefreq: "weekly", priority: "0.7", lastmod: null },
  { path: "/contact", changefreq: "monthly", priority: "0.8", lastmod: "2026-10-12" },
  {
    path: "/privacy-policy",
    changefreq: "yearly",
    priority: "0.3",
    lastmod: "2026-10-12",
  },
  {
    path: "/terms-of-service",
    changefreq: "yearly",
    priority: "0.3",
    lastmod: "2026-10-12",
  },
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

export async function generateSitemap() {
  const posts = await collectBlogPosts();
  const newestPost =
    posts.map((p) => p.dateModified || p.datePublished).sort().at(-1) ||
    new Date().toISOString().slice(0, 10);

  const urls = [];

  for (const route of STATIC_ROUTES) {
    const lastmod =
      route.path === "/blog" ? newestPost : route.lastmod || newestPost;
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
      lastmod: post.dateModified || post.datePublished,
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  // Deduplicate by loc (blog index already listed; posts unique)
  const seen = new Set();
  const unique = urls.filter((u) => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

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

  console.log(`[generate-sitemap] Wrote ${unique.length} URLs`);
  return { urls: unique, posts };
}
