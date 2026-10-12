export type ServiceSlug =
  | "ai-automation"
  | "ai-voice-agents"
  | "business-automation"
  | "ai-saas-development";

export interface ServiceStep {
  title: string;
  description: string;
}

export interface ServiceUseCase {
  title: string;
  description: string;
}

export interface ServiceFaqItem {
  question: string;
  answer: string;
}

export interface ServiceConfig {
  slug: ServiceSlug;
  pageTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  problem: {
    title: string;
    description: string;
    points: string[];
  };
  builds: {
    title: string;
    description: string;
    items: string[];
  };
  howItWorks: {
    title: string;
    description: string;
    steps: ServiceStep[];
    technicalCapabilities?: string[];
  };
  useCases: {
    title: string;
    items: ServiceUseCase[];
  };
  integrations: {
    title: string;
    description: string;
    items: string[];
    technicalCapabilities?: string[];
  };
  process: {
    title: string;
    description: string;
    steps: ServiceStep[];
  };
  whoFor: {
    title: string;
    description: string;
    items: string[];
  };
  faq: ServiceFaqItem[];
  cta: {
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel?: string;
  };
}

export const serviceSlugs: ServiceSlug[] = [
  "ai-automation",
  "ai-voice-agents",
  "business-automation",
  "ai-saas-development",
];

