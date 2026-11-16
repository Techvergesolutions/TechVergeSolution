import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { buildMetadata } from "../seo/metadata";
import { siteName } from "../seo/config";
import { escapeXml } from "./xml";
import { MARKET_PAGE_QUERY, type MarketPage } from "../sanity/queries";

function putTag(html: string, tag: "meta" | "link", key: "name" | "property" | "rel", value: string, content: string): string {
  const selector = new RegExp(`<${tag}\\b[^>]*\\b${key}\\s*=\\s*["']${value}["'][^>]*>`, "i");
  const attribute = tag === "link" ? "href" : "content";
  const replacement = `<${tag} data-rh="true" ${key}="${value}" ${attribute}="${escapeXml(content)}" />`;
  return selector.test(html) ? html.replace(selector, () => replacement) : html.replace(/<\/head>/i, () => `${replacement}\n</head>`);
}

export async function fetchMarketPage(slug: string): Promise<{ page: MarketPage | null; ogImage?: string; imageAlt?: string }> {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
  if (!projectId) throw new Error("Sanity project ID is not configured");
  const client = createClient({
    projectId,
    dataset: process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || "production",
    apiVersion: process.env.VITE_SANITY_API_VERSION || "2024-01-01",
    perspective: "published",
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN || undefined,
  });
  const page = await client.fetch<MarketPage | null>(MARKET_PAGE_QUERY, { slug });
  let ogImage: string | undefined;
  let imageAlt: string | undefined;
  if (page?.seo?.ogImage?.asset) {
    try {
      ogImage = imageUrlBuilder(client).image(page.seo.ogImage).width(1200).quality(80).url();
      imageAlt = page.seo.ogImage.alt?.trim() || undefined;
    } catch { /* Use the site default image. */ }
  }
  return { page, ogImage, imageAlt };
}

export function renderMarketHead(template: string, slug: string, page: MarketPage | null, ogImage?: string, imageAlt?: string): { html: string; found: boolean } {
  const title = page?.title?.trim();
  const found = Boolean(title && page?.body?.length);
  const path = `/markets/${encodeURIComponent(slug)}`;
  const description = found
    ? page?.seo?.seoDescription?.trim() || page?.summary?.trim() || title || ""
    : "The page you requested could not be found on TechVerge Solution.";
  const metadata = buildMetadata({
    title: found ? page?.seo?.seoTitle?.trim() || title || "Page Not Found" : "Page Not Found",
    description,
    path,
    image: ogImage,
    noIndex: !found || page?.seo?.noIndex,
    canonicalUrl: page?.seo?.canonicalUrl,
  });
  const alt = imageAlt || metadata.title;
  let html = template.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, () => `<title data-rh="true">${escapeXml(metadata.title)}</title>`);
  const tags: Array<["meta" | "link", "name" | "property" | "rel", string, string]> = [
    ["meta", "name", "description", metadata.description],
    ["link", "rel", "canonical", metadata.alternates.canonical],
    ["meta", "name", "robots", metadata.robots.index ? "index, follow" : "noindex, follow"],
    ["meta", "property", "og:title", metadata.title],
    ["meta", "property", "og:description", metadata.description],
    ["meta", "property", "og:type", "website"],
    ["meta", "property", "og:url", metadata.openGraph.url],
    ["meta", "property", "og:site_name", siteName],
    ["meta", "property", "og:image", metadata.openGraph.images[0]],
    ["meta", "property", "og:image:alt", alt],
    ["meta", "name", "twitter:title", metadata.title],
    ["meta", "name", "twitter:description", metadata.description],
    ["meta", "name", "twitter:image", metadata.openGraph.images[0]],
    ["meta", "name", "twitter:image:alt", alt],
  ];
  for (const [tag, key, name, value] of tags) html = putTag(html, tag, key, name, value);
  if (found && title) {
    const summary = page?.summary?.trim();
    const content = `<main class="section-container max-w-4xl pt-32 pb-20"><article><h1>${escapeXml(title)}</h1>${summary ? `<p>${escapeXml(summary)}</p>` : ""}</article></main>`;
    html = html.replace(/<div\s+id=["']root["']\s*>\s*<\/div>/i, () => `<div id="root">${content}</div>`);
  }
  return { html, found };
}
