import type { ServiceConfig } from "@/data/services";
import type { ReactNode } from "react";
import { ServiceHero } from "./ServiceHero";
import { ServiceProblem } from "./ServiceProblem";
import { ServiceBuilds } from "./ServiceBuilds";
import { ServiceDeliverables } from "./ServiceDeliverables";
import { TechStackBadges } from "./TechStackBadges";
import { ServiceHowItWorks } from "./ServiceHowItWorks";
import { ServiceUseCases } from "./ServiceUseCases";
import { ServiceIntegrations } from "./ServiceIntegrations";
import { CaseStudiesSummary } from "./CaseStudiesSummary";
import { ServiceProcess } from "./ServiceProcess";
import { ServiceWhoFor } from "./ServiceWhoFor";
import { ServiceLimitations } from "./ServiceLimitations";
import { ServiceFaq } from "./ServiceFaq";
import { RelatedServices } from "./RelatedServices";
import { ServiceCta } from "./ServiceCta";
import { RelatedGuidesSection } from "@/components/blog/RelatedGuidesSection";
import { SERVICE_GUIDE_LINKS } from "@/data/internalLinks";

interface ServicePageLayoutProps {
  service: ServiceConfig;
  breadcrumb?: ReactNode;
}

function collectCapabilities(service: ServiceConfig): string[] {
  const fromHow = service.howItWorks.technicalCapabilities ?? [];
  const fromIntegrations = service.integrations.technicalCapabilities ?? [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const cap of [...fromHow, ...fromIntegrations]) {
    const key = cap.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cap);
  }
  return out;
}

export function ServicePageLayout({ service, breadcrumb }: ServicePageLayoutProps) {
  const capabilities = collectCapabilities(service);

  return (
    <>
      <ServiceHero service={service} breadcrumb={breadcrumb} />
      <ServiceProblem problem={service.problem} />
      <ServiceBuilds builds={service.builds} />
      <ServiceDeliverables deliverables={service.deliverables} />
      <TechStackBadges
        muted
        capabilities={capabilities}
        title="Stack & Technical Capabilities"
        description="We select proven tools when they fit your build — Next.js, AI integrations, Node.js, Supabase, and the connectors your workflow needs. These are implementation choices, not a packaged TechVerge platform."
      />
      <ServiceHowItWorks howItWorks={service.howItWorks} />
      <ServiceUseCases useCases={service.useCases} />
      <ServiceIntegrations integrations={service.integrations} />
      <CaseStudiesSummary
        serviceSlug={service.slug}
        limit={4}
        title="Related & Recent Work"
        description="Selected projects with factual delivery outcomes. No invented metrics — see the portfolio for full detail."
        muted={false}
      />
      <ServiceProcess process={service.process} />
      <ServiceWhoFor whoFor={service.whoFor} />
      <ServiceLimitations limitations={service.limitations} />
      <ServiceFaq faq={service.faq} />
      <RelatedGuidesSection
        title="Related guides"
        description="Read the practical write-ups that sit behind this service — written for operators, not for keyword stuffing."
        links={SERVICE_GUIDE_LINKS[service.slug] ?? []}
        muted
      />
      <RelatedServices currentSlug={service.slug} />
      <ServiceCta cta={service.cta} serviceSlug={service.slug} />
    </>
  );
}
