import { Link } from "react-router-dom";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { BookingCta } from "@/components/cta/BookingCta";

const useCases = [
  {
    useCase: "After-hours inbound intake",
    fit: "Strong",
    notes: "Capture intent, take a message, or book a callback when staff are offline.",
  },
  {
    useCase: "Appointment booking & rescheduling",
    fit: "Strong",
    notes: "Works well when calendar rules are clear (buffers, service length, service area).",
  },
  {
    useCase: "Basic FAQs (hours, location, services)",
    fit: "Strong",
    notes: "High volume, low ambiguity — a natural first scope for many small teams.",
  },
  {
    useCase: "Lead qualification before a human callback",
    fit: "Good",
    notes: "Collect budget range, timeline, service type, and route warm leads to sales.",
  },
  {
    useCase: "Order status or account lookups",
    fit: "Conditional",
    notes: "Only when identity checks and data access are designed carefully.",
  },
  {
    useCase: "Complex sales negotiation or complaints",
    fit: "Poor fit alone",
    notes: "Better as a fast transfer to a person with a call summary.",
  },
  {
    useCase: "Medical, legal, or regulated advice",
    fit: "Avoid / human-only",
    notes: "Keep sensitive advice and decisions with licensed humans by design.",
  },
];

const faqs = [
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
];

export const articleFaqs = faqs;

