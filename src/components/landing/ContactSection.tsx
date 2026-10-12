import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection";
import { Send, MapPin, Mail, Phone, CheckCircle, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  BOOKING_CTA_LABEL,
  getBookingUrl,
  isHttpUrl,
} from "@/lib/booking";
import { trackEvent } from "@/lib/analytics";

const INTENT_PRESETS: Record<string, string> = {
  strategy:
    "I'd like to book a free strategy call to discuss AI automation opportunities for our business.",
  audit:
    "I'd like a free workflow audit — please help us review where leads, calls, and follow-ups can be automated.",
  similar:
    "I'd like to discuss a project similar to one of your case studies — please help us explore scope and next steps.",
};

const AUTOMATE_OPTIONS = [
  "Lead follow-up",
  "Customer support",
  "Appointment booking",
  "AI voice agent",
  "CRM automation",
  "Internal operations",
  "AI SaaS / custom software",
  "Other",
] as const;

const VOLUME_OPTIONS = ["Under 50", "50–100", "100–500", "500+"] as const;

const BUDGET_OPTIONS = [
  "Under $1,500",
  "$1,500–$3,000",
  "$3,000–$5,000",
  "$5,000–$10,000",
  "$10,000+",
] as const;

const BLOCKED_DOMAINS = [
  "test.com",
  "example.com",
  "abc.com",
  "none.com",
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
];

const CONTACT_EMAIL = "info@techvergesolution.com";

type FormData = {
  name: string;
  email: string;
  company: string;
  website: string;
  automate: string;
  volume: string;
  currentTools: string;
  budget: string;
  message: string;
  /** Honeypot — must stay empty */
  company_fax: string;
};

const emptyForm: FormData = {
  name: "",
  email: "",
  company: "",
  website: "",
  automate: "",
  volume: "",
  currentTools: "",
  budget: "",
  message: "",
  company_fax: "",
};

