/**
 * Generate /llms.txt (public + dist) for AI crawlers — kept in sync with sitemap/blog build.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT } from "./load-env.mjs";
import { collectBlogPosts } from "./collect-blog-posts.mjs";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://www.techvergesolution.com").replace(
  /\/+$/,
  "",
);

const SERVICES = [
  {
    slug: "ai-automation",
    title: "AI Lead Follow-Up Automation",
    blurb:
      "Custom workflows that reply to new enquiries quickly, qualify interest, and route ready leads to your team.",
  },
  {
    slug: "ai-voice-agents",
    title: "AI Voice Agents",
    blurb:
      "Custom inbound voice agents that answer routine calls, qualify callers, and help schedule with clear human handoffs.",
  },
  {
    slug: "business-automation",
    title: "Business Process Automation",
    blurb:
      "Automations across forms, CRM, email, calendars, and internal tools so teams spend less time on repetitive admin.",
  },
  {
    slug: "ai-saas-development",
    title: "AI SaaS & Custom Software",
    blurb:
      "Custom AI-powered applications and internal tools built around your workflows—software you own, not seats on a TechVerge product.",
  },
  {
    slug: "custom-website-development",
    title: "Custom Website Development",
    blurb:
      "Custom website design and development for businesses, from responsive layouts to CMS integration and ongoing support.",
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    blurb:
      "Custom mobile app development for iOS and Android, from product planning and design to testing and launch.",
  },
];

const ORG_DESCRIPTION =
  "Custom AI automation and voice agents for small businesses in the US, UK, and UAE—built by TechVerge Solutions to cut manual work and catch more leads.";

const WHO_WE_SERVE =
  "Small and service businesses that rely on leads, appointments, calls, and follow-up—especially teams in the United States, with clients also in the United Kingdom and United Arab Emirates.";

const LOCATIONS = [
  "Head office: Lahore, Punjab, Pakistan",
  "Primary markets served: United States, United Kingdom, United Arab Emirates",
];

const CONTACT_EMAIL = "info@techvergesolution.com";

function line(title, url, blurb) {
  return `- [${title}](${url})${blurb ? `: ${blurb}` : ""}`;
}

export async function generateLlmsTxt() {
  const posts = await collectBlogPosts();
  const lines = [
    "# TechVerge Solutions",
    "",
    "> Custom AI automation, voice agents, and business software for small teams.",
    "",
    "## Summary",
    "",
    ORG_DESCRIPTION,
    "",
    "We design and implement custom AI lead follow-up, inbound voice agents, business process automation, custom websites, mobile apps, and client-owned AI software—not off-the-shelf SaaS seats from TechVerge.",
    "",
    "## Who we serve",
    "",
    WHO_WE_SERVE,
    "",
    "## Locations",
    "",
    ...LOCATIONS.map((row) => `- ${row}`),
    "",
    "## Key pages",
    "",
    line("Services", `${SITE}/services`, "Overview of what we design and implement."),
    line("About", `${SITE}/about`, "Who we are, how we work, and team roles."),
    line(
      "Contact",
      `${SITE}/contact`,
      `Book a strategy call or reach us at ${CONTACT_EMAIL}.`,
    ),
    line("Portfolio", `${SITE}/portfolio`, "Case studies by problem, solution, and outcome."),
    line("Blog", `${SITE}/blog`, "Practical guides on automation and voice agents."),
    line("Home", `${SITE}/`, "Main site overview."),
    "",
    "## Services",
    "",
    ...SERVICES.map((s) =>
      line(s.title, `${SITE}/services/${s.slug}`, s.blurb),
    ),
    "",
    "## Guides",
    "",
    ...posts.map((p) =>
      line(
        p.title.replace(/\s+/g, " ").trim(),
        `${SITE}/blog/${p.slug}`,
        (p.excerpt || p.description || "").replace(/\s+/g, " ").trim(),
      ),
    ),
    "",
    "## Discovery",
    "",
    line("XML sitemap", `${SITE}/sitemap.xml`, "All indexable marketing and blog URLs."),
    line("Blog RSS", `${SITE}/feed.xml`, "Latest published blog posts."),
    line("AI facts", `${SITE}/ai-facts`, "Short factual page for assistants and search."),
    "",
  ];

  const body = `${lines.join("\n")}\n`;
  for (const dir of ["public", "dist"]) {
    const target = path.join(ROOT, dir);
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, "llms.txt"), body, "utf8");
  }
  console.log(`[generate-llms] Wrote llms.txt (${posts.length} posts, ${SERVICES.length} services)`);
  return body;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateLlmsTxt().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
