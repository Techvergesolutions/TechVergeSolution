/**
 * Capture React-rendered HTML into dist route files so crawlers see body text
 * without executing JavaScript.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import sirv from "sirv";
import { ROOT } from "./load-env.mjs";
import { buildPrerenderRoutes } from "./build-prerender-routes.mjs";

const DIST = path.join(ROOT, "dist");
const MIN_ROOT_TEXT = 120;

/** Throw so callers (seo-build) can soft-fail without killing the whole build. */
function fail(message) {
  console.error(`\n[prerender-html] ERROR: ${message}\n`);
  throw new Error(message);
}

function outputPathForRoute(routePath) {
  if (routePath === "/") return path.join(DIST, "index.html");
  const segments = routePath.replace(/^\//, "").split("/");
  return path.join(DIST, ...segments, "index.html");
}

function startStaticServer() {
  const serve = sirv(DIST, {
    single: false,
    dev: true,
    etag: false,
  });

  const server = http.createServer((req, res) => {
    const urlPath = (req.url || "/").split("?")[0];
    if (!path.extname(urlPath) || urlPath.endsWith("/")) {
      const tryPath =
        urlPath === "/"
          ? "/index.html"
          : `${urlPath.replace(/\/$/, "")}/index.html`;
      const abs = path.join(DIST, tryPath.replace(/^\//, ""));
      if (fs.existsSync(abs)) {
        req.url = tryPath;
      }
    }
    serve(req, res);
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function waitForContent(page) {
  await page.waitForSelector("#root", { timeout: 30000 });
  await page.waitForFunction(
    () => {
      const root = document.getElementById("root");
      if (!root) return false;
      const text = (root.textContent || "").replace(/\s+/g, " ").trim();
      if (text.length < 80) return false;
      if (/Loading article/i.test(text)) return false;
      if (/Page Not Found/i.test(document.title)) return false;
      if (/page not found/i.test(text) && /\b404\b/.test(text)) return false;
      return Boolean(root.querySelector("h1"));
    },
    { timeout: 90000 },
  );
  await new Promise((r) => setTimeout(r, 600));
}

async function assertCapturedPage(page, routePath) {
  const snapshot = await page.evaluate(() => {
    const root = document.getElementById("root");
    const text = (root?.textContent || "").replace(/\s+/g, " ").trim();
    const h1 = root?.querySelector("h1")?.textContent?.trim() || "";
    return {
      textLen: text.length,
      h1,
      title: document.title,
      hasRoot: Boolean(root),
      loading: /Loading article/i.test(text),
    };
  });

  if (!snapshot.hasRoot) fail(`Route ${routePath}: missing #root`);
  if (snapshot.loading) fail(`Route ${routePath}: still showing loading state`);
  if (/page not found/i.test(snapshot.title)) {
    fail(
      `Route ${routePath}: rendered Not Found (title). Check Sanity env / published slug.`,
    );
  }
  if (!snapshot.h1) fail(`Route ${routePath}: missing <h1> inside #root`);
  if (snapshot.textLen < MIN_ROOT_TEXT) {
    fail(
      `Route ${routePath}: #root text too short (${snapshot.textLen} < ${MIN_ROOT_TEXT})`,
    );
  }
}

export async function prerenderHtml() {
  if (!fs.existsSync(DIST)) {
    fail(`Missing ${DIST}. Run vite build first.`);
  }

  const { routes } = await buildPrerenderRoutes();
  if (!routes.length) fail("No prerender routes returned");

  const { server, port } = await startStaticServer();
  const base = `http://127.0.0.1:${port}`;

  let browser;
  try {
    try {
      browser = await chromium.launch({ headless: true });
    } catch (error) {
      fail(
        `Failed to launch Chromium (${error.message}). Run: npx playwright install chromium`,
      );
    }

    const context = await browser.newContext();
    // Skip analytics / tag managers so they cannot keep the network busy.
    await context.route(
      /googletagmanager|google-analytics|googleadservices|doubleclick|hotjar|clarity\.ms|facebook\.net|linkedin\.com\/px/i,
      (route) => route.abort(),
    );
    // Sanity CORS often omits ephemeral http://127.0.0.1:<port> origins used by
    // this prerender server. Fulfill Sanity API calls from Node (no CORS).
    await context.route(
      /https:\/\/[^/]+\.(apicdn|api)\.sanity\.io\//,
      async (route) => {
        try {
          const request = route.request();
          // Drop browser Origin/Referer — Sanity CORS rejects 127.0.0.1 prerender ports.
          const headers = { ...request.headers() };
          delete headers.origin;
          delete headers.Origin;
          delete headers.referer;
          delete headers.Referer;
          const upstream = await fetch(request.url(), {
            method: request.method(),
            headers,
            body: request.postData() || undefined,
          });
          const buffer = Buffer.from(await upstream.arrayBuffer());
          const outHeaders = Object.fromEntries(upstream.headers.entries());
          outHeaders["access-control-allow-origin"] = "*";
          await route.fulfill({
            status: upstream.status,
            headers: outHeaders,
            body: buffer,
          });
        } catch (error) {
          await route.abort();
          console.warn(`[prerender-html] Sanity proxy failed: ${error.message}`);
        }
      },
    );

    const page = await context.newPage();
    page.setDefaultTimeout(90000);
    page.on("pageerror", (err) => {
      console.warn(`[prerender-html] pageerror: ${err.message}`);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        console.warn(`[prerender-html] console.${msg.type()}: ${msg.text()}`);
      }
    });

    const written = [];
    for (const route of routes) {
      const url = `${base}${route.path === "/" ? "/" : route.path}`;
      console.log(`[prerender-html] Rendering ${route.path}`);
      const failedRequests = [];
      const onResponse = (res) => {
        if (res.status() >= 400) {
          failedRequests.push(`${res.status()} ${res.url()}`);
        }
      };
      page.on("response", onResponse);
      try {
        // Prefer "load" over "networkidle": image srcsets / lazy media can keep
        // the network active long enough to time out on blog routes.
        await page.goto(url, { waitUntil: "load", timeout: 90000 });
        await waitForContent(page);
        await assertCapturedPage(page, route.path);
      } catch (error) {
        if (failedRequests.length) {
          console.warn(
            `[prerender-html] failed responses:\n  ${failedRequests.slice(0, 8).join("\n  ")}`,
          );
        }
        fail(`Route ${route.path}: render failed — ${error.message}`);
      } finally {
        page.off("response", onResponse);
      }

      const html = await page.content();
      if (/<div[^>]*id=["']root["'][^>]*>\s*<\/div>/i.test(html)) {
        fail(`Route ${route.path}: #root empty in serialized HTML`);
      }

      const out = outputPathForRoute(route.path);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, html, "utf8");
      written.push(path.relative(ROOT, out).replace(/\\/g, "/"));
    }

    console.log(
      `[prerender-html] Captured ${written.length} pages with body HTML`,
    );
    return written;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    await new Promise((resolve) => server.close(resolve));
  }
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  prerenderHtml().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
