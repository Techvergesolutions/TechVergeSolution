import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { JsonLd } from "@/components/JsonLd";
import { ORG_SCHEMA_NAME } from "@/data/organizationProfiles";
import { absoluteUrl } from "@/lib/seo/config";
import { articleJsonLd, faqPageJsonLd, organizationJsonLd, serviceJsonLd, visibleFaqs } from "@/lib/seo/schema";

describe("structured data", () => {
  it("uses Organization, LocalBusiness, WebSite, and ProfessionalService on the home graph", () => {
    const graph = organizationJsonLd()["@graph"];
    const types = graph.flatMap((node) =>
      Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]],
    );
    expect(types).toEqual(
      expect.arrayContaining(["Organization", "LocalBusiness", "WebSite", "ProfessionalService"]),
    );
    const org = graph.find((n) => n["@id"] === `${absoluteUrl("/")}#organization`)!;
    expect(org).toMatchObject({
      name: ORG_SCHEMA_NAME,
      "@id": `${absoluteUrl("/")}#organization`,
    });
    expect(org.address).toMatchObject({ addressLocality: "Lahore", addressCountry: "PK" });
    expect(org).not.toHaveProperty("aggregateRating");
    expect(org).not.toHaveProperty("review");
  });

  it("creates Service and BlogPosting markup without inventing missing fields", () => {
    expect(serviceJsonLd({ name: "Example", description: "Desc", path: "/services/example" })).toMatchObject({
      "@type": "Service",
      url: absoluteUrl("/services/example"),
      provider: { "@id": `${absoluteUrl("/")}#organization` },
    });
    const article = articleJsonLd({
      headline: "A post",
      description: "Summary",
      path: "/blog/a-post",
      datePublished: "2026-01-01",
      authorName: "A Person",
      image: "https://cdn.example/image.jpg",
    });
    expect(article).toMatchObject({
      "@type": "BlogPosting",
      datePublished: "2026-01-01",
      dateModified: "2026-01-01",
      author: { "@type": "Person", name: "A Person" },
      publisher: { "@id": `${absoluteUrl("/")}#organization` },
    });
    expect(articleJsonLd({ headline: "No details", path: "/blog/empty", description: "x" })).not.toHaveProperty(
      "datePublished",
    );
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
