import { getPublishedContent } from "../src/lib/server/content";
import { generateSitemapXml } from "../src/lib/server/xml";

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    try {
      const xml = generateSitemapXml(await getPublishedContent());
      return new Response(request.method === "HEAD" ? null : xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-store" } });
    } catch (error) {
      console.error("Unable to generate sitemap", error);
      return new Response("Sitemap temporarily unavailable", { status: 503, headers: { "Cache-Control": "no-store" } });
    }
  },
};
