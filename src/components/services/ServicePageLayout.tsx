import type { ServiceConfig } from "@/data/services";
import { ServiceHero } from "./ServiceHero";
import { ServiceProblem } from "./ServiceProblem";
import { ServiceBuilds } from "./ServiceBuilds";
import { ServiceHowItWorks } from "./ServiceHowItWorks";
import { ServiceUseCases } from "./ServiceUseCases";
import { ServiceIntegrations } from "./ServiceIntegrations";
import { ServiceProcess } from "./ServiceProcess";
import { ServiceWhoFor } from "./ServiceWhoFor";
import { ServiceFaq } from "./ServiceFaq";
import { ServiceCta } from "./ServiceCta";

interface ServicePageLayoutProps {
  service: ServiceConfig;
}

export function ServicePageLayout({ service }: ServicePageLayoutProps) {
  return (
    <>
      <ServiceHero service={service} />
      <ServiceProblem problem={service.problem} />
      <ServiceBuilds builds={service.builds} />
      <ServiceHowItWorks howItWorks={service.howItWorks} />
      <ServiceUseCases useCases={service.useCases} />
      <ServiceIntegrations integrations={service.integrations} />
      <ServiceProcess process={service.process} />
      <ServiceWhoFor whoFor={service.whoFor} />
      <ServiceFaq faq={service.faq} />
      <ServiceCta cta={service.cta} serviceSlug={service.slug} />
    </>
  );
}
