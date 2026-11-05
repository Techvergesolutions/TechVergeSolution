/**
 * Blog registry — compiled from `/content/blog/*.md` via `scripts/compile-blog.mjs`.
 * Keep URLs as `/blog` and `/blog/:slug`.
 */

import compiledPosts from "@/generated/blog-posts.json";

export interface BlogImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogTocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface BlogCta {
  label: string;
  path: string;
  description?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  /** 2–3 sentence plain-language answer shown under the H1. */
  quickAnswer?: string;
  datePublished: string;
  dateModified: string;
  readingTimeMinutes: number;
  author?: string;
  category?: string;
  tags?: string[];
  featuredImage: BlogImage;
  /** Absolute or site-relative path used for Open Graph when suitable. */
  ogImage?: string;
  ogImageAlt?: string;
  faq?: BlogFaq[];
  toc?: BlogTocItem[];
  relatedSlugs?: string[];
  cta?: BlogCta;
  /** Pre-rendered HTML from Markdown (available for file-based posts). */
  bodyHtml?: string;
  source?: string;
}

type CompiledPost = BlogPostMeta & { bodyHtml: string };

const posts = compiledPosts as CompiledPost[];

export const blogPosts: BlogPostMeta[] = posts.map(
  ({ bodyHtml: _bodyHtml, ...meta }) => meta,
);

export const BLOG_PAGE_SIZE = 6;

export function getCompiledBlogPosts(): CompiledPost[] {
  return posts;
}

export function getCompiledBlogPostBySlug(
  slug: string,
): CompiledPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getBlogPostBySlug(slug: string): BlogPostMeta | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function blogPostPath(slug: string): string {
  return `/blog/${slug}`;
}

export function getBlogCategories(): string[] {
  const set = new Set<string>();
  for (const post of posts) {
    if (post.category?.trim()) set.add(post.category.trim());
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getRelatedPosts(
  slug: string,
  relatedSlugs?: string[],
  limit = 3,
): BlogPostMeta[] {
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  const picked: BlogPostMeta[] = [];

  for (const related of relatedSlugs ?? []) {
    const post = bySlug.get(related);
    if (post && post.slug !== slug) picked.push(post);
    if (picked.length >= limit) return picked;
  }

  const current = bySlug.get(slug);
  for (const post of posts) {
    if (post.slug === slug) continue;
    if (picked.some((p) => p.slug === post.slug)) continue;
    if (
      current?.category &&
      post.category &&
      post.category === current.category
    ) {
      picked.push(post);
    }
    if (picked.length >= limit) return picked;
  }

  for (const post of posts) {
    if (post.slug === slug) continue;
    if (picked.some((p) => p.slug === post.slug)) continue;
    picked.push(post);
    if (picked.length >= limit) break;
  }

  return picked;
}

export const blogSlugs = blogPosts.map((post) => post.slug);

/** All Markdown-compiled posts have HTML bodies. */
export const staticArticleBodySlugs = new Set<string>(blogSlugs);
