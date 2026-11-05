// @vitest-environment node
import { describe, expect, it } from "vitest";
import { generateRssXml, generateSitemapXml } from "@/lib/server/xml";
import { absoluteUrl } from "@/lib/seo/config";
import type { IndexDocument } from "@/lib/server/content";

const doc = (overrides: Partial<IndexDocument>): IndexDocument => ({
  _id: "document", _type: "post", slug: "example", path: null, title: "A <title> & more",
  excerpt: "A & B", description: null, publishedAt: "2026-01-01T12:00:00Z", updatedAt: null, noIndex: null, ...overrides,
});

describe("dynamic sitemap and RSS", () => {
  it("includes published indexable services and posts, uses requested dates and excludes drafts and noindex", () => {
    const xml = generateSitemapXml([
      doc({ _id: "post-1", slug: "post-1", updatedAt: "2026-02-01T12:00:00Z" }),
      doc({ _id: "service-1", _type: "service", slug: "service-1", updatedAt: null, publishedAt: null }),
      doc({ _id: "market-1", _type: "marketPage", slug: "market-1" }),
      doc({ _id: "market-hidden", _type: "marketPage", slug: "market-hidden", noIndex: true }),
      doc({ _id: "drafts.post-2", slug: "draft-post" }),
      doc({ _id: "versions.release.post-3", slug: "release-post" }),
      doc({ _id: "hidden-post", slug: "hidden", noIndex: true }),
      doc({ _id: "hidden-about", _type: "page", slug: "about", noIndex: true }),
      doc({ _id: "invalid", slug: "../admin" }),
    ]);
    expect(xml).toContain(`<loc>${absoluteUrl("/blog/post-1")}</loc><lastmod>2026-02-01T12:00:00Z</lastmod>`);
    expect(xml).toContain(`<loc>${absoluteUrl("/services/service-1")}</loc>`);
    expect(xml).toContain(`<loc>${absoluteUrl("/markets/market-1")}</loc>`);
    expect(xml).not.toContain("/markets/market-hidden");
    expect(xml).toContain(`<loc>${absoluteUrl("/contact")}</loc>`);
    expect(xml).not.toContain("draft-post");
    expect(xml).not.toContain("release-post");
    expect(xml).not.toContain("/blog/hidden");
    expect(xml).not.toContain(absoluteUrl("/about"));
    expect(xml).not.toContain("../admin");
  });

  it("does not restore a noindex fallback article or duplicate a conflicting hidden URL", () => {
    const slug = "ai-voice-agents-for-small-business-2026";
    const xml = generateSitemapXml([doc({ _id: "cms-1", slug, noIndex: true }), doc({ _id: "cms-2", slug, noIndex: false })]);
    expect(xml).not.toContain(`/blog/${slug}`);
  });

  it("produces escaped RSS entries in publication order without private or noindex posts", () => {
    const rss = generateRssXml([
      doc({ _id: "old", slug: "old", publishedAt: "2025-01-01T00:00:00Z" }),
      doc({ _id: "new", slug: "new", title: "New <item> & more 😀", publishedAt: "2026-01-01T00:00:00Z" }),
      doc({ _id: "drafts.x", slug: "draft" }),
      doc({ _id: "private", slug: "hidden", noIndex: true }),
    ]);
    expect(rss).toContain("New &lt;item&gt; &amp; more 😀");
    expect(rss).toContain("A &amp; B");
    expect(rss.indexOf("/blog/new")).toBeLessThan(rss.indexOf("/blog/old"));
    expect(rss).not.toContain("/blog/draft");
    expect(rss).not.toContain("/blog/hidden");
  });
});
