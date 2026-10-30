/**
 * Blog API — Markdown under /content/blog is the source of truth for body/meta.
 * Sanity FAQs are fetched at runtime (and overlaid at build) so Studio edits show
 * without waiting for a markdown rewrite.
 */
import {
  blogPosts as markdownBlogPosts,
  getCompiledBlogPostBySlug,
  type BlogPostMeta,
} from "@/data/blog";
import { isSanityConfigured, sanityClient } from "@/lib/sanity";

export type BlogFaq = { question: string; answer: string };

export type SanityBlogPost = BlogPostMeta & {
  source: "sanity";
  body: unknown[];
  faqs: BlogFaq[];
};

/** @deprecated Prefer getCompiledBlogPosts — kept for tests/helpers. */
export const PUBLISHED_POST_FILTER = '_type == "post" && defined(slug.current)';

export function normalizeFaqs(faqs: unknown, limit = 12): BlogFaq[] {
  if (!Array.isArray(faqs)) return [];
  return faqs
    .filter(
      (item): item is BlogFaq =>
        Boolean(
          item &&
            typeof item === "object" &&
            typeof (item as BlogFaq).question === "string" &&
            typeof (item as BlogFaq).answer === "string" &&
            (item as BlogFaq).question.trim() &&
            (item as BlogFaq).answer.trim(),
        ),
    )
    .map((item) => ({
      question: item.question.trim(),
      answer: item.answer.trim(),
    }))
    .slice(0, limit);
}

/** Live CDN fetch — published Sanity FAQs for a slug (empty if none / offline). */
export async function fetchSanityFaqs(slug: string): Promise<BlogFaq[]> {
  if (!slug || !isSanityConfigured() || !sanityClient) return [];
  try {
    const row = await sanityClient.fetch<{ faqs?: unknown } | null>(
      `*[_type == "post" && slug.current == $slug][0]{
        faqs[]{ question, answer }
      }`,
      { slug },
    );
    return normalizeFaqs(row?.faqs);
  } catch {
    return [];
  }
}

/**
 * Prefer Sanity FAQs when present; otherwise keep compiled markdown FAQs.
 * Ensures Studio-published FAQs appear even when the MD file was never re-synced.
 */
export function resolveFaqs(
  sanityFaqs: BlogFaq[] | undefined,
  markdownFaqs: BlogFaq[] | undefined,
): BlogFaq[] {
  if (sanityFaqs && sanityFaqs.length > 0) return sanityFaqs.slice(0, 12);
  return (markdownFaqs ?? []).slice(0, 12);
}

/** Merge helper used in unit tests — Markdown registry is authoritative. */
export function mergeBlogPostMeta(
  _sanityRows?: unknown[] | null,
): BlogPostMeta[] {
  return [...markdownBlogPosts].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );
}

export async function getBlogPostList(): Promise<BlogPostMeta[]> {
  return mergeBlogPostMeta();
}

export async function resolveBlogPost(slug: string): Promise<
  | { kind: "static"; meta: BlogPostMeta & { bodyHtml?: string } }
  | { kind: "sanity"; post: SanityBlogPost }
  | null
> {
  const compiled = getCompiledBlogPostBySlug(slug);
  if (compiled) {
    const sanityFaqs = await fetchSanityFaqs(slug);
    return {
      kind: "static",
      meta: {
        ...compiled,
        faq: resolveFaqs(sanityFaqs, compiled.faq),
      },
    };
  }
  return null;
}
