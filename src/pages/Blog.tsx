import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Seo } from "@/components/Seo";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { blogPostPath } from "@/data/blog";
import { useBlogPostList } from "@/hooks/useBlogPosts";
import { pageSeo } from "@/lib/seo";

function formatDisplayDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const Blog = () => {
  const seo = pageSeo.blog;
  const { data: blogPosts = [] } = useBlogPostList();
  const featured = blogPosts[0];
  const remaining = blogPosts.slice(1);

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <section className="relative pt-32 pb-10 md:pt-40 md:pb-14 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="section-container relative z-10">
              <AnimatedSection className="max-w-3xl">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                  Blog
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Practical Notes on{" "}
                  <span className="text-gradient">AI Automation</span>
                </h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Guides for US small and service businesses on voice agents, lead
                  follow-up, and workflow automation — written without invented metrics
                  or one-size-fits-all claims.
                </p>
              </AnimatedSection>
            </div>
          </section>

          <section className="pb-20 md:pb-28">
            <div className="section-container">
              {featured ? (
                <AnimatedSection>
                  <article className="group rounded-2xl border border-border/50 overflow-hidden bg-card/40 hover:border-primary/30 transition-colors">
                    <Link
                      to={blogPostPath(featured.slug)}
                      className="grid md:grid-cols-2 gap-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <BlogFigure
                        src={featured.featuredImage.src}
                        alt={featured.featuredImage.alt}
                        width={featured.featuredImage.width}
                        height={featured.featuredImage.height}
                        lazy={false}
                        priority
                        className="my-0 h-full"
                        frameClassName="h-full min-h-[14rem] rounded-none border-0 md:border-r border-border/50"
                        imgClassName="min-h-[14rem] md:min-h-full"
                      />
                      <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                          <time dateTime={featured.datePublished}>
                            {formatDisplayDate(featured.datePublished)}
                          </time>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                            {featured.readingTimeMinutes} min read
                          </span>
                        </div>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                          {featured.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {featured.excerpt}
                        </p>
                        <span className="inline-flex items-center gap-2 text-primary font-medium">
                          Read article
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </article>
                </AnimatedSection>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                    Articles coming soon
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    We are preparing practical guides on AI voice agents, automation,
                    and custom software for growing US businesses.
                  </p>
                </div>
              )}

              {remaining.length > 0 ? (
                <ul className="mt-10 grid gap-6 md:grid-cols-2">
                  {remaining.map((post) => (
                    <li key={post.slug}>
                      <article className="h-full rounded-2xl border border-border/50 overflow-hidden bg-card/30 hover:border-primary/30 transition-colors">
                        <Link to={blogPostPath(post.slug)} className="block h-full">
                          <BlogFigure
                            src={post.featuredImage.src}
                            alt={post.featuredImage.alt}
                            width={post.featuredImage.width}
                            height={post.featuredImage.height}
                            className="my-0 rounded-none border-0 border-b border-border/50"
                          />
                          <div className="p-6">
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                              <time dateTime={post.datePublished}>
                                {formatDisplayDate(post.datePublished)}
                              </time>
                              <span aria-hidden="true">·</span>
                              <span>{post.readingTimeMinutes} min read</span>
                            </div>
                            <h2 className="font-display text-xl font-bold text-foreground mb-2">
                              {post.title}
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>
                        </Link>
                      </article>
                    </li>
                  ))}
                </ul>
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
