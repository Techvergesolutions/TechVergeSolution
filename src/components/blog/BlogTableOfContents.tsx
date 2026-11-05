import type { BlogTocItem } from "@/data/blog";

interface BlogTableOfContentsProps {
  items: BlogTocItem[];
}

export function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  if (!items.length) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-2xl border border-border/50 bg-card/20 px-5 py-5 md:px-6 md:py-6"
    >
      <p className="font-display font-bold text-foreground mb-3">
        On this page
      </p>
      <ol className="space-y-2 text-sm md:text-base">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "pl-4" : undefined}
          >
            <a
              href={`#${item.id}`}
              className="text-muted-foreground hover:text-primary transition-colors leading-snug"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
