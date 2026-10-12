import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { Seo } from "@/components/Seo";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { pageSeo } from "@/lib/seo";
import { servicePath } from "@/data/services";

const serviceLinks = [
  { name: "AI Lead Follow-Up", to: servicePath("ai-automation") },
  { name: "AI Voice Agents", to: servicePath("ai-voice-agents") },
  { name: "Business Automation", to: servicePath("business-automation") },
  { name: "AI SaaS Development", to: servicePath("ai-saas-development") },
];

const Portfolio = () => {
  const seo = pageSeo.portfolio;
  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <section className="relative pt-32 pb-4 md:pt-40 md:pb-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            <div className="section-container relative z-10">
              <AnimatedSection className="max-w-3xl mx-auto text-center">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                  Portfolio
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Work That Solves Real Operational Problems
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                  Browse selected projects by the problem we solved, what we built, and how it fits
                  the client&apos;s workflow.
                </p>
                <p className="text-sm text-muted-foreground">
                  Looking for how we engage? See{" "}
                  <Link
                    to="/services"
                    className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                  >
                    services
                  </Link>
                  .
                </p>
              </AnimatedSection>
            </div>
          </section>
          <PortfolioSection showAllByDefault hidePageHeader />

          <section className="relative py-12 md:py-16 overflow-hidden border-t border-border/40">
            <div className="section-container relative z-10">
              <AnimatedSection className="max-w-4xl mx-auto">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 text-center">
                  Services Behind This Work
                </h2>
                <p className="text-muted-foreground text-sm md:text-base text-center mb-8 max-w-2xl mx-auto">
                  Custom builds across lead follow-up, voice agents, process automation, and
                  software — explored in more depth on each service page.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="group flex items-center justify-between rounded-xl border border-border/60 bg-card/30 px-5 py-4 hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span className="font-medium text-foreground text-sm md:text-base">
                        {link.name}
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </section>

          <FinalCtaSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Portfolio;
