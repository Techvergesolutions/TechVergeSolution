import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanity";
import { fetchSanityQuery, type CmsPostSummary } from "@/lib/sanity/queries";
import { distinctPosts } from "@/lib/relatedPosts";

export function RelatedPosts({ slug, categoryIds = [], manual = [] }: {
  slug: string;
  categoryIds?: string[];
  manual?: CmsPostSummary[];
}) {
  const { data } = useQuery({
    queryKey: ["relatedPosts", slug, categoryIds],
    enabled: Boolean(sanityClient),
    queryFn: () => fetchSanityQuery(sanityClient!, "relatedPostCandidates", { slug, categoryIds }),
    staleTime: 5 * 60 * 1000,
  });
  const posts = distinctPosts([manual, data?.category ?? [], data?.latest ?? []], { excludeSlug: slug, limit: 3 });
  if (posts.length < 2) return null;

  return <section className="mt-14" aria-labelledby="related-posts-heading">
    <h2 id="related-posts-heading" className="font-display text-2xl md:text-3xl font-bold mb-6">Related Posts</h2>
    <ul className="space-y-4">{posts.map((post) => <li key={post.slug}>
      <Link to={`/blog/${post.slug}`} className="text-primary hover:underline font-medium">{post.title}</Link>
      {post.excerpt && <p className="text-muted-foreground mt-1">{post.excerpt}</p>}
    </li>)}</ul>
  </section>;
}
