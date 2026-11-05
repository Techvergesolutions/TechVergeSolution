import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { ServiceConfig } from "@/data/services";

interface ServiceIntegrationsProps {
  integrations: ServiceConfig["integrations"];
}

export function ServiceIntegrations({ integrations }: ServiceIntegrationsProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-muted/20" />
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Integrations
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
            {integrations.title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {integrations.description}
          </p>
        </AnimatedSection>

        <div className="flex flex-wrap gap-3 max-w-5xl">
          {integrations.items.map((item, index) => (
            <AnimatedSection key={item} delay={index * 0.04}>
              <span className="inline-block rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm text-foreground/90">
                {item}
              </span>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
