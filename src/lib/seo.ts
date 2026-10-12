export const SITE_URL = "https://www.techvergesolution.com";
export const SITE_NAME = "TechVerge Solutions";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`;
export const DEFAULT_OG_IMAGE_ALT = "TechVerge Solutions — AI automation and custom software";

/** Title pattern: `[Page Name] | TechVerge Solutions` */
export function formatPageTitle(pageName: string): string {
  return `${pageName} | ${SITE_NAME}`;
}

export interface PageSeoConfig {
  title: string;
  description: string;
  path: string;
}

/**
 * Central SEO for static routes. Service pages use `pageTitle` / `metaDescription`
 * from `src/data/services.ts` (same title pattern).
 */
export const pageSeo = {
  home: {
    title: formatPageTitle("AI Automation & Software Development"),
    description:
      "TechVerge Solutions builds custom AI automation, voice agents, business workflows and software to help businesses reduce manual work and improve lead follow-up.",
    path: "/",
  },
  about: {
    title: formatPageTitle("About"),
    description:
      "How TechVerge approaches AI automation and custom software — integration-first workflows, human + AI handoffs, and teams that ship practical systems for US businesses.",
    path: "/about",
  },
  services: {
    title: formatPageTitle("Services"),
    description:
      "Explore TechVerge services: AI lead follow-up automation, AI voice agents, business process automation, and custom AI SaaS development for US businesses.",
    path: "/services",
  },
  portfolio: {
    title: formatPageTitle("Portfolio"),
    description:
      "Selected TechVerge case studies — real automation and software projects described by problem, solution, and outcome, without invented metrics.",
    path: "/portfolio",
  },
  contact: {
    title: formatPageTitle("Contact"),
    description:
      "Contact TechVerge Solutions to discuss AI automation, voice agents, or custom software. Book a free strategy call or tell us about your workflow.",
    path: "/contact",
  },
  privacyPolicy: {
    title: formatPageTitle("Privacy Policy"),
    description:
      "How TechVerge Solutions collects, uses, and protects personal information when you use our website and services.",
    path: "/privacy-policy",
  },
  termsOfService: {
    title: formatPageTitle("Terms of Service"),
    description:
      "Terms and conditions for using TechVerge Solutions websites and custom AI automation, voice agent, and software development services.",
    path: "/terms-of-service",
  },
  blog: {
    title: formatPageTitle("Blog"),
    description:
      "Practical guides from TechVerge Solutions on AI voice agents, lead follow-up automation, and business workflows for US small and service businesses.",
    path: "/blog",
  },
  notFound: {
    title: formatPageTitle("Page Not Found"),
    description:
      "The page you requested could not be found on TechVerge Solutions.",
    path: "/",
  },
} as const satisfies Record<string, PageSeoConfig>;

export const HOME_TITLE = pageSeo.home.title;
export const HOME_DESCRIPTION = pageSeo.home.description;

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
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Saudi Arabia" },
    ],
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

export function blogPostingJsonLd(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  imagePath: string;
  imageAlt?: string;
}) {
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
