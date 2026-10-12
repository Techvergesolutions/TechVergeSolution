import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { ServiceConfig } from "@/data/services";

interface ServiceHowItWorksProps {
  howItWorks: ServiceConfig["howItWorks"];
}

export function ServiceHowItWorks({ howItWorks }: ServiceHowItWorksProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-muted/20" />
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            How it works
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
            {howItWorks.title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {howItWorks.description}
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-5xl mb-12">
          {howItWorks.steps.map((step, index) => (
            <AnimatedSection key={step.title} delay={index * 0.06}>
              <div className="h-full rounded-2xl border border-border/60 bg-card/40 p-6 md:p-7">
                <span className="font-display text-3xl font-bold text-primary/25 block mb-3">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {howItWorks.technicalCapabilities && howItWorks.technicalCapabilities.length > 0 && (
          <AnimatedSection delay={0.15}>
            <div className="max-w-5xl rounded-2xl border border-border/40 bg-background/40 p-6 md:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                Technical capabilities
              </h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {howItWorks.technicalCapabilities.map((cap) => (
                  <li
                    key={cap}
                    className="text-sm text-muted-foreground leading-relaxed flex gap-2"
                  >
                    <span className="text-primary/70 shrink-0" aria-hidden>
                      ·
                    </span>
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
