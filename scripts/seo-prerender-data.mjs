/**
 * Keep in sync with src/lib/seo.ts, src/data/services.ts, and src/data/blog.ts.
 * Shared config is imported directly using Node TypeScript support.
 * Expected route count: 13.
 */

import { loadEnv } from "vite";
const env = loadEnv(process.env.SEO_BUILD_MODE || "production", process.cwd(), "NEXT_PUBLIC_");
for (const [key, value] of Object.entries(env)) process.env[key] ??= value;
const { siteUrl: SITE_URL, siteName: SITE_NAME, defaultDescription, defaultOgImage, absoluteUrl } = await import("../src/lib/seo/config.ts");
export { SITE_URL, SITE_NAME, absoluteUrl, defaultDescription };
export const DEFAULT_OG_IMAGE = absoluteUrl(defaultOgImage);
export const DEFAULT_OG_IMAGE_ALT = `${SITE_NAME} — AI automation and custom software`;

const { organizationJsonLd, serviceJsonLd, faqPageJsonLd, articleJsonLd, visibleFaqs, serializeJsonLd } = await import("../src/lib/seo/schema.ts");
export { organizationJsonLd, serviceJsonLd, faqPageJsonLd, articleJsonLd, visibleFaqs, serializeJsonLd };

/** Static route metadata; service routes are loaded from Sanity at build time. */
export const prerenderRoutes = [
  {
    path: "/",
    title: `AI Automation & Software Development | ${SITE_NAME}`,
    description:
      defaultDescription,
    jsonLd: "organization",
  },
  {
    path: "/about",
    title: `About | ${SITE_NAME}`,
    description:
      "How TechVerge approaches AI automation and custom software — integration-first workflows, human + AI handoffs, and teams that ship practical systems for US businesses.",
  },
  {
    path: "/services",
    title: `Services | ${SITE_NAME}`,
    description:
      "Explore TechVerge services: AI lead follow-up automation, AI voice agents, business process automation, and custom AI SaaS development for US businesses.",
  },
  {
    path: "/portfolio",
    title: `Portfolio | ${SITE_NAME}`,
    description:
      "Selected TechVerge case studies — real automation and software projects described by problem, solution, and outcome, without invented metrics.",
  },
  {
    path: "/blog",
    title: `Blog | ${SITE_NAME}`,
    description:
      "Practical guides from TechVerge Solutions on AI voice agents, lead follow-up automation, and business workflows for US small and service businesses.",
  },
  {
    path: "/blog/ai-voice-agents-for-small-business-2026",
    title:
      `AI Voice Agents for Small Businesses in 2026: Use Cases, Costs, and Limitations | ${SITE_NAME}`,
    description:
      "A practical guide for US small and appointment-based businesses on AI voice agents in 2026 — suitable use cases, cost drivers, limitations, privacy basics, and when human handoff matters.",
    ogImage: `${SITE_URL}/images/blog/ai-voice-agents-hero.webp`,
    ogImageAlt:
      "AI voice agents for small businesses — headset workstation illustration",
    ogType: "article",
    article: {
      title:
        "AI Voice Agents for Small Businesses in 2026: Use Cases, Costs, and Limitations",
      datePublished: "2026-10-12",
      dateModified: "2026-10-12",
      imagePath: "/images/blog/ai-voice-agents-hero.webp",
      imageAlt:
        "AI voice agents for small businesses — headset workstation illustration",
      faq: [
        {
          question:
            "Will callers know they are talking to an AI voice agent?",
          answer:
            "That depends on your disclosure policy. Many US small businesses choose clear, professional transparency plus an easy path to a human. Build the wording into the opening script rather than leaving it to chance.",
        },
        {
          question:
            "Can an AI voice agent replace our receptionist entirely?",
          answer:
            "Usually not as a full replacement. Most successful setups cover a defined set of call types — after-hours intake, FAQs, booking — and escalate exceptions. Think coverage and consistency, not a one-for-one headcount swap.",
        },
        {
          question:
            "How long does a focused inbound pilot usually take?",
          answer:
            "A narrow use case can often reach a pilot in a few weeks once calendar or CRM access, scripts, and escalation rules are ready. Broader multi-intent rollouts take longer because edge-case testing matters.",
        },
        {
          question: "What do we need before we start?",
          answer:
            "Examples of real calls or scripts, hours of operation, booking rules, FAQs, a list of what the agent must never say or do, and a stakeholder who can approve tone and handoffs. Messy processes are normal — documenting them is part of discovery.",
        },
        {
          question:
            "Do we have to change our phone carrier or CRM?",
          answer:
            "Not always. Many builds connect to the tools you already use. The right answer depends on call routing, recording requirements, and how your team works today — discovery should map that before anyone promises a stack switch.",
        },
      ],
    },
  },
  {
    path: "/contact",
    title: `Contact | ${SITE_NAME}`,
    description:
      "Contact TechVerge Solutions to discuss AI automation, voice agents, or custom software. Book a free strategy call or tell us about your workflow.",
  },
  {
    path: "/privacy-policy",
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
      "How TechVerge Solutions collects, uses, and protects personal information when you use our website and services.",
  },
  {
    path: "/terms-of-service",
    title: `Terms of Service | ${SITE_NAME}`,
    description:
      "Terms and conditions for using TechVerge Solutions websites and custom AI automation, voice agent, and software development services.",
  },
];
