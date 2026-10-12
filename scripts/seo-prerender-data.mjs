/**
 * Keep in sync with src/lib/seo.ts, src/data/services.ts, and src/data/blog.ts.
 * Copied for Node post-build (no TS import / no new deps).
 * Expected route count: 13.
 */

export const SITE_URL = "https://www.techvergesolution.com";
export const SITE_NAME = "TechVerge Solutions";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`;
export const DEFAULT_OG_IMAGE_ALT =
  "TechVerge Solutions — AI automation and custom software";

export function absoluteUrl(path = "/") {
  if (!path || path === "/") return `${SITE_URL}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: ["Techverge Solution", "TechVerge", "Techverge"],
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/Logo.svg`,
        email: "info@techvergesolution.com",
        telephone: "+1-505-523-1081",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Albuquerque",
          addressRegion: "NM",
          addressCountry: "US",
        },
        areaServed: [
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "United Kingdom" },
          { "@type": "Country", name: "United Arab Emirates" },
          { "@type": "Country", name: "Saudi Arabia" },
        ],
        sameAs: [
          "https://www.linkedin.com/company/techverg-solution/",
          "https://www.instagram.com/techvergsolutions/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description:
          "TechVerge Solutions builds custom AI automation, voice agents, business workflows and software to help businesses reduce manual work and improve lead follow-up.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#professional-service`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        image: DEFAULT_OG_IMAGE,
        email: "info@techvergesolution.com",
        telephone: "+1-505-523-1081",
        areaServed: [
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "United Kingdom" },
          { "@type": "Country", name: "United Arab Emirates" },
          { "@type": "Country", name: "Saudi Arabia" },
        ],
        provider: { "@id": `${SITE_URL}/#organization` },
        description:
          "Custom AI automation, voice agents, business process automation, and software development. Primary market: US businesses; also serves UK, UAE, and Saudi Arabia remotely.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Automation & Software Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "AI Lead Follow-Up Automation",
                url: absoluteUrl("/services/ai-automation"),
                description:
                  "Custom workflows that respond to new enquiries and automate qualification and follow-up.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "AI Voice Agents",
                url: absoluteUrl("/services/ai-voice-agents"),
                description:
                  "Custom inbound call handling, caller qualification, and appointment scheduling support.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Business Process Automation",
                url: absoluteUrl("/services/business-automation"),
                description:
                  "Integration of forms, CRM, email, calendars, and internal systems.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "AI SaaS & Custom Software",
                url: absoluteUrl("/services/ai-saas-development"),
                description:
                  "Custom AI-powered applications and internal business tools.",
              },
            },
          ],
        },
      },
    ],
  };
}

export function serviceJsonLd(input) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Saudi Arabia" },
    ],
    serviceType: input.name,
  };
}

export function faqPageJsonLd(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function blogPostingJsonLd(input) {
  const url = absoluteUrl(input.path);
  const imageUrl = absoluteUrl(input.imagePath);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      ...(input.imageAlt ? { caption: input.imageAlt } : {}),
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/Logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "Blog",
      "@id": absoluteUrl("/blog"),
      name: `${SITE_NAME} Blog`,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  };
}

