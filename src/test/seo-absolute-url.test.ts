import { describe, expect, it } from "vitest";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import { mergeBlogPostMeta } from "@/lib/blogApi";
import { getCompiledBlogPosts } from "@/data/blog";

describe("absoluteUrl", () => {
  it("keeps Sanity CDN URLs intact for JSON-LD images", () => {
    const cdn =
      "https://cdn.sanity.io/images/xo7s2xmj/production/abc123-1400x900.jpg";
    expect(absoluteUrl(cdn)).toBe(cdn);
  });

  it("prefixes site-relative paths with www", () => {
    expect(absoluteUrl("/blog/hello")).toBe(`${SITE_URL}/blog/hello`);
    expect(absoluteUrl("/")).toBe(`${SITE_URL}/`);
  });

  it("normalizes apex host to www for canonicals", () => {
    expect(absoluteUrl("https://techvergesolution.com/about")).toBe(
      `${SITE_URL}/about`,
    );
  });
});

describe("markdown blog registry", () => {
  it("compiles at least the voice-agents post", () => {
    const posts = getCompiledBlogPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.some((p) => p.slug.includes("ai-voice"))).toBe(true);
    expect(posts.every((p) => p.bodyHtml && p.bodyHtml.length > 50)).toBe(true);
  });

  it("mergeBlogPostMeta returns markdown posts", () => {
    const merged = mergeBlogPostMeta([]);
    expect(merged.length).toBeGreaterThan(0);
    expect(merged.some((p) => p.slug.includes("ai-voice"))).toBe(true);
  });
});
