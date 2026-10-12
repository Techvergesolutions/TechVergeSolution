import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { CapabilitiesSection } from "@/components/landing/CapabilitiesSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionsSection } from "@/components/landing/SolutionsSection";
import { IndustriesSection } from "@/components/landing/IndustriesSection";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { WhySection } from "@/components/landing/WhySection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { Seo } from "@/components/Seo";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/lib/seo";

const Index = () => {
  return (
    <>
      {/* Organization / WebSite JSON-LD ships in index.html for the static shell */}
      <Seo title={HOME_TITLE} description={HOME_DESCRIPTION} path="/" />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <HeroSection />
          <CapabilitiesSection />
          <ProblemSection />
          <SolutionsSection />
          <IndustriesSection />
          <PortfolioSection />
          <ProcessSection />
          <WhySection />
          <FinalCtaSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
