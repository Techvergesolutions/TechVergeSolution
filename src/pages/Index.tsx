import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { CapabilitiesSection } from "@/components/landing/CapabilitiesSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionsSection } from "@/components/landing/SolutionsSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { Footer } from "@/components/landing/Footer";
import { RelatedGuidesSection } from "@/components/blog/RelatedGuidesSection";
import { Seo } from "@/components/Seo";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { HOMEPAGE_GUIDE_LINKS } from "@/data/internalLinks";
import { pageSeo } from "@/lib/seo";

const Index = () => {
  const seo = pageSeo.home;
  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <HeroSection />
          <CapabilitiesSection />
          <ProblemSection />
          <SolutionsSection />
          <ProcessSection />

          <section className="relative py-16 md:py-20 overflow-hidden border-y border-border/40">
            <div className="section-container relative z-10">
              <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                {[
                  {
                    title: "Services",
                    description:
                      "Lead follow-up, voice agents, process automation, and custom AI software we design and implement.",
                    to: "/services",
                  },
                  {
                    title: "Selected work",
                    description: "Case studies by problem, solution, and outcome — no invented metrics.",
                    to: "/portfolio",
                  },
                  {
                    title: "Automation guides",
                    description:
                      "Practical writing on AI voice agents, lead follow-up, and n8n workflows.",
                    to: "/blog",
                  },
                ].map((item, index) => (
                  <AnimatedSection key={item.to} delay={index * 0.06}>
                    <Link
                      to={item.to}
                      className="group block h-full rounded-2xl border border-border/60 bg-card/30 p-6 md:p-7 hover:border-primary/40 transition-colors"
                    >
                      <h2 className="font-display text-lg font-bold text-foreground mb-2">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        Explore
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>

          <RelatedGuidesSection
            title="From the TechVerge blog"
            description="Descriptive guides that match what we build — voice agents, lead follow-up automation, and n8n workflows for service businesses."
            links={HOMEPAGE_GUIDE_LINKS}
            muted
          />
          <FinalCtaSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
