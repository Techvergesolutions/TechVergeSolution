import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BookingCta } from "@/components/cta/BookingCta";
import { WorkflowAuditCta } from "@/components/cta/WorkflowAuditCta";
import type { ServiceConfig } from "@/data/services";

interface ServiceHeroProps {
  service: ServiceConfig;
}

export function ServiceHero({ service }: ServiceHeroProps) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl">
          <Link
            to="/services"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            ← All solutions
          </Link>
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            {service.eyebrow}
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {service.headline}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
            {service.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <BookingCta
              showArrow
              eventName="service_cta_click"
              eventParams={{ service: service.slug, placement: "hero", cta: "strategy" }}
              className="px-7 py-3.5 rounded-xl text-primary-foreground font-semibold"
            />
            <WorkflowAuditCta
              eventName="service_cta_click"
              eventParams={{ service: service.slug, placement: "hero", cta: "audit" }}
              className="px-7 py-3.5 rounded-xl text-foreground font-semibold"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
