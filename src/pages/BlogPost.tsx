import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Seo } from "@/components/Seo";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { PortableTextContent } from "@/components/blog/PortableTextContent";
import {
  AiVoiceAgentsForSmallBusiness2026,
  articleFaqs,
} from "@/content/blog/ai-voice-agents-for-small-business-2026";
import {
  blogPostPath,
  staticArticleBodySlugs,
  type BlogPostMeta,
} from "@/data/blog";
import { useBlogPostDetail } from "@/hooks/useBlogPosts";
import type { BlogFaq } from "@/lib/blogApi";
import {
  absoluteUrl,
  blogPostingJsonLd,
  faqPageJsonLd,
} from "@/lib/seo";
import NotFound from "./NotFound";

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

function faqsForStaticSlug(slug: string): BlogFaq[] {
  if (slug === "ai-voice-agents-for-small-business-2026") return articleFaqs;
  return [];
}

function articleSeo(post: BlogPostMeta, faqs: BlogFaq[]) {
  const path = blogPostPath(post.slug);
  const imagePath = post.ogImage ?? post.featuredImage.src;
  const image =
    imagePath.startsWith("http") ? imagePath : absoluteUrl(imagePath);
  const jsonLd = [
    blogPostingJsonLd({
      title: post.title,
      description: post.description,
      path,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      imagePath,
      imageAlt: post.ogImageAlt ?? post.featuredImage.alt,
    }),
    ...(faqs.length > 0 ? [faqPageJsonLd(faqs)] : []),
  ];

  return {
    title: `${post.title} | TechVerge Solutions`,
    description: post.description,
    path,
    image,
    imageAlt: post.ogImageAlt ?? post.featuredImage.alt,
    jsonLd,
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
  const faqs =
    resolved.kind === "sanity"
      ? resolved.post.faqs
      : faqsForStaticSlug(resolved.meta.slug);

  const seo = articleSeo(post, faqs);

  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        path={seo.path}
        image={seo.image}
        imageAlt={seo.imageAlt}
        type="article"
        jsonLd={seo.jsonLd}
      />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <article>
            <header className="relative pt-32 pb-8 md:pt-40 md:pb-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
              <div className="section-container relative z-10 max-w-3xl">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium mb-8"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Back to Blog
                </Link>
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
              {resolved.kind === "sanity" ? (
                <PortableTextContent value={resolved.post.body} />
              ) : (
                <ArticleBody slug={resolved.meta.slug} />
              )}
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
}
