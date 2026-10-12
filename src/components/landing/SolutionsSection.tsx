import { Link } from "react-router-dom";
import { AnimatedSection } from "../ui/AnimatedSection";
import { BookingCta } from "@/components/cta/BookingCta";
import { WorkflowAuditCta } from "@/components/cta/WorkflowAuditCta";
import { servicePath } from "@/data/services";
import { MessageSquareReply, PhoneCall, Network, AppWindow, ArrowRight } from "lucide-react";

const solutions = [
  {
    icon: MessageSquareReply,
    title: "AI Lead Follow-Up Automation",
    description:
      "Respond to new enquiries quickly and automate qualification and follow-up so leads don't sit unanswered.",
    href: servicePath("ai-automation"),
  },
  {
    icon: PhoneCall,
    title: "AI Voice Agents",
    description:
      "Handle common inbound calls, qualify callers, and help schedule appointments with clear human handoffs.",
    href: servicePath("ai-voice-agents"),
  },
  {
    icon: Network,
    title: "Business Process Automation",
    description:
      "Connect forms, CRM, email, calendars, and internal systems so work moves without copy-paste.",
    href: servicePath("business-automation"),
  },
  {
    icon: AppWindow,
    title: "AI SaaS & Custom Software",
    description:
      "Build custom AI-powered applications and internal business tools around your exact workflows.",
    href: servicePath("ai-saas-development"),
  },
];

export const SolutionsSection = () => {
  return (
    <section id="solutions" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-muted/20" />

      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-14 md:mb-16 max-w-3xl mx-auto">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Solutions
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            What We Build For You
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Practical automation services designed around your leads, calls, and operations — not a
            one-size-fits-all product.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {solutions.map((solution, index) => (
            <AnimatedSection key={solution.title} delay={index * 0.08}>
              <Link
                to={solution.href}
                className="group block h-full rounded-2xl border border-border/60 bg-card/40 p-7 md:p-8 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <solution.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
                  {solution.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-12 md:mt-14">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <BookingCta
              showArrow
              className="px-8 py-4 rounded-xl text-primary-foreground font-semibold w-full sm:w-auto"
            />
            <WorkflowAuditCta className="px-8 py-4 rounded-xl text-foreground font-semibold w-full sm:w-auto" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
