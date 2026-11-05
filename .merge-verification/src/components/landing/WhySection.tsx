import { AnimatedSection } from "../ui/AnimatedSection";
import { Plug, Zap, UsersRound, Layers } from "lucide-react";

const reasons = [
  {
    icon: Plug,
    title: "Integration-first",
    description:
      "We start from the tools you already use — CRM, forms, calendars, email, and internal systems — then connect the gaps.",
  },
  {
    icon: Zap,
    title: "Automation-first",
    description:
      "Repetitive response, qualification, and follow-up work is designed to run reliably so your team focuses on decisions that need people.",
  },
  {
    icon: UsersRound,
    title: "Human + AI",
    description:
      "AI handles the repeatable steps; humans stay in control for judgment, exceptions, and customer-critical moments.",
  },
  {
    icon: Layers,
    title: "Scalable architecture",
    description:
      "Workflows and software are built so you can expand channels, volume, and features without starting over.",
  },
];

export const WhySection = () => {
  return (
    <section id="why" className="relative py-24 md:py-32 overflow-hidden">
      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-14 md:mb-16 max-w-3xl mx-auto">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Why TechVerge
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            How We Approach Automation
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Concrete working principles — not slogans. We build custom automation and software that
            fit the way your business actually operates.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <AnimatedSection key={reason.title} delay={index * 0.08}>
              <div className="h-full rounded-2xl border border-border/60 bg-card/30 p-7 md:p-8">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5">
                  <reason.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
