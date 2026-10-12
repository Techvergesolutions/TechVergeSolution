/**
 * Post-vite build: write route-specific initial HTML metadata into dist/.
 * Keep route strings in sync via scripts/seo-prerender-data.mjs
 * (mirrors src/lib/seo.ts + src/data/services.ts).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  EXPECTED_ROUTE_COUNT,
  absoluteUrl,
  faqPageJsonLd,
  organizationJsonLd,
  prerenderRoutes,
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

function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function jsonLdScript(data) {
  return `<script type="application/ld+json">\n${serializeJsonLd(data)}\n    </script>`;
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
  const replacement = `<${tag} ${attrStr} />`;

  if (re.test(html)) {
    return html.replace(re, replacement);
  }

  // Insert before </head>
  return html.replace(/<\/head>/i, `    ${replacement}\n  </head>`);
}

function upsertTitle(html, title) {
  const re = /<title\b[^>]*>[\s\S]*?<\/title>/i;
  const replacement = `<title>${escapeText(title)}</title>`;
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
  if (route.jsonLd === "organization") {
    return `    ${jsonLdScript(organizationJsonLd())}`;
  }
  if (route.service) {
    const blocks = [
      serviceJsonLd({
        name: route.service.name,
        description: route.description,
        path: route.path,
      }),
    ];
    if (route.service.faq?.length) {
      blocks.push(faqPageJsonLd(route.service.faq));
    }
    return blocks.map((b) => `    ${jsonLdScript(b)}`).join("\n");
  }
  return "";
}

function applyRouteMeta(templateHtml, route) {
  const canonical = absoluteUrl(route.path);
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
    attrs: { property: "og:url", content: canonical },
  });
  html = upsertTag(html, {
    tag: "meta",
    attr: "property",
    attrValue: "og:image",
    attrs: { property: "og:image", content: DEFAULT_OG_IMAGE },
  });

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
      attrs: { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    });
  }
  if (/name\s*=\s*["']twitter:image:alt["']/i.test(html)) {
    html = upsertTag(html, {
      tag: "meta",
      attr: "name",
      attrValue: "twitter:image:alt",
      attrs: { name: "twitter:image:alt", content: DEFAULT_OG_IMAGE_ALT },
    });
  }

  if (/name\s*=\s*["']robots["']/i.test(html)) {
    html = upsertTag(html, {
      tag: "meta",
      attr: "name",
      attrValue: "robots",
      attrs: { name: "robots", content: "index, follow" },
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

function validateHtml(html, route) {
  const canonical = absoluteUrl(route.path);
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
  if (!html.includes(`<title>${escapeText(route.title)}</title>`)) {
    fail(`Route ${route.path}: title mismatch`);
  }

  const hasOrg =
    /"@type"\s*:\s*"Organization"/i.test(html) &&
    /"@id"\s*:\s*"https:\/\/www\.techvergesolution\.com\/#organization"/i.test(
      html,
    ) &&
    /"@graph"/i.test(html);
  const hasService = /"@type"\s*:\s*"Service"/i.test(html);
  const hasFaq = /"@type"\s*:\s*"FAQPage"/i.test(html);

  if (route.path === "/") {
    if (!hasOrg) fail(`Route /: missing Organization JSON-LD graph`);
  } else if (hasOrg && /"@graph"/i.test(html)) {
    // Provider Organization on Service schema is fine; full @graph home schema is not
    const ldScripts = [
      ...html.matchAll(
        /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
      ),
    ];
    for (const m of ldScripts) {
      if (/"@graph"/i.test(m[1])) {
        fail(
          `Route ${route.path}: homepage Organization @graph must not remain on non-home pages`,
        );
      }
    }
  }

  if (route.service) {
    if (!hasService) fail(`Route ${route.path}: missing Service JSON-LD`);
    if (route.service.faq?.length && !hasFaq) {
      fail(`Route ${route.path}: missing FAQPage JSON-LD`);
    }
  } else if (route.path !== "/" && hasService) {
    fail(`Route ${route.path}: unexpected Service JSON-LD`);
  }
}

function main() {
  if (!fs.existsSync(TEMPLATE)) {
    fail(`Missing ${TEMPLATE}. Run vite build first.`);
  }

  if (!Array.isArray(prerenderRoutes)) {
    fail("prerenderRoutes is missing or not an array");
  }
  if (prerenderRoutes.length !== EXPECTED_ROUTE_COUNT) {
    fail(
      `Expected ${EXPECTED_ROUTE_COUNT} routes, got ${prerenderRoutes.length}. Keep in sync with seo.ts / services.ts.`,
    );
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

main();
