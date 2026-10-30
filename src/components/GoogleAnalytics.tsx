import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  captureUtmAttribution,
  getStoredUtmAttribution,
  utmSafePagePath,
} from "@/lib/analytics";

const GA_SCRIPT_ID = "techverge-ga-script";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function injectGa(measurementId: string) {
  if (document.getElementById(GA_SCRIPT_ID)) return;

  captureUtmAttribution();
  const utm = getStoredUtmAttribution();

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
    ...utm,
  });

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

function sendPageView(measurementId: string, pathname: string, search: string) {
  if (typeof window.gtag !== "function") return;
  const pagePath = utmSafePagePath(pathname, search);
  const utm = getStoredUtmAttribution();
  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_title: document.title,
    page_location: `${window.location.origin}${pagePath}`,
    ...utm,
  });
}

/**
 * Loads GA4 only after cookie consent is accepted, deferred to idle time.
 * Page views use UTM-stripped paths; campaign params stay on first-touch attribution.
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
    let idleId = 0;
    let timeoutId = 0;

    const loadWhenIdle = () => {
      if (localStorage.getItem("cookie-consent") !== "accepted") return;
      if (document.getElementById(GA_SCRIPT_ID)) return;

      const run = () => {
        injectGa(measurementId);
        const { pathname, search } = locationRef.current;
        const key = utmSafePagePath(pathname, search);
        lastPathRef.current = key;
        sendPageView(measurementId, pathname, search);
      };

      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(run, { timeout: 4000 });
      } else {
        timeoutId = window.setTimeout(run, 2000);
      }
    };

    loadWhenIdle();
    const onConsent = () => loadWhenIdle();
    window.addEventListener("cookie-consent-updated", onConsent);
    return () => {
      window.removeEventListener("cookie-consent-updated", onConsent);
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
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
