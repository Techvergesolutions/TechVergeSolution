import { AnimatedSection } from "../ui/AnimatedSection";
import { Clock, PhoneMissed, GitBranch, Repeat, ArrowRight } from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    title: "Slow responses",
    text: "Leads cool off while someone is busy, offline, or stuck in another tool.",
  },
  {
    icon: Repeat,
    title: "Manual follow-ups",
    text: "Qualification and reminders depend on memory, spreadsheets, and luck.",
  },
  {
    icon: GitBranch,
    title: "Disconnected systems",
    text: "Forms, CRM, calendars, and messaging don't share the same pipeline.",
  },
  {
    icon: PhoneMissed,
    title: "Missed calls & admin work",
    text: "Inbound volume and repetitive tasks pull your team away from closing.",
  },
];

const workflowSteps = [
  "Lead",
  "AI Response",
  "Qualification",
  "Appointment / Next Action",
  "CRM",
  "Follow-up",
];

export const ProblemSection = () => {
  return (
    <section id="problem" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-15" />

      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-14 md:mb-16 max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            Your Business Has Leads. What Happens Next?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Most revenue leaks aren't a marketing problem — they're a response and follow-up
            problem. Leads get lost to slow replies, manual chasing, missed calls, and systems that
            don't talk to each other.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
          {painPoints.map((point, index) => (
            <AnimatedSection key={point.title} delay={index * 0.08}>
              <div className="h-full rounded-xl border border-border/60 bg-card/30 p-6">
                <point.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-2">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.text}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.15}>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                  Conceptual workflow
                </p>
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                  How we design lead-to-follow-up automation
                </h3>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                An example flow TechVerge designs and builds for your business — not a packaged
                product you buy off the shelf.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-2">
              {workflowSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-2 lg:gap-2 flex-1 min-w-0">
                  <div className="flex-1 rounded-lg border border-primary/20 bg-primary/5 px-3 py-3 text-center">
                    <span className="text-xs font-mono text-primary/70 block mb-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium text-foreground leading-snug">{step}</span>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <ArrowRight className="hidden lg:block w-4 h-4 text-muted-foreground/50 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
