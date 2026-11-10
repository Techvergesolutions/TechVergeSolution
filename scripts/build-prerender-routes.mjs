/**
 * Assemble prerender route list (static pages + dynamic blog posts).
 */
import fs from "node:fs";
import path from "node:path";
import {
  absoluteUrl,
  blogPostingJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  prerenderRoutes as baseRoutes,
  serviceJsonLd,
  SITE_NAME,
  SITE_URL,
} from "./seo-prerender-data.mjs";
import { collectBlogPosts } from "./collect-blog-posts.mjs";
import { clampMetaDescription, clampMetaTitle } from "./seo-limits.mjs";
import { ROOT } from "./load-env.mjs";

const HOMEPAGE_FAQ = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src", "data", "homepage-content.json"), "utf8"),
).faqs;

function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function blogIndexJsonLd(posts) {
  const blogUrl = absoluteUrl("/blog");
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": blogUrl,
    name: `${SITE_NAME} Blog`,
    description:
      "Practical TechVerge Solutions guides on AI voice agents, lead follow-up, and workflow automation for small and service businesses—clear and jargon-light.",
    url: blogUrl,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.datePublished,
    })),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blog/${post.slug}`),
        name: post.title,
      })),
    },
  };
}

const BREADCRUMBS = {
  "/": [{ name: "Home", path: "/" }],
  "/about": [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ],
  "/ai-facts": [
    { name: "Home", path: "/" },
    { name: "AI Facts", path: "/ai-facts" },
  ],
  "/services": [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ],
  "/services/ai-automation": [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "AI Lead Follow-Up", path: "/services/ai-automation" },
  ],
  "/services/ai-voice-agents": [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "AI Voice Agents", path: "/services/ai-voice-agents" },
  ],
  "/services/business-automation": [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Business Automation", path: "/services/business-automation" },
  ],
  "/services/ai-saas-development": [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "AI SaaS Development", path: "/services/ai-saas-development" },
  ],
  "/services/custom-website-development": [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Custom Website Development", path: "/services/custom-website-development" },
  ],
  "/services/mobile-app-development": [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Mobile App Development", path: "/services/mobile-app-development" },
  ],
  "/portfolio": [
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
  ],
  "/blog": [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ],
  "/contact": [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ],
  "/privacy-policy": [
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ],
  "/terms-of-service": [
    { name: "Home", path: "/" },
    { name: "Terms of Service", path: "/terms-of-service" },
  ],
};

export async function buildPrerenderRoutes() {
  const posts = await collectBlogPosts();

  // Drop hardcoded blog post routes from base; rebuild from collected posts
  const withoutBlogPosts = baseRoutes
    .filter((r) => !r.path.startsWith("/blog/") && r.path !== "/blog")
    .map((route) =>
      route.path === "/"
        ? {
            ...route,
            extraJsonLd: [
              ...(route.extraJsonLd ?? []),
              faqPageJsonLd(HOMEPAGE_FAQ),
            ],
          }
        : route,
    );

  const blogIndex = {
    path: "/blog",
    title: "AI Automation Guides | TechVerge Solutions",
    description:
      "Practical TechVerge Solutions guides on AI voice agents, lead follow-up, and workflow automation for small and service businesses—clear and jargon-light.",
    extraJsonLd: [blogIndexJsonLd(posts)],
  };

  const blogPostRoutes = posts.map((post) => {
    const path = `/blog/${post.slug}`;
    const ogImage = post.imagePath.startsWith("http")
      ? post.imagePath
      : `${SITE_URL}${post.imagePath}`;
    return {
      path,
      title: `${post.title} | TechVerge Solutions`,
      description: post.description,
      ogImage,
      ogImageAlt: post.imageAlt,
      ogType: "article",
      article: {
        title: post.title,
        datePublished: post.datePublished,
        dateModified: post.dateModified,
        imagePath: post.imagePath,
        imageAlt: post.imageAlt,
        authorName: post.author || SITE_NAME,
        authorPath: "/about",
        faq: post.faq || [],
      },
      extraJsonLd: [
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path },
        ]),
      ],
    };
  });

  const routes = [...withoutBlogPosts, blogIndex, ...blogPostRoutes]
    .map((route) => {
      const crumbs = BREADCRUMBS[route.path];
      const extra = [...(route.extraJsonLd || [])];
      if (crumbs && route.path !== "/") {
        // Avoid duplicating breadcrumbs already set on blog posts
        if (!route.path.startsWith("/blog/") || route.path === "/blog") {
          extra.push(breadcrumbJsonLd(crumbs));
        }
      } else if (crumbs && route.path === "/") {
        // skip home breadcrumb-only
      }
      return { ...route, extraJsonLd: extra };
    })
    .map((route) => ({
      ...route,
      title: clampMetaTitle(route.title, SITE_NAME),
      description: clampMetaDescription(route.description),
    }));

  return { routes, posts };
}

export {
  absoluteUrl,
  blogPostingJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  serviceJsonLd,
  SITE_URL,
  SITE_NAME,
};
