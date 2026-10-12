import { serviceSlugs } from "@/data/services";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

export type SitemapChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapEntry {
  path: string;
  loc: string;
  lastmod: string;
  changefreq: SitemapChangeFreq;
  priority: number;
}

/** Keep in sync with `public/sitemap.xml` (Vite serves the static XML). */
export const SITEMAP_LASTMOD = "2026-10-12";

const staticEntries: Omit<SitemapEntry, "loc" | "lastmod">[] = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/about", changefreq: "monthly", priority: 0.8 },
  { path: "/services", changefreq: "weekly", priority: 0.8 },
  { path: "/portfolio", changefreq: "monthly", priority: 0.8 },
  { path: "/contact", changefreq: "monthly", priority: 0.8 },
  { path: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
  { path: "/terms-of-service", changefreq: "yearly", priority: 0.3 },
];

export function getSitemapEntries(lastmod = SITEMAP_LASTMOD): SitemapEntry[] {
  const staticRoutes: SitemapEntry[] = staticEntries.map((entry) => ({
    ...entry,
    loc: absoluteUrl(entry.path),
    lastmod,
  }));

  const serviceRoutes: SitemapEntry[] = serviceSlugs.map((slug) => ({
    path: `/services/${slug}`,
    loc: absoluteUrl(`/services/${slug}`),
    lastmod,
    changefreq: "monthly" as const,
    priority: 0.8,
  }));

  // Preserve public/sitemap.xml order: home → about → services → service slugs → rest
  const [home, about, services, ...rest] = staticRoutes;
  return [home, about, services, ...serviceRoutes, ...rest];
}

export const SITEMAP_XML_URL = `${SITE_URL}/sitemap.xml`;
