import { AnimatedSection } from "../ui/AnimatedSection";
import { BookingCta } from "@/components/cta/BookingCta";
import { WorkflowAuditCta } from "@/components/cta/WorkflowAuditCta";

export const FinalCtaSection = () => {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="section-container relative z-10">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center rounded-2xl border border-border/60 bg-card/40 px-6 py-12 md:px-12 md:py-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">
              Let's Find What You Can Automate
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Tell us how leads, calls, and follow-ups work today. We'll map where automation can
              help — and where people should stay in the loop.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <BookingCta
                showArrow
                className="px-8 py-4 rounded-xl text-primary-foreground font-semibold w-full sm:w-auto"
              />
              <WorkflowAuditCta className="px-8 py-4 rounded-xl text-foreground font-semibold w-full sm:w-auto" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
