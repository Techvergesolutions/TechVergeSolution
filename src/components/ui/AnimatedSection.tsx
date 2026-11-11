import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  /** Render visible immediately (hero headings must not start at opacity 0). */
  eager?: boolean;
}

const OFFSET: Record<NonNullable<AnimatedSectionProps["direction"]>, string> = {
  up: "translate3d(0, 1.5rem, 0)",
  down: "translate3d(0, -1.5rem, 0)",
  left: "translate3d(1.5rem, 0, 0)",
  right: "translate3d(-1.5rem, 0, 0)",
};

/** Lightweight scroll reveal — no framer-motion on the critical path. */
export const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  eager = false,
}: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (eager) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties = {
    transitionDelay: visible ? `${Math.round(delay * 1000)}ms` : "0ms",
    transform: visible ? "translate3d(0, 0, 0)" : OFFSET[direction],
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.25,0.4,0.25,1)] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};
