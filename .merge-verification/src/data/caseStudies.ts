export type CaseStudyIcon =
  | "timer"
  | "calendar"
  | "graduation"
  | "utensils"
  | "users"
  | "brain"
  | "activity"
  | "bot"
  | "shopping";

export interface CaseStudy {
  name: string;
  /** Industry/category when factually supported by existing content. */
  category?: string;
  problem: string;
  solution: string;
  features: string[];
  /** Only included when evidenced or conservatively obvious from project type. */
  technology?: string;
  /** Factual delivery outcome only — no invented metrics. */
  outcome: string;
  /** Live project URL when available; omit if the site is offline. */
  link?: string;
  icon: CaseStudyIcon;
}

/**
 * Selected case studies from existing portfolio content.
 * No invented revenue, conversion, user-count, or percentage metrics.
 */
export const caseStudies: CaseStudy[] = [
  {
    name: "ClockLog",
    category: "SaaS / Operations",
    problem:
      "Teams needed a clearer way to track time and see productivity across projects.",
    solution:
      "A time-tracking and productivity management web application for modern teams.",
    features: [
      "Time tracking dashboard",
      "Team and project views",
      "Authentication & access control",
    ],
    technology: "Web application",
    outcome:
      "Built and shipped a live time-tracking platform with team and project visibility.",
    link: "https://clocklog-fe-app.vercel.app/login",
    icon: "timer",
  },
  {
    name: "EventForce",
    category: "Event Management",
    problem:
      "Large-scale events need coordinated planning, logistics, and stakeholder visibility.",
    solution:
      "An event coordination platform focused on professional and large-scale event operations.",
    features: [
      "Event planning workflows",
      "Logistics coordination",
      "Stakeholder-facing experience",
    ],
    technology: "Web application",
    outcome:
      "Delivered a live event coordination platform for planning, logistics, and stakeholder visibility.",
    link: "https://eventforce.sa.com/",
    icon: "calendar",
  },
  {
    name: "Student Help Squad",
    category: "Education Support",
    problem:
      "Students needed a dedicated place to find academic and personal support services.",
    solution:
      "A UK-based support platform connecting students with assistance resources.",
    features: [
      "Service discovery",
      "Support-oriented UX",
      "Student-facing content flows",
    ],
    technology: "Web application",
    outcome:
      "Launched a student-facing support platform for discovering academic and personal assistance services.",
    link: "https://studenthelpsquad.co.uk/",
    icon: "graduation",
  },
  {
    name: "ShareMyDine",
    category: "Food & Social",
    problem:
      "Food enthusiasts needed a better way to discover and share dining experiences.",
    solution:
      "A dining-focused social platform for connecting food enthusiasts in the UK.",
    features: [
      "Social dining discovery",
      "User profiles & listings",
      "Marketplace-style experience",
    ],
    technology: "Web application",
    outcome:
      "Built a dining discovery and social platform for sharing experiences and connecting enthusiasts.",
    link: "https://sharemydine.co.uk/",
    icon: "utensils",
  },
  {
    name: "BuzzHR",
    category: "Human Resources",
    problem:
      "HR teams needed a more streamlined system for engagement and day-to-day HR operations.",
    solution:
      "An HR management solution oriented around employee engagement and payroll workflows.",
    features: [
      "HRMS workflows",
      "Employee engagement features",
      "Payroll-oriented tooling",
    ],
    technology: "Web application",
    outcome:
      "Delivered an HR management system covering engagement and payroll-oriented workflows.",
    link: "https://www.buzzhr.co.uk/",
    icon: "users",
  },
  {
    name: "Peoples Creed AI",
    category: "AI / HR",
    problem:
      "HR teams wanted AI assistance grounded in ethical workforce decision-making.",
    solution:
      "An AI-driven platform focused on ethical human resources and workforce intelligence.",
    features: [
      "AI-assisted HR workflows",
      "Workforce intelligence views",
      "Web application experience",
    ],
    technology: "AI-powered web application",
    outcome:
      "Built an AI-assisted HR platform centered on ethical workforce decision support.",
    link: "https://peoplescreed.ai/",
    icon: "brain",
  },
  {
    name: "HealthPulse Interpreter",
    category: "Mobile / Health",
    problem:
      "Health metrics can be hard to interpret without clear, structured analysis support.",
    solution:
      "A mobile app that uses AI/ML to help interpret health-related diagnostic metrics.",
    features: [
      "Android app experience",
      "AI/ML interpretation flows",
      "Health metric presentation",
    ],
    technology: "Android mobile application with AI/ML",
    outcome:
      "Shipped an Android app that presents and helps interpret health-related diagnostic metrics.",
    link: "https://play.google.com/store/apps/details?id=org.auderenow.healthpulse.dxa.interpreter&hl=en",
    icon: "activity",
  },
  {
    name: "Agentic Creed",
    category: "AI Workflows",
    problem:
      "Businesses need structured ways to orchestrate multi-step digital workflows with AI agents.",
    solution:
      "An AI agency platform for managing complex digital workflows with agent-style automation.",
    features: [
      "Agent workflow management",
      "Automation-oriented UI",
      "Multi-step digital processes",
    ],
    technology: "AI-powered web application",
    outcome:
      "Built a platform for orchestrating multi-step digital workflows with agent-style automation.",
    link: "https://agenticcreed.ai/home",
    icon: "bot",
  },
  {
    name: "Vogue Scents",
    category: "E-Commerce",
    problem:
      "A fragrance brand needed a polished storefront for browsing and purchasing premium scents.",
    solution:
      "A luxury fragrance e-commerce experience with product discovery and checkout flow.",
    features: [
      "Product catalog",
      "E-commerce checkout path",
      "Brand-focused storefront design",
    ],
    technology: "E-commerce web application",
    outcome:
      "Delivered a brand storefront with product discovery and a complete purchase path.",
    // Domain no longer resolves; keep case study, hide outbound until a live URL exists.
    icon: "shopping",
  },
];
