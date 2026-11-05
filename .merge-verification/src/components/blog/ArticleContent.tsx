import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import type { PortableTextBlock } from "@portabletext/types";
import type { CmsServiceSummary } from "@/lib/sanity/queries";
import type { FaqEntry } from "@/lib/seo/schema";
import { PortableTextContent } from "@/components/blog/PortableTextContent";

type Heading = { id: string; text: string; level: 2 | 3 };

function midpoint(body: PortableTextBlock[]): number {
  const center = Math.ceil(body.length / 2);
  // Prefer a section boundary, without splitting a Portable Text list.
  const heading = body.findIndex((block, index) => index >= center && index > 0 && block._type === "block" && block.style === "h2");
  if (heading > 0) return heading;
  for (let index = center - 1; index > 0; index--) {
    if (body[index]?._type === "block" && body[index]?.style === "h2") return index;
  }
  for (let index = center; index < body.length; index++) {
    if (!body[index]?.listItem || !body[index - 1]?.listItem) return index;
  }
  return body.length;
}

export function RelatedServiceCard({ service }: { service: CmsServiceSummary | null | undefined }) {
  if (!service?.slug?.trim() || !service.title?.trim()) return null;
  return <aside className="my-10 rounded-2xl border border-border/60 bg-card/40 p-6">
    <p className="text-sm text-muted-foreground mb-2">Related service</p>
    <Link to={`/services/${service.slug}`} className="font-display text-xl font-bold text-primary hover:underline">
      Explore {service.title}
    </Link>
    {service.shortDescription && <p className="text-muted-foreground mt-2">{service.shortDescription}</p>}
  </aside>;
}

export function ArticleContent({ slug, body, fallback, service, faqs }: {
  slug: string;
  body?: PortableTextBlock[];
  fallback?: ReactNode;
  service?: CmsServiceSummary | null;
  faqs: FaqEntry[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const { hash } = useLocation();

  useLayoutEffect(() => {
    const content = ref.current;
    if (!content) return;
    const used = new Set(Array.from(document.querySelectorAll("[id]"))
      .filter((element) => !content.contains(element))
      .map((element) => element.id));
    const found: Heading[] = [];
    for (const element of content.querySelectorAll<HTMLHeadingElement>("h2, h3")) {
      const text = element.textContent?.trim();
      if (!text) continue;
      const stem = text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
      const base = `article-${stem}`;
      let id = base;
      let suffix = 2;
      while (used.has(id)) id = `${base}-${suffix++}`;
      used.add(id);
      element.id = id;
      element.classList.add("scroll-mt-28");
      found.push({ id, text, level: element.tagName === "H2" ? 2 : 3 });
    }
    const words = content.textContent?.trim().split(/\s+/).filter(Boolean).length ?? 0;
    setHeadings(words >= 300 && found.length >= 2 ? found : []);
    if (hash) {
      let id = hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Ignore invalid escaping. */ }
      const target = document.getElementById(id);
      if (target && content.contains(target) && typeof target.scrollIntoView === "function") {
        target.scrollIntoView();
      }
    }
  }, [slug, body, fallback, service, faqs, hash]);

  const split = body && service ? midpoint(body) : 0;
  return <>
    {headings.length > 0 && <nav aria-label="Table of contents" className="mb-10 rounded-2xl border border-border/60 bg-card/30 p-6">
      <p className="font-display text-lg font-bold mb-4">On this page</p>
      <ol className="space-y-2 text-sm">{headings.map((heading) => <li key={heading.id} className={heading.level === 3 ? "ml-4" : undefined}>
        <Link to={{ hash: `#${heading.id}` }} className="text-primary hover:underline">{heading.text}</Link>
      </li>)}</ol>
    </nav>}
    <div ref={ref}>
      {body ? (service ? <>
        <PortableTextContent value={body.slice(0, split)} />
        <RelatedServiceCard service={service} />
        {split < body.length && <PortableTextContent value={body.slice(split)} />}
      </> : <PortableTextContent value={body} />) : fallback}
      {faqs.length > 0 && <section className="mt-14">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">{faqs.map((faq, index) => <div key={`${index}-${faq.question}`}>
          <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
          <p className="text-muted-foreground">{faq.answer}</p>
        </div>)}</div>
      </section>}
    </div>
  </>;
}
