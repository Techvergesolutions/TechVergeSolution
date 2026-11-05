import { organizationJsonLd } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/** Organization + WebSite (+ ProfessionalService) — intended on every page. */
export function OrganizationJsonLd() {
  return <JsonLd data={organizationJsonLd()} />;
}
