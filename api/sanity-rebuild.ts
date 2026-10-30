import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "node:crypto";

/**
 * Sanity → Vercel rebuild webhook.
 *
 * Configure in Sanity (see docs/SEO-SANITY-WEBHOOK.md):
 * - URL: https://www.techvergesolution.com/api/sanity-rebuild
 * - Secret: same value as SANITY_WEBHOOK_SECRET (server env only)
 * - Trigger on post create/update/delete (including unpublish)
 *
 * Env (Vercel project → Settings → Environment Variables):
 * - SANITY_WEBHOOK_SECRET
 * - VERCEL_DEPLOY_HOOK_URL
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expected = process.env.SANITY_WEBHOOK_SECRET?.trim() || "";
  const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL?.trim() || "";

  if (!expected || !deployHook) {
    console.error("[sanity-rebuild] Missing SANITY_WEBHOOK_SECRET or VERCEL_DEPLOY_HOOK_URL");
    return res.status(503).json({ error: "Rebuild webhook is not configured" });
  }

  const provided = extractSecret(req);
  if (!provided || !timingSafeEqual(provided, expected)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const hookRes = await fetch(deployHook, { method: "POST" });
    if (!hookRes.ok) {
      console.error("[sanity-rebuild] Deploy hook failed", hookRes.status);
      return res.status(502).json({ error: "Deploy hook failed" });
    }
    return res.status(200).json({ ok: true, triggered: true });
  } catch (error) {
    console.error("[sanity-rebuild] Deploy hook error", error);
    return res.status(502).json({ error: "Deploy hook error" });
  }
}
