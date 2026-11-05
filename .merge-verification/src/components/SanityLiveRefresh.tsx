import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanity";

export function SanityLiveRefresh() {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!sanityClient) return;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const subscription = sanityClient.listen(
      '*[_type in ["post", "service", "page", "author", "category", "breadcrumbSettings", "contactSettings", "marketPage", "home", "about", "contact", "portfolio", "blog", "services"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]',
      {},
      { includeResult: false, visibility: "query" },
    ).subscribe({
      next: (event) => {
        if (event.type !== "mutation") return;
        clearTimeout(timeout);
        // Wait briefly for Sanity's query store to reflect the mutation.
        timeout = setTimeout(() => { void queryClient.invalidateQueries(); }, 3000);
      },
      error: (error) => console.warn("Sanity live updates are unavailable", error),
    });
    return () => { clearTimeout(timeout); subscription.unsubscribe(); };
  }, [queryClient]);
  return null;
}
