const BLOG_WIDTHS = [640, 960, 1400] as const;
const PORTRAIT_WIDTHS = [160, 320, 640] as const;

function baseWebpPath(src: string): string | null {
  if (!src.startsWith("/") || !/\.webp$/i.test(src) || /-\d+w\.webp$/i.test(src)) {
    return null;
  }
  return src.replace(/\.webp$/i, "");
}

export function isResponsiveBlogImage(src: string): boolean {
  return /^\/images\/blog\/[\w-]+\.webp$/i.test(src) && !/-\d+w\.webp$/i.test(src);
}

export function isResponsivePublicPortrait(src: string): boolean {
  return /^\/[\w-]+\.webp$/i.test(src) && !src.includes("/images/") && !/-\d+w\.webp$/i.test(src);
}

export function buildVariantSrcSet(
  src: string,
  ext: "webp" | "avif",
  widths: readonly number[],
): string | undefined {
  const base = baseWebpPath(src);
  if (!base) return undefined;
  if (isResponsiveBlogImage(src) || isResponsivePublicPortrait(src)) {
    return widths.map((w) => `${base}-${w}w.${ext} ${w}w`).join(", ");
  }
  return undefined;
}

export function blogVariantSrcSet(src: string, ext: "webp" | "avif"): string | undefined {
  if (!isResponsiveBlogImage(src)) return undefined;
  return buildVariantSrcSet(src, ext, BLOG_WIDTHS);
}

export function portraitVariantSrcSet(src: string, ext: "webp" | "avif"): string | undefined {
  if (!isResponsivePublicPortrait(src)) return undefined;
  return buildVariantSrcSet(src, ext, PORTRAIT_WIDTHS);
}
