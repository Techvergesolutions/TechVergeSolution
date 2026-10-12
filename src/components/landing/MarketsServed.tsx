import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface MarketsServedProps {
  /** Compact note under a page intro; default is a full section block. */
  compact?: boolean;
}

/**
 * Markets served remotely — no local-office claims.
 */
export function MarketsServed({ compact = false }: MarketsServedProps) {
  if (compact) {
    return (
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
        <span className="text-foreground/90 font-medium">Markets we serve: </span>
        United States (primary), United Kingdom, UAE, and Saudi Arabia — remotely,
        without claiming local offices in those markets.
      </p>
    );
  }

  return (
    <section className="relative py-12 md:py-16 overflow-hidden border-y border-border/40">
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-xl md:text-2xl font-bold mb-3">
            Markets We Serve
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            We primarily work with US businesses and also support clients in the United
            Kingdom, UAE, and Saudi Arabia. Engagements are delivered remotely — we do not
            claim brick-and-mortar offices in those markets.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
