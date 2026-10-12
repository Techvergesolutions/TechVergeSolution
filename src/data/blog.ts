/**
 * Blog post registry. Keep slugs/titles/descriptions in sync with
 * `scripts/seo-prerender-data.mjs` prerender routes.
 */

export interface BlogImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  datePublished: string;
  dateModified: string;
  readingTimeMinutes: number;
  tags?: string[];
  featuredImage: BlogImage;
  /** Absolute or site-relative path used for Open Graph when suitable. */
  ogImage?: string;
  ogImageAlt?: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "ai-voice-agents-for-small-business-2026",
    title:
      "AI Voice Agents for Small Businesses in 2026: Use Cases, Costs, and Limitations",
    description:
      "A practical guide for US small and appointment-based businesses on AI voice agents in 2026 — suitable use cases, cost drivers, limitations, privacy basics, and when human handoff matters.",
    excerpt:
      "Missed calls and after-hours inquiries still cost small businesses real opportunities. Here is a clear look at where AI voice agents help in 2026, what they cost to build well, and where they still fall short.",
    datePublished: "2026-10-12",
    dateModified: "2026-10-12",
    readingTimeMinutes: 8,
    tags: ["AI voice agents", "small business", "automation"],
    featuredImage: {
      src: "/images/blog/ai-voice-agents-hero.webp",
      alt: "Customer support specialist wearing a headset at a workstation",
      width: 1400,
      height: 934,
    },
    ogImage: "/images/blog/ai-voice-agents-hero.webp",
    ogImageAlt:
      "AI voice agents for small businesses — headset workstation illustration",
  },
];

export function getBlogPostBySlug(slug: string): BlogPostMeta | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function blogPostPath(slug: string): string {
  return `/blog/${slug}`;
}

export const blogSlugs = blogPosts.map((post) => post.slug);
