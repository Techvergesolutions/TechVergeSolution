export type AnalyticsEventName =
  | "hero_primary_cta_click"
  | "hero_secondary_cta_click"
  | "service_cta_click"
  | "case_study_click"
  | "booking_cta_click"
  | "audit_cta_click"
  | "cta_click"
  | "contact_form_start"
  | "contact_form_submit"
  | "whatsapp_click"
  | "booking_click"
  | "email_click"
  | "phone_click"
  | "scroll_depth"
  | "ai_facts_cta_click";

export type AnalyticsParams = Record<
  string,
  string | number | boolean | undefined
>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const UTM_STORAGE_KEY = "tv_utm_attribution";

/** First-touch campaign params we persist for the session. */
export const UTM_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "msclkid",
  "fbclid",
] as const;

export type UtmKey = (typeof UTM_PARAM_KEYS)[number];
export type UtmAttribution = Partial<Record<UtmKey, string>>;

function readSearchParams(search: string): URLSearchParams {
  const q = search.startsWith("?") ? search.slice(1) : search;
  return new URLSearchParams(q);
}

/** Pull supported campaign params from a query string. */
export function extractUtmParams(search: string): UtmAttribution {
  const params = readSearchParams(search);
  const out: UtmAttribution = {};
  for (const key of UTM_PARAM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) out[key] = value.slice(0, 200);
  }
  return out;
}

/** Drop UTM / click-id params from a search string (keeps intent, etc.). */
export function stripUtmFromSearch(search: string): string {
  const params = readSearchParams(search);
  let changed = false;
  for (const key of UTM_PARAM_KEYS) {
    if (params.has(key)) {
      params.delete(key);
      changed = true;
    }
  }
  if (!changed) return search.startsWith("?") || !search ? search : `?${search}`;
  const next = params.toString();
  return next ? `?${next}` : "";
}

/** Path + non-UTM query for GA page_path (avoids re-attributing on SPA navigations). */
export function utmSafePagePath(pathname: string, search = ""): string {
  return `${pathname}${stripUtmFromSearch(search)}`;
}

/**
 * Capture first-touch UTMs from the landing URL into sessionStorage.
 * Later visits in the same tab keep the original attribution.
 */
export function captureUtmAttribution(
  search = typeof window !== "undefined" ? window.location.search : "",
): UtmAttribution {
  if (typeof window === "undefined") return {};

  try {
    const existingRaw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (existingRaw) {
      return JSON.parse(existingRaw) as UtmAttribution;
    }
  } catch {
    /* ignore corrupt storage */
  }

  const fresh = extractUtmParams(search);
  if (Object.keys(fresh).length > 0) {
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      /* private mode / quota */
    }
  }
  return fresh;
}

export function getStoredUtmAttribution(): UtmAttribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return captureUtmAttribution();
    return JSON.parse(raw) as UtmAttribution;
  } catch {
    return captureUtmAttribution();
  }
}

/** Merge caller params with session UTM attribution (caller wins on key clash). */
export function withUtmParams(params?: AnalyticsParams): AnalyticsParams {
  const utm = getStoredUtmAttribution();
  return { ...utm, ...params };
}

/**
 * Push a conversion event to GTM's dataLayer and GA4 gtag when available.
 * Always attaches first-touch UTM / click-id params when present.
 */
export function trackEvent(
  name: AnalyticsEventName,
  params?: AnalyticsParams,
): void {
  if (typeof window === "undefined") return;

  const payload = withUtmParams(params);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: name,
    ...payload,
  });
  const gaEvents: readonly string[] = ["contact_form_submit", "whatsapp_click", "booking_click", "service_cta_click"];
  if (!gaEvents.includes(name) || import.meta.env.IS_PRODUCTION_DEPLOY !== "1" || !document.getElementById("techverge-ga4-script") || localStorage.getItem("cookie-consent") !== "accepted" || !window.gtag) return;
  const serviceName = typeof params?.service_name === "string" ? params.service_name : document.querySelector<HTMLElement>("[data-analytics-service]")?.dataset.analyticsService;
  window.gtag("event", name, {
    ...payload,
    page: window.location.pathname,
    ...(serviceName ? { service_name: serviceName } : {}),
  });
}

/** Fire both a specific CTA event and a generic cta_click for reporting. */
export function trackCtaClick(
  eventName: AnalyticsEventName,
  params?: AnalyticsParams,
): void {
  trackEvent(eventName, params);
  if (eventName !== "cta_click") {
    trackEvent("cta_click", {
      cta_name: eventName,
      ...params,
    });
  }
}
