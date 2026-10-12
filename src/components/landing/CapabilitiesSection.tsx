import { AnimatedSection } from "../ui/AnimatedSection";
import { Bot, Phone, Workflow, Boxes, Code2 } from "lucide-react";

const capabilities = [
  {
    icon: Bot,
    label: "AI Automation",
    blurb: "Custom workflows that respond, qualify, and follow up without manual busywork.",
  },
  {
    icon: Phone,
    label: "AI Voice Agents",
    blurb: "Inbound call handling built around your scripts, hours, and handoff rules.",
  },
  {
    icon: Workflow,
    label: "Business Automation",
    blurb: "Connect forms, CRM, email, calendars, and internal tools into one flow.",
  },
  {
    icon: Boxes,
    label: "AI SaaS",
    blurb: "Purpose-built AI applications tailored to how your team actually works.",
  },
  {
    icon: Code2,
    label: "Custom Software",
    blurb: "Internal tools and customer-facing systems designed around your process.",
  },
];

export const CapabilitiesSection = () => {
  return (
    <section id="capabilities" className="relative py-16 md:py-20 border-y border-border/40">
      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-10 md:mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            What We Build
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Custom-built services — not a packaged product. We design and implement the automation
            stack your business needs.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {capabilities.map((item, index) => (
            <AnimatedSection key={item.label} delay={index * 0.05}>
              <div className="h-full rounded-xl border border-border/60 bg-card/40 px-5 py-6 text-center sm:text-left hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2 text-sm md:text-base">
                  {item.label}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {item.blurb}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
