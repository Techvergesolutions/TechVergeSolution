import { Link } from "react-router-dom";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { urlForImage } from "@/lib/sanity";
import { cn } from "@/lib/utils";

type Props = {
  value: PortableTextBlock[];
  className?: string;
};

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl md:text-2xl font-bold text-foreground pt-3">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">{children}</ol>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href as string | undefined;
      if (!href) return <>{children}</>;
      const isInternal = href.startsWith("/") && !href.startsWith("//");
      if (isInternal) {
        return (
          <Link to={href} className="text-primary underline underline-offset-2">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          className="text-primary underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlForImage(value).width(1200).quality(85).url();
      const alt = (value.alt as string | undefined)?.trim() || "";
      return (
        <BlogFigure
          src={src}
          alt={alt}
          width={1200}
          height={800}
          caption={value.caption as string | undefined}
        />
      );
    },
  },
};

export function PortableTextContent({ value, className }: Props) {
  if (!value?.length) {
    return (
      <p className="text-muted-foreground">
        This article has no body content yet.
      </p>
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
