/**
 * Post-build SEO assertions for dist/ (fails CI on empty HTML, secrets, bad meta).
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT } from "./load-env.mjs";
import { buildPrerenderRoutes, SITE_URL } from "./build-prerender-routes.mjs";
import { SEO_CRAWLER_BOTS } from "./seo-crawler-bots.mjs";
import {
  META_DESCRIPTION_MAX,
  META_DESCRIPTION_MIN,
  META_TITLE_MAX,
} from "./seo-limits.mjs";

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

function extractMetaDescription(html) {
  return (
    html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i,
    )?.[1] ??
    html.match(
      /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i,
    )?.[1] ??
    ""
  );
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
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
  const open = html.match(/<div[^>]*id=["']root["'][^>]*>/i);
  if (!open || open.index === undefined) return "";
  const start = open.index + open[0].length;
  let depth = 1;
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = start;
  let match;
  while ((match = tagRe.exec(html))) {
    const token = match[0];
    if (token.startsWith("</")) {
      depth -= 1;
    } else if (!/\/\s*>$/.test(token)) {
      depth += 1;
    }
    if (depth === 0) {
      return html.slice(start, match.index);
    }
  }
  return "";
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

/**
 * @param {{ allowShellOnly?: boolean }} [options]
 * allowShellOnly: when Playwright capture was skipped (e.g. no Chromium on Vercel),
 * still require meta/canonical/JSON-LD but do not require hydrated #root body HTML.
 */
export async function validateSeoDist(options = {}) {
  const allowShellOnly = Boolean(options.allowShellOnly);
  if (!fs.existsSync(DIST)) fail("dist/ missing — run build first");

  const rootTemplate = read("index.html");
  if (
    !/<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(
      rootTemplate,
    )
  ) {
    fail("index.html missing responsive viewport meta");
  }

  const { routes, posts } = await buildPrerenderRoutes();
  const requiredSamples = ["/", "/blog", "/services/ai-voice-agents"];
  for (const p of requiredSamples) {
    if (!routes.some((r) => r.path === p)) fail(`Missing required route ${p}`);
  }

  if (allowShellOnly) {
    console.warn(
      "[validate-seo-dist] allowShellOnly=true — skipping #root body/h1 checks (Playwright skipped)",
    );
  }

  const canonicals = new Set();

  for (const route of routes) {
    const rel = outputRelForRoute(route.path);
    const html = read(rel);
    const title = extractTitle(html);
    const canonical = extractCanonical(html);
    const inner = rootInner(html);
    const text = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    const decoded = decodeEntities(title);
    const metaDescription = decodeEntities(extractMetaDescription(html));

    if (!title) fail(`${rel}: missing <title>`);
    if (decoded.length > META_TITLE_MAX) {
      fail(`${rel}: title too long (${decoded.length} > ${META_TITLE_MAX})`);
    }
    if (!metaDescription) fail(`${rel}: missing meta description`);
    if (metaDescription.length < META_DESCRIPTION_MIN) {
      fail(
        `${rel}: meta description too short (${metaDescription.length} < ${META_DESCRIPTION_MIN})`,
      );
    }
    if (metaDescription.length > META_DESCRIPTION_MAX) {
      fail(
        `${rel}: meta description too long (${metaDescription.length} > ${META_DESCRIPTION_MAX})`,
      );
    }
    if (!/property=["']og:title["']/i.test(html)) fail(`${rel}: missing og:title`);
    if (!/property=["']og:description["']/i.test(html)) {
      fail(`${rel}: missing og:description`);
    }
    if (!/name=["']twitter:card["']/i.test(html)) {
      fail(`${rel}: missing twitter:card`);
    }
    if (!canonical) fail(`${rel}: missing canonical`);
    if (canonicals.has(canonical)) fail(`${rel}: duplicate canonical ${canonical}`);
    canonicals.add(canonical);

    const expectedCanon =
      route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
    if (canonical !== expectedCanon) {
      fail(`${rel}: canonical ${canonical} !== ${expectedCanon}`);
    }

    if (decoded !== route.title) {
      fail(
        `${rel}: title mismatch\n  got: ${decoded}\n  expected: ${route.title}`,
      );
    }

    if (!allowShellOnly) {
      if (text.length < 120) {
        fail(`${rel}: #root text too short (${text.length})`);
      }
      const h1Count = (inner.match(/<h1\b/gi) || []).length;
      if (h1Count !== 1) {
        fail(`${rel}: expected exactly 1 <h1> in #root (found ${h1Count})`);
      }
    }

    if (!/name=["']robots["'][^>]*content=["']index,\s*follow["']/i.test(html)) {
      fail(`${rel}: missing robots index,follow`);
    }

    const ld = parseJsonLd(html);
    if (route.path === "/") {
      if (!ld.some((b) => b["@graph"] || b["@type"] === "Organization")) {
        fail(`${rel}: missing Organization JSON-LD`);
      }
      if (!ld.some((b) => b["@type"] === "FAQPage")) {
        fail(`${rel}: missing FAQPage JSON-LD on homepage`);
      }
      if (!/What services does Tech Verge Solution offer/i.test(html)) {
        fail(`${rel}: homepage missing services FAQ text for AI search`);
      }
      if (!/Lahore, Punjab, Pakistan/i.test(html)) {
        fail(`${rel}: homepage missing location FAQ text`);
      }
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
  if (!/<html[^>]*\blang=["']en["']/i.test(notFound)) {
    fail("404.html missing html lang=en");
  }

  const sitemap = read("sitemap.xml");
  if (!sitemap.includes("<urlset")) fail("sitemap.xml invalid");
  if (!sitemap.includes(`${SITE_URL}/`)) fail("sitemap missing homepage");
  for (const required of [
    "/about",
    "/services",
    "/portfolio",
    "/contact",
    "/blog",
  ]) {
    if (!sitemap.includes(`${SITE_URL}${required}`)) {
      fail(`sitemap missing ${required}`);
    }
  }
  for (const post of posts) {
    if (!sitemap.includes(`/blog/${post.slug}`)) {
      fail(`sitemap missing published post /blog/${post.slug}`);
    }
  }
  if (sitemap.includes("/privacy-policy") || sitemap.includes("/terms-of-service")) {
    fail("sitemap must exclude privacy-policy and terms-of-service");
  }

  const robots = read("robots.txt");
  if (!robots.includes("Sitemap:")) fail("robots.txt missing Sitemap");
  if (/Disallow:\s*\/assets/i.test(robots) || /Disallow:\s*\*\.(css|js)/i.test(robots)) {
    fail("robots.txt must not block CSS/JS");
  }
  for (const bot of SEO_CRAWLER_BOTS) {
    if (!robots.includes(`User-agent: ${bot}`)) {
      fail(`robots.txt missing User-agent: ${bot}`);
    }
  }

  const llms = read("llms.txt");
  if (!llms.includes("TechVerge Solutions") || !llms.includes("/sitemap.xml")) {
    fail("llms.txt missing required discovery links");
  }
  for (const requiredPath of [
    "/services",
    "/about",
    "/contact",
    "/portfolio",
    "/blog",
    "## Key pages",
    "## Locations",
  ]) {
    if (!llms.includes(requiredPath)) {
      fail(`llms.txt missing required section or link: ${requiredPath}`);
    }
  }

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
