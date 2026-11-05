import { breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export interface BreadcrumbJsonLdProps {
  items: { name: string; path: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  if (!items.length) return null;
  return <JsonLd data={breadcrumbJsonLd(items)} />;
}
