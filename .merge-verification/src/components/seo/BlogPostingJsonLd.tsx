import { blogPostingJsonLd } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export interface BlogPostingJsonLdProps {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  imagePath: string;
  imageAlt?: string;
  authorName?: string;
  authorPath?: string;
}

export function BlogPostingJsonLd(props: BlogPostingJsonLdProps) {
  return <JsonLd data={blogPostingJsonLd(props)} />;
}
