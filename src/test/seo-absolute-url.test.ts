import { describe, expect, it } from "vitest";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import { PUBLISHED_POST_FILTER, mergeBlogPostMeta } from "@/lib/blogApi";

describe("absoluteUrl", () => {
  it("keeps Sanity CDN URLs intact for JSON-LD images", () => {
    const cdn =
      "https://cdn.sanity.io/images/xo7s2xmj/production/abc123-1400x900.jpg";
    expect(absoluteUrl(cdn)).toBe(cdn);
  });

  it("prefixes site-relative paths", () => {
    expect(absoluteUrl("/blog/hello")).toBe(`${SITE_URL}/blog/hello`);
  });
});

describe("published Sanity filter", () => {
  it("excludes drafts and future dates", () => {
    expect(PUBLISHED_POST_FILTER).toContain('!(_id in path("drafts.**"))');
    expect(PUBLISHED_POST_FILTER).toContain("publishedAt <= now()");
  });
});

describe("mergeBlogPostMeta", () => {
  it("falls back to static posts when Sanity is empty", () => {
    const merged = mergeBlogPostMeta([]);
    expect(merged.length).toBeGreaterThan(0);
    expect(merged.some((p) => p.slug.includes("ai-voice"))).toBe(true);
  });

  it("lets Sanity win on slug conflicts", () => {
    const merged = mergeBlogPostMeta([
      {
        _id: "p1",
        title: "Sanity Title",
        slug: "ai-voice-agents-for-small-business-2026",
        excerpt: "From Sanity",
        description: "From Sanity desc",
        publishedAt: "2026-10-12",
        _updatedAt: "2026-10-12",
      },
    ]);
    const hit = merged.find(
      (p) => p.slug === "ai-voice-agents-for-small-business-2026",
    );
    expect(hit?.title).toBe("Sanity Title");
  });
});
