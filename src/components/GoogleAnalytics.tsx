import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  captureUtmAttribution,
  getStoredUtmAttribution,
  utmSafePagePath,
} from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function grantAnalyticsConsent() {
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function denyAnalyticsConsent() {
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function sendPageView(measurementId: string, pathname: string, search: string) {
  if (typeof window.gtag !== "function") return;
  const pagePath = utmSafePagePath(pathname, search);
  const utm = getStoredUtmAttribution();
  window.gtag("event", "page_view", {
    send_to: measurementId,
    page_path: pagePath,
    page_title: document.title,
    page_location: `${window.location.origin}${pagePath}`,
    ...utm,
  });
}

/**
 * GA4 script lives in index.html (so Google can verify the tag).
 * This component updates Consent Mode + SPA page_view after Accept.
 */
export const GoogleAnalytics = () => {
  const location = useLocation();
  const measurementId =
    import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "G-MWCBCV4CNB";
  const lastPathRef = useRef<string>("");
  const locationRef = useRef(location);
  locationRef.current = location;

  useEffect(() => {
    captureUtmAttribution();
  }, []);

  useEffect(() => {
    const syncConsentAndPage = () => {
      const consent = localStorage.getItem("cookie-consent");
      if (consent === "accepted") {
        grantAnalyticsConsent();
        captureUtmAttribution();
        const { pathname, search } = locationRef.current;
        const key = utmSafePagePath(pathname, search);
        if (lastPathRef.current !== key) {
          lastPathRef.current = key;
          sendPageView(measurementId, pathname, search);
        }
      } else if (consent === "declined") {
        denyAnalyticsConsent();
      }
    };

    syncConsentAndPage();
    window.addEventListener("cookie-consent-updated", syncConsentAndPage);
    return () => {
      window.removeEventListener("cookie-consent-updated", syncConsentAndPage);
    };
  }, [measurementId]);

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    if (localStorage.getItem("cookie-consent") !== "accepted") return;
    const key = utmSafePagePath(location.pathname, location.search);
    if (lastPathRef.current === key) return;
    lastPathRef.current = key;
    sendPageView(measurementId, location.pathname, location.search);
  }, [location.pathname, location.search, measurementId]);

  return null;
};
