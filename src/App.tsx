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
import { serviceSlugs } from "./data/services";

/** Keep the homepage eager; defer other routes to cut unused JS on first paint. */
import Index from "./pages/Index";

const About = lazy(() => import("./pages/About"));
const AiFacts = lazy(() => import("./pages/AiFacts"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

function RouteFallback() {
  return (
    <div
      className="min-h-[40vh] flex items-center justify-center text-muted-foreground text-sm"
      role="status"
      aria-live="polite"
    >
      Loading…
    </div>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <Toaster />
        <Sonner theme="dark" position="bottom-right" closeButton />

        <CookieConsent />
        <GoogleTagManager />

        <BrowserRouter>
          <ScrollToTop />
          <GoogleAnalytics />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/ai-facts" element={<AiFacts />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsAndConditions />} />

              {serviceSlugs.map((slug) => (
                <Route
                  key={slug}
                  path={`/${slug}`}
                  element={<Navigate to={`/services/${slug}`} replace />}
                />
              ))}

              <Route
                path="/lead-follow-up-automation"
                element={<Navigate to="/services/ai-automation" replace />}
              />
              <Route
                path="/services/lead-follow-up-automation"
                element={<Navigate to="/services/ai-automation" replace />}
              />

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
