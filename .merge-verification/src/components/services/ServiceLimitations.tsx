import { ShieldAlert } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { ServiceConfig } from "@/data/services";

interface ServiceLimitationsProps {
  limitations: ServiceConfig["limitations"];
}

export function ServiceLimitations({ limitations }: ServiceLimitationsProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Limitations &amp; handoffs
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
            {limitations.title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {limitations.description}
          </p>
        </AnimatedSection>

        <ul className="space-y-4 max-w-5xl">
          {limitations.items.map((item, index) => (
            <AnimatedSection key={item} delay={index * 0.05}>
              <li className="rounded-2xl border border-border/60 bg-card/30 p-5 md:p-6 flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4 text-primary" aria-hidden />
                </div>
                <p className="text-sm md:text-base text-foreground/90 leading-relaxed pt-1">
                  {item}
                </p>
              </li>
            </AnimatedSection>
          ))}
        </ul>
      </div>
    </section>
  );
}
