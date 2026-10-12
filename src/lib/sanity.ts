import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID?.trim() ?? "";
const dataset = import.meta.env.VITE_SANITY_DATASET?.trim() || "production";
const apiVersion =
  import.meta.env.VITE_SANITY_API_VERSION?.trim() || "2024-01-01";
const token = import.meta.env.VITE_SANITY_TOKEN?.trim() ?? "";

export function isSanityConfigured(): boolean {
  return projectId.length > 0;
}

export const sanityClient: SanityClient | null = isSanityConfigured()
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token: token || undefined,
      useCdn: !token,
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source: SanityImageSource) {
  if (!builder) {
    throw new Error("Sanity image URL builder is not configured");
  }
  return builder.image(source);
}
