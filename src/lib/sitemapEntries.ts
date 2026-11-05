import type { CmsService } from "@/lib/sanity/queries";
import { serviceSlugs } from "@/data/services";
import { blogPosts } from "@/data/blog";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

export type SitemapChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
export interface SitemapEntry { path: string; loc: string; lastmod: string; changefreq: SitemapChangeFreq; priority: number }
export const SITEMAP_LASTMOD = "2026-10-12";

export function getSitemapEntries(lastmod = SITEMAP_LASTMOD, cmsServices: CmsService[] = []): SitemapEntry[] {
  const serviceEntries = cmsServices.length ? cmsServices.filter((service) => service.slug && !service.seo?.noIndex).map((service) => ({ path: `/services/${service.slug}`, lastmod: service._updatedAt?.slice(0, 10) || lastmod, changefreq: "monthly" as const, priority: 0.8 })) : serviceSlugs.map((slug) => ({ path: `/services/${slug}`, lastmod, changefreq: "monthly" as const, priority: 0.8 }));
  const newestPost = blogPosts.map((post) => post.dateModified || post.datePublished).sort().at(-1) || lastmod;
  const entries: Omit<SitemapEntry, "loc">[] = [
    { path: "/", lastmod, changefreq: "weekly", priority: 1 },
    { path: "/about", lastmod, changefreq: "monthly", priority: 0.8 },
    { path: "/ai-facts", lastmod, changefreq: "monthly", priority: 0.6 },
    { path: "/services", lastmod, changefreq: "weekly", priority: 0.8 }, ...serviceEntries,
    { path: "/portfolio", lastmod, changefreq: "monthly", priority: 0.8 },
    { path: "/blog", lastmod: newestPost, changefreq: "weekly", priority: 0.8 },
    ...blogPosts.map((post) => ({ path: `/blog/${post.slug}`, lastmod: post.dateModified || post.datePublished, changefreq: "monthly" as const, priority: 0.7 })),
    { path: "/contact", lastmod, changefreq: "monthly", priority: 0.8 },
    { path: "/privacy-policy", lastmod, changefreq: "yearly", priority: 0.3 },
    { path: "/terms-of-service", lastmod, changefreq: "yearly", priority: 0.3 },
  ];
  return entries.map((entry) => ({ ...entry, loc: absoluteUrl(entry.path) }));
}
export const SITEMAP_XML_URL = `${SITE_URL}/sitemap.xml`;
