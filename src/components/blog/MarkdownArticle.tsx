import { cn } from "@/lib/utils";

type Props = {
  html: string;
  className?: string;
};

/** Renders precompiled Markdown HTML for blog posts. */
export function MarkdownArticle({ html, className }: Props) {
  if (!html?.trim()) {
    return (
      <p className="text-muted-foreground">This article has no body content yet.</p>
    );
  }

  return (
    <div
      className={cn(
        "space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed blog-md",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
