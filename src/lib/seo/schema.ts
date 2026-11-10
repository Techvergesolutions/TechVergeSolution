/**
 * Runtime JSON-LD helpers used by pages and server routes.
 * Canonical graph builders live in `@/lib/seo`.
 */
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  serviceJsonLd,
} from "../seo";

export {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  serviceJsonLd,
};

export type FaqEntry = { question: string; answer: string };

export function visibleFaqs(
  faqs: ReadonlyArray<{ question?: string | null; answer?: string | null } | null> | null | undefined,
): FaqEntry[] {
  return (faqs ?? []).flatMap((faq) =>
    faq?.question?.trim() && faq.answer?.trim() ? [{ question: faq.question, answer: faq.answer }] : [],
  );
}

/** BlogPosting JSON-LD (Schema.org) for articles — prefer over legacy Article type. */
export function articleJsonLd(input: {
  headline: string;
  path: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
  description?: string | null;
}) {
  const datePublished = input.datePublished?.trim();
  const dateModified = input.dateModified?.trim() || datePublished;
  return blogPostingJsonLd({
    title: input.headline,
    description: input.description?.trim() || input.headline,
    path: input.path,
    datePublished: datePublished || "",
    dateModified: dateModified || datePublished || "",
    imagePath: input.image?.trim() || "/og-image.webp",
    authorName: input.authorName?.trim() || undefined,
  });
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
