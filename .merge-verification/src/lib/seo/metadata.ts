import { absoluteUrl, defaultDescription, defaultOgImage, siteName } from "./config";

export type MetadataInput = {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[];
};

/** Metadata for the Vite/Helmet renderer; title formatting is centralized here. */
export function buildMetadata(input: MetadataInput) {
  const title = input.title.endsWith(` | ${siteName}`) ? input.title : `${input.title} | ${siteName}`;
  const description = input.description?.trim() || defaultDescription;
  const url = absoluteUrl(input.path);
  const canonical = absoluteUrl(input.canonicalUrl?.trim() || input.path);
  const image = absoluteUrl(input.image?.trim() || defaultOgImage);
  const type = input.type ?? "website";
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title, description, url, siteName, images: [image], type, locale: "en_US",
      ...(type === "article" && input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(type === "article" && input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
      ...(type === "article" && input.authors?.length ? { authors: input.authors } : {}),
    },
    twitter: { card: "summary_large_image" as const, title, description, images: [image] },
    robots: { index: !input.noIndex, follow: true },
  };
}
