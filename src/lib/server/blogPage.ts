import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { getBlogPostBySlug, getCompiledBlogPostBySlug } from "../../data/blog";
import { buildMetadata } from "../seo/metadata";
import { articleJsonLd, faqPageJsonLd, serializeJsonLd, visibleFaqs } from "../seo/schema";
import { siteName } from "../seo/config";
import { escapeXml } from "./xml";
import type { CmsImage, CmsSeo, CmsFaq } from "../sanity/queries";

export type BlogHeadPost = {
  title: string | null; slug: string | null; excerpt: string | null; description: string | null;
  publishedAt: string | null; updatedAt: string | null; seo: CmsSeo | null;
  mainImage: CmsImage | null; author: { name: string | null } | null; faqs: CmsFaq[] | null;
  body?: PortableTextBlock[] | null;
};

export const BLOG_HEAD_QUERY = `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0] {
  title, "slug": slug.current, excerpt, description, publishedAt, updatedAt, body,
  seo { seoTitle, seoDescription, canonicalUrl, noIndex, ogImage }, mainImage,
  author-> { name }, faqs[] { _key, question, answer }
}`;

const portableComponents: PortableTextComponents = {
  block: { h1: ({ children }) => createElement("h2", null, children) },
  types: {
    image: ({ value }) => {
      const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
      if (!projectId || !value?.asset) return null;
      try {
        const client = createClient({ projectId, dataset: process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || "production", apiVersion: process.env.VITE_SANITY_API_VERSION || "2024-01-01", useCdn: true });
        const src = imageUrlBuilder(client).image(value).width(1200).quality(75).auto("format").url();
        return createElement("figure", null,
          createElement("img", { src, alt: typeof value.alt === "string" ? value.alt : "", width: 1200, height: 800, loading: "lazy" }),
          typeof value.caption === "string" && value.caption.trim() ? createElement("figcaption", null, value.caption) : null);
      } catch { return null; }
    },
  },
};

export async function fetchBlogHead(slug: string): Promise<{ post: BlogHeadPost | null; image?: string; ogImage?: string }> {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
  if (!projectId) throw new Error("Sanity project ID is not configured");
  const client = createClient({ projectId, dataset: process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || "production", apiVersion: process.env.VITE_SANITY_API_VERSION || "2024-01-01", perspective: "published", useCdn: false, token: process.env.SANITY_API_READ_TOKEN || undefined });
  const post = await client.fetch<BlogHeadPost | null>(BLOG_HEAD_QUERY, { slug });
  let image: string | undefined;
  let ogImage: string | undefined;
  if (post?.mainImage?.asset) {
    try { image = imageUrlBuilder(client).image(post.mainImage).width(1400).quality(85).url(); } catch { /* Omit an invalid image from the schema. */ }
  }
  if (post?.seo?.ogImage?.asset) {
    try { ogImage = imageUrlBuilder(client).image(post.seo.ogImage).width(1400).quality(85).url(); } catch { /* Use the generated title image. */ }
  }
  return { post, image, ogImage };
}

function putTag(html: string, tag: "meta" | "link", key: "name" | "property" | "rel", value: string, content: string): string {
  const selector = new RegExp(`<${tag}\\b[^>]*\\b${key}\\s*=\\s*["']${value}["'][^>]*>`, "i");
  const attribute = tag === "link" ? "href" : "content";
  const replacement = `<${tag} data-rh="true" ${key}="${value}" ${attribute}="${escapeXml(content)}" />`;
  return selector.test(html) ? html.replace(selector, () => replacement) : html.replace(/<\/head>/i, () => `${replacement}\n</head>`);
}

