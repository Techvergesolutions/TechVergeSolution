export const SITE_URL = "https://www.techvergesolution.com";
export const SITE_NAME = "TechVerge Solutions";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`;
export const DEFAULT_OG_IMAGE_ALT = "TechVerge Solutions — AI automation and custom software";

export const HOME_TITLE =
  "AI Automation & Software Development for US Businesses | TechVerge";
export const HOME_DESCRIPTION =
  "TechVerge builds AI automation, voice agents, custom software and SaaS solutions that help US businesses automate operations, respond faster and convert more leads.";

export function absoluteUrl(path = "/"): string {
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
        areaServed: {
          "@type": "Country",
          name: "United States",
        },
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
        description: HOME_DESCRIPTION,
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
        areaServed: {
          "@type": "Country",
          name: "United States",
        },
        provider: { "@id": `${SITE_URL}/#organization` },
        description:
          "Custom AI automation, voice agents, business process automation, and software development for US businesses.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Automation & Software Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "AI Lead Follow-Up Automation",
                url: absoluteUrl("/ai-automation"),
                description:
                  "Custom workflows that respond to new enquiries and automate qualification and follow-up.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "AI Voice Agents",
                url: absoluteUrl("/ai-voice-agents"),
                description:
                  "Custom inbound call handling, caller qualification, and appointment scheduling support.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Business Process Automation",
                url: absoluteUrl("/business-automation"),
                description:
                  "Integration of forms, CRM, email, calendars, and internal systems.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "AI SaaS & Custom Software",
                url: absoluteUrl("/ai-saas-development"),
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

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
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
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    serviceType: input.name,
  };
}

export function faqPageJsonLd(faq: { question: string; answer: string }[]) {
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
