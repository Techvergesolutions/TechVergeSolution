import { getPublishedContent } from "../src/lib/server/content";
import { generateRssXml } from "../src/lib/server/xml";
import { mergeSecurityHeaders } from "../src/lib/server/securityHeaders";

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: mergeSecurityHeaders({ Allow: "GET, HEAD" }),
      });
    }
    try {
      const xml = generateRssXml(await getPublishedContent());
      return new Response(request.method === "HEAD" ? null : xml, {
        headers: mergeSecurityHeaders({
          "Content-Type": "application/rss+xml; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        }),
      });
    } catch (error) {
      console.error("Unable to generate RSS feed", error);
      return new Response("Feed temporarily unavailable", {
        status: 503,
        headers: mergeSecurityHeaders({ "Cache-Control": "no-store" }),
      });
    }
  },
};
