import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

const DEFAULT_BADGES = [
  "Next.js",
  "AI Integration",
  "Node.js",
  "Supabase",
] as const;

interface TechStackBadgesProps {
  /** Extra capability labels from a service config (tools / techniques, not product names). */
  capabilities?: string[];
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  /** Soft muted band behind the section. */
  muted?: boolean;
}

export function TechStackBadges({
  capabilities,
  eyebrow = "Capabilities we work with",
  title = "Modern Stack, Custom Delivery",
  description = "We use proven technologies when they fit your project — chosen for reliability and maintainability, not as a packaged TechVerge product.",
  className,
  muted = false,
}: TechStackBadgesProps) {
  const badges = [...DEFAULT_BADGES];
  const extras = (capabilities ?? []).filter(
    (cap) => !badges.some((b) => b.toLowerCase() === cap.toLowerCase())
  );

  return (
    <section
      className={cn("relative py-16 md:py-20 overflow-hidden", className)}
    >
      {muted && <div className="absolute inset-0 bg-muted/20" />}
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-10 md:mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            {eyebrow}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {description}
          </p>
        </AnimatedSection>

        <div className="flex flex-wrap gap-3 max-w-5xl mb-8">
          {badges.map((badge, index) => (
            <AnimatedSection key={badge} delay={index * 0.04}>
              <span className="inline-flex items-center rounded-xl border border-primary/25 bg-primary/5 px-4 py-2.5 text-sm font-medium text-foreground">
                {badge}
              </span>
            </AnimatedSection>
          ))}
        </div>

        {extras.length > 0 && (
          <AnimatedSection delay={0.12}>
            <div className="max-w-5xl rounded-2xl border border-border/40 bg-background/40 p-6 md:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                Relevant technical capabilities
              </h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {extras.map((cap) => (
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

export { DEFAULT_BADGES as TECH_STACK_DEFAULT_BADGES };
