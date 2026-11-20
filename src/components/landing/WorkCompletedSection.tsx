import { useEffect, useRef, useState } from "react";

const TARGET = 200;

export function WorkCompletedSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActive(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(TARGET);
      return;
    }
    const start = performance.now();
    const duration = 1400;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(TARGET * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return (
    <section ref={ref} className="relative py-16 md:py-24" aria-labelledby="work-completed-heading">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 sm:rounded-3xl">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-primary to-secondary" aria-hidden="true" />
          <div className="grid items-center gap-4 px-5 py-7 sm:gap-6 sm:px-8 sm:py-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12 md:px-14 md:py-12 lg:px-16">
            <div className="min-w-0 text-center md:text-left">
              <p className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3">Till now</p>
              <p className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none text-gradient tabular-nums" aria-live="polite">
                {value}
              </p>
            </div>
            <div className="min-w-0 text-center md:border-l md:border-border/50 md:pl-12 md:text-left lg:pl-16">
              <h2 id="work-completed-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Work completed
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-3 max-w-md mx-auto md:mx-0">
                Projects delivered to date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
