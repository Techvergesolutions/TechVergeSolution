import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { trackEvent } from "@/lib/analytics";

export function ServiceCards() {
  const { data: services, isLoading, isError } = useServices();
  if (isLoading) return <p className="text-muted-foreground" role="status">Loading services…</p>;
  if (isError) return <p className="text-muted-foreground" role="status">Services are temporarily unavailable. Please try again later.</p>;
  if (!services?.length) return <p className="text-muted-foreground">Services will be listed here soon.</p>;

  return <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
    {services.map((service) => (
      <Link key={service._id} to={`/services/${service.slug}`} onClick={() => trackEvent("service_cta_click", { service_name: service.title?.trim() || service.slug || undefined })} className="group block h-full rounded-2xl border border-border/60 bg-card/40 p-7 md:p-8 hover:border-primary/40 transition-colors">
        <h3 className="font-display text-xl font-bold text-foreground mb-3">{service.title?.trim() || service.slug}</h3>
        {service.shortDescription && <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">{service.shortDescription}</p>}
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">Learn more <ArrowRight className="w-4 h-4" /></span>
      </Link>
    ))}
  </div>;
}
