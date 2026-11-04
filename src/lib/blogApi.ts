import { siteName, defaultOgImage } from "./seo/config";
import type { PortableTextBlock } from "@portabletext/types";
import {
  blogPosts as staticBlogPosts,
  type BlogImage,
  type BlogPostMeta,
} from "@/data/blog";
import { isSanityConfigured, sanityClient, urlForImage } from "@/lib/sanity";
import { POST_BY_SLUG_QUERY, type CmsPostSummary, type CmsServiceSummary } from "@/lib/sanity/queries";

export type BlogFaq = { question: string; answer: string };

export type SanityBlogPost = BlogPostMeta & {
  source: "sanity";
  body: PortableTextBlock[];
  faqs: BlogFaq[];
  seoTitle?: string;
  seoDescription?: string;
  customOgImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  schemaImage?: string;
  categoryIds: string[];
  relatedPosts: CmsPostSummary[];
  relatedService: CmsServiceSummary | null;
};

const POST_LIST_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  description,
  publishedAt,
  _updatedAt,
  readingTimeMinutes,
  tags,
  mainImage {
    asset,
    alt,
    hotspot,
    crop
  },
  faqs[] {
    question,
    answer
  }
}`;

type SanityPostRow = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  publishedAt?: string;
  updatedAt?: string;
  _updatedAt?: string;
  readingTimeMinutes?: number;
  tags?: string[];
  mainImage?: {
    asset?: { _ref?: string };
    alt?: string;
  };
  body?: PortableTextBlock[];
  faqs?: BlogFaq[];
  categories?: ({ _id: string } | null)[] | null;
  relatedPosts?: (CmsPostSummary | null)[] | null;
  relatedService?: CmsServiceSummary | null;
  linkedFromServices?: CmsServiceSummary[] | null;
  author?: { name?: string } | null;
  seo?: {
    seoTitle?: string | null;
    seoDescription?: string | null;
    ogImage?: SanityPostRow["mainImage"] | null;
    canonicalUrl?: string | null;
    noIndex?: boolean | null;
  } | null;
};

const DEFAULT_FEATURED: BlogImage = {
  src: defaultOgImage,
  alt: siteName,
  width: 1200,
  height: 630,
};

function isoDateOnly(iso?: string): string {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return iso.slice(0, 10);
}

function estimateReadingMinutes(body?: PortableTextBlock[]): number {
  if (!body?.length) return 5;
  const text = body
    .flatMap((block) => {
      if (block._type !== "block" || !Array.isArray(block.children)) return [];
      return block.children
        .filter((child) => child._type === "span" && typeof child.text === "string")
        .map((child) => child.text as string);
    })
    .join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function mapFeaturedImage(mainImage?: SanityPostRow["mainImage"]): BlogImage {
  if (!mainImage?.asset) return DEFAULT_FEATURED;
  try {
    const src = urlForImage(mainImage).width(1400).quality(85).url();
    return {
      src,
      alt: mainImage.alt?.trim() || "Blog article image",
      width: 1400,
      height: 934,
    };
  } catch {
    return DEFAULT_FEATURED;
  }
}

function mapSanityRowToMeta(row: SanityPostRow): BlogPostMeta {
  const featuredImage = mapFeaturedImage(row.mainImage);
  const datePublished = isoDateOnly(row.publishedAt);
  const dateModified = isoDateOnly(row.updatedAt ?? row._updatedAt ?? row.publishedAt);
  const excerpt =
    row.excerpt?.trim() ||
    row.description?.trim() ||
    `Read the full article on the ${siteName} blog.`;

  return {
    slug: row.slug,
    title: row.title,
    description:
      row.description?.trim() ||
      excerpt.slice(0, 160) ||
      row.title,
    excerpt,
    datePublished,
    dateModified,
    readingTimeMinutes:
      row.readingTimeMinutes ?? estimateReadingMinutes(row.body),
    tags: row.tags?.filter(Boolean),
    featuredImage,
    ogImage: featuredImage.src.startsWith("http")
      ? featuredImage.src
      : undefined,
    ogImageAlt: featuredImage.alt,
  };
}

async function fetchSanityPostRows(): Promise<SanityPostRow[] | null> {
  if (!isSanityConfigured() || !sanityClient) return null;
  try {
    return await sanityClient.fetch<SanityPostRow[]>(POST_LIST_QUERY);
  } catch (error) {
    console.warn("[blog] Sanity post list fetch failed:", error);
    return null;
  }
}

/** Merge Sanity posts with static registry; Sanity wins on slug conflicts. */
export function mergeBlogPostMeta(
  sanityRows: SanityPostRow[] | null | undefined,
): BlogPostMeta[] {
  if (!sanityRows?.length) return [...staticBlogPosts];

  const sanityMeta = sanityRows.map(mapSanityRowToMeta);
  const sanitySlugs = new Set(sanityMeta.map((post) => post.slug));
  const staticOnly = staticBlogPosts.filter((post) => !sanitySlugs.has(post.slug));

  return [...sanityMeta, ...staticOnly].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );
}

export async function getBlogPostList(): Promise<BlogPostMeta[]> {
  const rows = await fetchSanityPostRows();
  return mergeBlogPostMeta(rows);
}

export async function getSanityPostBySlug(
  slug: string,
): Promise<SanityBlogPost | null> {
  if (!isSanityConfigured() || !sanityClient) return null;
  try {
    const row = await sanityClient.fetch<SanityPostRow | null>(
      POST_BY_SLUG_QUERY,
      { slug },
    );
    if (!row?.slug) return null;
    const meta = mapSanityRowToMeta(row);
    const ogImage = row.seo?.ogImage?.asset ? mapFeaturedImage(row.seo.ogImage) : meta.featuredImage;
    return {
      ...meta,
      source: "sanity",
      seoTitle: row.seo?.seoTitle?.trim() || row.title,
      seoDescription: row.seo?.seoDescription?.trim() || row.excerpt?.trim() || row.description?.trim() || meta.description,
      customOgImage: row.seo?.ogImage?.asset ? ogImage.src : undefined,
      ogImage: ogImage.src,
      ogImageAlt: ogImage.alt,
      canonicalUrl: row.seo?.canonicalUrl || undefined,
      noIndex: row.seo?.noIndex ?? false,
      publishedTime: row.publishedAt || undefined,
      modifiedTime: row.updatedAt || row.publishedAt || undefined,
      authors: row.author?.name ? [row.author.name] : undefined,
      schemaImage: row.mainImage?.asset ? meta.featuredImage.src : undefined,
      categoryIds: (row.categories ?? []).flatMap((category) => category?._id ? [category._id] : []),
      relatedPosts: (row.relatedPosts ?? []).filter((post): post is CmsPostSummary => Boolean(post)),
      relatedService: row.relatedService?.slug && row.relatedService.title
        ? row.relatedService
        : (row.linkedFromServices ?? []).find((service) => service?.slug && service.title) ?? null,
      body: row.body ?? [],
      faqs: (row.faqs ?? []).filter(
        (faq) => faq.question?.trim() && faq.answer?.trim(),
      ),
    };
  } catch (error) {
    console.warn(`[blog] Sanity post fetch failed for slug "${slug}":`, error);
    return null;
  }
}

export async function resolveBlogPost(slug: string): Promise<
  | { kind: "static"; meta: BlogPostMeta }
  | { kind: "sanity"; post: SanityBlogPost }
  | null
> {
  const sanityPost = await getSanityPostBySlug(slug);
  if (sanityPost) return { kind: "sanity", post: sanityPost };

  const staticMeta = staticBlogPosts.find((post) => post.slug === slug);
  if (staticMeta) return { kind: "static", meta: staticMeta };

  return null;
}
