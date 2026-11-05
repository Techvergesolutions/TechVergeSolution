import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { CookieConsent } from "./components/ui/CookieConsent";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { GoogleTagManager } from "./components/GoogleTagManager";
import ScrollToTop from "./components/ui/ScrollToTop";
import { SanityLiveRefresh } from "./components/SanityLiveRefresh";
import Index from "./pages/Index";

const About = lazy(() => import("./pages/About"));
const AiFacts = lazy(() => import("./pages/AiFacts"));
const Services = lazy(() => import("./pages/Services"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const MarketPage = lazy(() => import("./pages/MarketPage"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const NotFound = lazy(() => import("./pages/NotFound"));

const legacyServiceSlugs = ["ai-automation", "ai-voice-agents", "business-automation", "ai-saas-development"];
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false, refetchInterval: 30_000 } } });

export default function App() {
  return <QueryClientProvider client={queryClient}>
    <SanityLiveRefresh />
    <TooltipProvider delayDuration={300}>
      <Toaster /><Sonner theme="dark" position="bottom-right" closeButton />
      <CookieConsent /><GoogleTagManager />
      <BrowserRouter>
        <ScrollToTop /><GoogleAnalytics />
        <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-muted-foreground text-sm" role="status" aria-live="polite">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Index />} /><Route path="/about" element={<About />} />
            <Route path="/ai-facts" element={<AiFacts />} /><Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServicePage />} /><Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} /><Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/markets/:slug" element={<MarketPage />} /><Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} /><Route path="/terms-of-service" element={<TermsAndConditions />} />
            {legacyServiceSlugs.map((slug) => <Route key={slug} path={`/${slug}`} element={<Navigate to={`/services/${slug}`} replace />} />)}
            <Route path="/lead-follow-up-automation" element={<Navigate to="/services/ai-automation" replace />} />
            <Route path="/services/lead-follow-up-automation" element={<Navigate to="/services/ai-automation" replace />} />
            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} /><Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>;
}
