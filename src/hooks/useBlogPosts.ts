import { useQuery } from "@tanstack/react-query";
import {
  getCompiledBlogPostBySlug,
  getCompiledBlogPosts,
  type BlogFaq,
  type BlogPostMeta,
} from "@/data/blog";
import {
  fetchSanityFaqs,
  resolveFaqs,
  getBlogPostList,
  resolveBlogPost,
  type SanityBlogPost,
} from "@/lib/blogApi";
import { isSanityConfigured } from "@/lib/sanity";

export function useBlogPostList() {
  return useQuery({
    queryKey: ["blog", "list"],
    queryFn: getBlogPostList,
    placeholderData: getCompiledBlogPosts(),
    staleTime: 5 * 60 * 1000,
  });
}

export type ResolvedBlogPost = {
  kind: "static";
  meta: BlogPostMeta & { bodyHtml?: string };
} | { kind: "sanity"; post: SanityBlogPost };

function compiledBlogPlaceholder(slug: string | undefined): ResolvedBlogPost | undefined {
  if (!slug) return undefined;
  const meta = getCompiledBlogPostBySlug(slug);
  return meta ? { kind: "static", meta } : undefined;
}

export function useBlogPostDetail(slug: string | undefined) {
  return useQuery({
    queryKey: ["blog", "post", slug],
    enabled: Boolean(slug),
    queryFn: async (): Promise<ResolvedBlogPost | null> =>
      slug ? resolveBlogPost(slug) : null,
    initialData: () => compiledBlogPlaceholder(slug),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * FAQs for a blog post: markdown fallback immediately, then Sanity overlay when configured.
 */
export function useBlogFaqs(
  slug: string | undefined,
  markdownFaqs: BlogFaq[] | undefined,
) {
  const fallback = (markdownFaqs ?? []).slice(0, 12);

  const query = useQuery({
    queryKey: ["blog", "faqs", slug],
    enabled: Boolean(slug) && isSanityConfigured(),
    queryFn: () => fetchSanityFaqs(slug!),
    staleTime: 60_000,
  });

  const faqs = resolveFaqs(query.data, fallback);

  return {
    faqs,
    isLoading: query.isLoading && fallback.length === 0,
    source: query.data && query.data.length > 0 ? ("sanity" as const) : ("markdown" as const),
  };
}
