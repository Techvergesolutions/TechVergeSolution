import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogFigure } from "@/components/blog/BlogFigure";

describe("Sanity blog images", () => {
  it("serves responsive, compressed images while preserving crop and alt text", () => {
    render(<BlogFigure src="https://cdn.sanity.io/images/project/production/photo-1800x1200.jpg?rect=0%2C0%2C1800%2C1200&w=1200&h=800&q=85" alt="A customer working" width={1200} height={800} />);
    const image = screen.getByRole("img", { name: "A customer working" });
    const source = new URL(image.getAttribute("src")!);
    expect(source.searchParams.get("auto")).toBe("format");
    expect(source.searchParams.get("q")).toBe("75");
    expect(source.searchParams.get("rect")).toBe("0,0,1800,1200");
    const variants = image.getAttribute("srcset")!.split(", ").map((entry) => {
      const [url, descriptor] = entry.split(" ");
      return { url: new URL(url), descriptor };
    });
    expect(variants.map((item) => item.descriptor)).toEqual(["320w", "480w", "640w", "768w", "960w", "1200w"]);
    expect(variants[1].url.searchParams.get("h")).toBe("320");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("sizes", "(min-width: 768px) 720px, calc(100vw - 48px)");
  });

  it("prioritizes the post hero and leaves local assets unchanged", () => {
    render(<BlogFigure src="/images/local.webp" alt="Featured image" width={1400} height={934} priority />);
    const image = screen.getByRole("img", { name: "Featured image" });
    expect(image).toHaveAttribute("src", "/images/local.webp");
    expect(image).not.toHaveAttribute("srcset");
    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("fetchpriority", "high");
  });
});
