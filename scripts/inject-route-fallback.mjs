/**
 * Inject crawler-visible body HTML into dist route shells when #root is empty
 * or missing an <h1> (before Playwright, and as fallback if capture is skipped).
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./load-env.mjs";
import { buildPrerenderRoutes } from "./build-prerender-routes.mjs";

const DIST = path.join(ROOT, "dist");
const MIN_ROOT_TEXT = 120;

const ROUTE_H1 = {
  "/about": "Built For How Your Business Actually Works",
  "/ai-facts": "Straight Answers About TechVerge",
  "/services": "Custom Software, Websites & Automation",
  "/portfolio": "Work That Solves Real Operational Problems",
  "/contact": "Tell Us What You Want To Automate",
  "/blog": "Practical Guides on AI Voice Agents & Automation",
  "/privacy-policy": "Privacy Policy",
  "/terms-of-service": "Terms & Conditions",
};

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
  const h1Count = (inner.match(/<h1\b/gi) || []).length;
  return text.length >= MIN_ROOT_TEXT && h1Count === 1;
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

function aboutBody() {
  return `<main>
  <h1>Built For How Your Business Actually Works</h1>
  <p>We design and implement custom AI automation, voice agents, and software around your tools, handoffs, and growth goals — not a one-size-fits-all product.</p>
  <h2>A custom automation and software team</h2>
  <p>TechVerge Solutions designs and implements AI lead follow-up automation, inbound AI voice agents, business process automation, and custom AI-powered software. We build around your tools, call types, and handoffs.</p>
  <p>Primary markets are the United States, United Kingdom, and United Arab Emirates. The team is based in Lahore, Punjab, Pakistan.</p>
  <p><a href="/services">View services</a> · <a href="/contact">Contact us</a> · <a href="/blog">Read guides</a></p>
</main>`;
}

function fallbackBody(route) {
  if (route.path === "/about") return aboutBody();
  const h1 =
    ROUTE_H1[route.path] ||
    route.service?.name ||
    route.article?.title ||
    headingFromTitle(route.title);
  const desc = route.description || "";
  const extra = route.service?.name
    ? `<p>${escapeHtml(route.service.name)} from TechVerge Solutions for teams in the US, UK, and UAE.</p>`
    : "";
  return `<main>
  <h1>${escapeHtml(h1)}</h1>
  <p>${escapeHtml(desc)}</p>
  ${extra}
  <p><a href="/">Home</a> · <a href="/services">Services</a> · <a href="/contact">Contact</a></p>
</main>`;
}

export async function injectRouteFallback() {
  const { routes } = await buildPrerenderRoutes();
  let injected = 0;

  for (const route of routes) {
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
  } else {
    console.log("[inject-route-fallback] All prerender routes already have #root + h1");
  }
  return { injected };
}
