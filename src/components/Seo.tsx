import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { sanityClient, urlForImage } from "@/lib/sanity";
import type { CmsSeo } from "@/lib/sanity/queries";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_NAME } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export interface SeoProps {
  title: string; description: string; path?: string; image?: string; imageAlt?: string;
  type?: "website" | "article"; noindex?: boolean; canonicalUrl?: string;
  publishedTime?: string; modifiedTime?: string; authors?: string[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[] | null;
  includeSiteGraph?: boolean; datePublished?: string; dateModified?: string; preloadImage?: string;
}

export function Seo({ title, description, path = "/", image = DEFAULT_OG_IMAGE, imageAlt = DEFAULT_OG_IMAGE_ALT, type = "website", noindex = false, canonicalUrl, publishedTime, modifiedTime, authors, jsonLd, datePublished, dateModified, preloadImage }: SeoProps) {
  const pageTypes: Record<string, string> = { "/": "home", "/about": "about", "/contact": "contact", "/portfolio": "portfolio", "/blog": "blog" };
  const pageKey = type === "website" ? pageTypes[path] : undefined;
  const { data: page } = useQuery({
    queryKey: ["pageSeo", path], enabled: Boolean(sanityClient && pageKey), staleTime: 5 * 60 * 1000,
    queryFn: () => sanityClient!.fetch<{ title: string | null; description: string | null; excerpt: string | null; seo: CmsSeo | null } | null>(
      `*[_type == $key || (_type == "page" && (slug.current == $key || path == $path))] | order(_updatedAt desc)[0] { title, description, excerpt, seo { seoTitle, seoDescription, ogImage, canonicalUrl, noIndex } }`, { key: pageKey, path }),
  });
  if (page) {
    title = page.seo?.seoTitle?.trim() || page.title?.trim() || title;
    description = page.seo?.seoDescription?.trim() || page.description?.trim() || page.excerpt?.trim() || description;
    canonicalUrl = page.seo?.canonicalUrl || canonicalUrl;
    noindex = page.seo?.noIndex ?? noindex;
    if (page.seo?.ogImage?.asset) { try { image = urlForImage(page.seo.ogImage).width(1200).url(); } catch { /* Use the fallback. */ } }
  }
  publishedTime ||= datePublished;
  modifiedTime ||= dateModified;
  const metadata = buildMetadata({ title, description, path, image, noIndex: noindex, canonicalUrl, type, publishedTime, modifiedTime, authors });
  const graphs = jsonLd ? Array.isArray(jsonLd) ? jsonLd : [jsonLd] : [];
  return <Helmet>
    <html lang="en" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{metadata.title}</title><meta name="description" content={metadata.description} /><link rel="canonical" href={metadata.alternates.canonical} />
    <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />
    <meta property="og:title" content={metadata.title} /><meta property="og:description" content={metadata.description} />
    <meta property="og:type" content={type} /><meta property="og:url" content={metadata.openGraph.url} />
    <meta property="og:site_name" content={SITE_NAME} /><meta property="og:image" content={metadata.openGraph.images[0]} />
    <meta property="og:image:alt" content={imageAlt} /><meta property="og:locale" content="en_US" />
    {type === "article" && publishedTime && <meta property="article:published_time" content={publishedTime} />}
    {type === "article" && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
    {type === "article" && authors?.map((author) => <meta key={author} property="article:author" content={author} />)}
    <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} /><meta name="twitter:image" content={metadata.openGraph.images[0]} />
    <meta name="twitter:image:alt" content={imageAlt} />
    {preloadImage && <link rel="preload" as="image" href={preloadImage} />}
    {graphs.map((data, index) => <script key={index} type="application/ld+json">{JSON.stringify(data).replace(/</g, "\\u003c")}</script>)}
  </Helmet>;
}
