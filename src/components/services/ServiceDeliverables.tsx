import { Package } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { ServiceConfig } from "@/data/services";

interface ServiceDeliverablesProps {
  deliverables: ServiceConfig["deliverables"];
}

export function ServiceDeliverables({ deliverables }: ServiceDeliverablesProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-muted/20" />
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Deliverables
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
            {deliverables.title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {deliverables.description}
          </p>
        </AnimatedSection>

        <ul className="grid sm:grid-cols-2 gap-4 md:gap-5 max-w-5xl">
          {deliverables.items.map((item, index) => (
            <AnimatedSection key={item} delay={index * 0.06}>
              <li className="h-full rounded-2xl border border-border/60 bg-card/40 p-6 flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-secondary" aria-hidden />
                </div>
                <span className="text-sm md:text-base text-foreground/90 leading-relaxed pt-1">
                  {item}
                </span>
              </li>
            </AnimatedSection>
          ))}
        </ul>
      </div>
    </section>
  );
}