export const servicesConfig: Record<ServiceSlug, ServiceConfig> = {
  "ai-automation": {
    slug: "ai-automation",
    pageTitle: "AI Lead Follow-Up Automation | TechVerge Solutions",
    metaDescription:
      "We design and implement custom AI lead follow-up automation for US businesses — faster response, qualification, and routing to your team.",
    eyebrow: "AI Lead Follow-Up Automation",
    headline: "Respond to New Leads Before They Go Cold",
    subheadline:
      "We design and implement custom follow-up workflows that reply quickly, qualify interest, and route ready opportunities to your team.",
    problem: {
      title: "The Business Problem",
      description:
        "Most lost leads are not a product problem — they are a timing and follow-up problem. When enquiries sit unanswered, competitors win the conversation.",
      points: [
        "New form fills, chat messages, and inbound emails wait too long for a reply",
        "Sales teams spend hours on repetitive first-touch and qualification work",
        "Hot leads and low-intent enquiries look the same until someone reviews them manually",
        "Handoffs between marketing, sales, and ops get messy when tools do not talk to each other",
      ],
    },
    builds: {
      title: "What We Build",
      description:
        "We build custom AI-assisted follow-up systems around your offers, qualification rules, and CRM — not a one-size product you configure yourself.",
      items: [
        "Instant, on-brand first responses when a new lead comes in",
        "Qualification flows that ask the right questions and score interest",
        "Smart routing so qualified opportunities reach the right person or inbox",
        "Reminder and nurture sequences for leads that are not ready yet",
        "Clear human handoffs when a conversation needs a person",
      ],
    },
    howItWorks: {
      title: "How The Solution Works",
      description:
        "We start from the outcome you need — faster response and cleaner pipeline — then design the workflow your team will actually run.",
      steps: [
        {
          title: "Capture every enquiry",
          description:
            "We connect the channels you already use — website forms, landing pages, chat, or inbound email — into one follow-up path.",
        },
        {
          title: "Respond and qualify",
          description:
            "We design automated replies and qualification questions that match your tone and only escalate what meets your criteria.",
        },
        {
          title: "Route to the right owner",
          description:
            "Qualified leads land in your CRM, Slack, email, or assignment rules so your team picks up ready conversations — not noise.",
        },
        {
          title: "Keep people in control",
          description:
            "We define when automation stops and a human takes over, so customers never feel stuck talking to a dead-end bot.",
        },
      ],
      technicalCapabilities: [
        "Workflow orchestration across your forms, CRM, and messaging tools",
        "LLM-assisted reply drafting within your approved scripts and guardrails",
        "CRM field updates, tags, and owner assignment",
        "Logging and review so your team can improve prompts and rules over time",
      ],
    },
    useCases: {
      title: "Example Use Cases",
      items: [
        {
          title: "Website lead response",
          description:
            "A prospect submits a contact form at 9pm. They get a helpful reply within minutes, answer a few qualifying questions, and a sales owner is notified if they meet your criteria.",
        },
        {
          title: "Service business intake",
          description:
            "Home services, clinics, or agencies automatically gather location, urgency, and budget signals before a coordinator schedules the next step.",
        },
        {
          title: "B2B demo request triage",
          description:
            "Demo requests are sorted by company size, use case, and timeline so AEs spend time on opportunities that fit — not every form fill equally.",
        },
        {
          title: "Missed-call and chat follow-up",
          description:
            "When someone leaves a message or abandons chat, a follow-up sequence re-engages them and books them into the right calendar or queue.",
        },
      ],
    },
    integrations: {
      title: "Integrations",
      description:
        "We connect the tools you already run. The goal is fewer copy-paste steps — not forcing a rip-and-replace stack.",
      items: [
        "CRMs such as HubSpot, Salesforce, Pipedrive, or custom databases",
        "Forms and landing pages (Webflow, WordPress, Typeform, custom sites)",
        "Email and messaging (Gmail, Outlook, Slack, SMS providers)",
        "Calendars for booking qualified conversations",
        "Spreadsheets and internal ops tools where teams still work today",
      ],
      technicalCapabilities: [
        "API and webhook-based connections",
        "Secure credential handling and environment separation",
        "Optional workflow tools and custom glue code where needed",
      ],
    },
    process: {
      title: "Implementation Process",
      description:
        "A practical path from how follow-up works today to a workflow your team can trust.",
      steps: [
        {
          title: "Discover",
          description:
            "We map your current lead sources, response times, qualification rules, and who owns each stage.",
        },
        {
          title: "Design",
          description:
            "We design reply logic, escalation rules, and CRM updates — with clear human handoffs.",
        },
        {
          title: "Build & integrate",
          description:
            "We implement the workflow, connect your systems, and test real scenarios with your team.",
        },
        {
          title: "Launch & refine",
          description:
            "We go live carefully, monitor early conversations, and tighten qualification and routing based on what you see.",
        },
      ],
    },
    whoFor: {
      title: "Who It Is For",
      description:
        "Best fit for US businesses where speed-to-lead and consistent qualification directly affect revenue.",
      items: [
        "Sales and marketing teams drowning in first-touch follow-up",
        "Service businesses that receive form and chat enquiries daily",
        "B2B companies that need cleaner demo and discovery routing",
        "Operators who want automation without buying a rigid packaged product",
      ],
    },
    faq: [
      {
        question: "Is this a product we buy seats for?",
        answer:
          "No. We design and implement a custom follow-up system for your business. You keep ownership of the workflows and the accounts we connect — we are not selling a packaged AI product with monthly seats.",
      },
      {
        question: "How long does a typical engagement take?",
        answer:
          "Most focused lead follow-up builds land in a few weeks once we have access to your tools and clear qualification rules. Timeline depends on how many channels and CRM edge cases we need to cover.",
      },
      {
        question: "What do you need from us to get started?",
        answer:
          "Access to the systems where leads arrive today, examples of good replies, your qualification criteria, and a decision-maker who can approve routing rules. We do not need a perfect process — mapping the messy reality is part of discovery.",
      },
      {
        question: "Who owns the systems and data?",
        answer:
          "You do. We build on your CRM, inboxes, and preferred infrastructure wherever practical. Credentials stay under your control, and we document what was built so your team is not locked into undocumented magic.",
      },
      {
        question: "Will this replace our salespeople?",
        answer:
          "No. The goal is to handle repetitive first response and qualification so your people spend time on conversations that matter. We design explicit handoffs to humans for pricing, exceptions, and relationship work.",
      },
      {
        question: "What if our process is messy today?",
        answer:
          "That is normal. We start by documenting how work actually happens, then automate the highest-friction steps first — usually speed-to-lead and routing — before expanding.",
      },
    ],
    cta: {
      title: "Let's Map Your Lead Follow-Up",
      description:
        "Tell us how enquiries arrive today. We'll outline where custom automation can respond faster, qualify better, and hand off cleanly to your team.",
      primaryLabel: "Book a Free Strategy Call",
      secondaryLabel: "Get a Free Workflow Audit",
    },
  },

  "ai-voice-agents": {
    slug: "ai-voice-agents",
    pageTitle: "Custom AI Voice Agents | TechVerge Solutions",
    metaDescription:
      "We design and implement custom inbound AI voice agents that handle common calls, qualify callers, and help schedule — with clear human handoffs.",
    eyebrow: "AI Voice Agents",
    headline: "Handle Common Inbound Calls Without Missing the Important Ones",
    subheadline:
      "We design and implement custom voice agents that answer routine questions, qualify callers, and help schedule — then hand off to your team when a person should take over.",
    problem: {
      title: "The Business Problem",
      description:
        "Missed and repetitive inbound calls drain time and lose revenue. Front desks and sales lines spend hours answering the same questions while urgent callers wait.",
      points: [
        "After-hours and peak-hour calls go to voicemail",
        "Staff repeat the same FAQs, availability checks, and intake questions",
        "Callers who need a human get stuck in rigid phone trees",
        "Appointment and lead details never make it cleanly into your CRM or calendar",
      ],
    },
    builds: {
      title: "What We Build",
      description:
        "We build inbound voice experiences tailored to your scripts, hours, and escalation rules — not a generic call-bot you rent seats for.",
      items: [
        "Natural inbound call handling for common questions and intake",
        "Caller qualification based on your criteria",
        "Scheduling support against your real calendar rules",
        "Warm or cold handoff to a person when needed",
        "Call summaries and structured data written back to your systems",
      ],
    },
    howItWorks: {
      title: "How The Solution Works",
      description:
        "We design the conversation around what callers need and what your team must approve — then connect telephony, calendars, and CRM.",
      steps: [
        {
          title: "Define call intents",
          description:
            "We document the call types you want automation to handle versus escalate — FAQs, intake, booking, billing questions, and exceptions.",
        },
        {
          title: "Design the conversation",
          description:
            "We write prompts, guardrails, and confirmation steps so the agent stays on-brand and never invents policies you did not approve.",
        },
        {
          title: "Connect phone and systems",
          description:
            "We integrate your number or call path with calendars, CRM, and notification channels your team already uses.",
        },
        {
          title: "Test and hand off",
          description:
            "We run realistic call scenarios, tune interruptions and silence handling, and confirm that humans can take over cleanly.",
        },
      ],
      technicalCapabilities: [
        "Telephony and SIP / cloud voice provider integration",
        "Speech-to-text, LLM dialogue control, and text-to-speech within approved scripts",
        "Calendar availability checks and booking confirmations",
        "CRM logging, tags, and post-call summaries for your team",
      ],
    },
    useCases: {
      title: "Example Use Cases",
      items: [
        {
          title: "After-hours answering",
          description:
            "Callers outside business hours get answers to common questions and can request a callback or book the next available slot.",
        },
        {
          title: "Appointment scheduling",
          description:
            "The agent checks availability, confirms details, and books — then notifies staff when something needs review.",
        },
        {
          title: "Lead qualification by phone",
          description:
            "Inbound sales calls are screened for service area, budget, or urgency before a closer is interrupted.",
        },
        {
          title: "Front-desk overflow",
          description:
            "During peak volume, routine callers are handled automatically while priority or complex cases ring through to staff.",
        },
      ],
    },
    integrations: {
      title: "Integrations",
      description:
        "Voice only helps if it connects to how your business already runs scheduling and follow-up.",
      items: [
        "Phone numbers and call routing (existing providers where possible)",
        "Google Calendar, Outlook, or industry scheduling tools",
        "CRM and helpdesk systems for caller records",
        "SMS and email for confirmations and callbacks",
        "Internal alerts in Slack or team inboxes",
      ],
      technicalCapabilities: [
        "Cloud telephony APIs and webhook event handling",
        "Secure storage of call metadata and transcripts per your policy",
        "Fallback routing to live agents or voicemail",
      ],
    },
    process: {
      title: "Implementation Process",
      description:
        "Voice projects succeed when scripts, edge cases, and handoffs are designed before go-live — not bolted on later.",
      steps: [
        {
          title: "Discover",
          description:
            "We listen to how calls work today, which questions repeat, and where callers get frustrated.",
        },
        {
          title: "Design",
          description:
            "We define intents, escalation rules, booking logic, and what the agent must never say or do.",
        },
        {
          title: "Build & integrate",
          description:
            "We implement the agent, connect phone and backend systems, and iterate on real test calls with your team.",
        },
        {
          title: "Launch & monitor",
          description:
            "We roll out carefully, review transcripts and outcomes, and refine prompts and routing.",
        },
      ],
    },
    whoFor: {
      title: "Who It Is For",
      description:
        "A strong fit when inbound call volume includes many repeatable conversations — and missing calls has a clear cost.",
      items: [
        "Clinics, home services, and local businesses with heavy phone intake",
        "Sales teams that need after-hours coverage without a full night desk",
        "Operations leaders who want consistent intake quality",
        "Teams that need human escalation for complex or sensitive calls",
      ],
    },
    faq: [
      {
        question: "Is this a seat-based voice product?",
        answer:
          "No. We design and implement a custom inbound voice agent for your call types and systems. You are not buying a generic packaged product with per-seat pricing from TechVerge.",
      },
      {
        question: "Will callers know they are speaking with automation?",
        answer:
          "We follow the disclosure approach you approve. Many clients prefer clear, professional transparency plus a fast path to a human — we design that into the flow.",
      },
      {
        question: "What happens when the agent cannot help?",
        answer:
          "We define escalation rules up front: transfer to a person, take a message, book a callback, or send a summary to your team. The agent should not trap callers in a loop.",
      },
      {
        question: "How do you handle sensitive information?",
        answer:
          "We scope what the agent is allowed to collect, store, and say. Payment details, medical advice, and other sensitive topics can be excluded or handed to humans by design.",
      },
      {
        question: "What do you need from our side?",
        answer:
          "Sample call recordings or scripts if available, hours of operation, booking rules, FAQs, and access to calendar/CRM systems. A stakeholder who can approve tone and escalation is essential.",
      },
      {
        question: "How long until we can take live calls?",
        answer:
          "A focused inbound use case often reaches a pilot in a few weeks after access and scripts are ready. Broader multi-intent rollouts take longer because testing edge cases matters.",
      },
    ],
    cta: {
      title: "Let's Design Your Inbound Voice Flow",
      description:
        "Share how calls work today — volume, common questions, and where humans must stay involved. We'll outline a practical voice agent approach.",
      primaryLabel: "Book a Free Strategy Call",
      secondaryLabel: "Get a Free Workflow Audit",
    },
  },

  "business-automation": {
    slug: "business-automation",
    pageTitle: "Business Process Automation | TechVerge Solutions",
    metaDescription:
      "We design and implement custom business automation that connects forms, CRM, email, calendars, and internal systems — reducing repetitive admin.",
    eyebrow: "Business Process Automation",
    headline: "Connect Your Tools So Work Moves Without Copy-Paste",
    subheadline:
      "We design and implement automations across forms, CRM, email, calendars, and internal systems so your team spends less time on repetitive admin.",
    problem: {
      title: "The Business Problem",
      description:
        "Growing teams lose hours every week to manual updates between tools. The work is invisible until hiring cannot keep up with the admin load.",
      points: [
        "Staff re-enter the same data into CRM, spreadsheets, and email",
        "Approvals and status updates live in inboxes instead of a clear workflow",
        "Calendars, forms, and project tools do not stay in sync",
        "Handoffs between sales, delivery, and finance depend on someone remembering to update a field",
      ],
    },
    builds: {
      title: "What We Build",
      description:
        "We implement practical automations that move information and tasks between the systems you already use — designed around your process, not a generic template.",
      items: [
        "Form-to-CRM and form-to-ops pipelines that create clean records",
        "Email and notification flows tied to real status changes",
        "Calendar and scheduling sync for bookings and reminders",
        "Internal task creation when deals, tickets, or requests change stage",
        "Lightweight dashboards or digests so owners see what needs attention",
      ],
    },
    howItWorks: {
      title: "How The Solution Works",
      description:
        "We prioritize the bottlenecks that cost the most time, then connect systems with clear ownership and failure handling.",
      steps: [
        {
          title: "Map the busywork",
          description:
            "We document repetitive steps, tools involved, and where errors or delays usually appear.",
        },
        {
          title: "Design the happy path",
          description:
            "We define triggers, data mapping, approvals, and what happens when something fails or needs a human.",
        },
        {
          title: "Connect systems",
          description:
            "We integrate the apps your team already trusts and add custom logic where off-the-shelf connectors fall short.",
        },
        {
          title: "Stabilize and expand",
          description:
            "We monitor early runs, fix edge cases, then extend automation to the next high-friction process.",
        },
      ],
      technicalCapabilities: [
        "API, webhook, and scheduled sync jobs",
        "Idempotent updates to avoid duplicate CRM records",
        "Error alerts and retry strategies your ops team can understand",
        "Optional workflow tooling plus custom code for awkward systems",
      ],
    },
    useCases: {
      title: "Example Use Cases",
      items: [
        {
          title: "New client onboarding",
          description:
            "When a deal closes, kick off welcome emails, create project folders or tasks, and notify the delivery owner — without a checklist someone forgets.",
        },
        {
          title: "Lead and ticket hygiene",
          description:
            "Normalize form data, enrich records, assign owners, and close the loop when a ticket sits too long.",
        },
        {
          title: "Scheduling and reminders",
          description:
            "Keep calendars, confirmation emails, and CRM activities aligned when appointments are booked or rescheduled.",
        },
        {
          title: "Ops status digests",
          description:
            "Send daily or weekly summaries of open items, stalled deals, or missing fields so managers coach from a single view.",
        },
      ],
    },
    integrations: {
      title: "Integrations",
      description:
        "We meet you in your current stack. The win is fewer manual bridges — not forcing a new suite overnight.",
      items: [
        "CRMs and helpdesks",
        "Forms, website backends, and Typeform-style tools",
        "Gmail, Outlook, and team chat",
        "Google Workspace / Microsoft 365 calendars and Drive",
        "Accounting, project, and industry tools via API where available",
      ],
      technicalCapabilities: [
        "Middleware and workflow automation where appropriate",
        "Custom scripts for legacy or poorly documented systems",
        "Secure secrets management and least-privilege access",
      ],
    },
    process: {
      title: "Implementation Process",
      description:
        "Automation projects fail when they try to boil the ocean. We ship the highest-ROI path first.",
      steps: [
        {
          title: "Discover",
          description:
            "We inventory tools, shadow a few real workflows, and quantify where time and errors concentrate.",
        },
        {
          title: "Design",
          description:
            "We specify triggers, field maps, owners, and exception paths before writing integrations.",
        },
        {
          title: "Build & integrate",
          description:
            "We implement, test with real sample data, and train the people who will live with the workflow.",
        },
        {
          title: "Optimize",
          description:
            "We review failures and edge cases, then expand to adjacent processes once the foundation is stable.",
        },
      ],
    },
    whoFor: {
      title: "Who It Is For",
      description:
        "Ideal for operators and founders who feel the admin tax of growth before they feel ready for a full software rebuild.",
      items: [
        "Teams juggling CRM, email, and spreadsheets that never stay aligned",
        "Agencies and service businesses with repetitive onboarding steps",
        "Ops leaders who want reliable handoffs between departments",
        "Companies that need custom glue between tools — not another packaged platform",
      ],
    },
    faq: [
      {
        question: "Do we have to move to your software?",
        answer:
          "No. We build automation on top of the systems you already use whenever possible. TechVerge is not selling a proprietary operations platform you must migrate into.",
      },
      {
        question: "Where should we start if everything feels manual?",
        answer:
          "Usually with the path that creates the most rework — often form-to-CRM, client onboarding, or status notifications. We pick one high-friction workflow, ship it well, then expand.",
      },
      {
        question: "What access do you need?",
        answer:
          "Read/write access to the tools in scope (or a sandbox), a process owner, and examples of correct vs incorrect records. We prefer least-privilege credentials and documented ownership.",
      },
      {
        question: "Who maintains the automations after launch?",
        answer:
          "We document what we built and can hand maintenance to your team, stay on for iteration, or train an internal owner. You own the accounts and the logic we implement.",
      },
      {
        question: "How do you handle failures?",
        answer:
          "We design alerts, retries, and human fallbacks for critical paths. Silent failure is worse than no automation — visibility is part of the build.",
      },
      {
        question: "Can you work with messy spreadsheets and legacy tools?",
        answer:
          "Yes, within reason. Sometimes the right first step is stabilizing data and naming conventions before full automation. We will tell you honestly if a tool needs a different approach.",
      },
    ],
    cta: {
      title: "Let's Find The Admin You Can Remove",
      description:
        "Walk us through one repetitive process. We'll show where custom automation can connect your tools and free your team.",
      primaryLabel: "Book a Free Strategy Call",
      secondaryLabel: "Get a Free Workflow Audit",
    },
  },

  "ai-saas-development": {
    slug: "ai-saas-development",
    pageTitle: "Custom AI SaaS & Software Development | TechVerge Solutions",
    metaDescription:
      "We design and build custom AI-powered applications and internal tools for your workflows — not a TechVerge SaaS product you subscribe to.",
    eyebrow: "AI SaaS & Custom Software",
    headline: "Custom AI-Powered Apps Built Around Your Workflows",
    subheadline:
      "We design and build AI-powered applications and internal tools for your business — software you own, shaped around how your team actually works.",
    problem: {
      title: "The Business Problem",
      description:
        "Off-the-shelf tools stop fitting when your process is the product. Spreadsheets and patched-together apps create risk, slow delivery, and limit what AI can safely do.",
      points: [
        "Critical workflows live in fragile spreadsheets or tribal knowledge",
        "Generic SaaS forces workarounds that your team quietly hates",
        "You need AI features — drafting, search, classification — inside your product or ops tool",
        "Internal tools lag behind the process, so people invent shadow systems",
      ],
    },
    builds: {
      title: "What We Build",
      description:
        "We build custom software and AI-assisted features for your users or your internal teams. This is client-owned product work — not seats on a TechVerge SaaS.",
      items: [
        "Customer-facing web apps with AI-assisted workflows",
        "Internal tools for ops, support, or sales enablement",
        "Document and knowledge assistants grounded in your approved sources",
        "Classification, extraction, and drafting features inside existing products",
        "Admin panels, permissions, and audit trails suited to your org",
      ],
    },
    howItWorks: {
      title: "How The Solution Works",
      description:
        "We treat AI as a capability inside a product — not the product pitch. Outcomes and UX come first; models and infrastructure support them.",
      steps: [
        {
          title: "Clarify the job to be done",
          description:
            "We define who the software is for, which decisions it improves, and where humans must remain in the loop.",
        },
        {
          title: "Design product and data flows",
          description:
            "We shape UX, permissions, and data sources so AI features stay grounded and reviewable.",
        },
        {
          title: "Build iteratively",
          description:
            "We ship a usable core first — auth, primary workflows, then AI features with evaluation and feedback loops.",
        },
        {
          title: "Handoff with ownership",
          description:
            "We document architecture, environments, and runbooks so your team (or we) can maintain and extend the system.",
        },
      ],
      technicalCapabilities: [
        "Modern web frontends and APIs tailored to your stack preferences",
        "LLM features with retrieval, tool use, and guardrails where appropriate",
        "Auth, roles, logging, and deployment suited to your security needs",
        "Integrations with your CRM, storage, and existing services",
      ],
    },
    useCases: {
      title: "Example Use Cases",
      items: [
        {
          title: "Internal AI ops console",
          description:
            "A tool where staff upload documents, ask grounded questions, and trigger approved follow-up actions with an audit trail.",
        },
        {
          title: "Customer portal with assisted workflows",
          description:
            "Clients submit requests, get status updates, and receive AI-drafted responses that your team reviews before sending.",
        },
        {
          title: "Domain-specific SaaS MVP",
          description:
            "You have a clear niche workflow. We help you design and build the first production version — including AI features that differentiate the product.",
        },
        {
          title: "Embedded AI inside an existing app",
          description:
            "Add search, summarization, or classification to software you already run, without starting from zero.",
        },
      ],
    },
    integrations: {
      title: "Integrations",
      description:
        "Custom software still has to live in your ecosystem. We plan integrations as part of the product, not as an afterthought.",
      items: [
        "Identity providers and SSO where required",
        "CRMs, billing, and support platforms",
        "Document stores and knowledge bases",
        "Email, Slack, and notification channels",
        "Analytics and logging for product and AI quality",
      ],
      technicalCapabilities: [
        "REST/GraphQL APIs and event-driven updates",
        "Model provider flexibility with cost and quality controls",
        "Staging environments and CI/CD aligned to your release process",
      ],
    },
    process: {
      title: "Implementation Process",
      description:
        "Product work needs clarity on scope and ownership. We keep phases explicit so you always know what ships next.",
      steps: [
        {
          title: "Discover",
          description:
            "We align on users, success metrics, constraints, and what must be custom versus integrated.",
        },
        {
          title: "Design",
          description:
            "We produce UX flows, data model, and AI feature boundaries — including review and escalation paths.",
        },
        {
          title: "Build",
          description:
            "We develop in milestones you can demo, with testing around both product behavior and AI quality.",
        },
        {
          title: "Launch & iterate",
          description:
            "We deploy, train users, and plan the next improvements based on real usage — not a feature dump on day one.",
        },
      ],
    },
    whoFor: {
      title: "Who It Is For",
      description:
        "Best for teams that need software shaped to their process — including AI capabilities — and want clear ownership of what gets built.",
      items: [
        "Founders validating a niche AI-assisted product",
        "Companies replacing fragile spreadsheets with real internal tools",
        "Product teams embedding AI into an existing application",
        "Operators who need custom software, not another subscription to a generic platform",
      ],
    },
    faq: [
      {
        question: "Is this TechVerge's SaaS product?",
        answer:
          "No. We design and build software for you. You own the product and infrastructure decisions we agree on. We are not selling seats to a TechVerge-hosted packaged application.",
      },
      {
        question: "Who owns the code and IP?",
        answer:
          "Ownership is defined in the engagement agreement. In typical custom builds, you own the application we create for you, along with documentation and deployment access.",
      },
      {
        question: "How do you decide what AI should and should not do?",
        answer:
          "During design we mark which outputs need human review, which data sources are allowed, and which actions the system must never take automatically. Guardrails are a product decision, not an afterthought.",
      },
      {
        question: "What does a realistic timeline look like?",
        answer:
          "A focused MVP can often reach a usable pilot in a matter of weeks to a few months depending on integrations, compliance needs, and how defined the workflow already is. We phase delivery so you see working software early.",
      },
      {
        question: "What do you need from our team?",
        answer:
          "A product owner, access to subject-matter experts, sample data or documents (sanitized if needed), and clarity on users and success criteria. We can help sharpen the brief if it is still forming.",
      },
      {
        question: "Can you maintain the app after launch?",
        answer:
          "Yes — through an ongoing engagement — or we can hand off to your engineers with documentation and a clean repository. Maintenance expectations are set before build, not after.",
      },
    ],
    cta: {
      title: "Let's Scope The Software You Actually Need",
      description:
        "Share the workflow or product idea. We'll help you decide what to build, what to integrate, and where AI belongs — before you invest in the wrong stack.",
      primaryLabel: "Book a Free Strategy Call",
      secondaryLabel: "Get a Free Workflow Audit",
    },
  },
};

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  if (slug in servicesConfig) {
    return servicesConfig[slug as ServiceSlug];
  }
  return undefined;
}
