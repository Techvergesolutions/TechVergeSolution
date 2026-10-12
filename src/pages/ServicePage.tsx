import { Navigate } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { Seo } from "@/components/Seo";
import { getServiceBySlug, type ServiceSlug } from "@/data/services";
import { faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

interface ServicePageProps {
  slug: ServiceSlug;
}

export default function ServicePage({ slug }: ServicePageProps) {
  const service = getServiceBySlug(slug);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  const path = `/${service.slug}`;
  const jsonLd = [
    serviceJsonLd({
      name: service.eyebrow,
      description: service.metaDescription,
      path,
    }),
    ...(service.faq.length > 0 ? [faqPageJsonLd(service.faq)] : []),
  ];

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
