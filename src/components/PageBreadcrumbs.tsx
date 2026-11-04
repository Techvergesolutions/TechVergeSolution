import { useQuery } from "@tanstack/react-query";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/Breadcrumbs";
import { sanityClient } from "@/lib/sanity";
import { fetchSanityQuery } from "@/lib/sanity/queries";

type Section = "services" | "blog" | "portfolio" | "about" | "contact";
const paths: Record<Section, string> = {
  services: "/services", blog: "/blog", portfolio: "/portfolio", about: "/about", contact: "/contact",
};

export function PageBreadcrumbs({ section, current }: {
  section: Section;
  current?: { href: string; title?: string | null; staticPostSlug?: string };
}) {
  const { data: labels } = useQuery({
    queryKey: ["breadcrumbLabels"],
    enabled: Boolean(sanityClient),
    staleTime: 5 * 60 * 1000,
    queryFn: () => fetchSanityQuery(sanityClient!, "breadcrumbSettings"),
  });

  const home = labels?.home?.trim();
  const sectionName = labels?.[section]?.trim();
  const currentName = current?.title?.trim() || (current?.staticPostSlug
    ? labels?.staticPostLabels?.find((item) => item.slug === current.staticPostSlug)?.title?.trim()
    : undefined);
  if (!home || !sectionName || (current && !currentName)) return null;

  const items: BreadcrumbItem[] = [
    { name: home, href: "/" },
    { name: sectionName, href: paths[section] },
  ];
  if (current && currentName) items.push({ name: currentName, href: current.href });
  return <Breadcrumbs items={items} />;
}
