import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { ServiceConfig } from "@/data/services";

interface ServiceProblemProps {
  problem: ServiceConfig["problem"];
}

export function ServiceProblem({ problem }: ServiceProblemProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-muted/20" />
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-6xl mx-auto items-start">
          <AnimatedSection>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
              The problem
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
              {problem.title}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {problem.description}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <ul className="space-y-4">
              {problem.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-xl border border-border/60 bg-card/40 p-4 md:p-5"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span className="text-sm md:text-base text-foreground/90 leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
