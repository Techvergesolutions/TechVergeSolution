import { Link } from "react-router-dom";
import type { BlogAuthor } from "@/data/blogAuthors";
import { formatBlogDate } from "@/lib/blogFormat";

interface BlogAuthorCardProps {
  author: BlogAuthor;
  datePublished: string;
  dateModified: string;
  readingTimeMinutes: number;
}

export function BlogAuthorCard({
  author,
  datePublished,
  dateModified,
  readingTimeMinutes,
}: BlogAuthorCardProps) {
  const publishedLabel = formatBlogDate(datePublished);
  const updatedLabel = formatBlogDate(dateModified);
  const showUpdated = dateModified !== datePublished;

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 rounded-2xl border border-border/50 bg-card/30 p-5 md:p-6">
      <Link to={author.path} className="shrink-0">
        <img
          src={author.image}
          alt={author.imageAlt}
          width={72}
          height={72}
          className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full object-cover border border-border/60 bg-muted/40"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold text-foreground">
          <Link to={author.path} className="hover:text-primary transition-colors">
            {author.name}
          </Link>
        </p>
        <p className="text-sm text-muted-foreground mb-2">{author.role}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {author.bio}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs md:text-sm text-muted-foreground">
          <span>
            Published{" "}
            <time dateTime={datePublished}>{publishedLabel}</time>
          </span>
          {showUpdated ? (
            <>
              <span aria-hidden="true">·</span>
              <span>
                Updated{" "}
                <time dateTime={dateModified}>{updatedLabel}</time>
              </span>
            </>
          ) : null}
          <span aria-hidden="true">·</span>
          <span>{readingTimeMinutes} min read</span>
        </div>
      </div>
    </div>
  );
}
