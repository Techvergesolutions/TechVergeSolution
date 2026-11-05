import { AnimatedSection } from "../ui/AnimatedSection";

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Map existing workflow and identify bottlenecks.",
  },
  {
    number: "02",
    title: "Design",
    description: "Design automation and human/AI handoffs.",
  },
  {
    number: "03",
    title: "Build",
    description: "Integrate required systems.",
  },
  {
    number: "04",
    title: "Optimize",
    description: "Monitor, improve and expand the workflow.",
  },
];

export const ProcessSection = () => {
  return (
    <section id="process" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-muted/20" />

      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-14 md:mb-16 max-w-3xl mx-auto">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Process
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            From Problem To Automation
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            A clear path from how work happens today to a workflow your team can run and trust.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <AnimatedSection key={step.number} delay={index * 0.08}>
              <div className="relative h-full rounded-2xl border border-border/60 bg-card/40 p-6 md:p-7">
                <span className="font-display text-4xl font-bold text-primary/20 block mb-4">
                  {step.number}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
