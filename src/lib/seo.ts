import {
  AREA_SERVED_COUNTRIES,
  DEFAULT_BLOG_AUTHOR,
  ORG_ADDRESS,
  ORG_SECONDARY_ADDRESS,
  ORG_DESCRIPTION,
  ORG_NAME,
  ORG_SCHEMA_NAME,
  ORG_PHONE_LINES,
  organizationSameAs,
  organizationSchemaContact,
  organizationSchemaPriceRange,
} from "@/data/organizationProfiles";
import { siteUrl, siteName } from "./seo/config";

export const SITE_URL = siteUrl;
export const SITE_NAME = siteName || ORG_NAME;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`;
export const DEFAULT_OG_IMAGE_ALT = "TechVerge Solution — AI automation and custom software";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PROFESSIONAL_SERVICE_ID = `${SITE_URL}/#professional-service`;

/** Title pattern: `[Page Name] | TechVerge Solution` */
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
    title: formatPageTitle("AI Automation & Voice Agents"),
    description: ORG_DESCRIPTION,
    path: "/",
  },
  about: {
    title: formatPageTitle("About"),
    description:
      "Meet TechVerge Solution: we design custom AI automation, voice agents, and software for small businesses in the United States, United Kingdom, and UAE.",
    path: "/about",
  },
  aiFacts: {
    title: formatPageTitle("AI Facts"),
    description:
      "Plain facts about TechVerge Solution: who we serve, where we work, which services we build, typical timelines, how pricing starts, and how to contact us.",
    path: "/ai-facts",
  },
  services: {
    title: formatPageTitle("Services"),
    description:
      "Explore TechVerge services: AI lead follow-up, inbound voice agents, business process automation, custom websites, mobile apps, and AI software for your team.",
    path: "/services",
  },
  portfolio: {
    title: formatPageTitle("Portfolio"),
    description:
      "Real projects: problem, solution, result. Selected TechVerge case studies in automation, voice agents, websites, and custom software.",
    path: "/portfolio",
  },
  locations: {
    title: formatPageTitle("Locations"),
    description:
      "Cities we serve in the United States, United Kingdom, and UAE for AI automation, voice agents, websites, mobile apps, and custom software.",
    path: "/locations",
  },
  contact: {
    title: formatPageTitle("Contact"),
    description:
      "Contact TechVerge Solution to discuss AI automation, voice agents, or custom software. Book a strategy call or describe how your workflow works today.",
    path: "/contact",
  },
  privacyPolicy: {
    title: formatPageTitle("Privacy Policy"),
    description:
      "How TechVerge Solution collects, uses, stores, and protects personal information when you visit our site, request a quote, or use our services.",
    path: "/privacy-policy",
  },
  termsOfService: {
    title: formatPageTitle("Terms of Service"),
    description:
      "Terms for using TechVerge Solution websites and commissioning custom AI automation, voice agents, websites, apps, and software for your business.",
    path: "/terms-of-service",
  },
  blog: {
    title: formatPageTitle("AI Automation Guides"),
    description:
      "Practical TechVerge guides on AI voice agents, lead follow-up, and workflow automation for small and service businesses — clear, specific, and jargon-light.",
    path: "/blog",
  },
  notFound: {
    title: formatPageTitle("Page Not Found"),
    description:
      "The page you requested could not be found on TechVerge Solution.",
    path: "/",
  },
} as const satisfies Record<string, PageSeoConfig>;

export const HOME_TITLE = pageSeo.home.title;
export const HOME_DESCRIPTION = pageSeo.home.description;

