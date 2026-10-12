export const BOOKING_CTA_LABEL = "Book a Free Strategy Call";
export const AUDIT_CTA_LABEL = "Get a Free Workflow Audit";
export const SIMILAR_PROJECT_CTA_LABEL = "Discuss a Similar Project";

export type ContactIntent = "strategy" | "audit" | "similar";

export const CONTACT_STRATEGY_PATH = "/#contact?intent=strategy";
export const CONTACT_AUDIT_PATH = "/#contact?intent=audit";
export const CONTACT_SIMILAR_PATH = "/#contact?intent=similar";

/** Resolve external booking URL from env. Never invents a fake calendar link. */
export function getBookingUrl(): string | null {
  const booking =
    import.meta.env.VITE_BOOKING_URL || import.meta.env.VITE_CALENDLY_URL || "";
  if (typeof booking === "string" && booking.trim()) return booking.trim();
  return null;
}

export function isHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** Same-page contact scroll + intent prefill when already on the home page. */
export function goToContactIntent(intent: ContactIntent): void {
  const hash = `#contact?intent=${intent}`;
  window.history.replaceState(null, "", hash);
  window.dispatchEvent(
    new CustomEvent("contact-intent", { detail: { intent } })
  );
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

export function isOnHomePage(): boolean {
  const path = window.location.pathname;
  return path === "/" || path === "";
}
