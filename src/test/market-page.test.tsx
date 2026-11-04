import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MarketPage from "@/pages/MarketPage";

const state = vi.hoisted(() => ({ page: {
  _id: "market-1", title: "Specific market guide", slug: "specific-market", summary: "A unique introduction",
  body: [{ _type: "block", _key: "block", style: "normal", markDefs: [], children: [{ _type: "span", _key: "span", text: "Market-specific content", marks: [] }] }],
  seo: null, testimonials: [{ _key: "real", quote: "A real quote", name: "A client", role: "Director" }, { _key: "incomplete", quote: "Incomplete", name: null, role: null }],
} }));
vi.mock("@tanstack/react-query", () => ({ useQuery: () => ({ data: state.page, isLoading: false, isError: false }) }));
vi.mock("@/components/landing/Navbar", () => ({ Navbar: () => null }));
vi.mock("@/components/landing/Footer", () => ({ Footer: () => null }));
vi.mock("@/components/Seo", () => ({ Seo: () => null }));

describe("market pages", () => {
  it("renders unique Sanity content, one heading, and only complete testimonials", () => {
    render(<MemoryRouter initialEntries={["/markets/specific-market"]}><Routes><Route path="/markets/:slug" element={<MarketPage />} /></Routes></MemoryRouter>);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText("Market-specific content")).toBeInTheDocument();
    expect(screen.getByText("A real quote")).toBeInTheDocument();
    expect(screen.queryByText("Incomplete")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute("href", "/contact");
  });
});
