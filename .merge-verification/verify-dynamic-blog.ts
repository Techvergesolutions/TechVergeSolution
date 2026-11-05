import { loadEnv } from "vite";
import { createClient } from "@sanity/client";
import { JSDOM } from "jsdom";
import handler from "./api/blog-page";
Object.assign(process.env, loadEnv("production", process.cwd(), "VITE_SANITY_"));
const client = createClient({ projectId: process.env.VITE_SANITY_PROJECT_ID!, dataset: process.env.VITE_SANITY_DATASET || "production", apiVersion: "2024-01-01", perspective: "published", useCdn: false });
const posts = await client.fetch<{ slug: string; title: string }[]>(`*[_type == "post" && defined(slug.current) && defined(title)][0...2]{"slug": slug.current, title}`);
if (!posts.length) throw new Error("No published posts available");
for (const post of posts) {
  const response = await handler.fetch(new Request(`https://example.com/api/blog-page?slug=${encodeURIComponent(post.slug)}`));
  const doc = new JSDOM(await response.text()).window.document;
  if (response.status !== 200 || !doc.title.includes(post.title) || doc.querySelectorAll('link[rel="canonical"]').length !== 1 || !doc.querySelector("#root h1")?.textContent?.includes(post.title)) throw new Error(`Dynamic HTML failed for ${post.slug}`);
  console.log(`${post.slug}: ${response.status}, title, canonical and initial H1 OK`);
}
