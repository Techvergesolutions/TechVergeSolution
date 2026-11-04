/**
 * Post-vite build: write route-specific initial HTML metadata into dist/.
 * Keep route strings in sync via scripts/seo-prerender-data.mjs
 * (mirrors src/lib/seo.ts + src/data/services.ts).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { ALL_SERVICES_QUERY } from "../src/lib/sanity/queries.ts";
import {
  SITE_URL,
  SITE_NAME,
  defaultDescription,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  absoluteUrl,
  articleJsonLd,
  organizationJsonLd,
  visibleFaqs,
  serializeJsonLd,
  prerenderRoutes as staticRoutes,
  serviceJsonLd,
} from "./seo-prerender-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const TEMPLATE = path.join(DIST, "index.html");

function fail(message) {
  console.error(`\n[prerender-meta] ERROR: ${message}\n`);
  process.exit(1);
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function jsonLdScript(data, root = false) {
  const marker = root ? 'id="site-organization-jsonld"' : 'data-prerender-jsonld="true"';
  return `<script ${marker} type="application/ld+json">\n${serializeJsonLd(data)}\n    </script>`;
}

/** Replace or insert a unique meta/link tag matched by attribute selector. */
function upsertTag(html, { tag, attr, attrValue, attrs }) {
  const re = new RegExp(
    `<${tag}\\b[^>]*\\b${attr}\\s*=\\s*["']${attrValue}["'][^>]*/?>`,
    "i",
  );
  const attrStr = Object.entries(attrs)
    .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
    .join(" ");
  const replacement = `<${tag} data-rh="true" ${attrStr} />`;

  if (re.test(html)) {
    return html.replace(re, replacement);
  }

  // Insert before </head>
  return html.replace(/<\/head>/i, `    ${replacement}\n  </head>`);
}

function upsertTitle(html, title) {
  const re = /<title\b[^>]*>[\s\S]*?<\/title>/i;
  const replacement = `<title data-rh="true">${escapeText(title)}</title>`;
  if (re.test(html)) {
    return html.replace(re, replacement);
  }
  return html.replace(/<\/head>/i, `    ${replacement}\n  </head>`);
}

function removeJsonLdScripts(html) {
  return html.replace(
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
    "",
  );
}

function injectJsonLdBeforeHeadClose(html, scriptsHtml) {
  if (!scriptsHtml) return html;
  return html.replace(/<\/head>/i, `${scriptsHtml}\n  </head>`);
}

function buildJsonLdBlock(route) {
  const blocks = [`    ${jsonLdScript(organizationJsonLd(), true)}`];
  if (route.service) {
    blocks.push(`    ${jsonLdScript(serviceJsonLd({
        name: route.service.name,
        description: route.service.description,
        path: route.path,
      }))}`);
  }
  if (route.article) {
    blocks.push(`    ${jsonLdScript(articleJsonLd({
        headline: route.article.title,
        path: route.path,
        datePublished: route.article.datePublished,
        dateModified: route.article.dateModified,
        image: route.article.imagePath,
      }))}`);
  }
  return blocks.join("\n");
}

