/**
 * Collect blog posts from compiled Markdown manifest (content/blog → src/generated).
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadEnvFiles } from "./load-env.mjs";
import { compileBlog } from "./compile-blog.mjs";

loadEnvFiles();

const GENERATED = path.join(ROOT, "src", "generated", "blog-posts.json");

/** @returns {Promise<Array>} */
export async function collectBlogPosts() {
  let posts = [];
  if (fs.existsSync(GENERATED)) {
    try {
      posts = JSON.parse(fs.readFileSync(GENERATED, "utf8"));
    } catch {
      posts = [];
    }
  }
  if (!posts.length) {
    posts = await compileBlog();
  }

  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: post.author || "TechVerge Solution",
    category: post.category || "Blog",
    imagePath: post.ogImage || post.featuredImage?.src || "/og-image.webp",
    imageAlt:
      post.ogImageAlt || post.featuredImage?.alt || post.title,
    faq: post.faq || [],
    excerpt: post.excerpt,
    quickAnswer: post.quickAnswer || post.excerpt,
    relatedSlugs: post.relatedSlugs || [],
    cta: post.cta,
    source: "markdown",
  }));
}
