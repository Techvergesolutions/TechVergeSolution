import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ServiceGuides } from "@/components/services/ServiceGuides";
import { LatestPosts } from "@/components/blog/LatestPosts";
import { distinctPosts } from "@/lib/relatedPosts";
import type { CmsPostSummary } from "@/lib/sanity/queries";

const state = vi.hoisted(() => ({
  related: { category: [{ _id: "2", slug: "category", title: "Category match" }, { _id: "1", slug: "manual", title: "Duplicate" }], latest: [{ _id: "3", slug: "latest", title: "Latest post" }, { _id: "4", slug: "current", title: "Current post" }] },
  guides: [{ _id: "2", slug: "direct", title: "Direct guide" }, { _id: "1", slug: "manual", title: "Duplicate" }],
  latest: [{ _id: "1", slug: "manual", title: "Newest post" }, { _id: "2", slug: "direct", title: "Another post" }, { _id: "3", slug: "manual", title: "Duplicate" }],
}));
vi.mock("@tanstack/react-query", () => ({ useQuery: ({ queryKey }: { queryKey: string[] }) => ({
  data: queryKey[0] === "relatedPosts" ? state.related : queryKey[0] === "serviceGuides" ? state.guides : state.latest,
}) }));
vi.mock("@/lib/sanity", () => ({ sanityClient: {} }));

const post = (slug: string, title: string): CmsPostSummary => ({ _id: slug, slug, title, excerpt: null, mainImage: null, publishedAt: null, updatedAt: null });

describe("automatic internal links", () => {
  it("uses manual posts, then category and latest, excluding the current slug and duplicates", () => {
    render(<MemoryRouter><RelatedPosts slug="current" categoryIds={["cat"]} manual={[post("manual", "Manual choice")]} /></MemoryRouter>);
    const section = screen.getByRole("region", { name: "Related Posts" });
    const links = within(section).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(["Manual choice", "Category match", "Latest post"]);
    expect(new Set(links.map((link) => link.getAttribute("href"))).size).toBe(3);
  });

  it("combines editorial service guides and posts referencing the service without duplicates", () => {
    render(<MemoryRouter><ServiceGuides serviceId="service" manual={[post("manual", "Manual guide")]} /></MemoryRouter>);
    const links = within(screen.getByRole("region", { name: "Guides" })).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(["Manual guide", "Direct guide"]);
  });

  it("shows distinct Sanity post titles on the homepage", () => {
    render(<MemoryRouter><LatestPosts /></MemoryRouter>);
    const links = within(screen.getByRole("region", { name: "Latest from the blog" })).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["/blog/manual", "/blog/direct"]);
  });

  it("skips incomplete and duplicate post targets", () => {
    expect(distinctPosts([[post("x", "X"), post("x", "Duplicate"), post("", "Missing"), post("y", "Y")]], { excludeSlug: "y" }).map((item) => item.slug)).toEqual(["x"]);
  });
});
