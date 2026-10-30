import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  captureUtmAttribution,
  getStoredUtmAttribution,
  utmSafePagePath,
} from "@/lib/analytics";

/**
 * Base gtag lives in index.html (G-MWCBCV4CNB) so Google can verify the stream.
 * This component sends SPA route page_views (React Router does not reload the document).
 */
export const GoogleAnalytics = () => {
  const location = useLocation();
  const measurementId =
    import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "G-MWCBCV4CNB";
  const lastPathRef = useRef<string>("");
  const isFirst = useRef(true);

  useEffect(() => {
    captureUtmAttribution();
  }, []);

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    const pagePath = utmSafePagePath(location.pathname, location.search);
    if (lastPathRef.current === pagePath) return;
    lastPathRef.current = pagePath;

    // First load already gets an automatic page_view from index.html gtag('config').
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const utm = getStoredUtmAttribution();
    window.gtag("event", "page_view", {
      send_to: measurementId,
      page_path: pagePath,
      page_title: document.title,
      page_location: `${window.location.origin}${pagePath}`,
      ...utm,
    });
  }, [location.pathname, location.search, measurementId]);

  return null;
};
