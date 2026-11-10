import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { getCache } from "@vercel/functions";
import { mergeSecurityHeaders } from "../src/lib/server/securityHeaders";

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, {
    ...init,
    headers: mergeSecurityHeaders(init?.headers),
  });
}

const allowedTypes = new Set(["post", "service", "page", "marketPage"]);
const MAX_BODY_BYTES = 64 * 1024;

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
    const secret = process.env.SANITY_WEBHOOK_SECRET?.trim();
    if (!secret) return json({ error: "Webhook secret is not configured" }, { status: 503 });
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);
    if (!signature) return json({ error: "Invalid signature" }, { status: 401 });
    const length = Number(request.headers.get("content-length") || 0);
    if (length > MAX_BODY_BYTES) return json({ error: "Payload too large" }, { status: 413 });

    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: "Payload too large" }, { status: 413 });
    if (!await isValidSignature(raw, signature, secret)) return json({ error: "Invalid signature" }, { status: 401 });

    let payload: { _type?: unknown; _id?: unknown };
    try { payload = JSON.parse(raw); } catch { return json({ error: "Invalid JSON" }, { status: 400 }); }
    if (!payload || typeof payload._type !== "string" || !allowedTypes.has(payload._type) || typeof payload._id !== "string") {
      return json({ error: "Unsupported document" }, { status: 400 });
    }
    if (payload._id.startsWith("drafts.") || payload._id.startsWith("versions.")) {
      return json({ error: "Draft documents are not revalidated" }, { status: 400 });
    }

    try {
      // Sanity's mutation event can precede query visibility; wait before expiring.
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const tag = `sanity:${payload._type}`;
      await getCache().expireTag(tag);
      return json({ revalidated: true, tag });
    } catch (error) {
      console.error("Sanity cache invalidation failed", error);
      return json({ error: "Cache invalidation failed" }, { status: 503 });
    }
  },
};
