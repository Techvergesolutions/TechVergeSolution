import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { ServiceConfig } from "@/data/services";

interface ServiceProcessProps {
  process: ServiceConfig["process"];
}

export function ServiceProcess({ process }: ServiceProcessProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
            {process.title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {process.description}
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-6xl">
          {process.steps.map((step, index) => (
            <AnimatedSection key={step.title} delay={index * 0.06}>
              <div className="h-full rounded-2xl border border-border/60 bg-card/40 p-6 md:p-7">
                <span className="font-display text-4xl font-bold text-primary/20 block mb-4">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
