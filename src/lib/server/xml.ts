import { absoluteUrl, defaultDescription, siteName } from "../seo/config";
import { blogPosts } from "../../data/blog";
import type { IndexDocument } from "./content";

const staticPaths = [
  "/",
  "/about",
  "/ai-facts",
  "/services",
  "/portfolio",
  "/blog",
  "/locations",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
];

export function escapeXml(value: string): string {
  const safe = Array.from(value).filter((character) => {
    const code = character.codePointAt(0)!;
    return code === 9 || code === 10 || code === 13 || (code >= 0x20 && code <= 0xd7ff) || (code >= 0xe000 && code <= 0xfffd) || (code >= 0x10000 && code <= 0x10ffff);
  }).join("");
  return safe
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function isPublished(doc: IndexDocument): boolean {
  return !doc._id.startsWith("drafts.") && !doc._id.startsWith("versions.");
}

function documentPath(doc: IndexDocument): string | null {
  if (doc._type === "post" || doc._type === "service" || doc._type === "marketPage") {
    const slug = doc.slug?.trim();
    if (!slug || /[\\/]/.test(slug) || slug === "." || slug === "..") return null;
    return `/${doc._type === "post" ? "blog" : doc._type === "service" ? "services" : "markets"}/${encodeURIComponent(slug)}`;
  }
  if (doc.path && staticPaths.includes(doc.path)) return doc.path;
  const key = doc._type === "page" ? doc.slug : doc._type;
  const candidate = key === "home" ? "/" : `/${key}`;
  return staticPaths.includes(candidate) ? candidate : null;
}

function validDate(value: string | null | undefined): string | undefined {
  return value && !Number.isNaN(Date.parse(value)) ? value : undefined;
}

export function generateSitemapXml(documents: IndexDocument[]): string {
  const published = documents.filter(isPublished);
  const hiddenPaths = new Set(published.filter((doc) => doc.noIndex === true).map(documentPath).filter((path): path is string => Boolean(path)));
  const paths = new Map<string, string | undefined>();
  for (const path of staticPaths) paths.set(path, undefined);
  // Preserve the existing local article unless a Sanity document controls its slug.
  for (const post of blogPosts) {
    if (!published.some((doc) => doc._type === "post" && doc.slug === post.slug)) {
      paths.set(`/blog/${encodeURIComponent(post.slug)}`, validDate(post.dateModified || post.datePublished));
    }
  }
  for (const doc of published) {
    const path = documentPath(doc);
    if (!path) continue;
    if (hiddenPaths.has(path)) {
      paths.delete(path);
      continue;
    }
    paths.set(path, validDate(doc.updatedAt ?? doc.publishedAt));
  }
  for (const path of hiddenPaths) paths.delete(path);
  const entries = Array.from(paths, ([path, date]) =>
    `  <url><loc>${escapeXml(absoluteUrl(path))}</loc>${date ? `<lastmod>${escapeXml(date)}</lastmod>` : ""}</url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

export function generateRssXml(documents: IndexDocument[]): string {
  const publishedSanityPosts = documents.filter(
    (doc) => isPublished(doc) && doc._type === "post" && doc.noIndex !== true && doc.title?.trim() && documentPath(doc),
  );
  const hiddenPaths = new Set(
    documents
      .filter((doc) => isPublished(doc) && doc._type === "post" && doc.noIndex === true)
      .map(documentPath)
      .filter((path): path is string => Boolean(path)),
  );
  const cmsSlugs = new Set(publishedSanityPosts.map((doc) => doc.slug).filter(Boolean));

  type FeedItem = { path: string; title: string; description: string; publishedAt?: string };
  const feedItems: FeedItem[] = publishedSanityPosts
    .filter((doc) => !hiddenPaths.has(documentPath(doc)!))
    .map((doc) => ({
      path: documentPath(doc)!,
      title: doc.title!.trim(),
      description: doc.excerpt?.trim() || doc.description?.trim() || "",
      publishedAt: validDate(doc.publishedAt),
    }));

  for (const post of blogPosts) {
    if (cmsSlugs.has(post.slug)) continue;
    if (publishedSanityPosts.some((doc) => doc.slug === post.slug && doc.noIndex === true)) continue;
    feedItems.push({
      path: `/blog/${encodeURIComponent(post.slug)}`,
      title: post.title,
      description: post.excerpt || post.description,
      publishedAt: validDate(post.dateModified || post.datePublished),
    });
  }

  const seen = new Set<string>();
  const items = feedItems
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .flatMap((post) => {
      if (seen.has(post.path)) return [];
      seen.add(post.path);
      const link = escapeXml(absoluteUrl(post.path));
      return [
        `    <item><title>${escapeXml(post.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><description>${escapeXml(post.description)}</description>${post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ""}</item>`,
      ];
    });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n  <title>${escapeXml(`${siteName} Blog`)}</title>\n  <link>${escapeXml(absoluteUrl("/blog"))}</link>\n  <description>${escapeXml(defaultDescription)}</description>\n${items.join("\n")}\n</channel></rss>\n`;
}
