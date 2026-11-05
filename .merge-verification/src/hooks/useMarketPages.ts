import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanity";
import { fetchSanityQuery } from "@/lib/sanity/queries";

export function useMarketPages() {
  return useQuery({ queryKey: ["marketPages"], enabled: Boolean(sanityClient), queryFn: () => fetchSanityQuery(sanityClient!, "marketPages"), staleTime: 5 * 60 * 1000 });
}
