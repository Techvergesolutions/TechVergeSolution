import { Link } from "react-router-dom";
import {
  MessageSquareReply,
  PhoneCall,
  Network,
  AppWindow,
  ArrowRight,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { servicePath } from "@/data/services";

const features = [
  {
    icon: MessageSquareReply,
    title: "Faster Lead Follow-Up",
    outcome:
      "Respond to new enquiries quickly, qualify interest, and route ready opportunities so leads don't go cold.",
    href: servicePath("ai-automation"),
  },
  {
    icon: PhoneCall,
    title: "Inbound Voice Agents",
    outcome:
      "Handle common calls, qualify callers, and help schedule — with clear handoffs when a person should take over.",
    href: servicePath("ai-voice-agents"),
  },
  {
    icon: Network,
    title: "Process Automation",
    outcome:
      "Connect forms, CRM, email, calendars, and internal tools so work moves without copy-paste and chase-downs.",
    href: servicePath("business-automation"),
  },
  {
    icon: AppWindow,
    title: "AI SaaS & Custom Software",
    outcome:
      "Build purpose-built applications and internal tools around how your team actually sells, operates, and serves customers.",
    href: servicePath("ai-saas-development"),
  },
];

export function ServicesCoreFeatures() {
  return (
    <section id="core-features" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-muted/20" />
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Core features
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">
            Outcomes We Build Toward
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Custom AI automation and software services for US businesses — designed around your
            workflow, not a one-size product.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 0.08}>
              <Link
                to={feature.href}
                className="group block h-full rounded-2xl border border-border/60 bg-card/40 p-7 md:p-8 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-5">
                  {feature.outcome}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Explore this service
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
