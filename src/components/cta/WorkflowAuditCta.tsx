import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  trackEvent,
  type AnalyticsEventName,
  type AnalyticsParams,
} from "@/lib/analytics";
import {
  AUDIT_CTA_LABEL,
  CONTACT_AUDIT_PATH,
  goToContactIntent,
  isOnHomePage,
} from "@/lib/booking";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type WorkflowAuditCtaProps = {
  className?: string;
  onNavigate?: () => void;
  variant?: "button" | "link";
  /** When set, fires on click (e.g. hero_secondary_cta_click, service_cta_click). */
  eventName?: AnalyticsEventName;
  eventParams?: AnalyticsParams;
};

export function WorkflowAuditCta({
  className,
  onNavigate,
  variant = "button",
  eventName,
  eventParams,
}: WorkflowAuditCtaProps) {
  const baseClass =
    variant === "link"
      ? cn(
          "text-sm font-medium text-muted-foreground hover:text-primary transition-colors min-h-[44px] inline-flex items-center",
          focusRing,
          className
        )
      : cn(
          "btn-outline-glow inline-flex items-center justify-center min-h-[44px]",
          focusRing,
          className
        );

  return (
    <Link
      to={CONTACT_AUDIT_PATH}
      className={baseClass}
      aria-label={AUDIT_CTA_LABEL}
      onClick={(e) => {
        if (eventName) trackEvent(eventName, eventParams);
        if (isOnHomePage()) {
          e.preventDefault();
          goToContactIntent("audit");
        }
        onNavigate?.();
      }}
    >
      {AUDIT_CTA_LABEL}
    </Link>
  );
}
