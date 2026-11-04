import type { CmsPostSummary } from "@/lib/sanity/queries";

export type LinkedPost = CmsPostSummary & { slug: string; title: string };

/** Preserve editorial order while avoiding duplicate URLs and incomplete targets. */
export function distinctPosts(groups: ReadonlyArray<ReadonlyArray<CmsPostSummary | null | undefined>>, options: { excludeSlug?: string; limit?: number } = {}): LinkedPost[] {
  const seen = new Set<string>();
  if (options.excludeSlug) seen.add(options.excludeSlug);
  const result: LinkedPost[] = [];
  for (const group of groups) {
    for (const post of group) {
      const slug = post?.slug?.trim();
      const title = post?.title?.trim();
      if (!post || !slug || !title || seen.has(slug)) continue;
      seen.add(slug);
      result.push({ ...post, slug, title });
      if (options.limit && result.length >= options.limit) return result;
    }
  }
  return result;
}
