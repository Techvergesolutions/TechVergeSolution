export interface TeamMember {
  name: string;
  role: string;
  image: string;
  /** Plain-language experience line shown on About (editable). */
  experience: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Umer Arshad",
    role: "Founder & CEO",
    image: "/Umer.webp",
    experience: "10+ years leading software and automation delivery",
  },
  {
    name: "Rana Hamza",
    role: "Lead Software Architect",
    image: "/Hamza.webp",
    experience: "8+ years designing scalable application architecture",
  },
  {
    name: "Faseeh Tahir",
    role: "Chief Project Manager",
    image: "/Faseeh.webp",
    experience: "7+ years running delivery timelines and client handoffs",
  },
  {
    name: "Aliza Fayyaz",
    role: "UI/UX Designer",
    image: "/Aliza.webp",
    experience: "6+ years designing product interfaces for operators and teams",
  },
  {
    name: "Mujtaba Ahmad",
    role: "Full Stack Developer",
    image: "/Mujtaba.webp",
    experience: "6+ years building web apps and API integrations",
  },
  {
    name: "Uzair Ahmad",
    role: "Quality Assurance Engineer",
    image: "/Uzair.webp",
    experience: "5+ years testing automation workflows and release quality",
  },
];

export const COMPANY_TOOLS = [
  "n8n",
  "Next.js",
  "Node.js",
  "Supabase",
  "CRM connectors (HubSpot, Salesforce, and similar)",
  "Calendar & telephony APIs",
  "OpenAI and other model APIs",
  "Email / SMS providers",
] as const;

export const COMPANY_TIMELINE = [
  {
    year: "2022",
    title: "Founded",
    detail:
      "TechVerge Solution started building custom software and automation for growing businesses.",
  },
  {
    year: "2023–2024",
    title: "Automation focus",
    detail:
      "Expanded into lead follow-up systems, CRM integrations, and process automation for service teams.",
  },
  {
    year: "2025–2026",
    title: "AI voice & agents",
    detail:
      "Added inbound AI voice agents and AI-assisted workflows with explicit human handoffs as a core delivery line.",
  },
] as const;

export const AFFILIATION_DISCLAIMER =
  "TechVerge Solution (techvergesolution.com) is not affiliated with Techverx, Techvify or similar-named companies.";
