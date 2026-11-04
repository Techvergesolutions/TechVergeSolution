import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ServicePage from "@/pages/ServicePage";
import { ServiceCards } from "@/components/services/ServiceCards";

const service = {
  _id: "service.example", slug: "example", title: "Example service",
  heroHeading: "An example heading", shortDescription: "Example summary",
  body: [{ _type: "block", _key: "body1", style: "h2", markDefs: [], children: [{ _type: "span", _key: "span1", text: "About the service", marks: [] }] }],
  features: [{ _key: "step1", title: "Discover", description: "Plan the project." }],
  processHeading: "How we work", processDescription: null,
  faqs: [{ _key: "faq1", question: "What happens?", answer: "We work together." }],
  relatedPosts: [{ _id: "post1", slug: "article", title: "Related article", excerpt: "Article summary" }],
  seo: null,
};

vi.mock("@tanstack/react-query", () => ({ useQuery: ({ queryKey }: { queryKey: string[] }) => queryKey[0] === "serviceGuides" ? ({ data: [] }) : ({ data: service, isLoading: false, isError: false }) }));
vi.mock("@/hooks/useServices", () => ({ useServices: () => ({ data: [service], isLoading: false, isError: false }) }));
vi.mock("@/components/landing/Navbar", () => ({ Navbar: () => null }));
vi.mock("@/components/landing/Footer", () => ({ Footer: () => null }));
vi.mock("@/components/Seo", () => ({ Seo: () => null }));

describe("Sanity service views", () => {
  it("links to service documents from the shared cards", () => {
    render(<MemoryRouter><ServiceCards /></MemoryRouter>);
    expect(screen.getByRole("link", { name: /example service/i })).toHaveAttribute("href", "/services/example");
  });

  it("renders one H1, CMS sections, related posts and the contact CTA", () => {
    const { container } = render(<MemoryRouter initialEntries={["/services/example"]}><Routes><Route path="/services/:slug" element={<ServicePage />} /></Routes></MemoryRouter>);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("An example heading");
    expect(screen.getByRole("heading", { name: "About the service" })).toBeInTheDocument();
    expect(screen.getByText("Plan the project.")).toBeInTheDocument();
    expect(screen.getByText("We work together.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Related article" })).toHaveAttribute("href", "/blog/article");
    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute("href", "/contact");
    const schemas = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map((node) => JSON.parse(node.textContent!));
    const faqSchema = schemas.find((schema) => schema["@type"] === "FAQPage");
    expect(faqSchema.mainEntity[0].name).toBe(screen.getByText("What happens?").textContent);
    expect(faqSchema.mainEntity[0].acceptedAnswer.text).toBe(screen.getByText("We work together.").textContent);
  });
});
