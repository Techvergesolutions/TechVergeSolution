/**
 * Production-like static routing check:
 * - Known prerendered paths → 200 + unique HTML
 * - Unknown blog/service slugs → HTTP 404 + noindex body
 *
 * Mirrors vercel.json intent: filesystem first, then 404.html with status 404.
 * Does not deploy; run after `npm run build`.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT } from "./load-env.mjs";

const DIST = path.join(ROOT, "dist");

function fail(message) {
  console.error(`\n[routing-check] FAIL: ${message}\n`);
  process.exit(1);
}

function resolveStatic(urlPath) {
  const clean = urlPath.split("?")[0].replace(/\/$/, "") || "/";
  if (clean === "/") {
    const index = path.join(DIST, "index.html");
    return fs.existsSync(index) ? index : null;
  }
  const asIndex = path.join(DIST, clean.slice(1), "index.html");
  if (fs.existsSync(asIndex)) return asIndex;
  const asFile = path.join(DIST, `${clean.slice(1)}.html`);
  if (fs.existsSync(asFile)) return asFile;
  return null;
}

function startServer() {
  const notFoundPath = path.join(DIST, "404.html");
  if (!fs.existsSync(notFoundPath)) fail("dist/404.html missing");

  const server = http.createServer((req, res) => {
    const urlPath = req.url || "/";
    const file = resolveStatic(urlPath);
    if (file) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(fs.readFileSync(file));
      return;
    }
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fs.readFileSync(notFoundPath));
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      resolve({ server, port: server.address().port });
    });
  });
}

async function fetchPath(port, urlPath) {
  const res = await fetch(`http://127.0.0.1:${port}${urlPath}`);
  const text = await res.text();
  return { status: res.status, text };
}

export async function routingCheck() {
  if (!fs.existsSync(DIST)) fail("dist/ missing — run build first");

  const { server, port } = await startServer();
  try {
    const home = await fetchPath(port, "/");
    if (home.status !== 200) fail(`GET / expected 200 got ${home.status}`);
    if (!/<h1\b/i.test(home.text)) fail("GET / missing h1 in body");
    if (!/Organization/i.test(home.text)) fail("GET / missing Organization JSON-LD");

    const blog = await fetchPath(port, "/blog");
    if (blog.status !== 200) fail(`GET /blog expected 200 got ${blog.status}`);
    if (!/<h1\b/i.test(blog.text)) fail("GET /blog missing h1");

    const article = await fetchPath(
      port,
      "/blog/ai-voice-agents-for-small-business-2026",
    );
    if (article.status !== 200) fail(`GET article expected 200 got ${article.status}`);
    if (!/BlogPosting/i.test(article.text)) fail("article missing BlogPosting");
    if (!/<h1\b/i.test(article.text)) fail("article missing h1");

    const service = await fetchPath(port, "/services/ai-voice-agents");
    if (service.status !== 200) fail(`GET service expected 200 got ${service.status}`);
    if (!/<h1\b/i.test(service.text)) fail("service missing h1");

    const badBlog = await fetchPath(port, "/blog/this-slug-does-not-exist-xyz");
    if (badBlog.status !== 404) {
      fail(`unknown blog slug expected HTTP 404 got ${badBlog.status}`);
    }
    if (!/noindex/i.test(badBlog.text)) fail("404 body missing noindex");
    // Must NOT be homepage soft-404
    if (/canonical" href="https:\/\/www\.techvergesolution\.com\/"/i.test(badBlog.text) &&
        /AI Automation &amp; Software Development/i.test(badBlog.text) &&
        !/Page Not Found/i.test(badBlog.text)) {
      fail("unknown blog slug looks like homepage soft-404");
    }

    const badService = await fetchPath(port, "/services/not-a-real-service");
    if (badService.status !== 404) {
      fail(`unknown service slug expected HTTP 404 got ${badService.status}`);
    }
    if (!/noindex/i.test(badService.text)) fail("service 404 missing noindex");

    console.log("[routing-check] OK — known routes 200, unknown slugs HTTP 404 + noindex");
  } finally {
    server.close();
  }
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  routingCheck().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
