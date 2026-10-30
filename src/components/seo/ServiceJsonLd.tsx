import { serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export interface ServiceJsonLdProps {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}

export function ServiceJsonLd(props: ServiceJsonLdProps) {
  return <JsonLd data={serviceJsonLd(props)} />;
}
