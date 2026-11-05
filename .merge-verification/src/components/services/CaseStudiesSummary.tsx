import { Link } from "react-router-dom";
import {
  ArrowRight,
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
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { trackEvent } from "@/lib/analytics";
import {
  caseStudies,
  type CaseStudy,
  type CaseStudyIcon,
} from "@/data/caseStudies";
import type { ServiceSlug } from "@/data/services";
import { cn } from "@/lib/utils";

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

/** Prefer related project names when present; otherwise fall back to recent general work. */
const RELATED_BY_SERVICE: Partial<Record<ServiceSlug, string[]>> = {
  "ai-automation": ["Peoples Creed AI", "Agentic Creed", "BuzzHR", "ClockLog"],
  "ai-voice-agents": ["Agentic Creed", "Peoples Creed AI", "ClockLog", "EventForce"],
  "business-automation": ["ClockLog", "BuzzHR", "EventForce", "ShareMyDine"],
  "ai-saas-development": [
    "ClockLog",
    "EventForce",
    "Peoples Creed AI",
    "Agentic Creed",
  ],
};

const DEFAULT_NAMES = [
  "ClockLog",
  "EventForce",
  "Peoples Creed AI",
  "Agentic Creed",
];

function pickStudies(serviceSlug?: ServiceSlug, limit = 4): CaseStudy[] {
  const preferred = serviceSlug
    ? RELATED_BY_SERVICE[serviceSlug] ?? DEFAULT_NAMES
    : DEFAULT_NAMES;
  const byName = new Map(caseStudies.map((s) => [s.name, s]));
  const selected: CaseStudy[] = [];

  for (const name of preferred) {
    const study = byName.get(name);
    if (study) selected.push(study);
    if (selected.length >= limit) return selected;
  }

  for (const study of caseStudies) {
    if (selected.some((s) => s.name === study.name)) continue;
    selected.push(study);
    if (selected.length >= limit) break;
  }

  return selected;
}

interface CaseStudiesSummaryProps {
  serviceSlug?: ServiceSlug;
  limit?: number;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  muted?: boolean;
}

export function CaseStudiesSummary({
  serviceSlug,
  limit = 4,
  eyebrow = "Selected work",
  title = "Recent Projects",
  description = "A short look at custom software and automation work we've shipped — factual outcomes only. See the full portfolio for more.",
  className,
  muted = true,
}: CaseStudiesSummaryProps) {
  const studies = pickStudies(serviceSlug, limit);

  return (
    <section
      className={cn("relative py-20 md:py-28 overflow-hidden", className)}
    >
      {muted && <div className="absolute inset-0 bg-muted/20" />}
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            {eyebrow}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {description}
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-6xl">
          {studies.map((study, index) => {
            const Icon = ICON_MAP[study.icon];
            return (
              <AnimatedSection key={study.name} delay={index * 0.06}>
                <article className="h-full rounded-2xl border border-border/60 bg-card/40 p-6 flex flex-col">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  {study.category && (
                    <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-medium mb-2">
                      {study.category}
                    </span>
                  )}
                  <h3 className="font-display text-lg font-bold text-foreground mb-3">
                    {study.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {study.outcome}
                  </p>
                </article>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection className="mt-10 md:mt-12">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-90 transition-opacity min-h-[44px]"
            onClick={() =>
              trackEvent("case_study_click", {
                cta: "view_portfolio",
                placement: serviceSlug ? "service_page" : "services_hub",
                ...(serviceSlug ? { service: serviceSlug } : {}),
              })
            }
          >
            View full portfolio
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
