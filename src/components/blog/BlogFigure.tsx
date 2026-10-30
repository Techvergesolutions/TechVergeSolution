import { cn } from "@/lib/utils";

type BlogFigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** Hero/featured: do not lazy-load. Default true for in-article images. */
  lazy?: boolean;
  className?: string;
  frameClassName?: string;
  imgClassName?: string;
  priority?: boolean;
  srcSet?: string;
  sizes?: string;
};

/** Build srcSet for local `/images/...` assets that have `-640w` / `-960w` / `-1400w` variants. */
export function localImageSrcSet(src: string): string | undefined {
  if (!src.startsWith("/") || src.startsWith("//") || src.includes("?")) {
    return undefined;
  }
  if (!/\.webp$/i.test(src)) return undefined;
  const base = src.replace(/\.webp$/i, "");
  return `${base}-640w.webp 640w, ${base}-960w.webp 960w, ${base}-1400w.webp 1400w, ${src} ${1400}w`;
}

export function BlogFigure({
  src,
  alt,
  width,
  height,
  caption,
  lazy = true,
  className,
  frameClassName,
  imgClassName,
  priority = false,
  srcSet,
  sizes = "(max-width: 768px) 100vw, 720px",
}: BlogFigureProps) {
  const shouldLazy = priority ? false : lazy;
  const resolvedSrcSet = srcSet ?? localImageSrcSet(src);

  return (
    <figure className={cn("my-8", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-border/50 bg-muted/30",
          frameClassName,
        )}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          srcSet={resolvedSrcSet}
          sizes={resolvedSrcSet ? sizes : undefined}
          loading={shouldLazy ? "lazy" : "eager"}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm text-muted-foreground text-center">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
