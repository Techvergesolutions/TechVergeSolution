import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { Seo } from "@/components/Seo";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BookingCta } from "@/components/cta/BookingCta";
import { pageSeo } from "@/lib/seo";
import { SERVICE_MARKETS } from "@/data/locations";
import {
  ORG_ADDRESS_DISPLAY,
  ORG_SECONDARY_ADDRESS_DISPLAY,
} from "@/data/organizationProfiles";

const Locations = () => {
  const seo = pageSeo.locations;

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <section className="relative pt-32 pb-8 md:pt-40 md:pb-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            <div className="section-container relative z-10">
              <Breadcrumbs
                items={[
                  { name: "Home", href: "/" },
                  { name: "Locations", href: "/locations" },
                ]}
              />
              <AnimatedSection eager className="max-w-3xl mx-auto text-center">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                  Locations
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Cities We Serve
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Head office: {ORG_ADDRESS_DISPLAY}. Secondary office:{" "}
                  {ORG_SECONDARY_ADDRESS_DISPLAY}. We also work with businesses in major
                  cities across the United States, United Kingdom, and United Arab Emirates
                  on AI automation, voice agents, websites, mobile apps, and custom software.
                  Listed cities are markets we serve, not additional local offices.
                </p>
              </AnimatedSection>
            </div>
          </section>

          <section className="relative pb-16 md:pb-24">
            <div className="section-container relative z-10 space-y-14 md:space-y-20">
              {SERVICE_MARKETS.map((market, index) => (
                <AnimatedSection key={market.id} delay={index * 0.04}>
                  <div
                    id={market.id}
                    className="scroll-mt-28 rounded-2xl border border-border/50 bg-card/30 p-6 md:p-10"
                  >
                    <div className="flex items-start gap-3 mb-6">
                      <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" aria-hidden="true" />
                      <div>
                        <h2 className="font-display text-2xl md:text-3xl font-bold">
                          {market.name}
                        </h2>
                        <p className="text-muted-foreground text-sm md:text-base mt-1">
                          {market.shortName} cities where we support AI, software, and digital
                          projects.
                        </p>
                      </div>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {market.cities.map((city) => (
                        <li key={city.slug}>
                          <a
                            id={city.slug}
                            href={`#${city.slug}`}
                            className="scroll-mt-28 flex items-center gap-2 rounded-xl border border-border/40 bg-background/40 px-4 py-3 text-sm md:text-base text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                          >
                            <span className="font-medium">{city.name}</span>
                            {city.region ? (
                              <span className="text-muted-foreground">{city.region}</span>
                            ) : null}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              ))}

              <AnimatedSection className="max-w-2xl mx-auto text-center">
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                  If your city is not listed, we still take on remote work in the US, UK, and
                  UAE. Tell us how leads, calls, and follow-ups work today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <BookingCta
                    showArrow
                    className="px-8 py-4 rounded-xl text-primary-foreground font-semibold w-full sm:w-auto"
                  />
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-border/60 text-foreground font-semibold hover:border-primary/40 transition-colors w-full sm:w-auto"
                  >
                    Contact
                  </Link>
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

export default Locations;
