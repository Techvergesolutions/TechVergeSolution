import { absoluteUrl } from "@/lib/seo/config";
import { JsonLd } from "@/components/JsonLd";

export type BreadcrumbItem = { name: string; href: string };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (!items.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };

  return <>
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => <li key={`${item.href}-${index}`} className="inline-flex items-center gap-2">
          {index > 0 && <span aria-hidden="true">/</span>}
          {index === items.length - 1
            ? <span aria-current="page" className="text-foreground">{item.name}</span>
            : <a href={item.href} className="hover:text-foreground hover:underline">{item.name}</a>}
        </li>)}
      </ol>
    </nav>
    <JsonLd data={jsonLd} />
  </>;
}
