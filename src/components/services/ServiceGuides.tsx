import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanity";
import { fetchSanityQuery, type CmsPostSummary } from "@/lib/sanity/queries";
import { stripBlogExcerptLabel } from "@/lib/blogFormat";
import { distinctPosts } from "@/lib/relatedPosts";

export function ServiceGuides({ serviceId, manual = [] }: { serviceId: string; manual?: (CmsPostSummary | null)[] }) {
  const { data } = useQuery({
    queryKey: ["serviceGuides", serviceId],
    enabled: Boolean(sanityClient && serviceId),
    queryFn: () => fetchSanityQuery(sanityClient!, "postsForService", { serviceId }),
    staleTime: 5 * 60 * 1000,
  });
  const posts = distinctPosts([manual, data ?? []]);
  if (!posts.length) return null;

  return <section className="mt-14" aria-labelledby="service-guides-heading">
    <h2 id="service-guides-heading" className="font-display text-3xl font-bold mb-6">Guides</h2>
    <ul className="space-y-4">{posts.map((post) => {
      const excerpt = stripBlogExcerptLabel(post.excerpt);
      return <li key={post.slug}>
        <Link className="text-primary hover:underline font-medium" to={`/blog/${post.slug}`}>{post.title}</Link>
        {excerpt && <p className="text-muted-foreground mt-1">{excerpt}</p>}
      </li>;
    })}</ul>
  </section>;
}
