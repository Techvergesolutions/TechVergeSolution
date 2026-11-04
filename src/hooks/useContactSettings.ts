import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanity";
import { fetchSanityQuery } from "@/lib/sanity/queries";

export function useContactSettings() {
  return useQuery({ queryKey: ["contactSettings"], enabled: Boolean(sanityClient), queryFn: () => fetchSanityQuery(sanityClient!, "contactSettings"), staleTime: 5 * 60 * 1000 });
}
