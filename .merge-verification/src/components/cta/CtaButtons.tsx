import { cn } from "@/lib/utils";
import { BookingCta } from "./BookingCta";
import { WorkflowAuditCta } from "./WorkflowAuditCta";

type CtaButtonsProps = {
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  showArrow?: boolean;
  onNavigate?: () => void;
};

/** Primary + secondary conversion CTAs as a responsive row. */
export function CtaButtons({
  className,
  primaryClassName,
  secondaryClassName,
  showArrow = true,
  onNavigate,
}: CtaButtonsProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-center gap-4",
        className
      )}
    >
      <BookingCta
        showArrow={showArrow}
        onNavigate={onNavigate}
        className={primaryClassName}
      />
      <WorkflowAuditCta
        onNavigate={onNavigate}
        className={secondaryClassName}
      />
    </div>
  );
}
