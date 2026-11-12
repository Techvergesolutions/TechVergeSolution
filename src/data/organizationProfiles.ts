/**
 * Single source for Organization / sameAs / contact used by JSON-LD and the footer.
 *
 * TODO checklist (fill before launch schema review):
 * - ORG_TELEPHONE / ORG_TELEPHONE_DISPLAY — public phone (E.164 + display)
 * - ORG_EMAIL — confirm public inbox for schema
 * - ORG_PRICE_RANGE — Schema.org price range (e.g. "$$", "$$$")
 * - SOCIAL_PROFILES — verify every sameAs URL is a public company/profile page
 * - Add Clutch as https://clutch.co/profile/<slug> once the public company page exists
 */

/** Marketing / UI site name */
export const ORG_NAME = "TechVerge Solutions";

/** schema.org Organization / LocalBusiness name */
export const ORG_SCHEMA_NAME = "Tech Verge Solution";

// TODO: Confirm public contact email; leave empty to omit from JSON-LD only.
export const ORG_EMAIL = "info@techvergesolution.com";

/** Public phone lines (E.164). First line is primary for schema.org `telephone`. */
export const ORG_PHONE_LINES = [
  { tel: "+15055231081", display: "+1 (505) 523-1081" },
  { tel: "+923240049330", display: "+92 324 0049330" },
] as const;

export const ORG_TELEPHONE = ORG_PHONE_LINES[0].tel;
export const ORG_TELEPHONE_DISPLAY = ORG_PHONE_LINES[0].display;

/** Published starting price for marketing copy (USD). */
export const ORG_STARTING_PRICE_USD = 299;

/** schema.org priceRange / offer positioning — not a quote for every project. */
export const ORG_PRICE_RANGE = `Starting at $${ORG_STARTING_PRICE_USD} USD`;

export const ORG_DESCRIPTION =
  "Custom AI automation and voice agents for small businesses in the US, UK, and UAE—built by TechVerge Solutions to cut manual work and catch more leads.";

/** Countries listed in Organization.areaServed (matches primary marketing copy). */
export const AREA_SERVED_COUNTRIES = [
  "United States",
  "United Kingdom",
  "United Arab Emirates",
] as const;

/** Head office — used as Organization / LocalBusiness `address`. */
export const ORG_ADDRESS = {
  streetAddress: "1209 Mountain Rd Pl NE #5036",
  addressLocality: "Albuquerque",
  addressRegion: "NM",
  postalCode: "87110",
  addressCountry: "US",
} as const;

export const ORG_ADDRESS_DISPLAY =
  "1209 Mountain Rd Pl NE #5036, Albuquerque, NM 87110, USA";

/** Secondary office — locality only; no street was provided. */
export const ORG_SECONDARY_ADDRESS = {
  addressLocality: "Lahore",
  addressRegion: "Punjab",
  addressCountry: "PK",
} as const;

export const ORG_SECONDARY_ADDRESS_DISPLAY = "Lahore, Punjab, Pakistan";
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

const PLACEHOLDER = /TODO|PLACEHOLDER/i;

/** Fields for Organization JSON-LD — omits empty or TODO-marked values. */
export function organizationSchemaContact(): Record<string, string> {
  const out: Record<string, string> = {};
  const tel = ORG_TELEPHONE.trim();
  const email = ORG_EMAIL.trim();
  if (tel && !PLACEHOLDER.test(tel)) out.telephone = tel;
  if (email && !PLACEHOLDER.test(email)) out.email = email;
  return out;
}

export function organizationSchemaPriceRange(): Record<string, string> {
  const pr = ORG_PRICE_RANGE.trim();
  if (!pr || PLACEHOLDER.test(pr)) return {};
  return { priceRange: pr };
}

/** Absolute profile URLs for Organization.sameAs (excludes TODO placeholders). */
export function organizationSameAs(): string[] {
  return Object.values(SOCIAL_PROFILES).filter(
    (url) => url.trim() && !PLACEHOLDER.test(url),
  );
}

/** Default blog byline author — visible on posts; Person.url points at About. */
export const DEFAULT_BLOG_AUTHOR = {
  name: ORG_NAME,
  path: "/about",
} as const;
