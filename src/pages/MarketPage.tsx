import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PortableTextContent } from "@/components/blog/PortableTextContent";
import { Seo } from "@/components/Seo";
import { sanityClient, urlForImage } from "@/lib/sanity";
import { fetchSanityQuery } from "@/lib/sanity/queries";
import NotFound from "./NotFound";

export default function MarketPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading, isError } = useQuery({
    queryKey: ["marketPage", slug], enabled: Boolean(sanityClient && slug),
    queryFn: () => fetchSanityQuery(sanityClient!, "marketPage", { slug: slug! }), staleTime: 5 * 60 * 1000,
  });
  if (isLoading) return <main className="section-container pt-40" role="status">Loading page…</main>;
  if (isError) return <main className="section-container pt-40" role="status">Page unavailable. Please try again.</main>;
  if (!slug || !page?.title?.trim() || !page.body?.length) return <NotFound />;
  const title = page.seo?.seoTitle?.trim() || page.title;
  const description = page.seo?.seoDescription?.trim() || page.summary?.trim() || "";
  let image: string | undefined;
  if (page.seo?.ogImage?.asset) {
    try { image = urlForImage(page.seo.ogImage).width(1200).url(); } catch { /* Use the default. */ }
  }
  const testimonials = (page.testimonials ?? []).filter((item) => item.quote?.trim() && item.name?.trim());
  return <>
    <Seo title={title} description={description} path={`/markets/${encodeURIComponent(slug)}`} image={image} canonicalUrl={page.seo?.canonicalUrl || undefined} noindex={page.seo?.noIndex ?? false} />
    <div className="min-h-screen bg-background overflow-x-hidden"><Navbar /><main>
      <article className="section-container max-w-4xl pt-32 pb-20 md:pt-40 md:pb-28">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">{page.title}</h1>
        {page.summary && <p className="text-muted-foreground text-lg leading-relaxed mb-10">{page.summary}</p>}
        <PortableTextContent value={page.body} />
        {testimonials.length > 0 && <section className="mt-14"><h2 className="font-display text-3xl font-bold mb-6">Testimonials</h2>
          <div className="space-y-6">{testimonials.map((item) => <blockquote key={item._key} className="border-l-4 border-primary/40 pl-4"><p>{item.quote}</p><footer className="mt-2 text-muted-foreground">{item.name}{item.role ? `, ${item.role}` : ""}</footer></blockquote>)}</div>
        </section>}
        <section className="mt-14 rounded-2xl border border-border/60 bg-card/40 p-8"><Link to="/contact" className="inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">Contact Us</Link></section>
      </article>
    </main><Footer /></div>
  </>;
}
