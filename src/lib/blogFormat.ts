/** Drop a field label that was pasted into the excerpt body. */
export function stripBlogExcerptLabel(value: string | null | undefined): string {
  return String(value ?? "").replace(/^\s*blog excerpt:\s*/i, "").trim();
}

export function formatBlogDate(isoDate: string) {
  const match = String(isoDate ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return isoDate;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return isoDate;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
