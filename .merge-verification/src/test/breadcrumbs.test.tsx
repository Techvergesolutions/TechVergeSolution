import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { absoluteUrl } from "@/lib/seo/config";

const state = vi.hoisted(() => ({ labels: {
  home: "CMS Home", services: "CMS Services", blog: "CMS Blog", about: "CMS About",
  contact: "CMS Contact", portfolio: "CMS Portfolio",
  staticPostLabels: [{ slug: "legacy", title: "CMS legacy title" }],
} }));
vi.mock("@tanstack/react-query", () => ({ useQuery: () => ({ data: state.labels }) }));
vi.mock("@/lib/sanity", () => ({ sanityClient: {} }));

describe("breadcrumbs", () => {
  it("renders an ordered trail, a non-link current page, and matching escaped JSON-LD", () => {
    const items = [
      { name: "Home", href: "/" },
      { name: "Services", href: "/services" },
      { name: "A </script> service", href: "/services/example" },
    ];
    const { container } = render(<Breadcrumbs items={items} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).getAllByRole("listitem")).toHaveLength(3);
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(nav).getByRole("link", { name: "Services" })).toHaveAttribute("href", "/services");
    const current = within(nav).getByText("A </script> service");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.tagName).toBe("SPAN");
    expect(within(nav).getAllByRole("link")).toHaveLength(2);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(script.textContent).not.toContain("</script>");
    expect(JSON.parse(script.textContent!)).toEqual({
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.href),
      })),
    });
  });

  it("uses Sanity labels and the supplied Sanity service title", () => {
    render(<PageBreadcrumbs section="services" current={{ href: "/services/example", title: "CMS service title" }} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).getByText("CMS Home")).toHaveAttribute("href", "/");
    expect(within(nav).getByText("CMS Services")).toHaveAttribute("href", "/services");
    expect(within(nav).getByText("CMS service title")).toHaveAttribute("aria-current", "page");
  });

  it("uses the Sanity label for the existing local fallback article", () => {
    render(<PageBreadcrumbs section="blog" current={{ href: "/blog/legacy", staticPostSlug: "legacy" }} />);
    expect(screen.getByText("CMS legacy title")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "CMS Blog" })).toHaveAttribute("href", "/blog");
  });

  it("omits the trail when a required CMS title is unavailable", () => {
    const { container } = render(<PageBreadcrumbs section="blog" current={{ href: "/blog/unknown", staticPostSlug: "unknown" }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
