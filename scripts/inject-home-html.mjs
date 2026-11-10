/**
 * Inject crawler-visible homepage body into dist/index.html when #root is still empty
 * (before Playwright capture, or as fallback if capture is skipped).
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT } from "./load-env.mjs";

const DIST = path.join(ROOT, "dist");
const CONTENT = path.join(ROOT, "src", "data", "homepage-content.json");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://www.techvergesolution.com").replace(
  /\/+$/,
  "",
);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function injectRoot(html, inner) {
  return html.replace(
    /<div\s+id=["']root["'][^>]*>[\s\S]*?<\/div>/i,
    `<div id="root">${inner}</div>`,
  );
}

function homeStaticHtml(content) {
  const faqItems = content.faqs
    .map(
      (item) =>
        `<div><h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p></div>`,
    )
    .join("\n");

  const about = content.aboutParagraphs
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("\n");

  return `<header><nav aria-label="Primary"><a href="${SITE}/">Home</a> · <a href="${SITE}/services">Services</a> · <a href="${SITE}/blog">Blog</a> · <a href="${SITE}/contact">Contact</a></nav></header>
<main>
  <h1>AI Automation &amp; Voice Agents for Small Businesses</h1>
  <p>TechVerge Solutions — practical automation for teams in the US, UK, and UAE.</p>
  <section aria-labelledby="home-about-static">
    <h2 id="home-about-static">${escapeHtml(content.aboutHeading)}</h2>
    ${about}
    <p><a href="${SITE}/about">About</a> · <a href="${SITE}/ai-facts">AI facts</a></p>
  </section>
  <section aria-labelledby="home-faq-static">
    <h2 id="home-faq-static">Frequently asked questions</h2>
    ${faqItems}
  </section>
  <p><a href="${SITE}/services">View services</a> · <a href="${SITE}/portfolio">Portfolio</a> · <a href="${SITE}/blog">Blog guides</a></p>
</main>`;
}

export async function injectHomeHtml() {
  const indexPath = path.join(DIST, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.warn("[inject-home-html] dist/index.html missing — skip");
    return { injected: false };
  }

  const content = JSON.parse(fs.readFileSync(CONTENT, "utf8"));
  const html = injectRoot(fs.readFileSync(indexPath, "utf8"), homeStaticHtml(content));
  fs.writeFileSync(indexPath, html, "utf8");
  console.log("[inject-home-html] Injected static homepage body into dist/index.html");
  return { injected: true };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  injectHomeHtml().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
