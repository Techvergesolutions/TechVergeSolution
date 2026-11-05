import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanity";
import { fetchSanityQuery } from "@/lib/sanity/queries";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => {
      if (!sanityClient) throw new Error("Sanity is not configured");
      return fetchSanityQuery(sanityClient, "allServices");
    },
    staleTime: 5 * 60 * 1000,
  });
}
