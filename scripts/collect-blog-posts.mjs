/**
 * Collect static + published Sanity blog posts for sitemap / prerender meta.
 * Uses public CDN by default. Optional SANITY_API_READ_TOKEN (never VITE_*) for private datasets.
 */
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { loadEnvFiles } from "./load-env.mjs";

loadEnvFiles();

const PUBLISHED_POST_FILTER =
  `_type == "post" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && publishedAt <= now()`;

const STATIC_POSTS = [
  {
    slug: "ai-voice-agents-for-small-business-2026",
    title:
      "AI Voice Agents for Small Businesses in 2026: Use Cases, Costs, and Limitations",
    description:
      "A practical guide for US small and appointment-based businesses on AI voice agents in 2026 — suitable use cases, cost drivers, limitations, privacy basics, and when human handoff matters.",
    datePublished: "2026-10-12",
    dateModified: "2026-10-12",
    imagePath: "/images/blog/ai-voice-agents-hero.webp",
    imageAlt:
      "AI voice agents for small businesses — headset workstation illustration",
    faq: [
      {
        question: "Will callers know they are talking to an AI voice agent?",
        answer:
          "That depends on your disclosure policy. Many US small businesses choose clear, professional transparency plus an easy path to a human. Build the wording into the opening script rather than leaving it to chance.",
      },
      {
        question: "Can an AI voice agent replace our receptionist entirely?",
        answer:
          "Usually not as a full replacement. Most successful setups cover a defined set of call types — after-hours intake, FAQs, booking — and escalate exceptions. Think coverage and consistency, not a one-for-one headcount swap.",
      },
      {
        question: "How long does a focused inbound pilot usually take?",
        answer:
          "A narrow use case can often reach a pilot in a few weeks once calendar or CRM access, scripts, and escalation rules are ready. Broader multi-intent rollouts take longer because edge-case testing matters.",
      },
      {
        question: "What do we need before we start?",
        answer:
          "Examples of real calls or scripts, hours of operation, booking rules, FAQs, a list of what the agent must never say or do, and a stakeholder who can approve tone and handoffs. Messy processes are normal — documenting them is part of discovery.",
      },
      {
        question: "Do we have to change our phone carrier or CRM?",
        answer:
          "Not always. Many builds connect to the tools you already use. The right answer depends on call routing, recording requirements, and how your team works today — discovery should map that before anyone promises a stack switch.",
      },
    ],
  },
];

function isoDateOnly(iso) {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return String(iso).slice(0, 10);
}

async function fetchSanityPosts() {
  const projectId = process.env.VITE_SANITY_PROJECT_ID?.trim();
  if (!projectId) return [];

  // Prefer server-only token; never require VITE_SANITY_TOKEN (removed from client).
  const token =
    process.env.SANITY_API_READ_TOKEN?.trim() ||
    process.env.SANITY_API_TOKEN?.trim() ||
    undefined;

  const client = createClient({
    projectId,
    dataset: process.env.VITE_SANITY_DATASET?.trim() || "production",
    apiVersion: process.env.VITE_SANITY_API_VERSION?.trim() || "2024-01-01",
    token,
    useCdn: !token,
    perspective: "published",
  });
  const builder = imageUrlBuilder(client);

  try {
    const rows = await client.fetch(
      `*[${PUBLISHED_POST_FILTER}] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      excerpt,
      description,
      publishedAt,
      _updatedAt,
      mainImage { asset, alt },
      faqs[] { question, answer }
    }`,
    );

    return (rows || []).map((row) => {
      let imagePath = "/og-image.webp";
      if (row.mainImage?.asset) {
        try {
          imagePath = builder.image(row.mainImage).width(1400).quality(85).url();
        } catch {
          imagePath = "/og-image.webp";
        }
      }
      return {
        slug: row.slug,
        title: row.title,
        description:
          row.description?.trim() ||
          row.excerpt?.trim()?.slice(0, 160) ||
          row.title,
        datePublished: isoDateOnly(row.publishedAt),
        dateModified: isoDateOnly(row._updatedAt ?? row.publishedAt),
        imagePath,
        imageAlt: row.mainImage?.alt?.trim() || row.title,
        faq: (row.faqs || []).filter(
          (f) => f?.question?.trim() && f?.answer?.trim(),
        ),
        source: "sanity",
      };
    });
  } catch (error) {
    console.warn("[collect-blog-posts] Sanity fetch failed:", error.message);
    return [];
  }
}

/** @returns {Promise<Array>} */
export async function collectBlogPosts() {
  const sanity = await fetchSanityPosts();
  const sanitySlugs = new Set(sanity.map((p) => p.slug));
  const staticOnly = STATIC_POSTS.filter((p) => !sanitySlugs.has(p.slug));
  return [...sanity, ...staticOnly].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );
}

export { STATIC_POSTS, PUBLISHED_POST_FILTER };
