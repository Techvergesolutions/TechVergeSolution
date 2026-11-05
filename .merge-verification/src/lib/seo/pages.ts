import { siteName as SITE_NAME, defaultDescription } from "./config";

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
      defaultDescription,
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

