import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PortableTextContent } from "@/components/blog/PortableTextContent";
import { Seo } from "@/components/Seo";
import { breadcrumbJsonLd } from "@/lib/seo";
import { faqPageJsonLd, serviceJsonLd, visibleFaqs } from "@/lib/seo/schema";
import { JsonLd } from "@/components/JsonLd";
import { sanityClient, urlForImage } from "@/lib/sanity";
import { fetchSanityQuery } from "@/lib/sanity/queries";
import NotFound from "./NotFound";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { ServiceGuides } from "@/components/services/ServiceGuides";
import { trackEvent } from "@/lib/analytics";
import { getServiceBySlug } from "@/data/services";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, isError } = useQuery({
    queryKey: ["service", slug],
    queryFn: () => {
      if (!sanityClient || !slug) throw new Error("Sanity is not configured");
      return fetchSanityQuery(sanityClient, "serviceBySlug", { slug });
    },
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <main className="section-container pt-40" role="status" aria-live="polite">
        <p className="text-lg text-muted-foreground">Loading service…</p>
      </main>
    );
  }
  if (isError) {
    return (
      <main className="section-container pt-40" role="status" aria-live="polite">
        <p className="text-lg font-semibold text-foreground">Service unavailable</p>
        <p className="text-muted-foreground">Please try again.</p>
      </main>
    );
  }
  if (!slug || !service) return <NotFound />;

  const path = `/services/${slug}`;
  const name = service.title?.trim() || service.heroHeading?.trim() || "Service";
  const description = service.seo?.seoDescription?.trim() || service.shortDescription?.trim() || "";
  const title = service.seo?.seoTitle?.trim() || name;
  let image: string | undefined;
  if (service.seo?.ogImage?.asset) {
    try { image = urlForImage(service.seo.ogImage).width(1200).url(); } catch { /* Use the default image. */ }
  }
  const faq = visibleFaqs(service.faqs);
  const faqSchema = faqPageJsonLd(faq);
  const previousLayout = getServiceBySlug(slug);

  return <>
    <Seo title={title} description={description} path={path} image={image}
      canonicalUrl={service.seo?.canonicalUrl || undefined} noindex={service.seo?.noIndex ?? false} />
    <JsonLd data={serviceJsonLd({ name, description, path })} />
    <JsonLd
      data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name, path },
      ])}
    />
    {faqSchema && <JsonLd data={faqSchema} />}
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        {previousLayout ? <div data-analytics-service={name}>
          <ServicePageLayout breadcrumb={<PageBreadcrumbs section="services" current={{ href: path, title: service.title || service.heroHeading }} />} service={{ ...previousLayout, headline: service.heroHeading || name, eyebrow: name, subheadline: service.shortDescription || previousLayout.subheadline, pageTitle: title, metaDescription: description, faq: faq.length ? faq : previousLayout.faq }} />
          <div className="section-container max-w-4xl pb-20">
            {service.body?.length ? <PortableTextContent value={service.body} /> : null}
            {!!service.industries?.some((item) => item.title?.trim()) && <section className="mt-14"><h2 className="font-display text-3xl font-bold mb-6">Industries</h2><ul className="space-y-5">{service.industries.filter((item) => item.title?.trim()).map((item) => <li key={item._key}><h3 className="font-display text-xl font-bold mb-2">{item.marketPage?.slug && item.marketPage.title?.trim() && (item.marketPage.bodyCount ?? 0) > 0 && item.marketPage.noIndex !== true ? <Link className="text-primary hover:underline" to={`/markets/${encodeURIComponent(item.marketPage.slug)}`}>{item.title}</Link> : item.title}</h3>{item.description && <p className="text-muted-foreground">{item.description}</p>}</li>)}</ul></section>}
            <ServiceGuides serviceId={service._id} manual={service.relatedPosts ?? []} />
          </div>
        </div> :
        <article data-analytics-service={name} className="section-container max-w-4xl pt-32 pb-20 md:pt-40 md:pb-28">
          <header className="mb-12">
            <PageBreadcrumbs section="services" current={{ href: path, title: service.title || service.heroHeading }} />
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-6 mb-6">{service.heroHeading || name}</h1>
            {service.shortDescription && <p className="text-muted-foreground text-lg leading-relaxed">{service.shortDescription}</p>}
          </header>
          {service.body?.length ? <PortableTextContent value={service.body} /> : null}
          {!!service.industries?.some((item) => item.title?.trim()) && <section className="mt-14">
            <h2 className="font-display text-3xl font-bold mb-6">Industries</h2>
            <ul className="space-y-5">{service.industries.filter((item) => item.title?.trim()).map((item) => <li key={item._key}>
              <h3 className="font-display text-xl font-bold mb-2">{item.marketPage?.slug && item.marketPage.title?.trim() && (item.marketPage.bodyCount ?? 0) > 0 && item.marketPage.noIndex !== true ? <Link className="text-primary hover:underline" to={`/markets/${encodeURIComponent(item.marketPage.slug)}`}>{item.title}</Link> : item.title}</h3>
              {item.description && <p className="text-muted-foreground">{item.description}</p>}
            </li>)}</ul>
          </section>}
          {!!service.features?.length && <section className="mt-14">
            <h2 className="font-display text-3xl font-bold mb-6">{service.processHeading || "Our Process"}</h2>
            {service.processDescription && <p className="text-muted-foreground mb-6">{service.processDescription}</p>}
            <ol className="space-y-5">{service.features.map((step) => <li key={step._key}>
              {step.title && <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>}
              {step.description && <p className="text-muted-foreground">{step.description}</p>}
            </li>)}</ol>
          </section>}
          {faq.length > 0 && <section className="mt-14"><h2 className="font-display text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">{faq.map((item, index) => <div key={`${index}-${item.question}`}><h3 className="font-bold text-lg mb-2">{item.question}</h3><p className="text-muted-foreground">{item.answer}</p></div>)}</div>
          </section>}
          <ServiceGuides serviceId={service._id} manual={service.relatedPosts ?? []} />
          <section className="mt-14 rounded-2xl border border-border/60 bg-card/40 p-8">
            <h2 className="font-display text-2xl font-bold mb-4">Discuss Your Project</h2>
            <Link to="/contact" onClick={() => trackEvent("service_cta_click", { service_name: name })} className="inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">Contact Us</Link>
          </section>
        </article>}
      </main>
      <Footer />
    </div>
  </>;
}
