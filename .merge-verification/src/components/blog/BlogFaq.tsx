import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { BlogFaq as BlogFaqItem } from "@/data/blog";

interface BlogFaqProps {
  faq: BlogFaqItem[];
}

/** Visible FAQ block — keep in sync with FaqPageJsonLd on the same page. */
export function BlogFaq({ faq }: BlogFaqProps) {
  if (!faq.length) return null;

  return (
    <section
      className="pt-10 border-t border-border/50"
      aria-labelledby="blog-faq-heading"
    >
      <h2
        id="blog-faq-heading"
        className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6"
      >
        Frequently asked questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faq.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`faq-${index}`}
            className="border-border/60"
          >
            <AccordionTrigger className="text-left font-display text-base md:text-lg font-semibold text-foreground hover:no-underline hover:text-primary py-5">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