function applyRouteMeta(templateHtml, route) {
  const canonical = absoluteUrl(route.canonicalUrl || route.path);
  const pageUrl = absoluteUrl(route.path);
  const ogImage = route.article ? absoluteUrl(`/api/og?slug=${encodeURIComponent(route.path.split("/").pop())}`) : route.ogImage || DEFAULT_OG_IMAGE;
  const ogImageAlt = route.ogImageAlt || DEFAULT_OG_IMAGE_ALT;
  const ogType = route.ogType || "website";
  let html = templateHtml;

  html = upsertTitle(html, route.title);

  html = upsertTag(html, {
    tag: "meta",
    attr: "name",
    attrValue: "description",
    attrs: { name: "description", content: route.description },
  });

  html = upsertTag(html, {
    tag: "link",
    attr: "rel",
    attrValue: "canonical",
    attrs: { rel: "canonical", href: canonical },
  });

  html = upsertTag(html, {
    tag: "meta",
    attr: "property",
    attrValue: "og:title",
    attrs: { property: "og:title", content: route.title },
  });
  html = upsertTag(html, {
    tag: "meta",
    attr: "property",
    attrValue: "og:description",
    attrs: { property: "og:description", content: route.description },
  });
  html = upsertTag(html, {
    tag: "meta",
    attr: "property",
    attrValue: "og:url",
    attrs: { property: "og:url", content: pageUrl },
  });
  html = upsertTag(html, {
    tag: "meta",
    attr: "property",
    attrValue: "og:type",
    attrs: { property: "og:type", content: ogType },
  });
  html = upsertTag(html, {
    tag: "meta",
    attr: "property",
    attrValue: "og:image",
    attrs: { property: "og:image", content: ogImage },
  });
  if (/property\s*=\s*["']og:image:alt["']/i.test(html)) {
    html = upsertTag(html, {
      tag: "meta",
      attr: "property",
      attrValue: "og:image:alt",
      attrs: { property: "og:image:alt", content: ogImageAlt },
    });
  }

  // Twitter tags — update only if already present in the template
  if (/name\s*=\s*["']twitter:title["']/i.test(html)) {
    html = upsertTag(html, {
      tag: "meta",
      attr: "name",
      attrValue: "twitter:title",
      attrs: { name: "twitter:title", content: route.title },
    });
  }
  if (/name\s*=\s*["']twitter:description["']/i.test(html)) {
    html = upsertTag(html, {
      tag: "meta",
      attr: "name",
      attrValue: "twitter:description",
      attrs: { name: "twitter:description", content: route.description },
    });
  }
  if (/name\s*=\s*["']twitter:image["']/i.test(html)) {
    html = upsertTag(html, {
      tag: "meta",
      attr: "name",
      attrValue: "twitter:image",
      attrs: { name: "twitter:image", content: ogImage },
    });
  }
  if (/name\s*=\s*["']twitter:image:alt["']/i.test(html)) {
    html = upsertTag(html, {
      tag: "meta",
      attr: "name",
      attrValue: "twitter:image:alt",
      attrs: { name: "twitter:image:alt", content: ogImageAlt },
    });
  }

  html = upsertTag(html, {
    tag: "meta",
    attr: "name",
    attrValue: "robots",
    attrs: { name: "robots", content: route.noIndex ? "noindex, follow" : "index, follow" },
  });

  // JSON-LD: always strip template Organization graph, then inject route-specific
  html = removeJsonLdScripts(html);
  html = injectJsonLdBeforeHeadClose(html, buildJsonLdBlock(route));

  return html;
}

function outputPathForRoute(routePath) {
  if (routePath === "/") return path.join(DIST, "index.html");
  const segments = routePath.replace(/^\//, "").split("/");
  return path.join(DIST, ...segments, "index.html");
}

function countMatches(html, re) {
  return (html.match(re) || []).length;
}

function validateHtml(html, route) {
  const canonical = absoluteUrl(route.canonicalUrl || route.path);
  const pageUrl = absoluteUrl(route.path);
  const checks = [
    [/id\s*=\s*["']root["']/i, "#root"],
    [/<script\b/i, "script tags"],
  ];
  for (const [re, label] of checks) {
    if (!re.test(html)) {
      fail(`Route ${route.path}: missing ${label} after prerender`);
    }
  }

  if (countMatches(html, /<title\b/gi) !== 1) {
    fail(`Route ${route.path}: expected exactly 1 <title>`);
  }
  if (countMatches(html, /name\s*=\s*["']description["']/gi) !== 1) {
    fail(`Route ${route.path}: expected exactly 1 meta description`);
  }
  if (countMatches(html, /rel\s*=\s*["']canonical["']/gi) !== 1) {
    fail(`Route ${route.path}: expected exactly 1 canonical`);
  }
  if (countMatches(html, /property\s*=\s*["']og:url["']/gi) !== 1) {
    fail(`Route ${route.path}: expected exactly 1 og:url`);
  }

  if (!html.includes(`href="${escapeAttr(canonical)}"`)) {
    fail(`Route ${route.path}: canonical href mismatch (expected ${canonical})`);
  }
  if (!html.includes(`content="${escapeAttr(pageUrl)}"`)) {
    fail(`Route ${route.path}: og:url content mismatch (expected ${pageUrl})`);
  }
  if (!html.includes(`<title data-rh="true">${escapeText(route.title)}</title>`)) {
    fail(`Route ${route.path}: title mismatch`);
  }

  const hasOrg =
    /"@type"\s*:\s*"Organization"/i.test(html) &&
    html.includes(JSON.stringify(`${SITE_URL}/#organization`)) &&
    /"@graph"/i.test(html);
  const hasService = /"@type"\s*:\s*"Service"/i.test(html);
  const hasArticle = /"@type"\s*:\s*"Article"/i.test(html);

  if (!hasOrg || countMatches(html, /id\s*=\s*["']site-organization-jsonld["']/gi) !== 1) {
    fail(`Route ${route.path}: expected exactly one Organization and WebSite graph`);
  }

  if (route.service) {
    if (!hasService) fail(`Route ${route.path}: missing Service JSON-LD`);
  } else if (route.path !== "/" && hasService) {
    fail(`Route ${route.path}: unexpected Service JSON-LD`);
  }

  if (route.article) {
    if (!hasArticle) fail(`Route ${route.path}: missing Article JSON-LD`);
  } else if (hasArticle) {
    fail(`Route ${route.path}: unexpected Article JSON-LD`);
  }
}

async function getServiceRoutes() {
  const env = loadEnv("production", ROOT, "VITE_SANITY_");
  const projectId = process.env.VITE_SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID;
  if (!projectId) {
    console.warn("[prerender-meta] Sanity is not configured; no service metadata was generated.");
    return [];
  }
  const client = createClient({
    projectId,
    dataset: process.env.VITE_SANITY_DATASET || env.VITE_SANITY_DATASET || "production",
    apiVersion: process.env.VITE_SANITY_API_VERSION || env.VITE_SANITY_API_VERSION || "2024-01-01",
    useCdn: false,
    perspective: "published",
  });
  const services = await client.fetch(ALL_SERVICES_QUERY);
  return services.map((service) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.slug)) {
      throw new Error(`Invalid service slug: ${service.slug}`);
    }
    const name = service.title?.trim() || service.heroHeading?.trim() || "Service";
    const title = service.seo?.seoTitle?.trim() || name;
    const schemaDescription = service.seo?.seoDescription?.trim() || service.shortDescription?.trim();
    const description = schemaDescription || defaultDescription;
    const faq = visibleFaqs(service.faqs);
    let ogImage;
    if (service.seo?.ogImage?.asset) {
      try { ogImage = imageUrlBuilder(client).image(service.seo.ogImage).width(1200).url(); } catch { /* Use default. */ }
    }
    return {
      path: `/services/${service.slug}`,
      title: title.endsWith(` | ${SITE_NAME}`) ? title : `${title} | ${SITE_NAME}`,
      description,
      canonicalUrl: service.seo?.canonicalUrl,
      noIndex: service.seo?.noIndex,
      updatedAt: service._updatedAt,
      ogImage,
      service: { name, description: schemaDescription, faq },
    };
  });
}

async function main() {
  if (!fs.existsSync(TEMPLATE)) {
    fail(`Missing ${TEMPLATE}. Run vite build first.`);
  }

  const serviceRoutes = await getServiceRoutes();
  const prerenderRoutes = [...staticRoutes, ...serviceRoutes];
  if (!Array.isArray(prerenderRoutes)) {
    fail("prerenderRoutes is missing or not an array");
  }
  const paths = new Set();
  for (const route of prerenderRoutes) {
    if (!route?.path || !route?.title || !route?.description) {
      fail(
        `Route entry missing path/title/description: ${JSON.stringify(route)}`,
      );
    }
    if (paths.has(route.path)) {
      fail(`Duplicate route path: ${route.path}`);
    }
    paths.add(route.path);
  }

  const required = [
    "/",
    "/about",
    "/services",
    "/portfolio",
    "/blog",
    "/blog/ai-voice-agents-for-small-business-2026",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
  ];
  for (const p of required) {
    if (!paths.has(p)) fail(`Missing required route in prerender data: ${p}`);
  }

  // Read template once before overwriting dist/index.html
  const templateHtml = fs.readFileSync(TEMPLATE, "utf8");
  if (!/<div\s+id=["']root["']\s*>\s*<\/div>/i.test(templateHtml)) {
    fail("Template dist/index.html is missing #root");
  }
  if (!/<script\b/i.test(templateHtml)) {
    fail("Template dist/index.html is missing script tags");
  }

  const written = [];
  for (const route of prerenderRoutes) {
    const html = applyRouteMeta(templateHtml, route);
    validateHtml(html, route);

    // Blog article URLs are served dynamically so published CMS edits appear
    // in the initial HTML without waiting for a deployment.
    if (route.article) continue;

    const out = outputPathForRoute(route.path);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html, "utf8");
    written.push(path.relative(ROOT, out).replace(/\\/g, "/"));
  }

  console.log(
    `[prerender-meta] Wrote ${written.length} HTML files with route metadata:`,
  );
  for (const f of written) console.log(`  - ${f}`);
}

main().catch((error) => fail(error.message));
