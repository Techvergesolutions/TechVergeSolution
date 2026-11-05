import { useEffect } from "react";

const GTM_SCRIPT_ID = "techverge-gtm-script";
const GTM_NOSCRIPT_ID = "techverge-gtm-noscript";

function injectGtm(gtmId: string) {
  if (document.getElementById(GTM_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = GTM_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  if (!document.getElementById(GTM_NOSCRIPT_ID)) {
    const noscript = document.createElement("noscript");
    noscript.id = GTM_NOSCRIPT_ID;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
  }
}

/**
 * Loads Google Tag Manager only when VITE_GTM_ID is set and cookie consent is accepted.
 * Set VITE_GTM_ID in Vercel / .env (e.g. GTM-XXXXXXX) after creating your GTM container.
 */
export const GoogleTagManager = () => {
  useEffect(() => {
    const gtmId = import.meta.env.VITE_GTM_ID?.trim();
    if (!gtmId) return;

    let idleId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const loadWhenIdle = () => {
      if (localStorage.getItem("cookie-consent") !== "accepted") return;
      const run = () => injectGtm(gtmId);
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(run, { timeout: 4000 });
      } else {
        timeoutId = globalThis.setTimeout(run, 2000);
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
      if (timeoutId) globalThis.clearTimeout(timeoutId);
    };
  }, []);

  return null;
};
