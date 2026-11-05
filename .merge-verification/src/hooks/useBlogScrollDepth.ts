import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

const MILESTONES = [25, 50, 75, 100] as const;

/**
 * Fires GA4 `scroll_depth` once per milestone while reading a blog post.
 */
export function useBlogScrollDepth(slug: string | undefined) {
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!slug) return;
    fired.current = new Set();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const height = doc.scrollHeight - window.innerHeight;
      if (height <= 0) return;

      const percent = Math.min(100, Math.round((scrollTop / height) * 100));
      for (const milestone of MILESTONES) {
        if (percent >= milestone && !fired.current.has(milestone)) {
          fired.current.add(milestone);
          trackEvent("scroll_depth", {
            percent_scrolled: milestone,
            content_type: "blog_post",
            content_slug: slug,
            page_path: `/blog/${slug}`,
          });
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);
}
