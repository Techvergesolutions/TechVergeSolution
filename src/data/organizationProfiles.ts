/**
 * Single source for Organization / sameAs / contact used by JSON-LD and the footer.
 * Add Clutch as https://clutch.co/profile/<slug> once the public company page exists.
 */

export const ORG_NAME = "TechVerge Solutions";
export const ORG_EMAIL = "info@techvergesolution.com";
export const ORG_TELEPHONE = "+1-505-523-1081";
export const ORG_TELEPHONE_DISPLAY = "+1 (505) 523-1081";

export const ORG_DESCRIPTION =
  "Custom AI automation and voice agents for small businesses in the US, UK, and UAE—built by TechVerge Solutions to cut manual work and catch more leads.";

/** Countries listed in Organization.areaServed (matches primary marketing copy). */
export const AREA_SERVED_COUNTRIES = [
  "United States",
  "United Kingdom",
  "United Arab Emirates",
] as const;

export const ORG_ADDRESS = {
  addressLocality: "Albuquerque",
  addressRegion: "NM",
  addressCountry: "US",
} as const;

export const ORG_ADDRESS_DISPLAY = "Albuquerque, New Mexico, USA";
export const ORG_SITE_HOST = "techvergesolution.com";

/** Public profile URLs for schema.org sameAs (no login/settings URLs). */
export const SOCIAL_PROFILES = {
  linkedin: "https://www.linkedin.com/company/techverg-solution/",
  instagram: "https://www.instagram.com/techvergsolutions/",
  facebook: "https://www.facebook.com/profile.php?id=61579426794497",
  github: "https://github.com/solutiontechverge-hub",
  trustpilot: "https://www.trustpilot.com/users/6ae4b71dd0b152fb750a51f5",
} as const;

export type SocialProfileKey = keyof typeof SOCIAL_PROFILES;

/** Footer / UI links (icons live in Footer; WhatsApp is contact, not sameAs). */
export const FOOTER_SOCIAL_LINKS: {
  name: string;
  href: string;
  key: SocialProfileKey | "whatsapp";
}[] = [
  { name: "LinkedIn", href: SOCIAL_PROFILES.linkedin, key: "linkedin" },
  { name: "Instagram", href: SOCIAL_PROFILES.instagram, key: "instagram" },
  { name: "Facebook", href: SOCIAL_PROFILES.facebook, key: "facebook" },
  { name: "GitHub", href: SOCIAL_PROFILES.github, key: "github" },
];

/** Absolute profile URLs for Organization.sameAs (includes placeholders to fill later). */
export function organizationSameAs(): string[] {
  return Object.values(SOCIAL_PROFILES);
}

/** Default blog byline author — visible on posts; Person.url points at About. */
export const DEFAULT_BLOG_AUTHOR = {
  name: ORG_NAME,
  path: "/about",
} as const;
