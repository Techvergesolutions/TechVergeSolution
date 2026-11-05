import { describe, expect, it } from "vitest";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl, defaultDescription } from "@/lib/seo/config";

describe("buildMetadata", () => {
  it("creates absolute metadata, applies the title template once and honors noindex", () => {
    const metadata = buildMetadata({
      title: "Example | TechVerge Solutions",
      description: "Example description",
      path: "/blog/example",
      canonicalUrl: "https://example.org/original",
      image: "https://cdn.example.org/image.webp",
      noIndex: true,
      type: "article",
      publishedTime: "2026-01-01",
      modifiedTime: "2026-01-02",
      authors: ["Example Author"],
    });
    expect(metadata.title).toBe("Example | TechVerge Solutions");
    expect(metadata.alternates.canonical).toBe("https://example.org/original");
    expect(metadata.openGraph).toMatchObject({
      url: absoluteUrl("/blog/example"),
      images: ["https://cdn.example.org/image.webp"],
      type: "article",
      publishedTime: "2026-01-01",
      modifiedTime: "2026-01-02",
      authors: ["Example Author"],
    });
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("uses defaults when optional fields are empty", () => {
    const metadata = buildMetadata({ title: "About", description: " ", path: "/about" });
    expect(metadata.title).toBe("About | TechVerge Solutions");
    expect(metadata.description).toBe(defaultDescription);
    expect(metadata.openGraph.images).toEqual([absoluteUrl("/og-image.webp")]);
    expect(metadata.robots.index).toBe(true);
  });
});
