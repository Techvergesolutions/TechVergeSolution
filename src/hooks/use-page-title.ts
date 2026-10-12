import { useEffect } from "react";

/**
 * @deprecated Prefer `<Seo />` for title, description, canonical, and social tags.
 * Kept for lightweight title-only pages (e.g. 404).
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
