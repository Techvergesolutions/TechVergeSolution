import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  trackEvent,
  type AnalyticsEventName,
  type AnalyticsParams,
} from "@/lib/analytics";
import {
  BOOKING_CTA_LABEL,
  CONTACT_STRATEGY_PATH,
  getBookingUrl,
  goToContactIntent,
  isHttpUrl,
  isOnHomePage,
} from "@/lib/booking";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type BookingCtaProps = {
  className?: string;
  showArrow?: boolean;
  /** Called after navigation (e.g. close mobile menu). */
  onNavigate?: () => void;
  /** Text-style link for footer / nav lists. */
  variant?: "button" | "link";
  /** Analytics event; defaults to booking_cta_click. */
  eventName?: AnalyticsEventName;
  eventParams?: AnalyticsParams;
};

export function BookingCta({
  className,
  showArrow = false,
  onNavigate,
  variant = "button",
  eventName = "booking_cta_click",
  eventParams,
}: BookingCtaProps) {
  const bookingUrl = getBookingUrl();

  const handleClick = () => {
    trackEvent(eventName, eventParams);
    onNavigate?.();
  };

  const baseClass =
    variant === "link"
      ? cn(
          "inline-flex items-center text-sm font-medium text-primary hover:opacity-80 transition-opacity min-h-[44px]",
          focusRing,
          className
        )
      : cn(
          "btn-primary inline-flex items-center justify-center gap-2 min-h-[44px]",
          focusRing,
          className
        );

  const content = (
    <>
      {BOOKING_CTA_LABEL}
      {showArrow && (
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      )}
    </>
  );

  if (bookingUrl) {
    const external = isHttpUrl(bookingUrl);
    return (
      <a
        href={bookingUrl}
        className={cn(baseClass, showArrow && "group")}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={handleClick}
        aria-label={BOOKING_CTA_LABEL}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={CONTACT_STRATEGY_PATH}
      className={cn(baseClass, showArrow && "group")}
      aria-label={BOOKING_CTA_LABEL}
      onClick={(e) => {
        if (isOnHomePage()) {
          e.preventDefault();
          goToContactIntent("strategy");
        }
        handleClick();
      }}
    >
      {content}
    </Link>
  );
}
