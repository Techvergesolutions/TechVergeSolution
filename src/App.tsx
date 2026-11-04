import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Contact = lazy(() => import("./pages/Contact"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const MarketPage = lazy(() => import("./pages/MarketPage"));

// Components
import { CookieConsent } from "./components/ui/CookieConsent";
import { GoogleTagManager } from "./components/GoogleTagManager";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import ScrollToTop from "./components/ui/ScrollToTop";
import { SanityLiveRefresh } from "./components/SanityLiveRefresh";
// Historical flat URLs remain redirects regardless of which services are published.
const legacyServiceSlugs = ["ai-automation", "ai-voice-agents", "business-automation", "ai-saas-development"];

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchInterval: 30_000 } } });

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SanityLiveRefresh />
      <TooltipProvider>
        <Toaster />
        <Sonner theme="dark" position="bottom-right" closeButton />

        <CookieConsent />
        <GoogleTagManager />
        <GoogleAnalytics />

        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen" aria-label="Loading page" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/markets/:slug" element={<MarketPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsAndConditions />} />

            {/* Legacy flat service URLs → /services/:slug */}
            {legacyServiceSlugs.map((slug) => (
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
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
