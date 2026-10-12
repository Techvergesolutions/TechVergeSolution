import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { ServiceConfig } from "@/data/services";

interface ServiceWhoForProps {
  whoFor: ServiceConfig["whoFor"];
}

export function ServiceWhoFor({ whoFor }: ServiceWhoForProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-muted/20" />
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Who it is for
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
            {whoFor.title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {whoFor.description}
          </p>
        </AnimatedSection>

        <ul className="grid sm:grid-cols-2 gap-4 md:gap-5 max-w-5xl">
          {whoFor.items.map((item, index) => (
            <AnimatedSection key={item} delay={index * 0.06}>
              <li className="h-full rounded-2xl border border-border/60 bg-card/40 p-6 flex gap-3">
                <span
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary"
                  aria-hidden
                />
                <span className="text-sm md:text-base text-foreground/90 leading-relaxed">
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
