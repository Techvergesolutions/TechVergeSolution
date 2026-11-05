import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Seo } from "@/components/Seo";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BookingCta } from "@/components/cta/BookingCta";
import { AI_FACTS, AI_FACTS_INTRO } from "@/data/aiFacts";
import { breadcrumbJsonLd, pageSeo } from "@/lib/seo";

const AiFacts = () => {
  const seo = pageSeo.aiFacts;

  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        path={seo.path}
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "AI Facts", path: "/ai-facts" },
        ])}
      />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <section className="relative pt-32 pb-10 md:pt-40 md:pb-14 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            <div className="section-container relative z-10">
              <AnimatedSection className="max-w-3xl mx-auto text-center">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                  AI facts
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Straight Answers About TechVerge
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {AI_FACTS_INTRO}
                </p>
              </AnimatedSection>
            </div>
          </section>

          <section className="relative pb-16 md:pb-24">
            <div className="section-container relative z-10 max-w-3xl mx-auto">
              <dl className="space-y-8">
                {AI_FACTS.map((fact, index) => (
                  <AnimatedSection key={fact.label} delay={index * 0.04}>
                    <div className="border-b border-border/50 pb-8 last:border-0">
                      <dt className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
                        {fact.label}
                      </dt>
                      <dd className="text-muted-foreground text-base md:text-lg leading-relaxed">
                        {fact.text}
                      </dd>
                    </div>
                  </AnimatedSection>
                ))}
              </dl>

              <AnimatedSection className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <BookingCta
                  showArrow
                  eventName="ai_facts_cta_click"
                  className="px-8 py-4 rounded-xl text-primary-foreground font-semibold w-full sm:w-auto"
                />
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-border/60 text-foreground font-semibold hover:border-primary/40 transition-colors w-full sm:w-auto"
                >
                  Read About
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-primary font-semibold hover:underline w-full sm:w-auto"
                >
                  Contact
                </Link>
              </AnimatedSection>

              <p className="mt-10 text-sm text-muted-foreground/80">
                Machine-readable summary:{" "}
                <a
                  href="/llms.txt"
                  className="text-primary hover:underline"
                >
                  /llms.txt
                </a>
                .
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AiFacts;
