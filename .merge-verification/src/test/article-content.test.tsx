import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ArticleContent, RelatedServiceCard } from "@/components/blog/ArticleContent";
import type { PortableTextBlock } from "@portabletext/types";

const block = (key: string, style: string, text: string) => ({
  _type: "block", _key: key, style, markDefs: [], children: [{ _type: "span", _key: `${key}-span`, marks: [], text }],
}) as PortableTextBlock;

describe("article contents", () => {
  it("generates unique heading anchors and a table of contents for long articles", () => {
    const body = [
      block("one", "h2", "Repeated heading"),
      block("text", "normal", Array(320).fill("content").join(" ")),
      block("two", "h2", "Repeated heading"),
      block("three", "h3", "A smaller section"),
    ];
    const service = { _id: "service", slug: "example", title: "Example service", shortDescription: null };
    const { container } = render(<MemoryRouter><ArticleContent slug="article" body={body} service={service} faqs={[]} /><RelatedServiceCard service={service} /></MemoryRouter>);
    const toc = screen.getByRole("navigation", { name: "Table of contents" });
    const hrefs = within(toc).getAllByRole("link").map((link) => new URL(link.getAttribute("href")!, "https://example.com").hash);
    expect(hrefs).toEqual(["#article-repeated-heading", "#article-repeated-heading-2", "#article-a-smaller-section"]);
    for (const href of hrefs) expect(container.querySelector(href!)).toBeInTheDocument();
    const cards = screen.getAllByText("Related service").map((label) => label.closest("aside")!);
    expect(cards).toHaveLength(2);
    for (const card of cards) {
      const links = within(card).getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute("href", "/services/example");
      expect(links[0]).toHaveTextContent("Explore Example service");
    }
  });

  it("adds heading ids but omits the table of contents for a short article", () => {
    const { container } = render(<MemoryRouter><ArticleContent slug="short" body={[block("h", "h2", "Short heading"), block("p", "normal", "A brief paragraph.")]} faqs={[]} /></MemoryRouter>);
    expect(screen.queryByRole("navigation", { name: "Table of contents" })).not.toBeInTheDocument();
    expect(container.querySelector("#article-short-heading")).toBeInTheDocument();
  });
});
