import { describe, expect, it } from "vitest";
import {
  AREA_SERVED_COUNTRIES,
  DEFAULT_BLOG_AUTHOR,
  ORG_DESCRIPTION,
  ORG_SCHEMA_NAME,
  SOCIAL_PROFILES,
  organizationSameAs,
} from "@/data/organizationProfiles";
import {
  ORGANIZATION_ID,
  absoluteUrl,
  blogPostingJsonLd,
  breadcrumbJsonLd,
  composeJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  serviceJsonLd,
} from "@/lib/seo";
import { getServiceBySlug } from "@/data/services";
import { getCompiledBlogPosts } from "@/data/blog";

describe("organization JSON-LD", () => {
  it("includes Organization, WebSite, description, contactPoint, areaServed, sameAs", () => {
    const graph = organizationJsonLd();
    expect(graph["@context"]).toBe("https://schema.org");
    const types = graph["@graph"].flatMap((n) =>
      Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]],
    );
    expect(types).toEqual(
      expect.arrayContaining(["Organization", "LocalBusiness", "WebSite", "ProfessionalService"]),
    );

    const org = graph["@graph"].find((n) => {
      const t = Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]];
      return t.includes("Organization");
    })!;
    expect(org.name).toBe(ORG_SCHEMA_NAME);
    expect(org.url).toBe("https://www.techvergesolution.com/");
    expect(org.description).toBe(ORG_DESCRIPTION);
    expect(org["@id"]).toBe(ORGANIZATION_ID);
    expect((org.logo as { url: string }).url).toContain("/Logo.svg");
    expect(org.address).toMatchObject({
      streetAddress: "1209 Mountain Rd Pl NE #5036",
      addressLocality: "Albuquerque",
      addressRegion: "NM",
      postalCode: "87110",
      addressCountry: "US",
    });
    expect(org.location).toMatchObject({
      "@type": "Place",
      name: "Secondary office",
      address: {
        addressLocality: "Lahore",
        addressRegion: "Punjab",
        addressCountry: "PK",
      },
    });
    expect(org["@type"]).toEqual(expect.arrayContaining(["Organization", "LocalBusiness"]));
    const contactPoints = Array.isArray(org.contactPoint)
      ? org.contactPoint
      : [org.contactPoint];
    expect(contactPoints.length).toBeGreaterThanOrEqual(2);
    expect(contactPoints[0]).toMatchObject({
      "@type": "ContactPoint",
      contactType: "sales",
      email: "info@techvergesolution.com",
      telephone: "+15055231081",
    });
    expect(contactPoints.some((p) => p.telephone === "+923240049330")).toBe(true);
    expect(org.telephone).toBe("+15055231081");
    expect(org.priceRange).toBe("Starting at $299 USD");
    expect(
      (org.areaServed as { name: string }[]).map((c) => c.name),
    ).toEqual([...AREA_SERVED_COUNTRIES]);
    expect(org.sameAs).toEqual(organizationSameAs());
    expect(organizationSameAs()).toContain(SOCIAL_PROFILES.linkedin);
    expect(organizationSameAs()).toContain(SOCIAL_PROFILES.trustpilot);
    expect(organizationSameAs().some((u) => u.includes("PLACEHOLDER"))).toBe(
      false,
    );

    const site = graph["@graph"].find((n) => n["@type"] === "WebSite")!;
    expect(site.publisher).toEqual({ "@id": ORGANIZATION_ID });
  });
});

describe("Service / FAQ / Breadcrumb JSON-LD", () => {
  it("matches visible service H1 and FAQ copy", () => {
    const service = getServiceBySlug("ai-voice-agents")!;
    const block = serviceJsonLd({
      name: service.headline,
      description: service.metaDescription,
      path: `/services/${service.slug}`,
      serviceType: service.eyebrow,
    });
    expect(block["@type"]).toBe("Service");
    expect(block.name).toBe(service.headline);
    expect(block.description).toBe(service.metaDescription);
    expect(block.serviceType).toBe(service.eyebrow);

    const faq = faqPageJsonLd(service.faq)!;
    expect(faq["@type"]).toBe("FAQPage");
    expect(faq.mainEntity).toHaveLength(service.faq.length);
    expect(faq.mainEntity[0].name).toBe(service.faq[0].question);
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe(service.faq[0].answer);

    const crumbs = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.eyebrow, path: `/services/${service.slug}` },
    ]);
    expect(crumbs["@type"]).toBe("BreadcrumbList");
    expect(crumbs.itemListElement).toHaveLength(3);
  });

  it("omits FAQPage when there are no questions", () => {
    expect(faqPageJsonLd([])).toBeNull();
  });
});

describe("BlogPosting JSON-LD", () => {
  it("uses Person author with url and matches compiled post fields", () => {
    const post = getCompiledBlogPosts()[0];
    expect(post).toBeTruthy();
    const path = `/blog/${post.slug}`;
    const block = blogPostingJsonLd({
      title: post.title,
      description: post.description,
      path,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      imagePath: post.featuredImage.src,
      imageAlt: post.featuredImage.alt,
      authorName: post.author || DEFAULT_BLOG_AUTHOR.name,
      authorPath: DEFAULT_BLOG_AUTHOR.path,
    });

    expect(block["@type"]).toBe("BlogPosting");
    expect(block.headline).toBe(post.title);
    expect(block.description).toBe(post.description);
    expect(block.datePublished).toBe(post.datePublished);
    expect(block.dateModified).toBe(post.dateModified);
    expect(block.author).toEqual({
      "@type": "Person",
      name: post.author || DEFAULT_BLOG_AUTHOR.name,
      url: absoluteUrl(DEFAULT_BLOG_AUTHOR.path),
    });
    expect(block.publisher["@id"]).toBe(ORGANIZATION_ID);
    expect(block.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": absoluteUrl(path),
    });
  });
});

describe("composeJsonLd", () => {
  it("drops nullish blocks", () => {
    const out = composeJsonLd(
      organizationJsonLd(),
      faqPageJsonLd([]),
      null,
      breadcrumbJsonLd([{ name: "Home", path: "/" }]),
    );
    expect(out).toHaveLength(2);
    expect(out[0]["@graph"]).toBeTruthy();
    expect(out[1]["@type"]).toBe("BreadcrumbList");
  });
});
