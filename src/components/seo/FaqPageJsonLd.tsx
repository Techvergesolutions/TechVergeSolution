import { faqPageJsonLd } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export interface FaqPageJsonLdProps {
  faq: { question: string; answer: string }[];
}

/** Only emit FAQPage when a visible FAQ section has items. */
export function FaqPageJsonLd({ faq }: FaqPageJsonLdProps) {
  if (!faq.length) return null;
  return <JsonLd data={faqPageJsonLd(faq)} />;
}
