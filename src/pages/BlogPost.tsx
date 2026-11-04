import { Link, useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Seo } from "@/components/Seo";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { ArticleContent, RelatedServiceCard } from "@/components/blog/ArticleContent";
import { RelatedPosts } from "@/components/RelatedPosts";
import {
  AiVoiceAgentsForSmallBusiness2026,
} from "@/content/blog/ai-voice-agents-for-small-business-2026";
import {
  blogPostPath,
  staticArticleBodySlugs,
  type BlogPostMeta,
} from "@/data/blog";
import { useBlogPostDetail } from "@/hooks/useBlogPosts";
import type { SanityBlogPost } from "@/lib/blogApi";
import { absoluteUrl } from "@/lib/seo";
import { articleJsonLd, faqPageJsonLd, visibleFaqs } from "@/lib/seo/schema";
import { JsonLd } from "@/components/JsonLd";
import NotFound from "./NotFound";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";

function formatDisplayDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function ArticleBody({ slug }: { slug: string }) {
  switch (slug) {
    case "ai-voice-agents-for-small-business-2026":
      return <AiVoiceAgentsForSmallBusiness2026 />;
    default:
      return null;
  }
}

function articleSeo(post: BlogPostMeta | SanityBlogPost) {
  const path = blogPostPath(post.slug);
  const cms = "source" in post ? post : undefined;
  const imagePath = cms?.customOgImage || `/api/og?slug=${encodeURIComponent(post.slug)}`;
  const image =
    imagePath.startsWith("http") ? imagePath : absoluteUrl(imagePath);
  return {
    title: cms?.seoTitle || post.title,
    description: cms?.seoDescription || post.description,
    path,
    image,
    imageAlt: cms?.customOgImage ? post.ogImageAlt || post.title : post.title,
    canonicalUrl: cms?.canonicalUrl,
    noindex: cms?.noIndex,
    publishedTime: cms ? cms.publishedTime : post.datePublished,
    modifiedTime: cms ? cms.modifiedTime : post.dateModified,
    authors: cms?.authors,
  };
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: resolved, isLoading, isError } = useBlogPostDetail(slug);

  if (!slug) {
    return <NotFound />;
  }

  if (isLoading && !resolved) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="section-container max-w-3xl pt-40 pb-20">
          <p className="text-muted-foreground">Loading article…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !resolved) {
    return <NotFound />;
  }

  if (
    resolved.kind === "static" &&
    !staticArticleBodySlugs.has(resolved.meta.slug)
  ) {
    return <NotFound />;
  }

  const post =
    resolved.kind === "sanity" ? resolved.post : resolved.meta;
  const faqs = resolved.kind === "sanity" ? visibleFaqs(resolved.post.faqs) : [];
  const faqSchema = faqPageJsonLd(faqs);
  const seo = articleSeo(post);
  const articleSchema = articleJsonLd({
    headline: post.title,
    path: blogPostPath(post.slug),
    image: resolved.kind === "sanity" ? resolved.post.schemaImage : post.featuredImage.src,
    datePublished: resolved.kind === "sanity" ? resolved.post.publishedTime : post.datePublished,
    dateModified: resolved.kind === "sanity" ? resolved.post.modifiedTime : post.dateModified,
    authorName: resolved.kind === "sanity" ? resolved.post.authors?.[0] : undefined,
  });

  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        path={seo.path}
        image={seo.image}
        imageAlt={seo.imageAlt}
        type="article"
        canonicalUrl={seo.canonicalUrl}
        noindex={seo.noindex}
        publishedTime={seo.publishedTime}
        modifiedTime={seo.modifiedTime}
        authors={seo.authors}
      />
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <article>
            <header className="relative pt-32 pb-8 md:pt-40 md:pb-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
              <div className="section-container relative z-10 max-w-3xl">
                <PageBreadcrumbs section="blog" current={{ href: blogPostPath(post.slug), ...(resolved.kind === "sanity" ? { title: post.title } : { staticPostSlug: post.slug }) }} />
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-5">
                  <time dateTime={post.datePublished}>
                    {formatDisplayDate(post.datePublished)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {post.readingTimeMinutes} min read
                  </span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {post.title}
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </header>

            <div className="section-container max-w-3xl pb-6">
              <BlogFigure
                src={post.featuredImage.src}
                alt={post.featuredImage.alt}
                width={post.featuredImage.width}
                height={post.featuredImage.height}
                lazy={false}
                priority
                className="my-0"
              />
            </div>

            <div className="section-container max-w-3xl pb-20 md:pb-28">
              <ArticleContent
                slug={post.slug}
                body={resolved.kind === "sanity" ? resolved.post.body : undefined}
                fallback={resolved.kind === "static" ? <ArticleBody slug={resolved.meta.slug} /> : undefined}
                service={resolved.kind === "sanity" ? resolved.post.relatedService : null}
                faqs={faqs}
              />
              <RelatedServiceCard service={resolved.kind === "sanity" ? resolved.post.relatedService : null} />
              <RelatedPosts slug={post.slug} categoryIds={resolved.kind === "sanity" ? resolved.post.categoryIds : []}
                manual={resolved.kind === "sanity" ? resolved.post.relatedPosts : []} />
              <section className="mt-14 rounded-2xl border border-border/60 bg-card/40 p-8">
                <Link to="/contact" className="inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">Talk to our team</Link>
              </section>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
}
