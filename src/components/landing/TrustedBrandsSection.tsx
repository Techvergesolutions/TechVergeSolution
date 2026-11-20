import { caseStudies } from "@/data/caseStudies";

const BRAND_NAMES = [
  "EventForce",
  "ClockLog",
  "BuzzHR",
  "ShareMyDine",
  "Student Help Squad",
  "Peoples Creed AI",
] as const;

const brands = BRAND_NAMES.map((name) => {
  const study = caseStudies.find((item) => item.name === name);
  return { name, href: study?.link };
});

export function TrustedBrandsSection() {
  const loop = [brands, brands];
  return (
    <section className="relative py-8 sm:py-10 md:py-14" aria-labelledby="trusted-brands-heading">
      <div className="section-container">
        <div className="rounded-2xl border border-border/50 bg-card/20 px-4 py-8 sm:rounded-3xl sm:px-8 sm:py-10 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2">Selected work</p>
            <h2 id="trusted-brands-heading" className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Trusted brands
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-2">
              Products we have designed and shipped.
            </p>
          </div>
          <div className="brand-marquee mt-6 sm:mt-8">
            <div className="brand-track">
              {loop.map((group, copy) => (
                <ul key={copy} className="flex items-center gap-3 pr-3" aria-hidden={copy === 1}>
                  {group.map((brand) => (
                    <li key={`${copy}-${brand.name}`}>
                      {brand.href ? (
                        <a className="brand-mark" href={brand.href} target="_blank" rel="noopener noreferrer">
                          {brand.name}
                        </a>
                      ) : (
                        <span className="brand-mark">{brand.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
