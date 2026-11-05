import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface BlogBreadcrumbItem {
  name: string;
  path?: string;
}

interface BlogBreadcrumbsProps {
  items: BlogBreadcrumbItem[];
}

export function BlogBreadcrumbs({ items }: BlogBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="inline-flex items-center gap-1.5 min-w-0">
              {index > 0 ? (
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" aria-hidden="true" />
              ) : null}
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="hover:text-primary transition-colors truncate max-w-[12rem] sm:max-w-none"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={isLast ? "text-foreground/80 truncate max-w-[16rem] sm:max-w-md" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
