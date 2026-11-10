import { describe, expect, it } from "vitest";
import { buildMetadata } from "@/lib/seo/metadata";
import { clampMetaDescription, clampMetaTitle, META_DESCRIPTION_MAX, META_TITLE_MAX } from "@/lib/seo/limits";
import { pageSeo } from "@/lib/seo";

describe("clampMetaTitle", () => {
  it("keeps titles within the limit including site suffix", () => {
    const long =
      "How to Automate Your Business with n8n and AI in 2026: Seven Workflows";
    const out = clampMetaTitle(long, "TechVerge Solutions");
    expect(out.length).toBeLessThanOrEqual(META_TITLE_MAX);
    expect(out.endsWith("| TechVerge Solutions")).toBe(true);
  });
});

describe("clampMetaDescription", () => {
  it("shortens long descriptions at a word boundary", () => {
    const long = "x".repeat(META_DESCRIPTION_MAX + 40);
    const out = clampMetaDescription(long);
    expect(out.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX);
  });
});

describe("buildMetadata", () => {
  it("returns canonical, Open Graph, and Twitter fields for static pages", () => {
    const home = pageSeo.home;
    const meta = buildMetadata({
      title: home.title,
      description: home.description,
      path: home.path,
    });
    expect(meta.title.length).toBeLessThanOrEqual(META_TITLE_MAX);
    expect(meta.description.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX);
    expect(meta.alternates.canonical).toMatch(/^https:\/\/www\.techvergesolution\.com\//);
    expect(meta.openGraph.images[0]).toContain("og-image");
    expect(meta.twitter.card).toBe("summary_large_image");
  });
});
