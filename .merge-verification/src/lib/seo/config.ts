export const siteName = "TechVerge Solutions";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.techvergesolution.com").replace(/\/+$/, "");
export const defaultDescription =
  "TechVerge Solutions builds custom AI automation, voice agents, business workflows and software to help businesses reduce manual work and improve lead follow-up.";
export const defaultOgImage = "/og-image.webp";

export function absoluteUrl(path = "/"): string {
  return new URL(path || "/", `${siteUrl}/`).href;
}

const organizationDetails = {
  logo: "/Logo.svg",
  email: "info@techvergesolution.com",
  sameAs: [
    "https://www.linkedin.com/company/techverg-solution/",
    "https://www.instagram.com/techvergsolutions/",
    "https://www.facebook.com/profile.php?id=61579426794497",
    "https://github.com/solutiontechverge-hub",
  ],
};

export const organization = {
  name: siteName,
  ...(organizationDetails.logo.trim() ? { logo: absoluteUrl(organizationDetails.logo.trim()) } : {}),
  ...(organizationDetails.email.trim() ? { email: organizationDetails.email.trim() } : {}),
  sameAs: organizationDetails.sameAs.map((url) => url.trim()).filter(Boolean),
};

export const areaServed = ["United States", "United Kingdom", "United Arab Emirates"] as const;
