import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ContactSection } from "@/components/landing/ContactSection";
import { Seo } from "@/components/Seo";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { pageSeo } from "@/lib/seo";

const Contact = () => {
  const seo = pageSeo.contact;
  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <section className="relative pt-32 pb-4 md:pt-40 md:pb-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            <div className="section-container relative z-10">
              <AnimatedSection className="max-w-3xl mx-auto text-center">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                  Contact
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Tell Us What You Want To Automate
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Share how leads, calls, and follow-ups work today — we&apos;ll help map a practical
                  next step.
                </p>
              </AnimatedSection>
            </div>
          </section>
          <ContactSection hidePageHeader />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
