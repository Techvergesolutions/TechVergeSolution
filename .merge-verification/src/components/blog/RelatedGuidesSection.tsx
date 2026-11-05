import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { blogPostPath } from "@/data/blog";
import type { InternalGuideLink } from "@/data/internalLinks";

interface RelatedGuidesSectionProps {
  title?: string;
  description?: string;
  links: InternalGuideLink[];
  muted?: boolean;
}

/** Homepage / service → blog guides with descriptive anchor text. */
export function RelatedGuidesSection({
  title = "Practical guides",
  description = "Read more on how we approach voice agents, lead follow-up, and workflow automation.",
  links,
  muted = false,
}: RelatedGuidesSectionProps) {
  if (!links.length) return null;

  return (
    <section
      className={
        muted
          ? "relative py-16 md:py-20 overflow-hidden border-y border-border/40 bg-card/10"
          : "relative py-16 md:py-20 overflow-hidden border-t border-border/40"
      }
    >
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-3xl mb-8 md:mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </AnimatedSection>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
          {links.map((link, index) => (
            <li key={link.slug}>
              <AnimatedSection delay={index * 0.05} className="h-full">
                <Link
                  to={blogPostPath(link.slug)}
                  className="group block h-full rounded-2xl border border-border/60 bg-card/30 p-5 md:p-6 hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <p className="font-display text-base md:text-lg font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                    {link.anchor}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {link.blurb}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Read the guide
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </AnimatedSection>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
