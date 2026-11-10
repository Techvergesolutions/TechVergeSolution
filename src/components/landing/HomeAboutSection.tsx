import { Link } from "react-router-dom";
import { HOMEPAGE_ABOUT } from "@/data/homepageContent";

export function HomeAboutSection() {
  return (
    <section
      className="relative py-16 md:py-20 border-b border-border/40"
      aria-labelledby="home-about-heading"
    >
      <div className="section-container max-w-3xl">
        <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
          {HOMEPAGE_ABOUT.eyebrow}
        </p>
        <h2
          id="home-about-heading"
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6"
        >
          {HOMEPAGE_ABOUT.heading}
        </h2>
        <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
          {HOMEPAGE_ABOUT.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-8 text-sm md:text-base">
          <Link to="/about" className="text-primary font-medium hover:underline">
            Learn more about our team and process
          </Link>
          {" · "}
          <Link to="/ai-facts" className="text-primary font-medium hover:underline">
            Read plain AI facts
          </Link>
        </p>
      </div>
    </section>
  );
}
