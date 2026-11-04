import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, areaServed } from "@/lib/seo/config";
import { articleJsonLd, faqPageJsonLd, organizationJsonLd, serviceJsonLd, visibleFaqs } from "@/lib/seo/schema";

describe("structured data", () => {
  it("uses one organization and website graph with configured countries and no unsupported contact details", () => {
    const graph = organizationJsonLd()["@graph"];
    expect(graph).toHaveLength(2);
    expect(graph[0]).toMatchObject({ "@type": "Organization", "@id": `${absoluteUrl("/")}#organization`, areaServed: areaServed.map((name) => ({ "@type": "Country", name })) });
    expect(graph[1]).toMatchObject({ "@type": "WebSite", "@id": `${absoluteUrl("/")}#website`, publisher: { "@id": `${absoluteUrl("/")}#organization` } });
    expect(graph[0]).not.toHaveProperty("address");
    expect(graph[0]).not.toHaveProperty("telephone");
    expect(graph[0]).not.toHaveProperty("aggregateRating");
    expect(graph[0]).not.toHaveProperty("review");
  });

  it("creates Service and Article markup without inventing missing fields", () => {
    expect(serviceJsonLd({ name: "Example", path: "/services/example" })).toMatchObject({
      "@type": "Service", url: absoluteUrl("/services/example"), provider: { "@id": `${absoluteUrl("/")}#organization` },
    });
    const article = articleJsonLd({ headline: "A post", path: "/blog/a-post", datePublished: "2026-01-01", authorName: "A Person", image: "https://cdn.example/image.jpg" });
    expect(article).toMatchObject({
      "@type": "Article", datePublished: "2026-01-01", dateModified: "2026-01-01", image: "https://cdn.example/image.jpg",
      author: { "@type": "Person", name: "A Person" }, publisher: { "@id": `${absoluteUrl("/")}#organization` },
    });
    expect(articleJsonLd({ headline: "No details", path: "/blog/empty" })).not.toHaveProperty("author");
    expect(articleJsonLd({ headline: "No details", path: "/blog/empty" })).not.toHaveProperty("datePublished");
  });

  it("uses only complete FAQs without changing their text", () => {
    const faqs = visibleFaqs([{ question: " Question? ", answer: " Exact answer. " }, { question: " ", answer: "No" }, null]);
    expect(faqs).toEqual([{ question: " Question? ", answer: " Exact answer. " }]);
    expect(faqPageJsonLd(faqs)?.mainEntity[0]).toMatchObject({ name: " Question? ", acceptedAnswer: { text: " Exact answer. " } });
    expect(faqPageJsonLd([])).toBeNull();
  });

  it("escapes script-closing characters in JSON-LD", () => {
    const { container } = render(<JsonLd data={{ text: "</script><img src=x>" }} />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(script.textContent).not.toContain("<");
    expect(JSON.parse(script.textContent!)).toEqual({ text: "</script><img src=x>" });
  });
});
