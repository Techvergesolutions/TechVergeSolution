import { useEffect } from "react";

/** Sets document.title for SPA routes (no react-helmet in this project). */
export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
