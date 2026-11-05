/**
 * Notify IndexNow (Bing / Yandex / others) that URLs changed.
 *
 * Usage:
 *   node scripts/ping-indexnow.mjs
 *   node scripts/ping-indexnow.mjs --url https://www.techvergesolution.com/blog/my-slug
 *   node scripts/ping-indexnow.mjs --slug my-slug
 *   node scripts/ping-indexnow.mjs --all-posts
 *
 * Env:
 *   INDEXNOW_KEY          — must match public/<key>.txt (default: key file in repo)
 *   INDEXNOW_HOST         — default www.techvergesolution.com
 *   INDEXNOW_KEY_LOCATION — absolute URL to the key file (optional)
 *   SITE_URL              — https://www.techvergesolution.com
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT } from "./load-env.mjs";
import { collectBlogPosts } from "./collect-blog-posts.mjs";

const DEFAULT_KEY = "d52e645fe0119e9f67683e0c748a48c2";
const SITE_URL = (
  process.env.SITE_URL || "https://www.techvergesolution.com"
).replace(/\/$/, "");
const HOST = (process.env.INDEXNOW_HOST || "www.techvergesolution.com").replace(
  /^https?:\/\//,
  "",
);

function resolveKey() {
  return (process.env.INDEXNOW_KEY || DEFAULT_KEY).trim();
}

function keyFilePath(key) {
  return path.join(ROOT, "public", `${key}.txt`);
}

function ensureKeyFile(key) {
  const file = keyFilePath(key);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, `${key}\n`, "utf8");
    console.log(`[indexnow] Wrote missing key file ${path.relative(ROOT, file)}`);
  } else {
    const body = fs.readFileSync(file, "utf8").trim();
    if (body !== key) {
      throw new Error(
        `[indexnow] public/${key}.txt content must equal the key (got "${body}")`,
      );
    }
  }
  // Keep dist in sync when present (post-build)
  const distFile = path.join(ROOT, "dist", `${key}.txt`);
  if (fs.existsSync(path.join(ROOT, "dist"))) {
    fs.writeFileSync(distFile, `${key}\n`, "utf8");
  }
}

function parseArgs(argv) {
  const urls = [];
  let allPosts = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--all-posts") allPosts = true;
    else if (a === "--url" && argv[i + 1]) urls.push(argv[++i]);
    else if (a === "--slug" && argv[i + 1]) {
      urls.push(`${SITE_URL}/blog/${argv[++i].replace(/^\/+/, "")}`);
    } else if (a.startsWith("http")) urls.push(a);
  }
  return { urls, allPosts };
}

function normalizeUrl(input) {
  if (!input) return null;
  if (input.startsWith("http")) return input.split("#")[0];
  if (input.startsWith("/")) return `${SITE_URL}${input}`;
  return `${SITE_URL}/${input}`;
}

/**
 * Submit URL list to the IndexNow API.
 * @returns {{ ok: boolean, status: number, submitted: number, body?: string }}
 */
export async function pingIndexNow(urlList) {
  const key = resolveKey();
  ensureKeyFile(key);

  const urls = [
    ...new Set(
      urlList.map(normalizeUrl).filter((u) => typeof u === "string" && u.length),
    ),
  ];
  if (!urls.length) {
    return { ok: false, status: 0, submitted: 0, body: "No URLs to submit" };
  }

  const keyLocation =
    process.env.INDEXNOW_KEY_LOCATION?.trim() || `${SITE_URL}/${key}.txt`;

  const payload = {
    host: HOST,
    key,
    keyLocation,
    urlList: urls,
  };

  const endpoint = "https://api.indexnow.org/indexnow";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => "");
  // 200 / 202 accepted; 422 invalid; some endpoints return empty body
  const ok = res.status === 200 || res.status === 202;
  if (!ok) {
    console.warn(`[indexnow] ${res.status} ${text || res.statusText}`);
  } else {
    console.log(`[indexnow] Submitted ${urls.length} URL(s) → ${res.status}`);
  }
  return { ok, status: res.status, submitted: urls.length, body: text };
}

export async function pingBlogPosts(slugs) {
  const urls = slugs.map((s) => `${SITE_URL}/blog/${s}`);
  // Also refresh index + blog listing when posts change
  urls.push(`${SITE_URL}/blog`);
  urls.push(`${SITE_URL}/sitemap.xml`);
  return pingIndexNow(urls);
}

async function main() {
  const { urls, allPosts } = parseArgs(process.argv.slice(2));
  let list = [...urls];

  if (allPosts || list.length === 0) {
    const posts = await collectBlogPosts();
    list = posts.map((p) => `${SITE_URL}/blog/${p.slug}`);
    list.push(`${SITE_URL}/blog`, `${SITE_URL}/`);
  }

  const result = await pingIndexNow(list);
  if (!result.ok && result.status !== 0) process.exitCode = 1;
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main().catch((err) => {
    console.error("[indexnow] FAILED:", err);
    process.exit(1);
  });
}
