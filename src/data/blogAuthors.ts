/**
 * Blog author profiles shown on post templates (name, bio, photo).
 * Keep Person JSON-LD author.url pointing at a visible page (/about).
 */

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  imageAlt: string;
  path: string;
}

export const blogAuthors: Record<string, BlogAuthor> = {
  "techverge-solutions": {
    id: "techverge-solutions",
    name: "TechVerge Solution",
    role: "AI automation & software team",
    bio: "We design and implement custom AI voice agents, lead follow-up, and business automation for small and service businesses in the US, UK, and UAE.",
    image: "/Logo.svg",
    imageAlt: "TechVerge Solution logo",
    path: "/about",
  },
  "umer-arshad": {
    id: "umer-arshad",
    name: "Umer Arshad",
    role: "Founder & CEO",
    bio: "Founder of TechVerge Solution. Focused on practical AI automation and voice systems that fit how service businesses actually work.",
    image: "/Umer.webp",
    imageAlt: "Umer Arshad, Founder & CEO of TechVerge Solution",
    path: "/about",
  },
};

export const DEFAULT_BLOG_AUTHOR_ID = "techverge-solutions";

export function resolveBlogAuthor(authorName?: string): BlogAuthor {
  const raw = (authorName || "").trim().toLowerCase();
  if (!raw || raw.includes("techverge")) {
    return blogAuthors[DEFAULT_BLOG_AUTHOR_ID];
  }
  if (raw.includes("umer")) {
    return blogAuthors["umer-arshad"];
  }
  return {
    ...blogAuthors[DEFAULT_BLOG_AUTHOR_ID],
    name: authorName!.trim(),
  };
}
