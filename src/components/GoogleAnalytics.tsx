import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { captureUtmAttribution, getStoredUtmAttribution, utmSafePagePath } from "@/lib/analytics";

const SCRIPT_ID = "techverge-ga4-script";

export function syncGoogleAnalytics(id: string) {
  if (!/^G-[A-Z0-9]+$/i.test(id)) return;
  const globals = window as unknown as Record<string, unknown>;
  const disabled = `ga-disable-${id}`;
  if (localStorage.getItem("cookie-consent") !== "accepted") { globals[disabled] = true; return; }
  globals[disabled] = false;
  if (document.getElementById(SCRIPT_ID)) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (..._args: unknown[]) { window.dataLayer!.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", id);
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

export function GoogleAnalytics() {
  const location = useLocation();
  const lastPath = useRef("");
  const id = import.meta.env.NEXT_PUBLIC_GA_ID?.trim() || import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  useEffect(() => { captureUtmAttribution(); }, []);
  useEffect(() => {
    if (import.meta.env.IS_PRODUCTION_DEPLOY !== "1" || !id) return;
    const sync = () => {
      syncGoogleAnalytics(id);
      if (localStorage.getItem("cookie-consent") === "accepted") lastPath.current = utmSafePagePath(window.location.pathname, window.location.search);
    };
    sync();
    window.addEventListener("cookie-consent-updated", sync);
    return () => window.removeEventListener("cookie-consent-updated", sync);
  }, [id]);
  useEffect(() => {
    if (!id || import.meta.env.IS_PRODUCTION_DEPLOY !== "1" || localStorage.getItem("cookie-consent") !== "accepted" || !document.getElementById(SCRIPT_ID) || !window.gtag) return;
    const pagePath = utmSafePagePath(location.pathname, location.search);
    if (lastPath.current === pagePath) return;
    lastPath.current = pagePath;
    window.gtag("event", "page_view", { send_to: id, page_path: pagePath, page_title: document.title, page_location: `${window.location.origin}${pagePath}`, ...getStoredUtmAttribution() });
  }, [location.pathname, location.search, id]);
  return null;
}
