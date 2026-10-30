/**
 * Post-build SEO assertions for dist/ (fails CI on empty HTML, secrets, bad meta).
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT } from "./load-env.mjs";
import { buildPrerenderRoutes, SITE_URL } from "./build-prerender-routes.mjs";

const DIST = path.join(ROOT, "dist");

function fail(message) {
  console.error(`\n[validate-seo-dist] FAIL: ${message}\n`);
  process.exit(1);
}

function read(rel) {
  const abs = path.join(DIST, rel);
  if (!fs.existsSync(abs)) fail(`Missing file: dist/${rel}`);
  return fs.readFileSync(abs, "utf8");
}

function outputRelForRoute(routePath) {
  if (routePath === "/") return "index.html";
  return `${routePath.replace(/^\//, "")}/index.html`;
}

function extractTitle(html) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
}

function extractCanonical(html) {
  return (
    html.match(
      /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
    )?.[1] ??
    html.match(
      /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i,
    )?.[1] ??
    ""
  );
}

function rootInner(html) {
  const m = html.match(
    /<div[^>]*id=["']root["'][^>]*>([\s\S]*)<\/div>\s*(?:<script|<\/body>)/i,
  );
  return m?.[1] ?? "";
}

function parseJsonLd(html) {
  const blocks = [];
  for (const m of html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      fail(`Invalid JSON-LD block near: ${m[1].slice(0, 80)}`);
    }
  }
  return blocks;
}

function walkAssets(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) walkAssets(abs, files);
    else if (/\.(js|mjs|css|html|map)$/i.test(name)) files.push(abs);
  }
  return files;
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

export async function validateSeoDist() {
  if (!fs.existsSync(DIST)) fail("dist/ missing — run build first");

  const { routes, posts } = await buildPrerenderRoutes();
  const requiredSamples = ["/", "/blog", "/services/ai-voice-agents"];
  for (const p of requiredSamples) {
    if (!routes.some((r) => r.path === p)) fail(`Missing required route ${p}`);
  }

  const canonicals = new Set();

  for (const route of routes) {
    const rel = outputRelForRoute(route.path);
    const html = read(rel);
    const title = extractTitle(html);
    const canonical = extractCanonical(html);
    const inner = rootInner(html);
    const text = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    if (!title) fail(`${rel}: missing <title>`);
    if (!canonical) fail(`${rel}: missing canonical`);
    if (canonicals.has(canonical)) fail(`${rel}: duplicate canonical ${canonical}`);
    canonicals.add(canonical);

    const expectedCanon =
      route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
    if (canonical !== expectedCanon) {
      fail(`${rel}: canonical ${canonical} !== ${expectedCanon}`);
    }

    const decoded = decodeEntities(title);
    if (decoded !== route.title) {
      fail(
        `${rel}: title mismatch\n  got: ${decoded}\n  expected: ${route.title}`,
      );
    }

    if (text.length < 120) fail(`${rel}: #root text too short (${text.length})`);
    if (!/<h1\b/i.test(inner)) fail(`${rel}: missing <h1> in #root`);

    if (!/name=["']robots["'][^>]*content=["']index,\s*follow["']/i.test(html)) {
      fail(`${rel}: missing robots index,follow`);
    }

    const ld = parseJsonLd(html);
    if (
      route.path === "/" &&
      !ld.some((b) => b["@graph"] || b["@type"] === "Organization")
    ) {
      fail(`${rel}: missing Organization JSON-LD`);
    }
    if (route.article) {
      if (!ld.some((b) => b["@type"] === "BlogPosting")) {
        fail(`${rel}: missing BlogPosting JSON-LD`);
      }
      if (!ld.some((b) => b["@type"] === "BreadcrumbList")) {
        fail(`${rel}: missing BreadcrumbList JSON-LD`);
      }
      for (const b of ld) {
        if (b["@type"] === "BlogPosting" && b.image?.url) {
          if (/techvergesolution\.com\/https?:/i.test(b.image.url)) {
            fail(`${rel}: broken BlogPosting image URL ${b.image.url}`);
          }
        }
      }
    }
    if (
      route.path === "/blog" &&
      !ld.some((b) => b["@type"] === "Blog" || b["@type"] === "BreadcrumbList")
    ) {
      fail(`${rel}: blog index missing Blog/Breadcrumb JSON-LD`);
    }
    if (route.service && !ld.some((b) => b["@type"] === "Service")) {
      fail(`${rel}: missing Service JSON-LD`);
    }
  }

  const notFound = read("404.html");
  if (!/noindex/i.test(notFound)) fail("404.html missing noindex");

  const sitemap = read("sitemap.xml");
  if (!sitemap.includes("<urlset")) fail("sitemap.xml invalid");
  if (!sitemap.includes(`${SITE_URL}/`)) fail("sitemap missing homepage");
  for (const post of posts) {
    if (!sitemap.includes(`/blog/${post.slug}`)) {
      fail(`sitemap missing published post /blog/${post.slug}`);
    }
  }

  const robots = read("robots.txt");
  if (!robots.includes("Sitemap:")) fail("robots.txt missing Sitemap");

  // Avoid bare /sk…/ — minified Sanity client contains identifiers like
  // skipCrossDatasetReferenceValidation.
  const secretPatterns = [
    /VITE_SANITY_TOKEN/,
    /["']sk[A-Za-z0-9_-]{40,}["']/,
    /SANITY_WEBHOOK_SECRET\s*[:=]\s*["'][^"']+["']/,
    /VERCEL_DEPLOY_HOOK_URL\s*[:=]\s*["']https?:\/\/[^"']+["']/,
    /api\.vercel\.com\/v1\/integrations\/deploy\//,
  ];
  for (const file of walkAssets(path.join(DIST, "assets"))) {
    const body = fs.readFileSync(file, "utf8");
    for (const re of secretPatterns) {
      if (re.test(body)) {
        fail(
          `Possible secret leaked in ${path.relative(ROOT, file)} (pattern ${re})`,
        );
      }
    }
  }

  console.log(
    `[validate-seo-dist] OK — ${routes.length} routes, ${posts.length} posts, sitemap + assets clean`,
  );
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  validateSeoDist().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
