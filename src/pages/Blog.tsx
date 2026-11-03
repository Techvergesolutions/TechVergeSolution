import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Seo } from "@/components/Seo";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { BlogBreadcrumbs } from "@/components/blog/BlogBreadcrumbs";
import {
  BLOG_PAGE_SIZE,
  blogPostPath,
  getBlogCategories,
  getCompiledBlogPosts,
} from "@/data/blog";
import { blogIndexJsonLd, breadcrumbJsonLd, composeJsonLd, pageSeo } from "@/lib/seo";
import { formatBlogDate } from "@/lib/blogFormat";

const Blog = () => {
  const seo = pageSeo.blog;
  const [params, setParams] = useSearchParams();
  const allPosts = getCompiledBlogPosts();
  const categories = getBlogCategories();

  const activeCategory = params.get("category")?.trim() || "All";
  const page = Math.max(1, Number(params.get("page") || "1") || 1);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return allPosts;
    return allPosts.filter((post) => post.category === activeCategory);
  }, [allPosts, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / BLOG_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagePosts = filtered.slice(
    (safePage - 1) * BLOG_PAGE_SIZE,
    safePage * BLOG_PAGE_SIZE,
  );

  const jsonLd = composeJsonLd(
    blogIndexJsonLd(
      allPosts.map((post) => ({
        title: post.title,
        path: blogPostPath(post.slug),
        datePublished: post.datePublished,
      })),
    ),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]),
  );

  function setCategory(category: string) {
    const next = new URLSearchParams(params);
    if (category === "All") next.delete("category");
    else next.set("category", category);
    next.delete("page");
    setParams(next, { replace: true });
  }

  function setPage(nextPage: number) {
    const next = new URLSearchParams(params);
    if (nextPage <= 1) next.delete("page");
    else next.set("page", String(nextPage));
    setParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        path={seo.path}
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <section className="relative pt-28 pb-10 md:pt-36 md:pb-14 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="section-container relative z-10">
              <AnimatedSection className="max-w-3xl">
                <BlogBreadcrumbs
                  items={[
                    { name: "Home", path: "/" },
                    { name: "Blog" },
                  ]}
                />
                <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                  Blog
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Practical Guides on AI Voice Agents & Automation
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Clear writing on AI voice agents, lead follow-up, and workflow
                  automation for small and service businesses. Each guide is meant
                  to answer a real operating question—without invented metrics or
                  tool hype.
                </p>
              </AnimatedSection>
            </div>
          </section>

          <section className="pb-20 md:pb-28">
            <div className="section-container">
              <div
                className="flex flex-wrap gap-2 mb-10"
                role="tablist"
                aria-label="Filter by category"
              >
                {["All", ...categories].map((category) => {
                  const selected = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setCategory(category)}
                      className={
                        selected
                          ? "rounded-full border border-primary/50 bg-primary/15 text-primary px-4 py-2 text-sm font-medium"
                          : "rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-border px-4 py-2 text-sm font-medium transition-colors"
                      }
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {pagePosts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                    No guides in this category yet
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    Try another filter, or check back soon for new practical
                    automation writing.
                  </p>
                </div>
              ) : (
                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pagePosts.map((post, index) => (
                    <li key={post.slug}>
                      <AnimatedSection delay={index * 0.04} className="h-full">
                        <article className="h-full rounded-2xl border border-border/50 overflow-hidden bg-card/30 hover:border-primary/30 transition-colors">
                          <Link to={blogPostPath(post.slug)} className="block h-full">
                            <BlogFigure
                              src={post.featuredImage.src}
                              alt={post.featuredImage.alt}
                              width={post.featuredImage.width}
                              height={post.featuredImage.height}
                              lazy={index > 2}
                              priority={index === 0}
                              className="my-0 rounded-none border-0 border-b border-border/50"
                              frameClassName="rounded-none"
                              imgClassName="object-contain"
                            />
                            <div className="p-6 flex flex-col h-[calc(100%-1px)]">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                                {post.category ? (
                                  <span className="font-semibold uppercase tracking-wider text-primary">
                                    {post.category}
                                  </span>
                                ) : null}
                                <span aria-hidden="true">·</span>
                                <time dateTime={post.datePublished}>
                                  {formatBlogDate(post.datePublished)}
                                </time>
                                <span aria-hidden="true">·</span>
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                                  {post.readingTimeMinutes} min
                                </span>
                              </div>
                              <h2 className="font-display text-xl font-bold text-foreground mb-2 leading-snug">
                                {post.title}
                              </h2>
                              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                                {post.excerpt}
                              </p>
                              <span className="inline-flex items-center gap-2 text-primary font-medium text-sm">
                                Read guide
                                <ArrowRight className="w-4 h-4" />
                              </span>
                            </div>
                          </Link>
                        </article>
                      </AnimatedSection>
                    </li>
                  ))}
                </ul>
              )}

              {totalPages > 1 ? (
                <nav
                  className="mt-12 flex flex-wrap items-center justify-center gap-3"
                  aria-label="Blog pagination"
                >
                  <button
                    type="button"
                    onClick={() => setPage(safePage - 1)}
                    disabled={safePage <= 1}
                    className="rounded-lg border border-border/60 px-4 py-2 text-sm disabled:opacity-40 hover:border-primary/40 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Page {safePage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage(safePage + 1)}
                    disabled={safePage >= totalPages}
                    className="rounded-lg border border-border/60 px-4 py-2 text-sm disabled:opacity-40 hover:border-primary/40 transition-colors"
                  >
                    Next
                  </button>
                </nav>
              ) : null}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
