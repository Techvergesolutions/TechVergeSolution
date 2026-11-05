import { readFile } from "node:fs/promises";
import path from "node:path";
import { fetchBlogHead, renderBlogHead } from "../src/lib/server/blogPage";

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    const slug = new URL(request.url).searchParams.get("slug")?.trim();
    if (!slug || slug.length > 200 || /[\\/]/.test(slug) || slug === "." || slug === "..") return new Response("Not found", { status: 404 });
    try {
      const [template, data] = await Promise.all([readFile(path.join(process.cwd(), "dist", "blog-shell.html"), "utf8"), fetchBlogHead(slug)]);
      const result = renderBlogHead(template, slug, data.post, data.image, data.ogImage);
      return new Response(request.method === "HEAD" ? null : result.html, { status: result.found ? 200 : 404, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    } catch (error) {
      console.error("Unable to render blog page", error);
      return new Response("Blog temporarily unavailable", { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" } });
    }
  },
};
