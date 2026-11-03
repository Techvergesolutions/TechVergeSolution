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

function variantSrcSet(src: string, ext: "webp" | "avif"): string | undefined {
  if (!src.startsWith("/") || src.startsWith("//") || src.includes("?")) {
    return undefined;
  }
  if (!/\.webp$/i.test(src)) return undefined;
  const base = src.replace(/\.webp$/i, "");
  return `${base}-640w.${ext} 640w, ${base}-960w.${ext} 960w, ${base}-1400w.${ext} 1400w`;
}

/** Build srcSet for local `/images/...` assets that have `-640w` / `-960w` / `-1400w` variants. */
export function localImageSrcSet(src: string): string | undefined {
  const set = variantSrcSet(src, "webp");
  if (!set) return undefined;
  return `${set}, ${src} 1400w`;
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
  const webpSrcSet = srcSet ?? localImageSrcSet(src);
  const avifSrcSet = variantSrcSet(src, "avif");

  return (
    <figure className={cn("my-8", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-border/50 bg-muted/30",
          frameClassName,
        )}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <picture className="block h-full w-full">
          {avifSrcSet ? (
            <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
          ) : null}
          {webpSrcSet ? (
            <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
          ) : null}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            srcSet={webpSrcSet}
            sizes={webpSrcSet ? sizes : undefined}
            loading={shouldLazy ? "lazy" : "eager"}
            decoding="async"
            fetchPriority={priority ? "high" : undefined}
            className={cn("h-full w-full object-cover", imgClassName)}
          />
        </picture>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm text-muted-foreground text-center">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
