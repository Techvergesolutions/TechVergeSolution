import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { blogPostPath, type BlogPostMeta } from "@/data/blog";

interface BlogRelatedGuidesProps {
  posts: BlogPostMeta[];
}

export function BlogRelatedGuides({ posts }: BlogRelatedGuidesProps) {
  if (!posts.length) return null;

  return (
    <section aria-labelledby="related-guides-heading" className="pt-10 border-t border-border/50">
      <h2
        id="related-guides-heading"
        className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6"
      >
        Related guides
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={blogPostPath(post.slug)}
              className="group block h-full rounded-2xl border border-border/50 bg-card/20 p-5 hover:border-primary/35 transition-colors"
            >
              {post.category ? (
                <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
                  {post.category}
                </span>
              ) : null}
              <p className="font-display font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                {post.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium">
                Read guide
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