/** Force https://www host for same-site URLs (canonical / og:url). */
export function toWwwSiteUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname === "techvergesolution.com" ||
      parsed.hostname === "www.techvergesolution.com"
    ) {
      parsed.protocol = "https:";
      parsed.hostname = "www.techvergesolution.com";
      return parsed.href;
    }
  } catch {
    /* not a URL */
  }
  return url;
}

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  // Already-absolute URLs (e.g. Sanity CDN) must not be prefixed with SITE_URL.
  if (/^https?:\/\//i.test(path)) {
    return toWwwSiteUrl(path);
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

function areaServedNodes() {
  return AREA_SERVED_COUNTRIES.map((name) => ({
    "@type": "Country" as const,
    name,
  }));
}

function postalAddressNode() {
  return { "@type": "PostalAddress" as const, ...ORG_ADDRESS };
}

function secondaryPostalAddressNode() {
  return { "@type": "PostalAddress" as const, ...ORG_SECONDARY_ADDRESS };
}

export function organizationNode() {
  const contact = organizationSchemaContact();
  const sameAs = organizationSameAs();
  return {
    "@type": ["Organization", "LocalBusiness"] as const,
    "@id": ORGANIZATION_ID,
    name: ORG_SCHEMA_NAME,
    alternateName: ["Tech Verge Solution", "Techverge Solution", "TechVerge", "Techverge"],
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/Logo.svg`,
    },
    description: ORG_DESCRIPTION,
    ...organizationSchemaPriceRange(),
    address: postalAddressNode(),
    location: {
      "@type": "Place" as const,
      name: "Secondary office",
      address: secondaryPostalAddressNode(),
    },
    areaServed: areaServedNodes(),
    ...contact,
    ...(ORG_PHONE_LINES.length || contact.email
      ? {
          contactPoint:
            ORG_PHONE_LINES.length > 1
              ? ORG_PHONE_LINES.map((line, index) => ({
                  "@type": "ContactPoint" as const,
                  telephone: line.tel,
                  contactType: "sales",
                  ...(index === 0 && contact.email ? { email: contact.email } : {}),
                  areaServed: areaServedNodes(),
                  availableLanguage: ["English"],
                }))
              : {
                  "@type": "ContactPoint" as const,
                  ...contact,
                  contactType: "sales",
                  areaServed: areaServedNodes(),
                  availableLanguage: ["English"],
                },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function webSiteNode() {
  return {
    "@type": "WebSite" as const,
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: HOME_DESCRIPTION,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-US",
  };
}

export function professionalServiceNode() {
  const contact = organizationSchemaContact();
  const sameAs = organizationSameAs();
  return {
    "@type": ["ProfessionalService", "LocalBusiness"] as const,
    "@id": PROFESSIONAL_SERVICE_ID,
    name: ORG_SCHEMA_NAME,
    url: `${SITE_URL}/`,
    image: DEFAULT_OG_IMAGE,
    ...contact,
    ...organizationSchemaPriceRange(),
    address: postalAddressNode(),
    areaServed: areaServedNodes(),
    provider: { "@id": ORGANIZATION_ID },
    description: ORG_DESCRIPTION,
    ...(sameAs.length ? { sameAs } : {}),
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
  };
}

/** Organization + WebSite (+ ProfessionalService catalog) for every page. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), webSiteNode(), professionalServiceNode()],
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    areaServed: areaServedNodes(),
    serviceType: input.serviceType ?? input.name,
  };
}

export function faqPageJsonLd(faq: { question: string; answer: string }[]) {
  if (!faq.length) return null;
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
  authorName?: string;
  authorPath?: string;
}) {
  const url = absoluteUrl(input.path);
  const imageUrl = absoluteUrl(input.imagePath);
  const authorName = input.authorName?.trim() || DEFAULT_BLOG_AUTHOR.name;
  const authorUrl = absoluteUrl(input.authorPath || DEFAULT_BLOG_AUTHOR.path);

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
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author: {
      "@type": "Person",
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
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
      publisher: { "@id": ORGANIZATION_ID },
    },
  };
}

export function blogIndexJsonLd(
  posts: { title: string; path: string; datePublished: string }[],
) {
  const blogUrl = absoluteUrl("/blog");
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": blogUrl,
    name: `${SITE_NAME} Blog`,
    description: pageSeo.blog.description,
    url: blogUrl,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-US",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(post.path),
      datePublished: post.datePublished,
    })),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(post.path),
        name: post.title,
      })),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Flatten page-specific graphs, dropping null/empty FAQ blocks. */
export function composeJsonLd(
  ...blocks: Array<Record<string, unknown> | null | undefined | false>
): Record<string, unknown>[] {
  return blocks.filter(
    (block): block is Record<string, unknown> =>
      Boolean(block) && typeof block === "object",
  );
}
