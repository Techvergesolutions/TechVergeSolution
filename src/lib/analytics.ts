export type AnalyticsEventName =
  | "hero_primary_cta_click"
  | "hero_secondary_cta_click"
  | "service_cta_click"
  | "case_study_click"
  | "booking_cta_click"
  | "contact_form_start"
  | "contact_form_submit"
  | "whatsapp_click"
  | "booking_click"
  | "email_click"
  | "phone_click";

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Push a conversion event to GTM's dataLayer.
 * Safe to call before GTM loads — does not initialize GTM or gtag.
 */
export function trackEvent(
  name: AnalyticsEventName,
  params?: AnalyticsParams
): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: name,
    ...params,
  });
  const gaEvents: readonly string[] = ["contact_form_submit", "whatsapp_click", "booking_click", "service_cta_click"];
  if (!gaEvents.includes(name) || import.meta.env.IS_PRODUCTION_DEPLOY !== "1" || !document.getElementById("techverge-ga4-script") || localStorage.getItem("cookie-consent") !== "accepted" || !window.gtag) return;
  const serviceName = typeof params?.service_name === "string" ? params.service_name : document.querySelector<HTMLElement>("[data-analytics-service]")?.dataset.analyticsService;
  window.gtag("event", name, {
    page: window.location.pathname,
    ...(serviceName ? { service_name: serviceName } : {}),
  });
}
