import { useEffect } from "react";

const SCRIPT_ID = "techverge-ga4-script";

export function syncGoogleAnalytics(id: string) {
  if (!/^G-[A-Z0-9]+$/i.test(id)) return;
  const globals = window as unknown as Record<string, unknown>;
  const disabled = `ga-disable-${id}`;
  if (localStorage.getItem("cookie-consent") !== "accepted") {
    globals[disabled] = true;
    return;
  }
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
  useEffect(() => {
    const id = import.meta.env.NEXT_PUBLIC_GA_ID?.trim();
    if (import.meta.env.IS_PRODUCTION_DEPLOY !== "1" || !id) return;
    const sync = () => syncGoogleAnalytics(id);
    sync();
    window.addEventListener("cookie-consent-updated", sync);
    return () => window.removeEventListener("cookie-consent-updated", sync);
  }, []);
  return null;
}