export function renderBlogHead(template: string, slug: string, post: BlogHeadPost | null, image?: string, ogImage?: string): { html: string; found: boolean } {
  const fallback = getBlogPostBySlug(slug);
  const title = post?.title?.trim() || (!post ? fallback?.title : undefined);
  const path = `/blog/${encodeURIComponent(slug)}`;
  const found = Boolean(title);
  const description = post ? post.seo?.seoDescription?.trim() || post.excerpt?.trim() || post.description?.trim() || "" : fallback?.description || "The page you requested could not be found on TechVerge Solutions.";
  const publishedTime = post?.publishedAt || (!post ? fallback?.datePublished : undefined);
  const modifiedTime = post?.updatedAt || publishedTime;
  const author = post?.author?.name?.trim();
  const imageAlt = ogImage ? post?.seo?.ogImage?.alt?.trim() || "Blog article image" : title || "Page Not Found";
  const metadata = buildMetadata({ title: post?.seo?.seoTitle?.trim() || title || "Page Not Found", description, path, image: ogImage || `/api/og?slug=${encodeURIComponent(slug)}`, noIndex: !found || post?.seo?.noIndex, canonicalUrl: post?.seo?.canonicalUrl, type: found ? "article" : "website", publishedTime, modifiedTime, authors: author ? [author] : undefined });
  let html = template.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, () => `<title data-rh="true">${escapeXml(metadata.title)}</title>`);
  const tags: Array<["meta" | "link", "name" | "property" | "rel", string, string]> = [
    ["meta", "name", "description", metadata.description], ["link", "rel", "canonical", metadata.alternates.canonical],
    ["meta", "name", "robots", metadata.robots.index ? "index, follow" : "noindex, follow"],
    ["meta", "property", "og:title", metadata.title], ["meta", "property", "og:description", metadata.description],
    ["meta", "property", "og:type", found ? "article" : "website"], ["meta", "property", "og:url", metadata.openGraph.url],
    ["meta", "property", "og:site_name", siteName], ["meta", "property", "og:image", metadata.openGraph.images[0]],
    ["meta", "property", "og:image:alt", imageAlt], ["meta", "name", "twitter:title", metadata.title],
    ["meta", "name", "twitter:description", metadata.description], ["meta", "name", "twitter:image", metadata.openGraph.images[0]],
    ["meta", "name", "twitter:image:alt", imageAlt],
  ];
  if (found && publishedTime) tags.push(["meta", "property", "article:published_time", publishedTime]);
  if (found && modifiedTime) tags.push(["meta", "property", "article:modified_time", modifiedTime]);
  if (found && author) tags.push(["meta", "property", "article:author", author]);
  for (const [tag, key, name, value] of tags) html = putTag(html, tag, key, name, value);
  if (found && title) {
    const article = articleJsonLd({
      headline: title,
      description,
      path,
      image: post ? image : fallback?.featuredImage.src,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      authorName: author,
    });
    const faq = faqPageJsonLd(visibleFaqs(post?.faqs));
    const scripts = [article, ...(faq ? [faq] : [])].map((data) => `<script data-prerender-jsonld="true" type="application/ld+json">${serializeJsonLd(data)}</script>`).join("\n");
    html = html.replace(/<\/head>/i, () => `${scripts}\n</head>`);
    const bodyHtml = post?.body?.length
      ? renderToStaticMarkup(createElement(PortableText, { value: post.body, components: portableComponents }))
      : !post ? getCompiledBlogPostBySlug(slug)?.bodyHtml || "" : "";
    const faqHtml = visibleFaqs(post?.faqs).map(({ question, answer }) => `<section><h3>${escapeXml(question)}</h3><p>${escapeXml(answer)}</p></section>`).join("");
    const content = `<main class="section-container max-w-3xl pt-32 pb-20"><article><h1>${escapeXml(title)}</h1>${bodyHtml}${faqHtml ? `<section><h2>Frequently Asked Questions</h2>${faqHtml}</section>` : ""}</article></main>`;
    html = html.replace(/<div\s+id=["']root["']\s*>\s*<\/div>/i, () => `<div id="root">${content}</div>`);
  }
  return { html, found };
}
