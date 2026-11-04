import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { getCache } from "@vercel/functions";

const allowedTypes = new Set(["post", "service", "page", "marketPage"]);
const MAX_BODY_BYTES = 64 * 1024;

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
    const secret = process.env.SANITY_WEBHOOK_SECRET?.trim();
    if (!secret) return Response.json({ error: "Webhook secret is not configured" }, { status: 503 });
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);
    if (!signature) return Response.json({ error: "Invalid signature" }, { status: 401 });
    const length = Number(request.headers.get("content-length") || 0);
    if (length > MAX_BODY_BYTES) return Response.json({ error: "Payload too large" }, { status: 413 });

    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return Response.json({ error: "Payload too large" }, { status: 413 });
    if (!await isValidSignature(raw, signature, secret)) return Response.json({ error: "Invalid signature" }, { status: 401 });

    let payload: { _type?: unknown; _id?: unknown };
    try { payload = JSON.parse(raw); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
    if (!payload || typeof payload._type !== "string" || !allowedTypes.has(payload._type) || typeof payload._id !== "string") {
      return Response.json({ error: "Unsupported document" }, { status: 400 });
    }
    if (payload._id.startsWith("drafts.") || payload._id.startsWith("versions.")) {
      return Response.json({ error: "Draft documents are not revalidated" }, { status: 400 });
    }

    try {
      // Sanity's mutation event can precede query visibility; wait before expiring.
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const tag = `sanity:${payload._type}`;
      await getCache().expireTag(tag);
      return Response.json({ revalidated: true, tag });
    } catch (error) {
      console.error("Sanity cache invalidation failed", error);
      return Response.json({ error: "Cache invalidation failed" }, { status: 503 });
    }
  },
};
