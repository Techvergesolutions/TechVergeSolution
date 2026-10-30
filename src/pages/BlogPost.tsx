import { useParams } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Seo } from "@/components/Seo";
import { useBlogFaqs } from "@/hooks/useBlogPosts";
import { useBlogScrollDepth } from "@/hooks/useBlogScrollDepth";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { BlogFaq } from "@/components/blog/BlogFaq";
import { BlogBreadcrumbs } from "@/components/blog/BlogBreadcrumbs";
import { BlogQuickAnswer } from "@/components/blog/BlogQuickAnswer";
import { BlogAuthorCard } from "@/components/blog/BlogAuthorCard";
import { BlogTableOfContents } from "@/components/blog/BlogTableOfContents";
import { BlogShareRow } from "@/components/blog/BlogShareRow";
import { BlogRelatedGuides } from "@/components/blog/BlogRelatedGuides";
import { BlogServiceCta } from "@/components/blog/BlogServiceCta";
import { MarkdownArticle } from "@/components/blog/MarkdownArticle";
import {
  blogPostPath,
  getCompiledBlogPostBySlug,
  getRelatedPosts,
  type BlogPostMeta,
} from "@/data/blog";
import type { BlogFaq as BlogFaqItem } from "@/data/blog";
import { resolveBlogAuthor } from "@/data/blogAuthors";
import {
  absoluteUrl,
  blogPostingJsonLd,
  breadcrumbJsonLd,
  composeJsonLd,
  faqPageJsonLd,
} from "@/lib/seo";
import NotFound from "./NotFound";

function articleSeo(post: BlogPostMeta, faqs: BlogFaqItem[]) {
  const path = blogPostPath(post.slug);
  const imagePath = post.ogImage ?? post.featuredImage.src;
  const image =
    imagePath.startsWith("http") ? imagePath : absoluteUrl(imagePath);
  const author = resolveBlogAuthor(post.author);
  const jsonLd = composeJsonLd(
    blogPostingJsonLd({
      title: post.title,
      description: post.description,
      path,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      imagePath,
      imageAlt: post.ogImageAlt ?? post.featuredImage.alt,
      authorName: author.name,
      authorPath: author.path,
    }),
    faqPageJsonLd(faqs),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path },
    ]),
  );

  return {
    title: `${post.title} | TechVerge Solutions`,
    description: post.description,
    path,
    image,
    imageAlt: post.ogImageAlt ?? post.featuredImage.alt,
    author,
    jsonLd,
  };
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getCompiledBlogPostBySlug(slug) : undefined;
  const { faqs } = useBlogFaqs(slug, post?.faq);
  useBlogScrollDepth(post?.slug);

  if (!post) {
    return <NotFound />;
  }

  const seo = articleSeo(post, faqs);
  const related = getRelatedPosts(post.slug, post.relatedSlugs, 3);
  const quickAnswer = post.quickAnswer || post.excerpt;
  const cta = post.cta ?? {
    label: "Explore our services",
    path: "/services",
    description:
      "See how TechVerge designs AI voice agents, lead follow-up, and business automation for service teams.",
  };

  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        path={seo.path}
        image={seo.image}
        imageAlt={seo.imageAlt}
        type="article"
        datePublished={post.datePublished}
        dateModified={post.dateModified}
        jsonLd={seo.jsonLd}
        preloadImage={
          post.featuredImage.src.startsWith("http")
            ? post.featuredImage.src
            : absoluteUrl(post.featuredImage.src)
        }
      />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <article>
            <header className="relative pt-28 pb-8 md:pt-36 md:pb-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
              <div className="section-container relative z-10 max-w-3xl">
                <BlogBreadcrumbs
                  items={[
                    { name: "Home", path: "/" },
                    { name: "Blog", path: "/blog" },
                    ...(post.category
                      ? [{ name: post.category, path: `/blog?category=${encodeURIComponent(post.category)}` }]
                      : []),
                    { name: post.title },
                  ]}
                />

                {post.category ? (
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                    {post.category}
                  </span>
                ) : null}

                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {post.title}
                </h1>

                <BlogQuickAnswer text={quickAnswer} />

                <div className="mt-8">
                  <BlogAuthorCard
                    author={seo.author}
                    datePublished={post.datePublished}
                    dateModified={post.dateModified}
                    readingTimeMinutes={post.readingTimeMinutes}
                  />
                </div>

                <div className="mt-6">
                  <BlogShareRow title={post.title} path={seo.path} />
                </div>
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
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>

            <div className="section-container max-w-3xl pb-20 md:pb-28 space-y-10">
              <BlogTableOfContents items={post.toc ?? []} />
              <MarkdownArticle html={post.bodyHtml} />
              <BlogFaq faq={faqs} />
              <BlogRelatedGuides posts={related} />
              <BlogServiceCta cta={cta} />
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
}
