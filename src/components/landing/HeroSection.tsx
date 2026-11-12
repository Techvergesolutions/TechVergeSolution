import { BookingCta } from "@/components/cta/BookingCta";
import { WorkflowAuditCta } from "@/components/cta/WorkflowAuditCta";

/** CSS-first hero — avoids framer-motion on the LCP path. */
export const HeroSection = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(190_100%_50%_/_0.06)_0%,_transparent_55%)]"
        aria-hidden="true"
      />

      <div className="section-container relative z-10 pt-28 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-display text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-primary mb-5 sm:mb-6">
            TechVerge Solution
          </p>

          <h1 className="font-display text-[1.75rem] leading-tight sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 sm:mb-6 sm:leading-[1.1] tracking-tight px-1">
            AI Automation & Voice Agents for Small Businesses
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-1">
            Practical systems for teams in the US, UK, and UAE—faster follow-up, fewer missed
            calls, and less repetitive work without the buzzword fog.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 px-1">
            <BookingCta
              showArrow
              eventName="hero_primary_cta_click"
              className="px-8 py-4 rounded-xl text-primary-foreground font-semibold text-base md:text-lg w-full sm:w-auto"
            />
            <WorkflowAuditCta
              eventName="hero_secondary_cta_click"
              className="px-8 py-4 rounded-xl text-foreground font-semibold text-base md:text-lg w-full sm:w-auto"
            />
          </div>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground/80 tracking-wide px-2">
            AI Automation · AI Voice Agents · Business Automation · Custom Software
          </p>
        </div>
      </div>
    </section>
  );
};
