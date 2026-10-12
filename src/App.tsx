import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ServicePage from "./pages/ServicePage";

// Components
import { CookieConsent } from "./components/ui/CookieConsent";
import { GoogleTagManager } from "./components/GoogleTagManager";
import ScrollToTop from "./components/ui/ScrollToTop";

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
            <Route path="/ai-automation" element={<ServicePage slug="ai-automation" />} />
            <Route path="/ai-voice-agents" element={<ServicePage slug="ai-voice-agents" />} />
            <Route path="/business-automation" element={<ServicePage slug="business-automation" />} />
            <Route path="/ai-saas-development" element={<ServicePage slug="ai-saas-development" />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
