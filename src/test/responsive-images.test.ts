import { describe, expect, it } from "vitest";
import {
  blogVariantSrcSet,
  isResponsiveBlogImage,
  portraitVariantSrcSet,
} from "@/lib/images/responsiveVariants";

describe("responsive image variants", () => {
  it("builds WebP/AVIF srcsets for blog heroes", () => {
    const src = "/images/blog/ai-voice-agents-hero.webp";
    expect(isResponsiveBlogImage(src)).toBe(true);
    expect(blogVariantSrcSet(src, "webp")).toContain("640w");
    expect(blogVariantSrcSet(src, "avif")).toContain("1400w.avif");
  });

  it("ignores non-blog local paths", () => {
    expect(blogVariantSrcSet("/images/local.webp", "webp")).toBeUndefined();
  });

  it("builds portrait srcsets for public team images", () => {
    const src = "/Umer.webp";
    expect(portraitVariantSrcSet(src, "webp")).toContain("160w");
    expect(portraitVariantSrcSet(src, "avif")).toContain("640w.avif");
  });
});
