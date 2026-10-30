import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "node:crypto";
import { submitIndexNow } from "./indexnow";

/**
 * Sanity → Vercel rebuild webhook + IndexNow ping for published posts.
 *
 * Configure in Sanity (see docs/SEO-SANITY-WEBHOOK.md):
 * - URL: https://www.techvergesolution.com/api/sanity-rebuild
 * - Secret: same value as SANITY_WEBHOOK_SECRET (server env only)
 * - Trigger on post create/update/delete (including unpublish)
 *
 * Env (Vercel project → Settings → Environment Variables):
 * - SANITY_WEBHOOK_SECRET
 * - VERCEL_DEPLOY_HOOK_URL
 * - INDEXNOW_KEY (optional; defaults to repo key file name)
 */
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

const SITE_URL = (
  process.env.SITE_URL || "https://www.techvergesolution.com"
).replace(/\/$/, "");

function extractBlogUrls(body: unknown): string[] {
  if (!body || typeof body !== "object") return [];
  const data = body as Record<string, unknown>;
  const urls: string[] = [];

  const pushSlug = (slug: unknown) => {
    if (typeof slug === "string" && slug.trim()) {
      urls.push(`${SITE_URL}/blog/${slug.trim()}`);
    } else if (slug && typeof slug === "object") {
      const current = (slug as { current?: string }).current;
      if (typeof current === "string" && current.trim()) {
        urls.push(`${SITE_URL}/blog/${current.trim()}`);
      }
    }
  };

  pushSlug(data.slug);

  if (Array.isArray(data.ids)) {
    // ignore document ids
  }

  // Sanity webhook projection may nest under `result` or send an array
  if (data.result && typeof data.result === "object") {
    pushSlug((data.result as { slug?: unknown }).slug);
  }
  if (Array.isArray(body)) {
    for (const item of body) {
      if (item && typeof item === "object") {
        pushSlug((item as { slug?: unknown }).slug);
      }
    }
  }

  if (urls.length) {
    urls.push(`${SITE_URL}/blog`, `${SITE_URL}/sitemap.xml`);
  }
  return [...new Set(urls)];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expected = process.env.SANITY_WEBHOOK_SECRET?.trim() || "";
  const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL?.trim() || "";

  if (!expected || !deployHook) {
    console.error(
      "[sanity-rebuild] Missing SANITY_WEBHOOK_SECRET or VERCEL_DEPLOY_HOOK_URL",
    );
    return res.status(503).json({ error: "Rebuild webhook is not configured" });
  }

  const provided = extractSecret(req);
  if (!provided || !timingSafeEqual(provided, expected)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body =
    typeof req.body === "string"
      ? (() => {
          try {
            return JSON.parse(req.body || "{}");
          } catch {
            return {};
          }
        })()
      : req.body || {};

  const blogUrls = extractBlogUrls(body);

  try {
    const hookRes = await fetch(deployHook, { method: "POST" });
    if (!hookRes.ok) {
      console.error("[sanity-rebuild] Deploy hook failed", hookRes.status);
      return res.status(502).json({ error: "Deploy hook failed" });
    }

    let indexNow: Awaited<ReturnType<typeof submitIndexNow>> | null = null;
    if (blogUrls.length) {
      try {
        indexNow = await submitIndexNow(blogUrls);
        if (!indexNow.ok) {
          console.warn(
            "[sanity-rebuild] IndexNow soft-fail",
            indexNow.status,
            indexNow.body,
          );
        }
      } catch (err) {
        console.warn("[sanity-rebuild] IndexNow error (non-fatal)", err);
      }
    }

    return res.status(200).json({
      ok: true,
      triggered: true,
      indexNow: indexNow
        ? {
            ok: indexNow.ok,
            status: indexNow.status,
            submitted: indexNow.submitted,
            urls: indexNow.urls,
          }
        : { skipped: true },
    });
  } catch (error) {
    console.error("[sanity-rebuild] Deploy hook error", error);
    return res.status(502).json({ error: "Deploy hook error" });
  }
}
