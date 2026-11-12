import type { ServiceSlug } from "@/data/services";

export interface InternalGuideLink {
  slug: string;
  /** Descriptive anchor text — never "click here". */
  anchor: string;
  blurb: string;
}

/** Homepage → practical guides. */
export const HOMEPAGE_GUIDE_LINKS: InternalGuideLink[] = [
  {
    slug: "ai-voice-agents-for-small-business-2026",
    anchor: "AI voice agents for small businesses in 2026",
    blurb:
      "Use cases, limitations, and when human handoff matters for appointment-based teams.",
  },
  {
    slug: "ai-automation-small-business-2026",
    anchor: "seven AI automations small businesses should try first",
    blurb:
      "A practical shortlist of workflows, a 30-day approach, and how to measure results without vanity metrics.",
  },
  {
    slug: "n8n-ai-business-automation-2026",
    anchor: "how to automate your business with n8n and AI",
    blurb:
      "Seven n8n workflows for lead capture, follow-up, support routing, and reporting.",
  },
];

/** Service page → related guides (descriptive anchors). */
export const SERVICE_GUIDE_LINKS: Record<ServiceSlug, InternalGuideLink[]> = {
  "ai-voice-agents": [
    {
      slug: "ai-voice-agents-for-small-business-2026",
      anchor: "our guide to AI voice agents for small businesses",
      blurb:
        "Where inbound agents fit, and where they still fall short.",
    },
    {
      slug: "ai-voice-agents-for-small-businesses-how-they-work-cost",
      anchor: "what AI voice agents cost in 2026",
      blurb:
        "Per-minute fees, setup, and the charges a headline quote usually leaves out.",
    },
  ],
  "ai-automation": [
    {
      slug: "ai-automation-small-business-2026",
      anchor: "seven AI automations to implement first",
      blurb:
        "Lead capture, follow-up, support triage, and other high-ROI workflows for small teams.",
    },
    {
      slug: "n8n-ai-business-automation-2026",
      anchor: "n8n and AI workflows for lead follow-up",
      blurb:
        "How n8n connects CRM, email, and AI tools so new enquiries get answered faster.",
    },
  ],
  "business-automation": [
    {
      slug: "n8n-ai-business-automation-2026",
      anchor: "n8n business automation workflows for 2026",
      blurb:
        "Connect forms, CRM, calendars, and support tools without more copy-paste admin.",
    },
    {
      slug: "ai-automation-small-business-2026",
      anchor: "which back-office workflows to automate first",
      blurb:
        "A practical order of operations for small businesses that are drowning in repetitive work.",
    },
  ],
  "ai-saas-development": [
    {
      slug: "ai-automation-small-business-2026",
      anchor: "when custom AI software beats another SaaS seat",
      blurb:
        "How to decide whether you need a workflow, an agent, or a purpose-built application.",
    },
    {
      slug: "n8n-ai-business-automation-2026",
      anchor: "n8n as a bridge before a full custom build",
      blurb:
        "Use automation to prove the workflow, then graduate to custom software when the product shape is clear.",
    },
  ],
};
