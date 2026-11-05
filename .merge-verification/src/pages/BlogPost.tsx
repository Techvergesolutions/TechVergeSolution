import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Seo } from "@/components/Seo";
import { useBlogFaqs, useBlogPostDetail } from "@/hooks/useBlogPosts";
import { useBlogScrollDepth } from "@/hooks/useBlogScrollDepth";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { BlogFaq } from "@/components/blog/BlogFaq";
import { BlogQuickAnswer } from "@/components/blog/BlogQuickAnswer";
import { BlogAuthorCard } from "@/components/blog/BlogAuthorCard";
import { BlogTableOfContents } from "@/components/blog/BlogTableOfContents";
import { BlogShareRow } from "@/components/blog/BlogShareRow";
import { BlogRelatedGuides } from "@/components/blog/BlogRelatedGuides";
import { BlogServiceCta } from "@/components/blog/BlogServiceCta";
import { MarkdownArticle } from "@/components/blog/MarkdownArticle";
import { ArticleContent, RelatedServiceCard } from "@/components/blog/ArticleContent";
import { RelatedPosts } from "@/components/RelatedPosts";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { blogPostPath, getRelatedPosts } from "@/data/blog";
import { resolveBlogAuthor } from "@/data/blogAuthors";
import { absoluteUrl } from "@/lib/seo";
import { articleJsonLd, faqPageJsonLd, visibleFaqs } from "@/lib/seo/schema";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: resolved, isLoading, isError } = useBlogPostDetail(slug);
  const fallbackFaqs = resolved?.kind === "static" ? resolved.meta.faq : undefined;
  const { faqs: markdownFaqs } = useBlogFaqs(slug, fallbackFaqs);
  useBlogScrollDepth(slug);
  if (isLoading && !resolved) return <div className="min-h-screen bg-background"><Navbar /><main className="section-container max-w-3xl pt-40 pb-20" role="status">Loading article…</main><Footer /></div>;
  if (!slug || isError || !resolved) return <NotFound />;

  const cms = resolved.kind === "sanity" ? resolved.post : undefined;
  const post = resolved.kind === "sanity" ? resolved.post : resolved.meta;
  const faqs = cms ? visibleFaqs(cms.faqs) : markdownFaqs;
  const path = blogPostPath(post.slug);
  const image = cms?.customOgImage || absoluteUrl(`/api/og?slug=${encodeURIComponent(post.slug)}`);
  const article = articleJsonLd({ headline: post.title, path, image: cms ? cms.schemaImage : post.featuredImage.src, datePublished: cms?.publishedTime || post.datePublished, dateModified: cms?.modifiedTime || post.dateModified, authorName: cms?.authors?.[0] });
  const faqSchema = faqPageJsonLd(faqs);
  const author = !cms ? resolveBlogAuthor(post.author) : undefined;
  const related = !cms ? getRelatedPosts(post.slug, post.relatedSlugs, 3) : [];
  const cta = post.cta ?? { label: "Explore our services", path: "/services", description: "See how TechVerge designs AI voice agents, lead follow-up, and business automation for service teams." };

  return <>
    <Seo title={cms?.seoTitle || post.title} description={cms?.seoDescription || post.description} path={path} image={image} imageAlt={cms?.customOgImage ? post.ogImageAlt || post.title : post.title} type="article" canonicalUrl={cms?.canonicalUrl} noindex={cms?.noIndex} publishedTime={cms?.publishedTime || post.datePublished} modifiedTime={cms?.modifiedTime || post.dateModified} authors={cms?.authors} />
    <JsonLd data={article} />{faqSchema && <JsonLd data={faqSchema} />}
    <div className="min-h-screen bg-background overflow-x-hidden"><Navbar /><main><article>
      <header className="relative pt-28 pb-8 md:pt-36 md:pb-10 overflow-hidden"><div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="section-container relative z-10 max-w-3xl">
          <PageBreadcrumbs section="blog" current={{ href: path, ...(cms ? { title: post.title } : { staticPostSlug: post.slug }) }} />
          {post.category && <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">{post.category}</span>}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">{post.title}</h1>
          <BlogQuickAnswer text={post.quickAnswer || post.excerpt} />
          {author && <div className="mt-8"><BlogAuthorCard author={author} datePublished={post.datePublished} dateModified={post.dateModified} readingTimeMinutes={post.readingTimeMinutes} /></div>}
          {cms?.authors?.[0] && <p className="mt-6 text-sm text-muted-foreground">By {cms.authors[0]}</p>}
          <div className="mt-6"><BlogShareRow title={post.title} path={path} /></div>
        </div>
      </header>
      <div className="section-container max-w-3xl pb-6"><BlogFigure src={post.featuredImage.src} alt={post.featuredImage.alt} width={post.featuredImage.width} height={post.featuredImage.height} priority className="my-0" /></div>
      <div className="section-container max-w-3xl pb-20 md:pb-28 space-y-10">
        {cms ? <><ArticleContent slug={post.slug} body={cms.body} service={cms.relatedService} faqs={faqs} /><RelatedServiceCard service={cms.relatedService} /><RelatedPosts slug={post.slug} categoryIds={cms.categoryIds} manual={cms.relatedPosts} /></> : <><BlogTableOfContents items={post.toc ?? []} /><MarkdownArticle html={post.bodyHtml || ""} /><BlogFaq faq={faqs} /><BlogRelatedGuides posts={related} /><BlogServiceCta cta={cta} /><RelatedPosts slug={post.slug} /></>}
        <section className="rounded-2xl border border-border/60 bg-card/40 p-8"><Link to="/contact" className="inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">Talk to our team</Link></section>
      </div>
    </article></main><Footer /></div>
  </>;
}
