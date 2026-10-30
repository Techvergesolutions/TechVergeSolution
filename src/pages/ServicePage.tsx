import { useParams } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { Seo } from "@/components/Seo";
import { getServiceBySlug, servicePath, type ServiceSlug } from "@/data/services";
import {
  breadcrumbJsonLd,
  composeJsonLd,
  faqPageJsonLd,
  serviceJsonLd,
} from "@/lib/seo";
import NotFound from "./NotFound";

interface ServicePageProps {
  slug?: ServiceSlug;
}

export default function ServicePage({ slug: slugProp }: ServicePageProps) {
  const { slug: slugParam } = useParams<{ slug: string }>();
  const slug = slugProp ?? slugParam;
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return <NotFound />;
  }

  const path = servicePath(service.slug);
  // Service.name matches the visible H1 (headline); serviceType uses the shorter eyebrow.
  const jsonLd = composeJsonLd(
    serviceJsonLd({
      name: service.headline,
      description: service.metaDescription,
      path,
      serviceType: service.eyebrow,
    }),
    faqPageJsonLd(service.faq),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.eyebrow, path },
    ]),
  );

  return (
    <>
      <Seo
        title={service.pageTitle}
        description={service.metaDescription}
        path={path}
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <ServicePageLayout service={service} />
        </main>
        <Footer />
      </div>
    </>
  );
}
