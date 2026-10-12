import { motion } from "framer-motion";
import { BookingCta } from "@/components/cta/BookingCta";
import { WorkflowAuditCta } from "@/components/cta/WorkflowAuditCta";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(190_100%_50%_/_0.06)_0%,_transparent_55%)]" />

      <div className="section-container relative z-10 pt-28 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-primary mb-6"
          >
            TechVerge Solutions
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
          >
            AI Automation That Turns More Leads Into Customers
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            We build AI-powered workflows, voice agents, and business software that help US
            businesses respond faster, automate repetitive work, and convert more opportunities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <BookingCta
              showArrow
              eventName="hero_primary_cta_click"
              className="px-8 py-4 rounded-xl text-primary-foreground font-semibold text-base md:text-lg w-full sm:w-auto"
            />
            <WorkflowAuditCta
              eventName="hero_secondary_cta_click"
              className="px-8 py-4 rounded-xl text-foreground font-semibold text-base md:text-lg w-full sm:w-auto"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm md:text-base text-muted-foreground/80 tracking-wide"
          >
            AI Automation · AI Voice Agents · Business Automation · Custom Software
          </motion.p>
        </div>
      </div>
    </section>
  );
};