export function AiVoiceAgentsForSmallBusiness2026() {
  return (
    <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed">
      <p>
        If you run a US small business that lives on appointments, service calls, or
        inbound leads, you already know the pattern: the phone rings while you are
        with a client, after hours, or mid-job — and the next caller books with
        someone else. In 2026, AI voice agents are one of the more practical ways to
        cover those gaps, but only when the use case is clear and the handoffs are
        designed on purpose.
      </p>
      <p>
        This guide is for owners and operators of service and appointment businesses —
        home services, clinics and practices with booking needs, local professional
        services, and similar teams — who want a grounded view of what AI voice agents
        do well, what they cost to implement thoughtfully, and where they still fall
        short.
      </p>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        What an AI voice agent actually is in 2026
      </h2>
      <p>
        An AI voice agent is software that can answer or place phone calls, understand
        spoken language, follow a script or policy, and take actions — such as looking
        up availability, writing a CRM note, or transferring to a person. Unlike a
        simple phone tree, modern agents can handle natural back-and-forth for a
        defined set of intents.
      </p>
      <p>
        They are not magic, and they are not a packaged “set and forget” product for
        every business. The useful deployments look more like custom workflows with a
        voice interface: clear goals, integrations you already trust, and rules for
        when a human must take over.
      </p>
      <p>
        In practice, most small-business builds start as inbound-only. Outbound calling
        exists, but it brings extra compliance, list quality, and timing questions that
        many teams are better off postponing until inbound coverage is stable. Think of
        the first version as a reliable front door: answer, understand, act within
        policy, and escalate cleanly.
      </p>

      <BlogFigure
        src="/images/blog/ai-call-workflow.webp"
        alt="Person holding a smartphone during a business phone conversation"
        width={1200}
        height={901}
        caption="Inbound voice coverage works best when call types and escalation paths are defined up front."
      />

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        Why small and appointment businesses care
      </h2>
      <p>
        Speed-to-lead still matters. Callers who need a plumber, a cleaning slot, a
        consult, or a same-week appointment rarely leave three voicemails. They call
        the next number. Voice agents help when your team cannot be at the phone —
        evenings, weekends, lunch rushes, or when every staff member is already on a
        job.
      </p>
      <p>
        They also help with consistency. The same questions about hours, service
        areas, deposits, and what to bring to an appointment get answered the same way
        every time. That does not replace judgment-heavy conversations; it clears the
        repetitive layer so humans spend time where judgment matters.
      </p>
      <p>
        There is also a quieter benefit: fewer half-finished intake forms. When a
        caller reaches a person who is already mid-job, details get scribbled, lost, or
        delayed. An agent that writes structured notes into your CRM or shared inbox
        gives the next human a cleaner starting point — even when the outcome is simply
        “please call me back between 4 and 6.”
      </p>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        Use cases that fit — and ones that do not
      </h2>
      <p>
        Fit depends less on industry buzzwords and more on whether the call has a
        predictable structure. The table below is a practical starting filter for
        US small and service businesses.
      </p>
      <p>
        A good rule of thumb: if two experienced team members would handle the call
        almost the same way nine times out of ten, it is a candidate for automation.
        If every call is a negotiation, a clinical judgment, or a one-off exception,
        keep a human in the loop from the first minute.
      </p>

      <div className="my-8 overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full min-w-[36rem] text-left text-sm md:text-base">
          <caption className="sr-only">
            Suitable AI voice agent use cases for small businesses
          </caption>
          <thead className="bg-muted/50 text-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Use case
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Fit
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {useCases.map((row) => (
              <tr key={row.useCase} className="border-t border-border/40">
                <th scope="row" className="px-4 py-3 font-medium text-foreground align-top">
                  {row.useCase}
                </th>
                <td className="px-4 py-3 align-top whitespace-nowrap">{row.fit}</td>
                <td className="px-4 py-3 align-top">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        Appointment booking without creating chaos
      </h2>
      <p>
        Booking is one of the highest-ROI voice use cases when your calendar rules are
        real. That means service durations, buffers between jobs, travel windows,
        staff skills, and “do not book” rules are written down — not only living in
        someone’s head.
      </p>
      <p>
        A solid flow usually confirms the service type, checks availability against
        your system of record, books or offers alternatives, and sends a confirmation
        the customer already expects (SMS or email). If your booking logic is full of
        exceptions, start with intake and callback scheduling, then graduate to live
        booking after the rules are stable.
      </p>
      <p>
        Rescheduling and cancellations deserve their own rules. Many businesses allow
        free changes until a cutoff, then require a fee or manager approval. Encode that
        early. An agent that cheerfully cancels a same-day slot against your policy will
        create more cleanup work than it saves.
      </p>

      <BlogFigure
        src="/images/blog/appointment-scheduling.webp"
        alt="Desk calendar and planner used for scheduling appointments"
        width={1200}
        height={802}
        caption="Voice booking succeeds when calendar rules — duration, buffers, and exceptions — are explicit."
      />

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        Qualification, CRM notes, and routing
      </h2>
      <p>
        Many teams do not need the agent to close the sale. They need it to ask the
        questions a good receptionist would ask: service needed, location, urgency,
        preferred time window, and how the caller found you. Those answers should land
        in your CRM or inbox as a structured note so the human callback starts warm.
      </p>
      <p>
        This is where voice agents connect to broader{" "}
        <Link
          to="/services/ai-automation"
          className="text-primary hover:underline underline-offset-4"
        >
          AI lead follow-up automation
        </Link>{" "}
        and{" "}
        <Link
          to="/services/business-automation"
          className="text-primary hover:underline underline-offset-4"
        >
          business process automation
        </Link>
        . The call is one channel; the value shows up when the next step in your
        workflow happens without someone retyping the conversation.
      </p>
      <p>
        Routing rules should mirror how your team already thinks: new vs existing
        customers, emergency vs routine, sales vs support, in-area vs out-of-area.
        Start with a short list. Over-branching on day one is a common reason pilots
        feel brittle. You can always add intents after the first ones prove reliable.
      </p>

      <BlogFigure
        src="/images/blog/support-workflow.webp"
        alt="Support team collaborating at a desk with laptops and headsets"
        width={1100}
        height={825}
        caption="Structured call notes and routing keep the AI layer useful for the humans who close the work."
      />

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        What costs actually depend on
      </h2>
      <p>
        There is no honest single “average price” for AI voice agents that applies to
        every small business. Costs vary with scope, telephony setup, integrations,
        testing depth, and how much ongoing tuning you want after launch. Treat
        published “market averages” with skepticism unless they disclose methodology
        and match your call volume and complexity.
      </p>
      <p>When you budget, separate a few drivers:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <span className="text-foreground font-medium">Build scope</span> — one
          inbound use case versus multi-intent routing across departments.
        </li>
        <li>
          <span className="text-foreground font-medium">Integrations</span> — calendar,
          CRM, SMS, payment links (or explicitly excluding payments).
        </li>
        <li>
          <span className="text-foreground font-medium">Usage economics</span> — minutes,
          concurrent calls, and third-party speech or telephony fees your stack uses.
        </li>
        <li>
          <span className="text-foreground font-medium">Operations</span> — monitoring,
          script updates, and who owns changes when your services or hours change.
        </li>
      </ul>
      <p>
        A practical approach is to price a focused pilot against a clear success
        definition (for example: after-hours bookings captured, or fewer voicemails
        left unanswered), then expand. Custom implementation from a team like{" "}
        <Link
          to="/services/ai-voice-agents"
          className="text-primary hover:underline underline-offset-4"
        >
          TechVerge’s AI voice agents service
        </Link>{" "}
        is typically scoped to your call types and systems rather than sold as generic
        seats.
      </p>
      <p>
        When you compare proposals, ask what is included versus what bills separately:
        telephony, speech providers, SMS confirmations, monitoring, and post-launch
        script changes. Two quotes can look similar on a headline number and diverge
        once usage and maintenance are spelled out. Prefer clarity over a single
        round number that hides assumptions.
      </p>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        Limitations you should plan for
      </h2>
      <p>
        Voice agents struggle when callers are upset, when accents or background noise
        are heavy, when policies are vague, or when the request sits outside the
        trained intents. They can also sound confident while being wrong if you do not
        constrain what they are allowed to promise.
      </p>
      <p>
        Other limits are operational: poor CRM data quality, calendars that do not
        reflect real capacity, and teams that never listen to call samples after
        launch. Technology does not fix unclear ownership. If nobody reviews
        transcripts or failure reasons weekly, quality drifts.
      </p>
      <p>
        Latency and talk style matter too. Callers notice long pauses, robotic pacing,
        or an agent that interrupts. Those issues are solvable with tuning, but they
        require listening to real calls — not only demo scripts. Budget time for a
        pilot period where you intentionally collect edge cases and tighten responses.
      </p>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        Consent, recording, and privacy — without legal theater
      </h2>
      <p>
        Phone recording and disclosure rules vary by US state and by how you use the
        recordings. This article is not legal advice. As a practical baseline: decide
        what you record, why you retain it, who can access it, and how callers are
        told — then confirm requirements with counsel familiar with your states of
        operation.
      </p>
      <p>
        Also scope what the agent may collect. Payment card details, social security
        numbers, and sensitive health details often should be excluded or handed to a
        human under a controlled process. For general consumer privacy hygiene, the
        FTC’s consumer guidance on protecting personal information is a useful public
        reference:{" "}
        <a
          href="https://consumer.ftc.gov/articles/how-protect-your-personal-information"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline underline-offset-4"
        >
          How to Protect Your Personal Information (FTC)
        </a>
        . Your implementation should still follow your own privacy policy and any
        industry rules that apply to you.
      </p>
      <p>
        Retention is easy to overlook. Decide how long call audio and transcripts stay
        available, who can export them, and how vendor access is revoked when a project
        ends. Document that alongside your scripts so privacy is not an afterthought
        bolted on at launch week.
      </p>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        Human handoff is a feature, not a failure
      </h2>
      <p>
        The best voice agents are designed to lose gracefully. When confidence is low,
        when the caller asks for a person, or when the topic is on a blocklist, the
        agent should transfer, book a callback, or take a structured message — with a
        summary your team can use immediately.
      </p>
      <p>
        Train staff on what the agent covers so they do not contradict it on live
        calls. Align tone: if the agent is warm and concise, humans should not sound
        like a different company. Handoff is part of the product experience.
      </p>
      <p>
        Warm transfers work best when the agent announces why it is connecting and
        passes context. Cold transfers that force the caller to repeat everything
        undo the point of automation. If live transfer is not always available —
        common for tiny teams — a callback with a promised window is often better than
        a dead-end loop.
      </p>

      <BlogFigure
        src="/images/blog/human-handoff.webp"
        alt="Business team collaborating around a table during a handoff discussion"
        width={1200}
        height={800}
        caption="Clear escalation rules keep callers from getting stuck when the agent reaches its limits."
      />

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        How to evaluate readiness
      </h2>
      <p>Before you buy tooling or start a build, ask:</p>
      <ol className="list-decimal pl-6 space-y-2">
        <li>Which call types are high volume and low ambiguity?</li>
        <li>What must never be said, promised, or collected on an automated call?</li>
        <li>Where should successful outcomes land — calendar, CRM, SMS, or inbox?</li>
        <li>Who owns weekly review of transcripts and failure cases?</li>
        <li>What does a successful 30-day pilot look like in plain numbers you already track (calls answered, bookings created, callbacks scheduled)?</li>
      </ol>
      <p>
        If those answers are fuzzy, start with discovery and process mapping. If they
        are clear, a focused inbound agent is a reasonable next step.
      </p>
      <p>
        Many teams also underestimate change management. Someone needs to update
        holiday hours, new service packages, and pricing language when the business
        changes. Assign that owner before go-live. An agent running last season’s
        script can confuse callers faster than no agent at all.
      </p>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        Frequently asked questions
      </h2>
      <div className="space-y-6">
        {faqs.map((item) => (
          <div key={item.question}>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {item.question}
            </h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground pt-4">
        Next step
      </h2>
      <p>
        If you want help designing a custom inbound voice agent around your calendar
        and CRM — not a generic seat-based product — explore{" "}
        <Link
          to="/services/ai-voice-agents"
          className="text-primary hover:underline underline-offset-4"
        >
          AI voice agents
        </Link>
        , related{" "}
        <Link
          to="/services/ai-automation"
          className="text-primary hover:underline underline-offset-4"
        >
          lead follow-up automation
        </Link>
        , and{" "}
        <Link
          to="/services/business-automation"
          className="text-primary hover:underline underline-offset-4"
        >
          business automation
        </Link>
        , or{" "}
        <Link
          to="/contact"
          className="text-primary hover:underline underline-offset-4"
        >
          contact TechVerge Solutions
        </Link>{" "}
        to talk through your call types.
      </p>

      <div className="mt-10 p-6 md:p-8 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
        <p className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
          Ready to scope a voice agent for your business?
        </p>
        <p className="mb-6 text-base">
          Tell us which calls you miss today. We will help you decide what to automate,
          what to escalate, and what to leave with your team.
        </p>
        <div className="flex flex-wrap gap-4">
          <BookingCta className="px-6 py-3 rounded-lg text-primary-foreground font-medium" />
          <Link
            to="/services/ai-voice-agents"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-lg border border-border/60 text-foreground hover:border-primary/50 transition-colors"
          >
            View AI voice agents
          </Link>
        </div>
      </div>
    </div>
  );
}
