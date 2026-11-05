import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BlogPost from "@/pages/BlogPost";

const state = vi.hoisted(() => ({
  post: {
    kind: "sanity" as const,
    post: {
      source: "sanity" as const, slug: "example", title: "CMS article", description: "Description", excerpt: "Excerpt",
      datePublished: "2026-01-01", dateModified: "2026-01-01", publishedTime: "2026-01-01", modifiedTime: "2026-01-01",
      readingTimeMinutes: 2, featuredImage: { src: "/og-image.webp", alt: "Image", width: 1200, height: 630 },
      schemaImage: "https://cdn.example/image.jpg", authors: ["Jane Author"], body: [],
      faqs: [{ question: "What happens?", answer: "The exact answer." }],
    },
  },
}));
vi.mock("@/hooks/useBlogPosts", () => ({ useBlogPostDetail: () => ({ data: state.post, isLoading: false, isError: false }), useBlogFaqs: () => ({ faqs: [] }) }));
vi.mock("@/components/landing/Navbar", () => ({ Navbar: () => null }));
vi.mock("@/components/landing/Footer", () => ({ Footer: () => null }));
vi.mock("@/components/Seo", () => ({ Seo: () => null }));
vi.mock("@/components/PageBreadcrumbs", () => ({ PageBreadcrumbs: () => null }));
vi.mock("@/components/blog/BlogFigure", () => ({ BlogFigure: () => null }));
vi.mock("@/components/blog/PortableTextContent", () => ({ PortableTextContent: () => null }));
vi.mock("@/components/RelatedPosts", () => ({ RelatedPosts: () => null }));

describe("Sanity article schema", () => {
  it("renders the same FAQ text visibly and in JSON-LD, with the Sanity person author", () => {
    const { container } = render(<MemoryRouter initialEntries={["/blog/example"]}><Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes></MemoryRouter>);
    const schemas = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map((node) => JSON.parse(node.textContent!));
    const article = schemas.find((schema) => schema["@type"] === "Article");
    const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
    expect(article.author).toEqual({ "@type": "Person", name: "Jane Author" });
    expect(faq.mainEntity[0].name).toBe(screen.getByText("What happens?").textContent);
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe(screen.getByText("The exact answer.").textContent);
  });
});
