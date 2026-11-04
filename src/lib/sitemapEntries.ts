import type { CmsService } from "@/lib/sanity/queries";
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

/** Static routes use this date; service dates come from Sanity. */
export const SITEMAP_LASTMOD = "2026-10-12";

const staticEntries: Omit<SitemapEntry, "loc" | "lastmod">[] = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/about", changefreq: "monthly", priority: 0.8 },
  { path: "/services", changefreq: "weekly", priority: 0.8 },
  { path: "/portfolio", changefreq: "monthly", priority: 0.8 },
  { path: "/blog", changefreq: "weekly", priority: 0.7 },
  {
    path: "/blog/ai-voice-agents-for-small-business-2026",
    changefreq: "monthly",
    priority: 0.7,
  },
  { path: "/contact", changefreq: "monthly", priority: 0.8 },
  { path: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
  { path: "/terms-of-service", changefreq: "yearly", priority: 0.3 },
];

export function getSitemapEntries(lastmod = SITEMAP_LASTMOD, cmsServices: CmsService[] = []): SitemapEntry[] {
  const staticRoutes: SitemapEntry[] = staticEntries.map((entry) => ({
    ...entry,
    loc: absoluteUrl(entry.path),
    lastmod,
  }));

  const serviceRoutes: SitemapEntry[] = cmsServices.filter((service) => service.slug && !service.seo?.noIndex).map((service) => ({
    path: `/services/${service.slug}`,
    loc: absoluteUrl(`/services/${service.slug}`),
    lastmod: service._updatedAt?.slice(0, 10) || lastmod,
    changefreq: "monthly" as const,
    priority: 0.8,
  }));

  // Preserve the site navigation order, with services after the services index.
  const [home, about, services, portfolio, ...rest] = staticRoutes;
  return [home, about, services, ...serviceRoutes, portfolio, ...rest];
}

export const SITEMAP_XML_URL = `${SITE_URL}/sitemap.xml`;
