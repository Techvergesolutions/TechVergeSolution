import sharp from "sharp";
import { fetchBlogHead } from "../src/lib/server/blogPage";
import { escapeXml } from "../src/lib/server/xml";
import { getBlogPostBySlug } from "../src/data/blog";
import { siteName } from "../src/lib/seo/config";
import { mergeSecurityHeaders } from "../src/lib/server/securityHeaders";

/** A title card for a published article, rendered on demand. */
export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: mergeSecurityHeaders({ Allow: "GET, HEAD" }),
      });
    }
    const slug = new URL(request.url).searchParams.get("slug")?.trim();
    if (!slug || slug.length > 200 || /[\\/]/.test(slug) || slug === "." || slug === "..") {
      return new Response("Invalid slug", { status: 400, headers: mergeSecurityHeaders() });
    }
    try {
      const { post } = await fetchBlogHead(slug);
      const title = (post?.title || getBlogPostBySlug(slug)?.title)?.trim();
      if (!title) return new Response("Not found", { status: 404, headers: mergeSecurityHeaders() });
      const words = title.slice(0, 240).split(/\s+/);
      const lines: string[] = [];
      for (const word of words) {
        const current = lines[lines.length - 1];
        if (current && `${current} ${word}`.length <= 34) lines[lines.length - 1] += ` ${word}`;
        else lines.push(word);
      }
      const visible = lines.slice(0, 4);
      if (lines.length > 4) visible[visible.length - 1] += "…";
      const text = visible.map((line, index) => `<text x="90" y="${230 + index * 72}" font-family="sans-serif" font-size="52" font-weight="700" fill="#f8fafc">${escapeXml(line)}</text>`).join("");
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#09111f"/><rect x="90" y="104" width="80" height="6" fill="#23c7d9"/><text x="90" y="165" font-family="sans-serif" font-size="26" fill="#23c7d9">${escapeXml(siteName)}</text>${text}</svg>`;
      const image = await sharp(Buffer.from(svg)).png().toBuffer();
      return new Response(request.method === "HEAD" ? null : new Uint8Array(image), {
        headers: mergeSecurityHeaders({
          "Content-Type": "image/png",
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        }),
      });
    } catch (error) {
      console.error("Unable to generate article image", error);
      return new Response("Image temporarily unavailable", {
        status: 503,
        headers: mergeSecurityHeaders({ "Cache-Control": "no-store" }),
      });
    }
  },
};
