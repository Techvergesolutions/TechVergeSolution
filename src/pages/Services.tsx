import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { MarketsServed } from "@/components/landing/MarketsServed";
import { Seo } from "@/components/Seo";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BookingCta } from "@/components/cta/BookingCta";
import { WorkflowAuditCta } from "@/components/cta/WorkflowAuditCta";
import { ServicesCoreFeatures } from "@/components/services/ServicesCoreFeatures";
import { TechStackBadges } from "@/components/services/TechStackBadges";
import { CaseStudiesSummary } from "@/components/services/CaseStudiesSummary";
import { pageSeo } from "@/lib/seo";

const Services = () => {
  const seo = pageSeo.services;
  const hubCtaParams = { placement: "services_hub" as const };

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          {/* 1. Hero */}
          <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="section-container relative z-10">
              <AnimatedSection className="max-w-3xl mx-auto text-center">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                  Services
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Custom AI Automation &amp; Software for US Businesses
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
                  We design and implement lead follow-up, voice agents, process automation, and
                  custom AI software around your workflow — not a packaged platform you configure
                  yourself.
                </p>
                <div className="mb-8">
                  <MarketsServed compact />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <BookingCta
                    showArrow
                    eventName="service_cta_click"
                    eventParams={{ ...hubCtaParams, cta: "strategy", section: "hero" }}
                    className="px-7 py-3.5 rounded-xl text-primary-foreground font-semibold w-full sm:w-auto"
                  />
                  <WorkflowAuditCta
                    eventName="service_cta_click"
                    eventParams={{ ...hubCtaParams, cta: "audit", section: "hero" }}
                    className="px-7 py-3.5 rounded-xl text-foreground font-semibold w-full sm:w-auto"
                  />
                </div>
              </AnimatedSection>
            </div>
          </section>

          {/* 2. Core Features → /services/:slug */}
          <ServicesCoreFeatures />

          {/* 3. Tech Stack badges */}
          <TechStackBadges
            title="Tools We Use When Building"
            description="Next.js, AI integrations, Node.js, Supabase, and more — selected as implementation tools for your custom build, not as TechVerge product names."
          />

          {/* 4. Case Studies summary */}
          <CaseStudiesSummary
            limit={4}
            title="Work We've Shipped"
            description="Selected projects with factual outcomes — no invented metrics. Explore the portfolio for problem, solution, and delivery detail."
          />

          {/* 5. CTA → /contact */}
          <section className="relative py-20 md:py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
            <div className="section-container relative z-10">
              <AnimatedSection>
                <div className="max-w-3xl mx-auto text-center rounded-2xl border border-border/60 bg-card/40 px-6 py-12 md:px-12 md:py-16">
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
                    Ready to Map What You Can Automate?
                  </h2>
                  <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                    Tell us how leads, calls, and operations work today. We&apos;ll outline where
                    custom automation or software can help — and where people should stay in the
                    loop.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <BookingCta
                      showArrow
                      eventName="service_cta_click"
                      eventParams={{ ...hubCtaParams, cta: "strategy", section: "footer_cta" }}
                      className="px-8 py-4 rounded-xl text-primary-foreground font-semibold w-full sm:w-auto"
                    />
                    <WorkflowAuditCta
                      eventName="service_cta_click"
                      eventParams={{ ...hubCtaParams, cta: "audit", section: "footer_cta" }}
                      className="px-8 py-4 rounded-xl text-foreground font-semibold w-full sm:w-auto"
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Services;
