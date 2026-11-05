import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import {
  servicePath,
  servicesConfig,
  serviceSlugs,
  type ServiceSlug,
} from "@/data/services";

interface RelatedServicesProps {
  currentSlug: ServiceSlug;
}

export function RelatedServices({ currentSlug }: RelatedServicesProps) {
  const related = serviceSlugs
    .filter((slug) => slug !== currentSlug)
    .map((slug) => servicesConfig[slug]);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden border-t border-border/40">
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-8 md:mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Related Services
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Explore other ways we design and implement custom automation and software — or see
            selected work in the{" "}
            <Link to="/portfolio" className="text-primary hover:underline font-medium">
              portfolio
            </Link>
            .
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-3 gap-4 max-w-5xl">
          {related.map((service, index) => (
            <AnimatedSection key={service.slug} delay={index * 0.06}>
              <Link
                to={servicePath(service.slug)}
                className="group block h-full rounded-2xl border border-border/60 bg-card/30 p-5 md:p-6 hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <h3 className="font-display text-base md:text-lg font-bold text-foreground mb-2">
                  {service.eyebrow}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {service.subheadline}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  View service
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
