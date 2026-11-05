import { AnimatedSection } from "../ui/AnimatedSection";
import { Home, Building2, HeartPulse, Briefcase } from "lucide-react";

const industries = [
  {
    icon: Home,
    name: "Home Services",
    text: "Faster enquiry response and appointment booking when every missed call matters.",
  },
  {
    icon: Building2,
    name: "Real Estate",
    text: "Lead qualification and follow-up that keeps buyers and sellers moving.",
  },
  {
    icon: HeartPulse,
    name: "Healthcare",
    text: "Intake, scheduling support, and admin automation with careful human oversight.",
  },
  {
    icon: Briefcase,
    name: "Professional Services",
    text: "Client intake, reminders, and CRM updates without drowning the team in admin.",
  },
];

export const IndustriesSection = () => {
  return (
    <section id="industries" className="relative py-24 md:py-32 overflow-hidden">
      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-14 md:mb-16 max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            Built For Businesses That Can't Afford Slow Follow-Up
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            These are industries where speed-to-lead and reliable follow-up often decide the deal.
            We work with other sectors too — these are common fits, not exclusive limits.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {industries.map((industry, index) => (
            <AnimatedSection key={industry.name} delay={index * 0.08}>
              <div className="h-full rounded-2xl border border-border/60 bg-card/30 p-6 md:p-7">
                <industry.icon className="w-7 h-7 text-secondary mb-4" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {industry.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{industry.text}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
