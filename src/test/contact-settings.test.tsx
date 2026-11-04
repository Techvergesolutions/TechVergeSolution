import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactSection } from "@/components/landing/ContactSection";
import type { ReactNode } from "react";

const state = vi.hoisted(() => ({ settings: {
  email: "team@example.org", whatsapp: "+971501234567", bookingUrl: "https://example.org/book",
  availableHours: [{ _key: "hours", hours: "Mon-Fri, 9am-6pm", timezone: "GST" }],
} }));
vi.mock("@/hooks/useContactSettings", () => ({ useContactSettings: () => ({ data: state.settings }) }));
vi.mock("@/components/ui/AnimatedSection", () => ({ AnimatedSection: ({ children }: { children: ReactNode }) => <div>{children}</div> }));

describe("contact settings", () => {
  it("renders published contact details and timezone without inventing conversions", () => {
    render(<ContactSection hidePageHeader />);
    expect(screen.getByRole("link", { name: "team@example.org" })).toHaveAttribute("href", "mailto:team@example.org");
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", "https://wa.me/971501234567");
    expect(screen.getByText("Mon-Fri, 9am-6pm GST")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book/i })).toHaveAttribute("href", "https://example.org/book");
  });
});
