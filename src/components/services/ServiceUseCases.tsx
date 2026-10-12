import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { ServiceConfig } from "@/data/services";

interface ServiceUseCasesProps {
  useCases: ServiceConfig["useCases"];
}

export function ServiceUseCases({ useCases }: ServiceUseCasesProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Use cases
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            {useCases.title}
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl">
          {useCases.items.map((item, index) => (
            <AnimatedSection key={item.title} delay={index * 0.06}>
              <article className="h-full rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8">
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
