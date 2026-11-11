/**
 * When Playwright cannot run (e.g. Vercel without browser libs), inject minimal
 * crawler-visible copy into empty #root shells so validate-seo-dist passes.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./load-env.mjs";
import { buildPrerenderRoutes } from "./build-prerender-routes.mjs";

const DIST = path.join(ROOT, "dist");
const MIN_ROOT_TEXT = 120;

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

function rootInnerHtml(html) {
  const open = html.match(/<div[^>]*id=["']root["'][^>]*>/i);
  if (!open || open.index === undefined) return "";
  const start = open.index + open[0].length;
  let depth = 1;
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = start;
  let match;
  while ((match = tagRe.exec(html))) {
    const token = match[0];
    if (token.startsWith("</")) depth -= 1;
    else if (!/\/\s*>$/.test(token)) depth += 1;
    if (depth === 0) return html.slice(start, match.index);
  }
  return "";
}

function shellHasUsableRoot(html) {
  const inner = rootInnerHtml(html);
  const text = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length >= MIN_ROOT_TEXT && /<h1\b/i.test(inner);
}

function injectRoot(html, inner) {
  return html.replace(
    /<div\s+id=["']root["'][^>]*>[\s\S]*?<\/div>/i,
    `<div id="root">${inner}</div>`,
  );
}

function headingFromTitle(title) {
  return title.replace(/\s*\|\s*TechVerge Solutions\s*$/i, "").trim();
}

function fallbackBody(route) {
  const h1 = headingFromTitle(route.title);
  const desc = route.description || "";
  const serviceName = route.service?.name;
  const extra = serviceName
    ? `<p>Service: ${escapeHtml(serviceName)}.</p>`
    : "";
  return `<main>
  <h1>${escapeHtml(h1)}</h1>
  <p>${escapeHtml(desc)}</p>
  ${extra}
</main>`;
}

export async function injectRouteFallback() {
  const { routes } = await buildPrerenderRoutes();
  let injected = 0;

  for (const route of routes) {
    if (route.path === "/") continue;
    const out = outputPathForRoute(route.path);
    if (!fs.existsSync(out)) continue;

    const html = fs.readFileSync(out, "utf8");
    if (shellHasUsableRoot(html)) continue;

    fs.writeFileSync(out, injectRoot(html, fallbackBody(route)), "utf8");
    injected += 1;
  }

  if (injected) {
    console.log(
      `[inject-route-fallback] Injected fallback body HTML into ${injected} route(s)`,
    );
  }
  return { injected };
}
