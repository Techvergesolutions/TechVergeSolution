import { Link } from "react-router-dom";
import { BlogFaq } from "@/components/blog/BlogFaq";
import { HOMEPAGE_FAQ } from "@/data/homepageContent";

export function HomeFaqSection() {
  return (
    <section className="relative py-16 md:py-20 border-b border-border/40">
      <div className="section-container max-w-3xl">
        <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
          Common questions
        </p>
        <BlogFaq faq={HOMEPAGE_FAQ} />
        <p className="mt-6 text-sm text-muted-foreground">
          Service-specific FAQs live on each{" "}
          <Link to="/services" className="text-primary hover:underline">
            service page
          </Link>
          .{" "}
          <Link to="/contact" className="text-primary hover:underline">
            Contact us
          </Link>{" "}
          to discuss your workflow.
        </p>
      </div>
    </section>
  );
}
