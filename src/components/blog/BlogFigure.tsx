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
  if (!/^\/images\/blog\/(ai-voice-agents-hero|ai-call-workflow|appointment-scheduling|human-handoff|support-workflow)\.webp$/i.test(src)) return undefined;
  const base = src.replace(/\.webp$/i, "");
  const sizes = base.endsWith("ai-voice-agents-hero") ? [640, 960, 1400] : [640, 960];
  return sizes.map((size) => `${base}-${size}w.${ext} ${size}w`).join(", ");
}

/** Build srcSet for local `/images/...` assets that have `-640w` / `-960w` / `-1400w` variants. */
export function localImageSrcSet(src: string): string | undefined {
  const set = variantSrcSet(src, "webp");
  if (!set) return undefined;
  return set;
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
  srcSet: suppliedSrcSet,
  sizes = "(min-width: 768px) 720px, calc(100vw - 48px)",
}: BlogFigureProps) {
  const shouldLazy = priority ? false : lazy;
  let srcSet: string | undefined = suppliedSrcSet ?? localImageSrcSet(src);
  const avifSrcSet = variantSrcSet(src, "avif");
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
        <picture className="block h-full w-full">
          {avifSrcSet ? (
            <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
          ) : null}
          {srcSet && !imageSrc.startsWith("https://cdn.sanity.io/") ? (
            <source type="image/webp" srcSet={srcSet} sizes={sizes} />
          ) : null}
          <img
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            srcSet={srcSet}
            sizes={srcSet ? sizes : undefined}
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
