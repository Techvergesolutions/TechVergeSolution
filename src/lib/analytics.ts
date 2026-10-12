export type AnalyticsEventName =
  | "hero_primary_cta_click"
  | "hero_secondary_cta_click"
  | "service_cta_click"
  | "case_study_click"
  | "booking_cta_click"
  | "contact_form_start"
  | "contact_form_submit"
  | "email_click"
  | "phone_click";

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
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
}
