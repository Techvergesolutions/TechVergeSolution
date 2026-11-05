import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BookingCta } from "@/components/cta/BookingCta";
import { WorkflowAuditCta } from "@/components/cta/WorkflowAuditCta";
import type { ServiceConfig, ServiceSlug } from "@/data/services";

interface ServiceCtaProps {
  cta: ServiceConfig["cta"];
  serviceSlug: ServiceSlug;
}

export function ServiceCta({ cta, serviceSlug }: ServiceCtaProps) {
  const eventParams = {
    service: serviceSlug,
    placement: "footer_cta",
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="section-container relative z-10">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center rounded-2xl border border-border/60 bg-card/40 px-6 py-12 md:px-12 md:py-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
              {cta.title}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {cta.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <BookingCta
                showArrow
                eventName="service_cta_click"
                eventParams={{ ...eventParams, cta: "strategy" }}
                className="px-8 py-4 rounded-xl text-primary-foreground font-semibold w-full sm:w-auto"
              />
              {cta.secondaryLabel && (
                <WorkflowAuditCta
                  eventName="service_cta_click"
                  eventParams={{ ...eventParams, cta: "audit" }}
                  className="px-8 py-4 rounded-xl text-foreground font-semibold w-full sm:w-auto"
                />
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
