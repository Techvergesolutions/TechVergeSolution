import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { COMPANY_TIMELINE, COMPANY_TOOLS } from "@/data/team";

export function AboutToolsTimeline() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden border-y border-border/40">
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
          <AnimatedSection>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
              Tools we use
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Implementation choices, not a locked platform
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
              We pick proven tools when they fit your build. These are delivery options —
              you keep ownership of accounts and workflows wherever practical.
            </p>
            <ul className="flex flex-wrap gap-2">
              {COMPANY_TOOLS.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-border/60 bg-card/40 px-3.5 py-1.5 text-sm text-muted-foreground"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
              Company timeline
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              A short history
            </h2>
            <ol className="space-y-6">
              {COMPANY_TIMELINE.map((item) => (
                <li key={item.year} className="relative pl-6 border-l border-primary/30">
                  <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary" />
                  <p className="text-primary text-sm font-semibold mb-1">{item.year}</p>
                  <h3 className="font-display font-bold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ol>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
