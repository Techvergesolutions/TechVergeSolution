import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AFFILIATION_DISCLAIMER } from "@/data/team";
import {
  ORG_ADDRESS_DISPLAY,
  ORG_SECONDARY_ADDRESS_DISPLAY,
} from "@/data/organizationProfiles";

export function AboutWhoWeAre() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto items-start">
          <AnimatedSection>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
              Who we are
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
              A custom automation and software team
            </h2>
            <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
              <p>
                TechVerge Solution designs and implements{" "}
                <Link
                  to="/services/ai-automation"
                  className="text-primary hover:underline font-medium"
                >
                  AI lead follow-up automation
                </Link>
                ,{" "}
                <Link
                  to="/services/ai-voice-agents"
                  className="text-primary hover:underline font-medium"
                >
                  inbound AI voice agents
                </Link>
                ,{" "}
                <Link
                  to="/services/business-automation"
                  className="text-primary hover:underline font-medium"
                >
                  business process automation
                </Link>
                , and{" "}
                <Link
                  to="/services/ai-saas-development"
                  className="text-primary hover:underline font-medium"
                >
                  custom AI-powered software
                </Link>
                . We are not selling a packaged seat-based product — we build around
                your tools, call types, and handoffs.
              </p>
              <p>
                Our work is practical: faster response to new enquiries, fewer missed
                calls, cleaner CRM updates, and workflows your team can actually own.
                Read how we think about these problems in our{" "}
                <Link to="/blog" className="text-primary hover:underline font-medium">
                  practical automation guides
                </Link>
                , or skim the{" "}
                <Link to="/ai-facts" className="text-primary hover:underline font-medium">
                  plain-language AI facts
                </Link>{" "}
                for timelines, pricing approach, and contact details.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <div className="rounded-2xl border border-border/60 bg-card/30 p-6 md:p-8 space-y-5">
              <div>
                <h3 className="font-display font-bold text-foreground mb-2">
                  Where we operate
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  We primarily serve businesses in the United States, and also work with
                  clients in the United Kingdom and the United Arab Emirates. Head office:{" "}
                  {ORG_ADDRESS_DISPLAY}. Secondary office: {ORG_SECONDARY_ADDRESS_DISPLAY}.
                  Work outside those offices is delivered remotely — we do not claim
                  additional local offices in every city we serve.
                </p>
              </div>
              <div className="pt-4 border-t border-border/50">
                <h3 className="font-display font-bold text-foreground mb-2">
                  Name clarity
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {AFFILIATION_DISCLAIMER}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
