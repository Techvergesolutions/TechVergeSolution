import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent, type AnalyticsParams } from "@/lib/analytics";
import {
  CONTACT_SIMILAR_PATH,
  SIMILAR_PROJECT_CTA_LABEL,
  goToContactIntent,
  isOnHomePage,
} from "@/lib/booking";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type SimilarProjectCtaProps = {
  className?: string;
  showArrow?: boolean;
  variant?: "button" | "outline" | "link";
  onNavigate?: () => void;
  eventParams?: AnalyticsParams;
};

export function SimilarProjectCta({
  className,
  showArrow = false,
  variant = "button",
  onNavigate,
  eventParams,
}: SimilarProjectCtaProps) {
  const baseClass =
    variant === "link"
      ? cn(
          "inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors min-h-[44px]",
          focusRing,
          className
        )
      : variant === "outline"
        ? cn(
            "btn-outline-glow inline-flex items-center justify-center gap-2 min-h-[44px] rounded-xl text-foreground font-semibold",
            focusRing,
            className
          )
        : cn(
            "btn-primary inline-flex items-center justify-center gap-2 min-h-[44px] rounded-xl text-primary-foreground font-semibold",
            focusRing,
            className
          );

  return (
    <Link
      to={CONTACT_SIMILAR_PATH}
      className={cn(baseClass, showArrow && "group")}
      aria-label={SIMILAR_PROJECT_CTA_LABEL}
      onClick={(e) => {
        trackEvent("case_study_click", {
          cta: "similar_project",
          ...eventParams,
        });
        if (isOnHomePage()) {
          e.preventDefault();
          goToContactIntent("similar");
        }
        onNavigate?.();
      }}
    >
      {SIMILAR_PROJECT_CTA_LABEL}
      {showArrow && (
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      )}
    </Link>
  );
}
