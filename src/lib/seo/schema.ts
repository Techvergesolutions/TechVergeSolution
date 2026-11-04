import { absoluteUrl, areaServed, defaultDescription, organization, siteName } from "./config.ts";

const organizationId = `${absoluteUrl("/")}#organization`;
const websiteId = `${absoluteUrl("/")}#website`;
const servedCountries = () => areaServed.map((name) => ({ "@type": "Country", name }));

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: organization.name,
        url: absoluteUrl("/"),
        ...(organization.logo ? { logo: organization.logo } : {}),
        ...(organization.email ? { email: organization.email } : {}),
        ...(organization.sameAs.length ? { sameAs: organization.sameAs } : {}),
        areaServed: servedCountries(),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: absoluteUrl("/"),
        name: siteName,
        description: defaultDescription,
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export function serviceJsonLd(input: { name: string; description?: string | null; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    ...(input.description?.trim() ? { description: input.description } : {}),
    url: absoluteUrl(input.path),
    provider: { "@id": organizationId },
    areaServed: servedCountries(),
  };
}

export type FaqEntry = { question: string; answer: string };
export function visibleFaqs(faqs: ReadonlyArray<{ question?: string | null; answer?: string | null } | null> | null | undefined): FaqEntry[] {
  return (faqs ?? []).flatMap((faq) =>
    faq?.question?.trim() && faq.answer?.trim() ? [{ question: faq.question, answer: faq.answer }] : [],
  );
}

export function faqPageJsonLd(faqs: FaqEntry[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question", name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function articleJsonLd(input: {
  headline: string;
  path: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
}) {
  const url = absoluteUrl(input.path);
  const dateModified = input.dateModified || input.datePublished;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(input.authorName?.trim() ? { author: { "@type": "Person", name: input.authorName.trim() } } : {}),
    publisher: { "@id": organizationId },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
