import { afterEach, describe, expect, it, vi } from "vitest";
import { syncGoogleAnalytics } from "@/components/GoogleAnalytics";
import { trackEvent } from "@/lib/analytics";

afterEach(() => {
  vi.unstubAllEnvs();
  localStorage.clear();
  document.getElementById("techverge-ga4-script")?.remove();
  document.querySelector("[data-analytics-service]")?.remove();
  delete window.gtag;
  delete window.dataLayer;
});

describe("GA4 consent and events", () => {
  it("does not load before consent and disables collection when consent is revoked", () => {
    syncGoogleAnalytics("G-ABC123");
    expect(document.getElementById("techverge-ga4-script")).toBeNull();
    localStorage.setItem("cookie-consent", "accepted");
    syncGoogleAnalytics("G-ABC123");
    syncGoogleAnalytics("G-ABC123");
    expect(document.querySelectorAll("#techverge-ga4-script")).toHaveLength(1);
    localStorage.setItem("cookie-consent", "declined");
    syncGoogleAnalytics("G-ABC123");
    expect((window as unknown as Record<string, unknown>)["ga-disable-G-ABC123"]).toBe(true);
  });

  it("sends only requested events with the current page and service when available", () => {
    vi.stubEnv("IS_PRODUCTION_DEPLOY", "1");
    localStorage.setItem("cookie-consent", "accepted");
    syncGoogleAnalytics("G-ABC123");
    const spy = vi.spyOn(window, "gtag");
    const article = document.createElement("article");
    article.dataset.analyticsService = "Custom Website Development";
    document.body.appendChild(article);
    trackEvent("service_cta_click");
    expect(spy).toHaveBeenCalledWith("event", "service_cta_click", { page: window.location.pathname, service_name: "Custom Website Development" });
    trackEvent("email_click");
    expect(spy).toHaveBeenCalledTimes(1);
    localStorage.setItem("cookie-consent", "declined");
    trackEvent("whatsapp_click");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does not send GA4 events outside production", () => {
    vi.stubEnv("IS_PRODUCTION_DEPLOY", "0");
    localStorage.setItem("cookie-consent", "accepted");
    syncGoogleAnalytics("G-ABC123");
    const spy = vi.spyOn(window, "gtag");
    trackEvent("booking_click");
    expect(spy).not.toHaveBeenCalled();
  });
});