/** Exactly 13 routes — titles/descriptions from pageSeo + servicesConfig + blog. */
export const prerenderRoutes = [
  {
    path: "/",
    title: "AI Automation & Software Development | TechVerge Solutions",
    description:
      "TechVerge Solutions builds custom AI automation, voice agents, business workflows and software to help businesses reduce manual work and improve lead follow-up.",
    jsonLd: "organization",
  },
  {
    path: "/about",
    title: "About | TechVerge Solutions",
    description:
      "How TechVerge approaches AI automation and custom software — integration-first workflows, human + AI handoffs, and teams that ship practical systems for US businesses.",
  },
  {
    path: "/services",
    title: "Services | TechVerge Solutions",
    description:
      "Explore TechVerge services: AI lead follow-up automation, AI voice agents, business process automation, and custom AI SaaS development for US businesses.",
  },
  {
    path: "/services/ai-automation",
    title: "AI Lead Follow-Up Automation | TechVerge Solutions",
    description:
      "We design and implement custom AI lead follow-up automation for US businesses — faster response, qualification, and routing to your team.",
    service: {
      name: "AI Lead Follow-Up Automation",
      faq: [
        {
          question: "Is this a product we buy seats for?",
          answer:
            "No. We design and implement a custom follow-up system for your business. You keep ownership of the workflows and the accounts we connect — we are not selling a packaged AI product with monthly seats.",
        },
        {
          question: "How long does a typical engagement take?",
          answer:
            "Most focused lead follow-up builds land in a few weeks once we have access to your tools and clear qualification rules. Timeline depends on how many channels and CRM edge cases we need to cover.",
        },
        {
          question: "What do you need from us to get started?",
          answer:
            "Access to the systems where leads arrive today, examples of good replies, your qualification criteria, and a decision-maker who can approve routing rules. We do not need a perfect process — mapping the messy reality is part of discovery.",
        },
        {
          question: "Who owns the systems and data?",
          answer:
            "You do. We build on your CRM, inboxes, and preferred infrastructure wherever practical. Credentials stay under your control, and we document what was built so your team is not locked into undocumented magic.",
        },
        {
          question: "Will this replace our salespeople?",
          answer:
            "No. The goal is to handle repetitive first response and qualification so your people spend time on conversations that matter. We design explicit handoffs to humans for pricing, exceptions, and relationship work.",
        },
        {
          question: "What if our process is messy today?",
          answer:
            "That is normal. We start by documenting how work actually happens, then automate the highest-friction steps first — usually speed-to-lead and routing — before expanding.",
        },
      ],
    },
  },
  {
    path: "/services/ai-voice-agents",
    title: "Custom AI Voice Agents | TechVerge Solutions",
    description:
      "We design and implement custom inbound AI voice agents that handle common calls, qualify callers, and help schedule — with clear human handoffs.",
    service: {
      name: "AI Voice Agents",
      faq: [
        {
          question: "Is this a seat-based voice product?",
          answer:
            "No. We design and implement a custom inbound voice agent for your call types and systems. You are not buying a generic packaged product with per-seat pricing from TechVerge.",
        },
        {
          question: "Will callers know they are speaking with automation?",
          answer:
            "We follow the disclosure approach you approve. Many clients prefer clear, professional transparency plus a fast path to a human — we design that into the flow.",
        },
        {
          question: "What happens when the agent cannot help?",
          answer:
            "We define escalation rules up front: transfer to a person, take a message, book a callback, or send a summary to your team. The agent should not trap callers in a loop.",
        },
        {
          question: "How do you handle sensitive information?",
          answer:
            "We scope what the agent is allowed to collect, store, and say. Payment details, medical advice, and other sensitive topics can be excluded or handed to humans by design.",
        },
        {
          question: "What do you need from our side?",
          answer:
            "Sample call recordings or scripts if available, hours of operation, booking rules, FAQs, and access to calendar/CRM systems. A stakeholder who can approve tone and escalation is essential.",
        },
        {
          question: "How long until we can take live calls?",
          answer:
            "A focused inbound use case often reaches a pilot in a few weeks after access and scripts are ready. Broader multi-intent rollouts take longer because testing edge cases matters.",
        },
      ],
    },
  },
  {
    path: "/services/business-automation",
    title: "Business Process Automation | TechVerge Solutions",
    description:
      "We design and implement custom business automation that connects forms, CRM, email, calendars, and internal systems — reducing repetitive admin.",
    service: {
      name: "Business Process Automation",
      faq: [
        {
          question: "Do we have to move to your software?",
          answer:
            "No. We build automation on top of the systems you already use whenever possible. TechVerge is not selling a proprietary operations platform you must migrate into.",
        },
        {
          question: "Where should we start if everything feels manual?",
          answer:
            "Usually with the path that creates the most rework — often form-to-CRM, client onboarding, or status notifications. We pick one high-friction workflow, ship it well, then expand.",
        },
        {
          question: "What access do you need?",
          answer:
            "Read/write access to the tools in scope (or a sandbox), a process owner, and examples of correct vs incorrect records. We prefer least-privilege credentials and documented ownership.",
        },
        {
          question: "Who maintains the automations after launch?",
          answer:
            "We document what we built and can hand maintenance to your team, stay on for iteration, or train an internal owner. You own the accounts and the logic we implement.",
        },
        {
          question: "How do you handle failures?",
          answer:
            "We design alerts, retries, and human fallbacks for critical paths. Silent failure is worse than no automation — visibility is part of the build.",
        },
        {
          question: "Can you work with messy spreadsheets and legacy tools?",
          answer:
            "Yes, within reason. Sometimes the right first step is stabilizing data and naming conventions before full automation. We will tell you honestly if a tool needs a different approach.",
        },
      ],
    },
  },
  {
    path: "/services/ai-saas-development",
    title: "Custom AI SaaS & Software Development | TechVerge Solutions",
    description:
      "We design and build custom AI-powered applications and internal tools for your workflows — not a TechVerge SaaS product you subscribe to.",
    service: {
      name: "AI SaaS & Custom Software",
      faq: [
        {
          question: "Is this TechVerge's SaaS product?",
          answer:
            "No. We design and build software for you. You own the product and infrastructure decisions we agree on. We are not selling seats to a TechVerge-hosted packaged application.",
        },
        {
          question: "Who owns the code and IP?",
          answer:
            "Ownership is defined in the engagement agreement. In typical custom builds, you own the application we create for you, along with documentation and deployment access.",
        },
        {
          question: "How do you decide what AI should and should not do?",
          answer:
            "During design we mark which outputs need human review, which data sources are allowed, and which actions the system must never take automatically. Guardrails are a product decision, not an afterthought.",
        },
        {
          question: "What does a realistic timeline look like?",
          answer:
            "A focused MVP can often reach a usable pilot in a matter of weeks to a few months depending on integrations, compliance needs, and how defined the workflow already is. We phase delivery so you see working software early.",
        },
        {
          question: "What do you need from our team?",
          answer:
            "A product owner, access to subject-matter experts, sample data or documents (sanitized if needed), and clarity on users and success criteria. We can help sharpen the brief if it is still forming.",
        },
        {
          question: "Can you maintain the app after launch?",
          answer:
            "Yes — through an ongoing engagement — or we can hand off to your engineers with documentation and a clean repository. Maintenance expectations are set before build, not after.",
        },
      ],
    },
  },
  {
    path: "/portfolio",
    title: "Portfolio | TechVerge Solutions",
    description:
      "Selected TechVerge case studies — real automation and software projects described by problem, solution, and outcome, without invented metrics.",
  },
  {
    path: "/blog",
    title: "Blog | TechVerge Solutions",
    description:
      "Practical guides from TechVerge Solutions on AI voice agents, lead follow-up automation, and business workflows for US small and service businesses.",
  },
  {
    path: "/blog/ai-voice-agents-for-small-business-2026",
    title:
      "AI Voice Agents for Small Businesses in 2026: Use Cases, Costs, and Limitations | TechVerge Solutions",
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
    title: "Contact | TechVerge Solutions",
    description:
      "Contact TechVerge Solutions to discuss AI automation, voice agents, or custom software. Book a free strategy call or tell us about your workflow.",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy | TechVerge Solutions",
    description:
      "How TechVerge Solutions collects, uses, and protects personal information when you use our website and services.",
  },
  {
    path: "/terms-of-service",
    title: "Terms of Service | TechVerge Solutions",
    description:
      "Terms and conditions for using TechVerge Solutions websites and custom AI automation, voice agent, and software development services.",
  },
];

export const EXPECTED_ROUTE_COUNT = 13;