const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-3 rounded-lg bg-muted border ${
    hasError ? "border-red-500" : "border-border"
  } focus:border-primary outline-none transition-all min-h-[48px]`;

export const ContactSection = () => {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const formStartedAt = useRef(Date.now());
  const formStartTracked = useRef(false);

  const markFormStart = () => {
    if (formStartTracked.current) return;
    formStartTracked.current = true;
    trackEvent("contact_form_start");
  };

  useEffect(() => {
    const applyIntent = (intent?: string | null) => {
      if (!intent || !INTENT_PRESETS[intent]) return;
      setFormData((prev) => ({
        ...prev,
        message: prev.message.trim() ? prev.message : INTENT_PRESETS[intent],
      }));
    };

    const fromHash = () => {
      const hash = window.location.hash;
      const queryIndex = hash.indexOf("?");
      if (queryIndex === -1) return;
      const params = new URLSearchParams(hash.slice(queryIndex + 1));
      applyIntent(params.get("intent"));
    };

    fromHash();

    const onIntent = (e: Event) => {
      const detail = (e as CustomEvent<{ intent?: string }>).detail;
      applyIntent(detail?.intent);
    };

    window.addEventListener("hashchange", fromHash);
    window.addEventListener("contact-intent", onIntent as EventListener);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("contact-intent", onIntent as EventListener);
    };
  }, []);

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const domain = formData.email.split("@")[1]?.toLowerCase();

    if (!formData.name.trim()) newErrors.name = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Work email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (domain && BLOCKED_DOMAINS.includes(domain)) {
      newErrors.email = "Please use a work email address";
    }

    if (!formData.company.trim()) newErrors.company = "Company is required";

    if (formData.website.trim()) {
      try {
        const url = new URL(
          formData.website.startsWith("http")
            ? formData.website
            : `https://${formData.website}`
        );
        if (!["http:", "https:"].includes(url.protocol)) {
          newErrors.website = "Please enter a valid URL";
        }
      } catch {
        newErrors.website = "Please enter a valid URL";
      }
    }

    if (!formData.automate) newErrors.automate = "Please select what you'd like to automate";
    if (!formData.volume) newErrors.volume = "Please select approximate volume";
    if (!formData.budget) newErrors.budget = "Please select an estimated budget";

    if (formData.message.trim().length < 15) {
      newErrors.message = "Please provide a bit more detail (min. 15 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setStatus("submitting");

    try {
      const websiteNormalized = formData.website.trim()
        ? formData.website.startsWith("http")
          ? formData.website.trim()
          : `https://${formData.website.trim()}`
        : "";

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_name: formData.name.trim(),
          reply_to: formData.email.trim(),
          company_name: formData.company.trim(),
          website: websiteNormalized,
          automate: formData.automate,
          volume: formData.volume,
          current_tools: formData.currentTools.trim(),
          budget: formData.budget,
          message: formData.message.trim(),
          company_fax: formData.company_fax,
          form_started_at: formStartedAt.current,
        }),
      });

      if (response.ok) {
        trackEvent("contact_form_submit");
        setStatus("success");
        setFormData(emptyForm);
        formStartedAt.current = Date.now();
        setErrors({});
        setTimeout(() => setStatus("idle"), 6000);
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          (err as { error?: string }).error || "Failed to send. Please try again."
        );
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
      setStatus("idle");
    }
  };

  const bookingUrl = getBookingUrl();
  const bookingHref =
    bookingUrl ??
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Strategy Call Request")}`;
  const bookingIsExternal = isHttpUrl(bookingHref);

  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-14 md:mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Contact
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            Tell Us About Your Project
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Share how leads, calls, and follow-ups work today. We'll review your workflow and
            respond with next steps — no packaged product pitch.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <AnimatedSection delay={0.1}>
            {status === "success" ? (
              <div
                className="glass-card p-8 rounded-2xl border border-border/50 bg-black/20 backdrop-blur-sm text-center space-y-4"
                role="status"
                aria-live="polite"
              >
                <CheckCircle className="w-12 h-12 text-primary mx-auto" />
                <h3 className="font-display text-xl font-bold">Inquiry sent</h3>
                <p className="text-muted-foreground">
                  Thanks — we'll review your workflow and get back to you.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                onFocusCapture={markFormStart}
                onChangeCapture={markFormStart}
                className="glass-card p-6 sm:p-8 rounded-2xl space-y-5 border border-border/50 bg-black/20 backdrop-blur-sm"
                noValidate
              >
                {/* Honeypot — hidden from users */}
                <div
                  className="absolute -left-[9999px] opacity-0 h-0 w-0 overflow-hidden"
                  aria-hidden="true"
                >
                  <label htmlFor="contact-company-fax">Company fax</label>
                  <input
                    id="contact-company-fax"
                    type="text"
                    name="company_fax"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.company_fax}
                    onChange={(e) => setField("company_fax", e.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="contact-name">
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setField("name", e.target.value)}
                      className={inputClass(!!errors.name)}
                      placeholder="Jane Smith"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="contact-name-error" className="text-red-500 text-xs mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="contact-email">
                      Work Email <span className="text-primary">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setField("email", e.target.value)}
                      className={inputClass(!!errors.email)}
                      placeholder="jane@company.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="contact-email-error" className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="contact-company">
                      Company <span className="text-primary">*</span>
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      autoComplete="organization"
                      value={formData.company}
                      onChange={(e) => setField("company", e.target.value)}
                      className={inputClass(!!errors.company)}
                      placeholder="Acme Inc."
                      aria-invalid={!!errors.company}
                      aria-describedby={errors.company ? "contact-company-error" : undefined}
                    />
                    {errors.company && (
                      <p id="contact-company-error" className="text-red-500 text-xs mt-1">
                        {errors.company}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="contact-website">
                      Website <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <input
                      id="contact-website"
                      type="url"
                      autoComplete="url"
                      value={formData.website}
                      onChange={(e) => setField("website", e.target.value)}
                      className={inputClass(!!errors.website)}
                      placeholder="https://company.com"
                      aria-invalid={!!errors.website}
                      aria-describedby={errors.website ? "contact-website-error" : undefined}
                    />
                    {errors.website && (
                      <p id="contact-website-error" className="text-red-500 text-xs mt-1">
                        {errors.website}
                      </p>
                    )}
                  </div>
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium mb-1">
                    What would you like to automate? <span className="text-primary">*</span>
                  </legend>
                  <select
                    id="contact-automate"
                    value={formData.automate}
                    onChange={(e) => setField("automate", e.target.value)}
                    className={inputClass(!!errors.automate)}
                    aria-invalid={!!errors.automate}
                    aria-describedby={errors.automate ? "contact-automate-error" : undefined}
                  >
                    <option value="">Select an option</option>
                    {AUTOMATE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.automate && (
                    <p id="contact-automate-error" className="text-red-500 text-xs mt-1">
                      {errors.automate}
                    </p>
                  )}
                </fieldset>

                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium mb-1">
                    Approximate monthly lead/customer volume{" "}
                    <span className="text-primary">*</span>
                  </legend>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {VOLUME_OPTIONS.map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg border cursor-pointer text-sm min-h-[48px] transition-colors ${
                          formData.volume === opt
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-muted hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="volume"
                          value={opt}
                          checked={formData.volume === opt}
                          onChange={() => setField("volume", opt)}
                          className="sr-only"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {errors.volume && (
                    <p className="text-red-500 text-xs mt-1" role="alert">
                      {errors.volume}
                    </p>
                  )}
                </fieldset>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="contact-tools">
                    Current tools / CRM{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    id="contact-tools"
                    type="text"
                    value={formData.currentTools}
                    onChange={(e) => setField("currentTools", e.target.value)}
                    className={inputClass()}
                    placeholder="e.g. HubSpot, Salesforce, Google Sheets…"
                  />
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium mb-1">
                    Estimated project budget <span className="text-primary">*</span>
                  </legend>
                  <select
                    id="contact-budget"
                    value={formData.budget}
                    onChange={(e) => setField("budget", e.target.value)}
                    className={inputClass(!!errors.budget)}
                    aria-invalid={!!errors.budget}
                    aria-describedby={errors.budget ? "contact-budget-error" : undefined}
                  >
                    <option value="">Select a range</option>
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.budget && (
                    <p id="contact-budget-error" className="text-red-500 text-xs mt-1">
                      {errors.budget}
                    </p>
                  )}
                </fieldset>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="contact-message">
                    Additional details <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setField("message", e.target.value)}
                    className={`${inputClass(!!errors.message)} resize-none min-h-[120px]`}
                    placeholder="Describe your current workflow, pain points, and what success looks like…"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="contact-message-error" className="text-red-500 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="btn-primary w-full py-4 rounded-xl text-primary-foreground font-semibold flex items-center justify-center gap-2 min-h-[52px]"
                  whileHover={{ scale: status === "submitting" ? 1 : 1.01 }}
                  whileTap={{ scale: status === "submitting" ? 1 : 0.99 }}
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                  {status === "submitting" ? "Sending..." : "Submit Project Inquiry"}
                </motion.button>

                <div className="pt-2 text-center space-y-3 border-t border-border/40">
                  <p className="text-sm text-muted-foreground">Prefer to talk now?</p>
                  <a
                    href={bookingHref}
                    {...(bookingIsExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="btn-outline-glow inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-foreground font-semibold w-full sm:w-auto min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={BOOKING_CTA_LABEL}
                    onClick={() => trackEvent("booking_cta_click", { placement: "contact" })}
                  >
                    <Calendar size={18} />
                    {BOOKING_CTA_LABEL}
                  </a>
                </div>
              </form>
            )}
          </AnimatedSection>

          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-display">What to expect</h3>
              <ul className="space-y-4">
                {[
                  "A conversation about your current lead and follow-up workflow",
                  "Clear recommendations on what to automate vs. keep human",
                  "Optional free workflow audit of a specific process",
                  "Custom build approach — not a packaged SaaS upsell",
                  "Straightforward next steps if we're a fit",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="text-primary w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-8 rounded-2xl space-y-6 border border-border/50 bg-black/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">Albuquerque, New Mexico, USA</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => trackEvent("email_click", { placement: "contact" })}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <a
                    href="tel:+15055231081"
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => trackEvent("phone_click", { placement: "contact" })}
                  >
                    +1 (505) 523-1081
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
