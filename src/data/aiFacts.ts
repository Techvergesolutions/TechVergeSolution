import {
  ORG_ADDRESS_DISPLAY,
  ORG_EMAIL,
  ORG_NAME,
  ORG_PHONE_LINES,
  ORG_STARTING_PRICE_USD,
} from "@/data/organizationProfiles";

export interface AiFact {
  label: string;
  text: string;
}

/** Plain-language facts for /ai-facts — keep aligned with About, services FAQs, and NAP. */
export const AI_FACTS: AiFact[] = [
  {
    label: "What we do",
    text: `${ORG_NAME} designs and implements custom AI automation, inbound voice agents, business process automation, and AI-powered software around your tools and handoffs. We are not selling a packaged seat-based product.`,
  },
  {
    label: "Who we serve",
    text: "Small and service businesses that need faster lead follow-up, fewer missed calls, cleaner CRM updates, or custom software—especially teams that have outgrown manual admin and one-size-fits-all tools.",
  },
  {
    label: "Countries",
    text: `We primarily serve businesses in the United States, and also work with clients in the United Kingdom and the United Arab Emirates. Delivery is remote. We are based in ${ORG_ADDRESS_DISPLAY} and do not claim local offices in every market we support.`,
  },
  {
    label: "Services",
    text: "AI lead follow-up automation; AI voice agents for inbound calls and scheduling support; business process automation across forms, CRM, email, and calendars; and custom AI SaaS / software development that you own.",
  },
  {
    label: "Typical timelines",
    text: "A focused lead follow-up or inbound voice use case often reaches a usable pilot in a few weeks after tool access, scripts, and qualification rules are ready. Broader multi-intent or custom software work usually takes longer—weeks to a few months—depending on integrations and how defined the workflow already is. We phase delivery so you see working software early.",
  },
  {
    label: "How pricing works",
    text: `Engagements are scoped custom builds, not monthly seats on a TechVerge product. Many focused projects start from about $${ORG_STARTING_PRICE_USD} USD; final pricing depends on channels, integrations, call or lead volume complexity, and scope. We outline fit and next steps after a discovery conversation; deposits and payment terms are set in the engagement agreement before build work begins.`,
  },
  {
    label: "How to contact us",
    text: `Use the contact form or book a strategy call at /contact, email ${ORG_EMAIL}, or call ${ORG_PHONE_LINES.map((line) => line.display).join(" or ")}. WhatsApp is also available from the site footer for quick project questions.`,
  },
];

export const AI_FACTS_INTRO =
  "Plain facts about TechVerge Solutions for people and tools that want a short, accurate summary. Details and examples live on the linked service and About pages.";
