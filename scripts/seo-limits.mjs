/** Mirrors src/lib/seo/limits.ts for build scripts (keep in sync). */
export const META_TITLE_MAX = 60;
export const META_DESCRIPTION_MIN = 120;
export const META_DESCRIPTION_MAX = 160;

const ELLIPSIS = "…";

function truncateAtWord(text, max) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - ELLIPSIS.length);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > Math.floor(max * 0.55) ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}${ELLIPSIS}`;
}

export function clampMetaTitle(title, siteName, max = META_TITLE_MAX) {
  const raw = String(title).trim();
  if (!raw) return siteName.slice(0, max);

  const suffix = ` | ${siteName}`;
  const hasSuffix = raw.endsWith(suffix);
  const pagePart = hasSuffix ? raw.slice(0, -suffix.length) : raw;

  if (hasSuffix) {
    const maxPage = Math.max(1, max - suffix.length);
    return `${truncateAtWord(pagePart, maxPage)}${suffix}`;
  }

  const withSuffix = `${pagePart}${suffix}`;
  if (withSuffix.length <= max) return withSuffix;

  const maxPage = Math.max(1, max - suffix.length);
  return `${truncateAtWord(pagePart, maxPage)}${suffix}`;
}

export function clampMetaDescription(
  description,
  max = META_DESCRIPTION_MAX,
  min = META_DESCRIPTION_MIN,
) {
  let text = String(description ?? "").trim();
  if (!text) return "";
  if (text.length > max) return truncateAtWord(text, max);
  if (text.length >= min) return text;
  const pads = [
    " Built for small and service businesses.",
    " Serving teams in the United States, United Kingdom, and UAE.",
    " Talk with TechVerge Solutions to scope a practical next step.",
  ];
  for (const pad of pads) {
    if (text.length >= min) break;
    text += pad;
  }
  return text.length > max ? truncateAtWord(text, max) : text;
}
