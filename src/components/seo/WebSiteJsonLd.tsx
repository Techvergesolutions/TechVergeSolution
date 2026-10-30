import { SITE_URL, WEBSITE_ID, ORGANIZATION_ID, HOME_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/**
 * Standalone WebSite node when Organization graph is already present elsewhere.
 * Prefer OrganizationJsonLd (includes WebSite) on most pages.
 */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: HOME_DESCRIPTION,
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: "en-US",
      }}
    />
  );
}
