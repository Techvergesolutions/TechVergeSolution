import { serviceSlugs } from "@/data/services";
import { blogPosts } from "@/data/blog";
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

/**
 * Client/helper mirror of `scripts/generate-sitemap.mjs`.
 * Build-time sitemap is authoritative (includes Sanity posts + real lastmod).
 */
export function getSitemapEntries(
  lastmodFallback = new Date().toISOString().slice(0, 10),
): SitemapEntry[] {
  const staticEntries: Omit<SitemapEntry, "loc">[] = [
    { path: "/", lastmod: "2026-10-12", changefreq: "weekly", priority: 1.0 },
    { path: "/about", lastmod: "2026-10-12", changefreq: "monthly", priority: 0.8 },
    { path: "/services", lastmod: "2026-10-12", changefreq: "weekly", priority: 0.8 },
    ...serviceSlugs.map((slug) => ({
      path: `/services/${slug}`,
      lastmod: "2026-10-12" as const,
      changefreq: "monthly" as const,
      priority: 0.8,
    })),
    { path: "/portfolio", lastmod: "2026-10-12", changefreq: "monthly", priority: 0.8 },
    {
      path: "/blog",
      lastmod:
        blogPosts.map((p) => p.dateModified).sort().at(-1) || lastmodFallback,
      changefreq: "weekly",
      priority: 0.7,
    },
    ...blogPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      lastmod: post.dateModified || post.datePublished,
      changefreq: "monthly" as const,
      priority: 0.7,
    })),
    { path: "/contact", lastmod: "2026-10-12", changefreq: "monthly", priority: 0.8 },
    {
      path: "/privacy-policy",
      lastmod: "2026-10-12",
      changefreq: "yearly",
      priority: 0.3,
    },
    {
      path: "/terms-of-service",
      lastmod: "2026-10-12",
      changefreq: "yearly",
      priority: 0.3,
    },
  ];

  return staticEntries.map((entry) => ({
    ...entry,
    loc: absoluteUrl(entry.path),
  }));
}

export const SITEMAP_XML_URL = `${SITE_URL}/sitemap.xml`;
