import { useQuery } from "@tanstack/react-query";
import { blogPosts as staticBlogPosts } from "@/data/blog";
import {
  getBlogPostList,
  resolveBlogPost,
  type SanityBlogPost,
} from "@/lib/blogApi";
import type { BlogPostMeta } from "@/data/blog";

export function useBlogPostList() {
  return useQuery({
    queryKey: ["blog", "list"],
    queryFn: getBlogPostList,
    placeholderData: staticBlogPosts,
    staleTime: 1000 * 60 * 5,
  });
}

export type ResolvedBlogPost =
  | { kind: "static"; meta: BlogPostMeta }
  | { kind: "sanity"; post: SanityBlogPost };

export function useBlogPostDetail(slug: string | undefined) {
  return useQuery({
    queryKey: ["blog", "post", slug],
    enabled: Boolean(slug),
    queryFn: async (): Promise<ResolvedBlogPost | null> => {
      if (!slug) return null;
      return resolveBlogPost(slug);
    },
    staleTime: 1000 * 60 * 5,
  });
}
