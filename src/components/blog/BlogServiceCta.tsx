import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { BlogCta } from "@/data/blog";
import { BookingCta } from "@/components/cta/BookingCta";

interface BlogServiceCtaProps {
  cta: BlogCta;
}

export function BlogServiceCta({ cta }: BlogServiceCtaProps) {
  return (
    <aside className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/40 to-transparent px-6 py-7 md:px-8 md:py-8">
      <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-2">
        Next step
      </p>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
        Ready to put this into practice?
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
        {cta.description ||
          "Tell us how leads, calls, and follow-ups work today — we will map a practical build path."}{" "}
        Continue with{" "}
        <Link to={cta.path} className="text-primary hover:underline font-medium">
          {cta.label.replace(/^Explore\s+/i, "").trim() || cta.label}
        </Link>
        .
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          to={cta.path}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {cta.label}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <BookingCta className="rounded-xl px-5 py-3 text-sm font-semibold" />
      </div>
    </aside>
  );
}
