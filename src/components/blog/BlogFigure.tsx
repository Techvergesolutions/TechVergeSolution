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
  sizes?: string;
};

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
  sizes = "(min-width: 768px) 720px, calc(100vw - 48px)",
}: BlogFigureProps) {
  const shouldLazy = priority ? false : lazy;
  let srcSet: string | undefined;
  let imageSrc = src;
  try {
    const url = new URL(src);
    if (url.protocol === "https:" && url.hostname === "cdn.sanity.io" && url.pathname.startsWith("/images/")) {
      url.searchParams.set("auto", "format");
      url.searchParams.set("q", "75");
      imageSrc = url.toString();
      const widths = [320, 480, 640, 768, 960, 1200].filter((size) => size < width);
      widths.push(width);
      srcSet = widths.map((size) => {
        const variant = new URL(url);
        variant.searchParams.set("w", String(size));
        // Preserve the requested aspect ratio when a source specifies both dimensions.
        const originalWidth = Number(url.searchParams.get("w"));
        const originalHeight = Number(url.searchParams.get("h"));
        if (originalWidth > 0 && originalHeight > 0) {
          variant.searchParams.set("h", String(Math.max(1, Math.round(originalHeight * size / originalWidth))));
        }
        return `${variant.toString()} ${size}w`;
      }).join(", ");
    }
  } catch { /* Local images keep their original URL. */ }

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
          src={imageSrc}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          width={width}
          height={height}
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
