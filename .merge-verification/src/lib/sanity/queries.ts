import type { SanityClient } from "@sanity/client";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageObject } from "@sanity/image-url/lib/types/types";

// GROQ projections return null for missing fields on existing documents.
export type CmsImage = SanityImageObject & { alt?: string | null };
export type CmsSeo = {
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: CmsImage | null;
  canonicalUrl: string | null;
  noIndex: boolean | null;
};
export type CmsFaq = { _key: string; question: string | null; answer: string | null };
export type CmsAuthor = {
  _id: string;
  name: string | null;
  slug: string | null;
  bio: string | null;
  image: CmsImage | null;
};
export type CmsCategory = { _id: string; title: string | null; slug: string | null; description: string | null };
export type CmsPostSummary = {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  mainImage: CmsImage | null;
  publishedAt: string | null;
  updatedAt: string | null;
};
export type CmsServiceSummary = {
  _id: string;
  title: string | null;
  slug: string | null;
  shortDescription: string | null;
};
export type CmsPost = CmsPostSummary & {
  _updatedAt: string;
  description: string | null;
  readingTimeMinutes: number | null;
  tags: string[] | null;
  body: PortableTextBlock[] | null;
  seo: CmsSeo | null;
  faqs: CmsFaq[] | null;
  author: CmsAuthor | null;
  categories: (CmsCategory | null)[] | null;
  relatedService: CmsServiceSummary | null;
  linkedFromServices: CmsServiceSummary[] | null;
  relatedPosts: (CmsPostSummary | null)[] | null;
};
export type CmsService = CmsServiceSummary & {
  _updatedAt: string;
  heroHeading: string | null;
  processHeading: string | null;
  processDescription: string | null;
  body: PortableTextBlock[] | null;
  features: { _key: string; title: string | null; description: string | null }[] | null;
  faqs: CmsFaq[] | null;
  seo: CmsSeo | null;
  order: number | null;
  relatedPosts: (CmsPostSummary | null)[] | null;
  industries?: { _key: string; title: string | null; description: string | null; marketPage: { title: string | null; slug: string | null; noIndex: boolean | null; bodyCount: number | null } | null }[] | null;
};
export type ContactSettings = { email: string | null; whatsapp: string | null; bookingUrl: string | null; availableHours: { _key: string; hours: string | null; timezone: string | null }[] | null };
export type MarketPage = { _id: string; title: string | null; slug: string | null; summary: string | null; body: PortableTextBlock[] | null; seo: CmsSeo | null; testimonials: { _key: string; quote: string | null; name: string | null; role: string | null }[] | null };
export type MarketPageSummary = Pick<MarketPage, "_id" | "title" | "slug">;
export type CmsSlug = { slug: string; _updatedAt: string; noIndex: boolean | null };
export type AllSlugsResult = { posts: CmsSlug[]; services: CmsSlug[] };
export type BreadcrumbLabels = Record<"home" | "services" | "blog" | "portfolio" | "about" | "contact", string | null> & {
  staticPostLabels: { slug: string | null; title: string | null }[] | null;
};

export const BREADCRUMB_SETTINGS_QUERY = `*[_id == "breadcrumb-settings" && _type == "breadcrumbSettings"][0] {
  home, services, blog, portfolio, about, contact, staticPostLabels[]{slug, title}
}`;

