import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "node:crypto";

/**
 * Ping IndexNow for one or more URLs (usually blog posts after publish).
 *
 * POST JSON: { "url"?: string, "urls"?: string[], "slug"?: string }
 * Auth: same SANITY_WEBHOOK_SECRET as /api/sanity-rebuild
 *   (header sanity-webhook-secret | Authorization Bearer | ?secret=)
 *
 * Env: INDEXNOW_KEY (defaults to repo key), SITE_URL, INDEXNOW_HOST
 */
const DEFAULT_KEY = "d52e645fe0119e9f67683e0c748a48c2";
const SITE_URL = (
  process.env.SITE_URL || "https://www.techvergesolution.com"
).replace(/\/$/, "");

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function extractSecret(req: VercelRequest): string {
  const header =
    (req.headers["sanity-webhook-secret"] as string | undefined) ||
    (req.headers["x-sanity-secret"] as string | undefined) ||
    "";
  if (header.trim()) return header.trim();

  const auth = (req.headers.authorization || "").trim();
  if (auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }

  const q = req.query?.secret;
  if (typeof q === "string" && q.trim()) return q.trim();
  return "";
}

function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (raw.startsWith("http")) return raw.split("#")[0];
  if (raw.startsWith("/")) return `${SITE_URL}${raw}`;
  return `${SITE_URL}/${raw}`;
}

function collectUrls(body: Record<string, unknown>): string[] {
  const urls: string[] = [];
  if (typeof body.url === "string") urls.push(body.url);
  if (typeof body.slug === "string") urls.push(`/blog/${body.slug}`);
  if (Array.isArray(body.urls)) {
    for (const u of body.urls) {
      if (typeof u === "string") urls.push(u);
    }
  }
  // Sanity-shaped payloads
  const slugObj = body.slug as { current?: string } | undefined;
  if (slugObj && typeof slugObj.current === "string") {
    urls.push(`/blog/${slugObj.current}`);
  }
  return [
    ...new Set(urls.map(normalizeUrl).filter((u): u is string => Boolean(u))),
  ];
}

export async function submitIndexNow(urls: string[]) {
  const key = (process.env.INDEXNOW_KEY || DEFAULT_KEY).trim();
  const host = (
    process.env.INDEXNOW_HOST || "www.techvergesolution.com"
  ).replace(/^https?:\/\//, "");
  const keyLocation =
    process.env.INDEXNOW_KEY_LOCATION?.trim() || `${SITE_URL}/${key}.txt`;

  const unique = [...new Set(urls)];
  if (!unique.length) {
    return { ok: false as const, status: 0, submitted: 0, error: "No URLs" };
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList: unique,
    }),
  });

  const text = await res.text().catch(() => "");
  const ok = res.status === 200 || res.status === 202;
  return {
    ok,
    status: res.status,
    submitted: unique.length,
    body: text,
    urls: unique,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expected = process.env.SANITY_WEBHOOK_SECRET?.trim() || "";
  if (!expected) {
    return res.status(503).json({ error: "IndexNow webhook is not configured" });
  }

  const provided = extractSecret(req);
  if (!provided || !timingSafeEqual(provided, expected)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body =
    typeof req.body === "string"
      ? (JSON.parse(req.body || "{}") as Record<string, unknown>)
      : ((req.body || {}) as Record<string, unknown>);

  let urls = collectUrls(body);
  if (!urls.length) {
    // Fallback: ping blog index so Bing rechecks sitemap-linked posts
    urls = [`${SITE_URL}/blog`, `${SITE_URL}/sitemap.xml`];
  }

  try {
    const result = await submitIndexNow(urls);
    if (!result.ok) {
      console.warn("[indexnow] API rejected", result.status, result.body);
      return res.status(502).json({ error: "IndexNow rejected", ...result });
    }
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    console.error("[indexnow] error", error);
    return res.status(502).json({ error: "IndexNow request failed" });
  }
}
