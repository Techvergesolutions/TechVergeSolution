import { AnimatedSection } from "../ui/AnimatedSection";
import { BookingCta } from "@/components/cta/BookingCta";
import { WorkflowAuditCta } from "@/components/cta/WorkflowAuditCta";
import { ServiceCards } from "@/components/services/ServiceCards";

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
            Practical software and automation services designed around your customers, team, and operations.
          </p>
        </AnimatedSection>

        <ServiceCards />

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
