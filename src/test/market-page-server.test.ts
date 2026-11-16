// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";

const state = vi.hoisted(() => ({ page: null as unknown, ogImage: undefined as string | undefined, imageAlt: undefined as string | undefined, fail: false }));
vi.mock("node:fs/promises", () => ({
  readFile: async () => '<!doctype html><html><head><title>AI Automation &amp; Voice Agents | TechVerge Solution</title><meta name="description" content="Custom AI automation and voice agents for small businesses in the US, UK, and UAE—built by TechVerge Solution to cut manual work and catch more leads."><link rel="canonical" href="https://www.techvergesolution.com/"><meta property="og:title" content="AI Automation &amp; Voice Agents | TechVerge Solution"><meta property="og:description" content="Custom AI automation and voice agents for small businesses in the US, UK, and UAE—built by TechVerge Solution to cut manual work and catch more leads."><meta property="og:url" content="https://www.techvergesolution.com/"><meta property="og:image" content="https://www.techvergesolution.com/og-image.webp"><meta name="twitter:title" content="AI Automation &amp; Voice Agents | TechVerge Solution"><meta name="twitter:description" content="Custom AI automation and voice agents for small businesses in the US, UK, and UAE—built by TechVerge Solution to cut manual work and catch more leads."></head><body><div id="root"></div></body></html>',
}));
vi.mock("@/lib/server/marketPage", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/server/marketPage")>();
  return {
    ...original,
    fetchMarketPage: async () => {
      if (state.fail) throw new Error("Sanity unavailable");
      return { page: state.page, ogImage: state.ogImage, imageAlt: state.imageAlt };
    },
  };
});
import handler from "../../api/market-page";

const summary = "Automation and voice-agent support for service businesses in the United States, including inbound calls, booking, and follow-up for local teams.";
const page = {
  _id: "market-us",
  title: "United States",
  slug: "united-states",
  summary,
  body: [{ _type: "block", children: [{ _type: "span", text: "Body" }] }],
  seo: { seoTitle: "AI Automation in the United States", seoDescription: summary, canonicalUrl: null, noIndex: false, ogImage: null },
  testimonials: [],
};

afterEach(() => {
  state.page = null;
  state.ogImage = undefined;
  state.imageAlt = undefined;
  state.fail = false;
});

describe("dynamic market HTML", () => {
  it("replaces the homepage social card with the market page", async () => {
    state.page = page;
    const response = await handler.fetch(new Request("https://www.techvergesolution.com/api/market-page?slug=united-states"));
    expect(response.status).toBe(200);
    const doc = new JSDOM(await response.text()).window.document;
    expect(doc.title).toBe("AI Automation in the United States | TechVerge Solution");
    expect(doc.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe(doc.title);
    expect(doc.querySelector('meta[property="og:description"]')?.getAttribute("content")).toBe(summary);
    expect(doc.querySelector('meta[property="og:url"]')?.getAttribute("content")).toMatch(/\/markets\/united-states$/);
    expect(doc.querySelector("h1")?.textContent).toBe("United States");
    expect(doc.title).not.toContain("AI Automation & Voice Agents");
  });

  it("uses the page title when the SEO title is empty", async () => {
    state.page = { ...page, seo: { ...page.seo, seoTitle: null, seoDescription: null } };
    const doc = new JSDOM(await (await handler.fetch(new Request("https://www.techvergesolution.com/api/market-page?slug=united-states"))).text()).window.document;
    expect(doc.title).toBe("United States | TechVerge Solution");
    expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(summary);
    expect(doc.querySelector('meta[name="twitter:title"]')?.getAttribute("content")).toBe(doc.title);
  });

  it("returns 404 without the homepage card when the market is missing", async () => {
    const response = await handler.fetch(new Request("https://www.techvergesolution.com/api/market-page?slug=missing"));
    expect(response.status).toBe(404);
    const doc = new JSDOM(await response.text()).window.document;
    expect(doc.title).toBe("Page Not Found | TechVerge Solution");
    expect(doc.querySelector('meta[property="og:url"]')?.getAttribute("content")).toMatch(/\/markets\/missing$/);
    expect(doc.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex, follow");
  });

  it("returns 503 when Sanity is unavailable and supports HEAD", async () => {
    state.fail = true;
    expect((await handler.fetch(new Request("https://www.techvergesolution.com/api/market-page?slug=united-states"))).status).toBe(503);
    state.fail = false;
    state.page = page;
    const head = await handler.fetch(new Request("https://www.techvergesolution.com/api/market-page?slug=united-states", { method: "HEAD" }));
    expect(head.status).toBe(200);
    expect(await head.text()).toBe("");
  });
});
