export const META_TITLE_MAX = 60;
export const META_DESCRIPTION_MAX = 160;

const ELLIPSIS = "…";

/** Truncate at a word boundary when possible. */
function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - ELLIPSIS.length);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > Math.floor(max * 0.55) ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}${ELLIPSIS}`;
}

/**
 * Ensure `[Page] | SiteName` and keep the full string within META_TITLE_MAX.
 * If the input already includes ` | SiteName`, only the page segment is shortened.
 */
export function clampMetaTitle(title: string, siteName: string, max = META_TITLE_MAX): string {
  const raw = title.trim();
  if (!raw) return siteName.slice(0, max);

  const suffix = ` | ${siteName}`;
  const hasSuffix = raw.endsWith(suffix);
  const pagePart = hasSuffix ? raw.slice(0, -suffix.length) : raw;

  if (hasSuffix) {
    const maxPage = Math.max(1, max - suffix.length);
    const page = truncateAtWord(pagePart, maxPage);
    return `${page}${suffix}`;
  }

  const withSuffix = `${pagePart}${suffix}`;
  if (withSuffix.length <= max) return withSuffix;

  const maxPage = Math.max(1, max - suffix.length);
  return `${truncateAtWord(pagePart, maxPage)}${suffix}`;
}

export function clampMetaDescription(
  description: string | null | undefined,
  max = META_DESCRIPTION_MAX,
): string {
  const text = description?.trim() ?? "";
  if (!text) return "";
  return truncateAtWord(text, max);
}
