import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ServicePage from "./pages/ServicePage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

// Components
import { CookieConsent } from "./components/ui/CookieConsent";
import { GoogleTagManager } from "./components/GoogleTagManager";
import ScrollToTop from "./components/ui/ScrollToTop";
import { serviceSlugs } from "./data/services";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner theme="dark" position="bottom-right" closeButton />

        <CookieConsent />
        <GoogleTagManager />

        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsAndConditions />} />

            {/* Legacy flat service URLs → /services/:slug */}
            {serviceSlugs.map((slug) => (
              <Route
                key={slug}
                path={`/${slug}`}
                element={<Navigate to={`/services/${slug}`} replace />}
              />
            ))}

            {/* Lead follow-up aliases → canonical /services/ai-automation (avoids thin duplicate) */}
            <Route
              path="/lead-follow-up-automation"
              element={<Navigate to="/services/ai-automation" replace />}
            />
            <Route
              path="/services/lead-follow-up-automation"
              element={<Navigate to="/services/ai-automation" replace />}
            />

            {/* Legacy legal URLs */}
            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
