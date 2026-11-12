import { describe, expect, it } from "vitest";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import { formatBlogDate, stripBlogExcerptLabel } from "@/lib/blogFormat";
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

  it("formats visible blog dates as Nov 4, 2026", () => {
    expect(formatBlogDate("2026-11-04")).toBe("Nov 4, 2026");
    expect(formatBlogDate("2026-11-04T15:00:00.000Z")).toBe("Nov 4, 2026");
  });

  it("drops a pasted Blog Excerpt label and keeps the guide category when Sanity has none", () => {
    expect(stripBlogExcerptLabel("Blog Excerpt:\n\nMissed calls cost clinics patients.")).toBe(
      "Missed calls cost clinics patients.",
    );
    const merged = mergeBlogPostMeta([
      {
        _id: "doctors",
        title: "How AI Voice Receptionists Help Doctors Stop Losing Patients to Missed Calls",
        slug: "ai-receptionist-for-doctors",
        excerpt: "Blog Excerpt:\n\nMissed calls can mean lost patients.",
        categories: null,
      },
    ]);
    const post = merged.find((item) => item.slug === "ai-receptionist-for-doctors");
    expect(post?.excerpt).toBe("Missed calls can mean lost patients.");
    expect(post?.category).toBe("AI Voice Agents");
    const pricing = merged.find(
      (item) => item.slug === "ai-voice-agents-for-small-businesses-how-they-work-cost",
    );
    expect(pricing?.title).toMatch(/What AI Voice Agents Cost/);
    const overridden = mergeBlogPostMeta([
      {
        _id: "pricing",
        title: "AI Voice Agents for Small Businesses: How They Work, What They Cost",
        slug: "ai-voice-agents-for-small-businesses-how-they-work-cost",
        excerpt: "AI voice agents can answer every call.",
        faqs: [{ question: "What Is Custom Website Development?", answer: "It is a website project." }],
      },
    ]);
    expect(
      overridden.find((item) => item.slug === "ai-voice-agents-for-small-businesses-how-they-work-cost")?.title,
    ).toMatch(/What AI Voice Agents Cost/);
    const voiceSlugs = [
      "ai-receptionist-for-doctors",
      "signs-small-business-needs-ai-phone-agent",
      "ai-voice-agents-for-small-businesses-how-they-work-cost",
      "ai-voice-agents-for-small-business-2026",
    ];
    const posts = getCompiledBlogPosts();
    for (const slug of voiceSlugs) {
      expect(posts.find((item) => item.slug === slug)?.category).toBe("AI Voice Agents");
    }
    expect(posts.some((item) => /blog excerpt:/i.test(item.excerpt + (item.quickAnswer ?? "")))).toBe(false);
  });
});
