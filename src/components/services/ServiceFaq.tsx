import { AnimatedSection } from "@/components/ui/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ServiceConfig } from "@/data/services";

interface ServiceFaqProps {
  faq: ServiceConfig["faq"];
}

export function ServiceFaq({ faq }: ServiceFaqProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-10 md:mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            FAQ
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Common Questions
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.08} className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`item-${index}`}
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
        </AnimatedSection>
      </div>
    </section>
  );
}
