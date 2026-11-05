import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanity";
import { fetchSanityQuery } from "@/lib/sanity/queries";
import { distinctPosts } from "@/lib/relatedPosts";

export function LatestPosts() {
  const { data } = useQuery({
    queryKey: ["blog", "latest"],
    enabled: Boolean(sanityClient),
    queryFn: () => fetchSanityQuery(sanityClient!, "latestPosts"),
    staleTime: 5 * 60 * 1000,
  });
  const posts = distinctPosts([data ?? []], { limit: 5 });
  if (!posts.length) return null;

  return <section className="section-container py-16 md:py-20" aria-labelledby="latest-blog-heading">
    <div className="max-w-5xl mx-auto">
      <h2 id="latest-blog-heading" className="font-display text-3xl md:text-4xl font-bold mb-8">Latest from the blog</h2>
      <ul className="grid gap-4 md:grid-cols-2">{posts.map((post) => <li key={post.slug} className="rounded-xl border border-border/60 bg-card/30 p-5">
        <Link to={`/blog/${post.slug}`} className="font-medium text-foreground hover:text-primary hover:underline">{post.title}</Link>
      </li>)}</ul>
    </div>
  </section>;
}
