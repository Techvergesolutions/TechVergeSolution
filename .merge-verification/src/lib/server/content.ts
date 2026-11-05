import { createClient } from "@sanity/client";
import { getCache } from "@vercel/functions";

export type IndexDocument = {
  _id: string;
  _type: string;
  slug: string | null;
  path: string | null;
  title: string | null;
  excerpt: string | null;
  description: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  noIndex: boolean | null;
};

export const CONTENT_TAGS = ["sanity:post", "sanity:service", "sanity:page", "sanity:marketPage"] as const;

// Published perspective plus the ID filter excludes drafts and content releases.
export const INDEX_QUERY = `*[_type in ["post", "service", "page", "home", "about", "contact", "portfolio", "blog", "services", "marketPage"] && (_type != "marketPage" || (defined(title) && title != "" && count(body) > 0)) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] {
  _id, _type, "slug": slug.current, path, title, excerpt, description, publishedAt, updatedAt, "noIndex": seo.noIndex
}`;

export async function getPublishedContent(): Promise<IndexDocument[]> {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || "production";
  if (!projectId) throw new Error("Sanity project ID is not configured");
  const client = createClient({
    projectId, dataset,
    apiVersion: process.env.VITE_SANITY_API_VERSION || "2024-01-01",
    perspective: "published", useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN || undefined,
  });

  if (!process.env.VERCEL) return client.fetch<IndexDocument[]>(INDEX_QUERY);
  const key = `content-index-v2:${projectId}:${dataset}`;
  let cache: ReturnType<typeof getCache> | undefined;
  try {
    cache = getCache();
    const cached = await cache.get(key);
    if (Array.isArray(cached)) return cached as IndexDocument[];
  } catch (error) {
    console.warn("Sanity content cache read failed; fetching directly", error);
  }
  const documents = await client.fetch<IndexDocument[]>(INDEX_QUERY);
  try {
    await cache?.set(key, documents, { ttl: 300, tags: [...CONTENT_TAGS] });
  } catch (error) {
    console.warn("Sanity content cache write failed; serving uncached data", error);
  }
  return documents;
}