export const ALL_SLUGS_QUERY = `{
  "posts": *[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt, "noIndex": seo.noIndex },
  "services": *[_type == "service" && defined(slug.current)]{ "slug": slug.current, _updatedAt, "noIndex": seo.noIndex }
}`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id, _updatedAt, title, "slug": slug.current, excerpt, description, mainImage,
  publishedAt, updatedAt, readingTimeMinutes, tags, body,
  seo { seoTitle, seoDescription, ogImage, canonicalUrl, noIndex },
  faqs[] { _key, question, answer },
  author-> { _id, name, "slug": slug.current, bio, image },
  categories[]-> { _id, title, "slug": slug.current, description },
  relatedService-> { _id, title, "slug": slug.current, shortDescription },
  "linkedFromServices": *[_type == "service" && ^._id in relatedPosts[]._ref && defined(slug.current)] | order(order asc) { _id, title, "slug": slug.current, shortDescription },
  relatedPosts[]-> { _id, title, "slug": slug.current, excerpt, mainImage, publishedAt, updatedAt }
}`;

export const SERVICE_BY_SLUG_QUERY = `*[_type == "service" && slug.current == $slug][0] {
  _id, _updatedAt, title, "slug": slug.current, shortDescription, heroHeading, body, processHeading, processDescription,
  features[] { _key, title, description }, faqs[] { _key, question, answer },
  industries[] { _key, title, description, marketPage-> { title, "slug": slug.current, "noIndex": seo.noIndex, "bodyCount": count(body) } },
  seo { seoTitle, seoDescription, ogImage, canonicalUrl, noIndex }, order,
  relatedPosts[]-> { _id, title, "slug": slug.current, excerpt, mainImage, publishedAt, updatedAt }
}`;

export const LATEST_POSTS_QUERY = `*[_type == "post" && defined(slug.current) && slug.current != "" && defined(title) && title != ""] | order(publishedAt desc)[0...5] {
  _id, title, "slug": slug.current, excerpt, mainImage, publishedAt, updatedAt
}`;

export const RELATED_POSTS_CANDIDATES_QUERY = `{
  "category": *[_type == "post" && defined(slug.current) && defined(title) && slug.current != $slug && count(categories[@._ref in $categoryIds]) > 0] | order(publishedAt desc)[0...12] { _id, title, "slug": slug.current, excerpt, mainImage, publishedAt, updatedAt },
  "latest": *[_type == "post" && defined(slug.current) && defined(title) && slug.current != $slug] | order(publishedAt desc)[0...12] { _id, title, "slug": slug.current, excerpt, mainImage, publishedAt, updatedAt }
}`;

export const POSTS_FOR_SERVICE_QUERY = `*[_type == "post" && relatedService._ref == $serviceId && defined(slug.current) && defined(title)] | order(publishedAt desc) {
  _id, title, "slug": slug.current, excerpt, mainImage, publishedAt, updatedAt
}`;

export const ALL_SERVICES_QUERY = `*[_type == "service" && defined(slug.current)] | order(order asc, title asc) {
  _id, _updatedAt, title, "slug": slug.current, shortDescription, heroHeading, body, processHeading, processDescription,
  features[] { _key, title, description }, faqs[] { _key, question, answer },
  seo { seoTitle, seoDescription, ogImage, canonicalUrl, noIndex }, order,
  relatedPosts[]-> { _id, title, "slug": slug.current, excerpt, mainImage, publishedAt, updatedAt }
}`;

export const CONTACT_SETTINGS_QUERY = `*[_type == "contactSettings"] | order(_updatedAt desc)[0] { email, whatsapp, bookingUrl, availableHours[] { _key, hours, timezone } }`;
export const MARKET_PAGE_QUERY = `*[_type == "marketPage" && slug.current == $slug][0] { _id, title, "slug": slug.current, summary, body, seo { seoTitle, seoDescription, ogImage, canonicalUrl, noIndex }, testimonials[] { _key, quote, name, role } }`;
export const MARKET_PAGES_QUERY = `*[_type == "marketPage" && defined(slug.current) && slug.current != "" && defined(title) && title != "" && count(body) > 0 && seo.noIndex != true] | order(title asc) { _id, title, "slug": slug.current }`;

/** Typed query definitions for use with fetchSanityQuery. */
export interface SanityQueries {
  breadcrumbSettings: { result: BreadcrumbLabels | null; params: undefined };
  allSlugs: { result: AllSlugsResult; params: undefined };
  postBySlug: { result: CmsPost | null; params: { slug: string } };
  serviceBySlug: { result: CmsService | null; params: { slug: string } };
  latestPosts: { result: CmsPostSummary[]; params: undefined };
  relatedPostCandidates: { result: { category: CmsPostSummary[]; latest: CmsPostSummary[] }; params: { slug: string; categoryIds: string[] } };
  postsForService: { result: CmsPostSummary[]; params: { serviceId: string } };
  allServices: { result: CmsService[]; params: undefined };
  contactSettings: { result: ContactSettings | null; params: undefined };
  marketPage: { result: MarketPage | null; params: { slug: string } };
  marketPages: { result: MarketPageSummary[]; params: undefined };
}

const queries: Record<keyof SanityQueries, string> = {
  breadcrumbSettings: BREADCRUMB_SETTINGS_QUERY,
  allSlugs: ALL_SLUGS_QUERY,
  postBySlug: POST_BY_SLUG_QUERY,
  serviceBySlug: SERVICE_BY_SLUG_QUERY,
  latestPosts: LATEST_POSTS_QUERY,
  relatedPostCandidates: RELATED_POSTS_CANDIDATES_QUERY,
  postsForService: POSTS_FOR_SERVICE_QUERY,
  allServices: ALL_SERVICES_QUERY,
  contactSettings: CONTACT_SETTINGS_QUERY,
  marketPage: MARKET_PAGE_QUERY,
  marketPages: MARKET_PAGES_QUERY,
};

export function fetchSanityQuery<K extends keyof SanityQueries>(
  client: SanityClient,
  key: K,
  ...args: SanityQueries[K]["params"] extends undefined ? [] : [params: SanityQueries[K]["params"]]
): Promise<SanityQueries[K]["result"]> {
  return client.fetch<SanityQueries[K]["result"]>(queries[key], args[0]);
}
