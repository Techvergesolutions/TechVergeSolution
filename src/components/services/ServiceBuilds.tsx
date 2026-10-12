import { Check } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { ServiceConfig } from "@/data/services";

interface ServiceBuildsProps {
  builds: ServiceConfig["builds"];
}

export function ServiceBuilds({ builds }: ServiceBuildsProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            What we build
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
            {builds.title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {builds.description}
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5 max-w-5xl">
          {builds.items.map((item, index) => (
            <AnimatedSection key={item} delay={index * 0.06}>
              <div className="group h-full rounded-2xl border border-border/60 bg-card/40 p-6 md:p-7 hover:border-primary/30 transition-colors">
                <div className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" aria-hidden />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-medium block mb-2">
                      Outcome {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-foreground/90 text-sm md:text-base leading-relaxed font-medium">
                      {item}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
