/**
 * Post-vite build: write route-specific initial HTML metadata into dist/.
 * Routes come from build-prerender-routes.mjs (static + Sanity blog).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
} from "./seo-prerender-data.mjs";
import {
  absoluteUrl,
  blogPostingJsonLd,
  buildPrerenderRoutes,
  faqPageJsonLd,
  organizationJsonLd,
  serviceJsonLd,
  SITE_NAME,
} from "./build-prerender-routes.mjs";
import { clampMetaDescription, clampMetaTitle } from "./seo-limits.mjs";

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

function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function jsonLdScript(data, index) {
  const marker = index === 0 ? 'id="site-organization-jsonld"' : 'data-prerender-jsonld="true"';
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
  const blocks = [];
  // Organization + WebSite on every page (matches client Seo includeSiteGraph).
  blocks.push(organizationJsonLd());
  if (route.service) {
    blocks.push(
      serviceJsonLd({
        name: route.service.name,
        description: route.description,
        path: route.path,
        serviceType: route.service.serviceType,
      }),
    );
    const faq = faqPageJsonLd(route.service.faq);
    if (faq) blocks.push(faq);
  }
  if (route.article) {
    blocks.push(
      blogPostingJsonLd({
        title: route.article.title,
        description: route.description,
        path: route.path,
        datePublished: route.article.datePublished,
        dateModified: route.article.dateModified,
        imagePath: route.article.imagePath,
        imageAlt: route.article.imageAlt,
        authorName: route.article.authorName,
        authorPath: route.article.authorPath,
      }),
    );
    const faq = faqPageJsonLd(route.article.faq);
    if (faq) blocks.push(faq);
  }
  if (Array.isArray(route.extraJsonLd)) {
    blocks.push(...route.extraJsonLd.filter(Boolean));
  }
  return blocks.map((b, index) => `    ${jsonLdScript(b, index)}`).join("\n");
}

function applyRouteMeta(templateHtml, route) {
  const canonical = absoluteUrl(route.path);
  const ogImage = route.ogImage || DEFAULT_OG_IMAGE;
  const ogImageAlt = route.ogImageAlt || DEFAULT_OG_IMAGE_ALT;
  const ogType = route.ogType || "website";
  const title = clampMetaTitle(route.title, SITE_NAME);
  const description = clampMetaDescription(route.description);
  let html = templateHtml;

  html = upsertTitle(html, title);

  html = upsertTag(html, {
    tag: "meta",
    attr: "name",
    attrValue: "description",
    attrs: { name: "description", content: description },
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
    attrs: { property: "og:title", content: title },
  });
  html = upsertTag(html, {
    tag: "meta",
    attr: "property",
    attrValue: "og:description",
    attrs: { property: "og:description", content: description },
  });
  html = upsertTag(html, {
    tag: "meta",
    attr: "property",
    attrValue: "og:url",
    attrs: { property: "og:url", content: canonical },
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
      attrs: { name: "twitter:title", content: title },
    });
  }
  if (/name\s*=\s*["']twitter:description["']/i.test(html)) {
    html = upsertTag(html, {
      tag: "meta",
      attr: "name",
      attrValue: "twitter:description",
      attrs: { name: "twitter:description", content: description },
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
    attrs: { name: "robots", content: "index, follow" },
  });

  if (route.article?.datePublished) {
    html = upsertTag(html, {
      tag: "meta",
      attr: "property",
      attrValue: "article:published_time",
      attrs: {
        property: "article:published_time",
        content: route.article.datePublished,
      },
    });
  }
  if (route.article?.dateModified) {
    html = upsertTag(html, {
      tag: "meta",
      attr: "property",
      attrValue: "article:modified_time",
      attrs: {
        property: "article:modified_time",
        content: route.article.dateModified,
      },
    });
  }

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

/** @type may be a string or schema.org type array (e.g. Organization + LocalBusiness). */
function jsonLdNodeTypes(node) {
  const raw = node?.["@type"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function validateHtml(html, route) {
  const canonical = absoluteUrl(route.path);
  const title = clampMetaTitle(route.title, SITE_NAME);
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
  if (!html.includes(`content="${escapeAttr(canonical)}"`)) {
    fail(`Route ${route.path}: og:url content mismatch (expected ${canonical})`);
  }
  if (!html.includes(`<title data-rh="true">${escapeText(title)}</title>`)) {
    fail(`Route ${route.path}: title mismatch`);
  }

  const ldScripts = [
    ...html.matchAll(
      /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      return null;
    }
  });

  const topTypes = new Set(
    ldScripts.flatMap((data) => {
      if (!data) return [];
      if (Array.isArray(data["@graph"])) {
        return data["@graph"].flatMap((n) => jsonLdNodeTypes(n));
      }
      return jsonLdNodeTypes(data);
    }),
  );

  const hasOrgGraph = ldScripts.some(
    (data) =>
      data &&
      Array.isArray(data["@graph"]) &&
      data["@graph"].some((n) => jsonLdNodeTypes(n).includes("Organization")) &&
      data["@graph"].some((n) => jsonLdNodeTypes(n).includes("WebSite")),
  );

  if (!hasOrgGraph) {
    fail(`Route ${route.path}: missing Organization + WebSite JSON-LD graph`);
  }

  const needsBreadcrumb =
    route.path.startsWith("/services/") ||
    route.path.startsWith("/blog/") ||
    route.path === "/blog";
  if (needsBreadcrumb && !topTypes.has("BreadcrumbList")) {
    fail(`Route ${route.path}: missing BreadcrumbList JSON-LD`);
  }

  if (route.service) {
    if (!topTypes.has("Service")) {
      fail(`Route ${route.path}: missing Service JSON-LD`);
    }
    if (route.service.faq?.length && !topTypes.has("FAQPage")) {
      fail(`Route ${route.path}: missing FAQPage JSON-LD`);
    }
  } else if (route.path !== "/" && topTypes.has("Service")) {
    fail(`Route ${route.path}: unexpected Service JSON-LD`);
  }

  if (route.article) {
    if (!topTypes.has("BlogPosting")) {
      fail(`Route ${route.path}: missing BlogPosting JSON-LD`);
    }
    if (route.article.faq?.length && !topTypes.has("FAQPage")) {
      fail(`Route ${route.path}: missing FAQPage JSON-LD`);
    }
  } else if (topTypes.has("BlogPosting")) {
    fail(`Route ${route.path}: unexpected top-level BlogPosting JSON-LD`);
  }
}

export async function prerenderMeta() {
  if (!fs.existsSync(TEMPLATE)) {
    fail(`Missing ${TEMPLATE}. Run vite build first.`);
  }

  const { routes: prerenderRoutes } = await buildPrerenderRoutes();

  if (!Array.isArray(prerenderRoutes) || prerenderRoutes.length < 12) {
    fail(`Expected at least 12 prerender routes, got ${prerenderRoutes?.length}`);
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
    "/services/ai-automation",
    "/services/ai-voice-agents",
    "/services/business-automation",
    "/services/ai-saas-development",
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

  // Prefer a clean Vite shell. After prerender-html, index.html is hydrated and
  // may contain duplicate Helmet tags — reuse a snapshot from the last clean pass.
  const SNAPSHOT = path.join(DIST, ".prerender-template.html");
  let templateHtml = fs.readFileSync(TEMPLATE, "utf8");
  const hasEmptyRoot =
    /<div\s+[^>]*id=["']root["'][^>]*>\s*<\/div>/i.test(templateHtml);
  if (hasEmptyRoot) {
    fs.writeFileSync(SNAPSHOT, templateHtml, "utf8");
    fs.writeFileSync(path.join(DIST, "blog-shell.html"), templateHtml, "utf8");
  } else if (fs.existsSync(SNAPSHOT)) {
    templateHtml = fs.readFileSync(SNAPSHOT, "utf8");
  } else {
    fail(
      "dist/index.html is hydrated and no .prerender-template.html snapshot exists. Run `vite build` first.",
    );
  }
  if (!/<div\s+[^>]*id=["']root["'][^>]*>\s*<\/div>/i.test(templateHtml)) {
    fail("Prerender template is missing an empty #root");
  }
  if (!/<script\b/i.test(templateHtml)) {
    fail("Prerender template is missing script tags");
  }

  const written = [];
  for (const route of prerenderRoutes) {
    const html = applyRouteMeta(templateHtml, route);
    validateHtml(html, route);

    const out = outputPathForRoute(route.path);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html, "utf8");
    written.push(path.relative(ROOT, out).replace(/\\/g, "/"));
  }

  // Dedicated 404 shell (same SPA assets; client NotFound sets noindex)
  const notFoundRoute = {
    path: "/404",
    title: "Page Not Found | TechVerge Solutions",
    description:
      "The page you requested could not be found on TechVerge Solutions.",
  };
  let notFoundHtml = applyRouteMeta(templateHtml, notFoundRoute);
  notFoundHtml = upsertTag(notFoundHtml, {
    tag: "meta",
    attr: "name",
    attrValue: "robots",
    attrs: { name: "robots", content: "noindex, nofollow" },
  });
  // Ensure robots meta exists even if template lacked it
  if (!/name\s*=\s*["']robots["']/i.test(notFoundHtml)) {
    notFoundHtml = notFoundHtml.replace(
      /<\/head>/i,
      `    <meta name="robots" content="noindex, nofollow" />\n  </head>`,
    );
  }
  fs.writeFileSync(path.join(DIST, "404.html"), notFoundHtml, "utf8");
  written.push("dist/404.html");

  console.log(
    `[prerender-meta] Wrote ${written.length} HTML files with route metadata:`,
  );
  for (const f of written) console.log(`  - ${f}`);

  return { routes: prerenderRoutes, written };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  prerenderMeta().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
