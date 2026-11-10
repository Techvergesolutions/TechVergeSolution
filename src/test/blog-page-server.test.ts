// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";

const state = vi.hoisted(() => ({ post: null as unknown, ogImage: undefined as string | undefined, fail: false }));
vi.mock("node:fs/promises", () => ({ readFile: async () => '<!doctype html><html><head><title>Home</title><meta name="description" content="Home"><link rel="canonical" href="https://example.org/"><meta property="og:type" content="website"><script id="site-organization-jsonld" type="application/ld+json">{"@type":"Organization"}</script></head><body><div id="root"></div></body></html>' }));
vi.mock("@/lib/server/blogPage", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/server/blogPage")>();
  return { ...original, fetchBlogHead: async () => { if (state.fail) throw new Error("Sanity unavailable"); return { post: state.post, ogImage: state.ogImage }; } };
});
import handler from "../../api/blog-page";

const post = { title: 'A <real> post', slug: "new-post", excerpt: 'A "useful" summary', description: null, publishedAt: "2026-01-01T00:00:00Z", updatedAt: null, seo: { seoTitle: "SEO title", seoDescription: "SEO description", canonicalUrl: null, noIndex: false }, mainImage: null, author: { name: "Real Author" }, faqs: [{ _key: "one", question: "A question?", answer: "An answer </script>" }] };
afterEach(() => { state.post = null; state.ogImage = undefined; state.fail = false; });

describe("dynamic blog HTML", () => {
  it("renders published Sanity metadata and safe structured data in the initial response", async () => {
    state.post = post;
    const response = await handler.fetch(new Request("https://example.com/api/blog-page?slug=new-post"));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    const raw = await response.text();
    const doc = new JSDOM(raw).window.document;
    expect(doc.title).toBe("SEO title | TechVerge Solutions");
    expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toBe("SEO description");
    expect(doc.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toMatch(/\/blog\/new-post$/);
    expect(doc.querySelector('meta[property="og:type"]')?.getAttribute("content")).toBe("article");
    expect(doc.querySelector('meta[property="og:image"]')?.getAttribute("content")).toMatch(/\/api\/og\?slug=new-post$/);
    const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')].map((node) => JSON.parse(node.textContent!));
    expect(schemas.find((schema) => schema["@type"] === "BlogPosting")).toMatchObject({
      headline: "A <real> post",
      author: { "@type": "Person", name: "Real Author" },
      dateModified: post.publishedAt,
    });
    expect(schemas.find((schema) => schema["@type"] === "FAQPage").mainEntity[0].acceptedAnswer.text).toBe("An answer </script>");
    expect(raw).not.toContain("An answer </script>");
  });

  it("reflects edits immediately and applies fallbacks and noindex", async () => {
    state.post = { ...post, title: "Updated title", seo: { seoTitle: null, seoDescription: null, canonicalUrl: "https://example.com/original", noIndex: true }, faqs: [] };
    const response = await handler.fetch(new Request("https://example.com/api/blog-page?slug=new-post"));
    const doc = new JSDOM(await response.text()).window.document;
    expect(doc.title).toBe("Updated title | TechVerge Solutions");
    expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toBe('A "useful" summary');
    expect(doc.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex, follow");
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://example.com/original");
    expect(doc.querySelectorAll('script[data-prerender-jsonld]')).toHaveLength(1);
  });

  it("returns 404 for missing posts and 503 for a Sanity failure", async () => {
    const request = new Request("https://example.com/api/blog-page?slug=missing");
    expect((await handler.fetch(request)).status).toBe(404);
    state.fail = true;
    expect((await handler.fetch(request)).status).toBe(503);
  });

  it("uses an editor-selected Sanity social image", async () => {
    state.post = { ...post, seo: { ...post.seo, ogImage: { alt: "A custom image" } } };
    state.ogImage = "https://cdn.sanity.io/images/project/production/photo.jpg?w=1400";
    const response = await handler.fetch(new Request("https://example.com/api/blog-page?slug=new-post"));
    const doc = new JSDOM(await response.text()).window.document;
    expect(doc.querySelector('meta[property="og:image"]')?.getAttribute("content")).toBe(state.ogImage);
    expect(doc.querySelector('meta[property="og:image:alt"]')?.getAttribute("content")).toBe("A custom image");
  });

  it("preserves the existing local article and supports HEAD", async () => {
    const response = await handler.fetch(new Request("https://example.com/api/blog-page?slug=ai-voice-agents-for-small-business-2026", { method: "HEAD" }));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
  });
});
