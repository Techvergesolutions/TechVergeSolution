import { useState } from "react";
import { AnimatedSection } from "../ui/AnimatedSection";
import { SimilarProjectCta } from "@/components/cta/SimilarProjectCta";
import { trackEvent } from "@/lib/analytics";
import { caseStudies, type CaseStudy, type CaseStudyIcon } from "@/data/caseStudies";
import {
  ArrowUpRight,
  Timer,
  CalendarDays,
  GraduationCap,
  Utensils,
  Users,
  Brain,
  Activity,
  Bot,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<CaseStudyIcon, LucideIcon> = {
  timer: Timer,
  calendar: CalendarDays,
  graduation: GraduationCap,
  utensils: Utensils,
  users: Users,
  brain: Brain,
  activity: Activity,
  bot: Bot,
  shopping: ShoppingBag,
};

const INITIAL_VISIBLE = 4;

function CaseStudyRow({ study, index }: { study: CaseStudy; index: number }) {
  const Icon = ICON_MAP[study.icon];
  const reverse = index % 2 === 1;

  return (
    <article className="rounded-2xl border border-border/60 bg-card/30 overflow-hidden">
      <div className="grid lg:grid-cols-12">
        {/* Identity panel */}
        <div
          className={`lg:col-span-4 relative flex flex-col justify-between p-8 md:p-10 bg-muted/25 ${
            reverse
              ? "lg:order-2 lg:border-l border-border/50"
              : "lg:order-1 lg:border-r border-border/50"
          }`}
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            {study.category && (
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
                {study.category}
              </span>
            )}
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-2 mb-4">
              {study.name}
            </h3>
            {study.technology && (
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground/70 font-medium">Technology · </span>
                {study.technology}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row lg:flex-col gap-3">
            {study.link && (
              <a
                href={study.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors min-h-[44px] px-4 rounded-xl border border-border/60 hover:border-primary/30"
                onClick={() =>
                  trackEvent("case_study_click", {
                    cta: "view_project",
                    project: study.name,
                  })
                }
              >
                View project
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
            <SimilarProjectCta
              variant="outline"
              eventParams={{ project: study.name }}
              className="px-4 py-2.5 text-sm w-full sm:w-auto lg:w-full"
            />
          </div>
        </div>

        {/* Narrative panel */}
        <div
          className={`lg:col-span-8 p-8 md:p-10 space-y-7 ${
            reverse ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/90 mb-2">
                Problem
              </p>
              <p className="text-muted-foreground text-sm md:text-[15px] leading-relaxed">
                {study.problem}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/90 mb-2">
                Solution
              </p>
              <p className="text-muted-foreground text-sm md:text-[15px] leading-relaxed">
                {study.solution}
              </p>
            </div>
          </div>

          <div className="h-px bg-border/50" />

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/90 mb-3">
                Key features
              </p>
              <ul className="space-y-2">
                {study.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-muted-foreground flex gap-2.5 leading-relaxed"
                  >
                    <span className="mt-2 h-1 w-1 rounded-full bg-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/90 mb-2">
                Outcome
              </p>
              <p className="text-muted-foreground text-sm md:text-[15px] leading-relaxed">
                {study.outcome}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export const PortfolioSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visible: CaseStudy[] = showAll
    ? caseStudies
    : caseStudies.slice(0, INITIAL_VISIBLE);

  return (
    <section id="work" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent pointer-events-none" />

      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-14 md:mb-16 max-w-3xl mx-auto">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Work
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            Selected Case Studies
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Real projects described by the problem, what we delivered, and how it works —
            without invented metrics.
          </p>
        </AnimatedSection>

        <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto">
          {visible.map((study, index) => (
            <AnimatedSection
              key={study.name}
              delay={(index % 4) * 0.05}
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <CaseStudyRow study={study} index={index} />
            </AnimatedSection>
          ))}
        </div>

        {!showAll && caseStudies.length > INITIAL_VISIBLE && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="btn-outline-glow px-6 py-3 rounded-xl text-foreground font-medium min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              View all case studies
            </button>
          </div>
        )}

        <AnimatedSection className="mt-14 md:mt-16">
          <div className="max-w-3xl mx-auto text-center rounded-2xl border border-border/60 bg-card/40 px-6 py-10 md:px-10 md:py-12">
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
              Building something in a similar space?
            </h3>
            <p className="text-muted-foreground text-sm md:text-base mb-7 max-w-xl mx-auto">
              Tell us about the problem you need solved — we&apos;ll map a practical path from
              your current workflow to a shipped solution.
            </p>
            <SimilarProjectCta
              showArrow
              className="px-8 py-4 w-full sm:w-auto"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PortfolioSection;
