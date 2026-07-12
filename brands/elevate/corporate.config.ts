import type {
  CorporatePageConfig,
  CorporateInquiryConfig,
} from "@/lib/corporate/page";

/**
 * "Corporate Wellness" marketing landing (the Corporate navbar destination) —
 * editorial copy from the approved mock (corporate.html). Its CTA funnels to
 * the inquiry page (/corporate/inquiry).
 */
export const elevateCorporate: CorporatePageConfig = {
  hero: {
    eyebrow: "Corporate Wellness · Teams of 5 to 500",
    title: "Wellness.",
    titleAccent: "At work.",
    sub: "Bring Elevate's vetted professionals to your office — massage, yoga, training, and more, coordinated end to end on a single invoice.",
    image: {
      src: "/assets/corporate/landing-hero.jpg",
      alt: "Colleagues collaborating around a table in a bright modern office",
    },
  },

  programs: {
    eyebrow: "Programs",
    heading: "Three ways to",
    headingAccent: "bring us in.",
    intro:
      "Every program draws on the same eight disciplines and the same vetted professionals as our in-home service — your coordinator handles staffing, scheduling, and setup.",
    items: [
      {
        icon: "Armchair",
        title: "On-site sessions",
        body: "Regular chair massage, desk-stretch, or mindfulness blocks that run during the workday.",
        points: [
          "Weekly, biweekly, or monthly cadence",
          "Runs in any spare room or quiet corner",
          "Employees book their own slots",
        ],
      },
      {
        icon: "Confetti",
        title: "Wellness days",
        body: "Half- or full-day events that mix disciplines — massage, yoga, nutrition talks — for launches, milestones, or appreciation days.",
        points: [
          "Multiple pros on site at once",
          "One coordinator runs the day",
          "Teams of 5 to 500",
        ],
      },
      {
        icon: "ChartLineUp",
        title: "Ongoing programs",
        body: "A standing wellness benefit: recurring visits, rotating disciplines, and simple reporting on what your team actually uses.",
        points: [
          "Single monthly invoice",
          "Usage summaries each quarter",
          "Adjust the mix any month",
        ],
      },
    ],
  },

  process: {
    eyebrow: "The process",
    heading: "Up and running in",
    headingAccent: "a week.",
    steps: [
      {
        num: "01",
        title: "Tell us about your team",
        body: "Headcount, space, goals, budget — one short call or email covers it.",
      },
      {
        num: "02",
        title: "Get a tailored plan",
        body: "A coordinator proposes the discipline mix, cadence, and a transparent all-in price.",
      },
      {
        num: "03",
        title: "We staff & coordinate",
        body: "Vetted pros arrive with everything they need. Your only job is telling the team.",
      },
      {
        num: "04",
        title: "See the impact",
        body: "Booking rates and feedback after every visit — keep what works, swap what doesn't.",
      },
    ],
  },

  cta: {
    eyebrow: "Talk to a coordinator",
    title: "One vendor.",
    titleAccent: "Zero hassle.",
    sub: "Tell us about your team and we'll send a tailored proposal within two business days.",
    primaryCta: { label: "Request a proposal", href: "/corporate/inquiry" },
    secondaryCta: { label: "Or use the contact page", href: "/contact" },
    chips: ["Teams of 5 to 500", "Single invoice", "Coordinator-run, end to end"],
  },
};

/**
 * "Corporate Wellness" inquiry page (/corporate/inquiry) — editorial copy from
 * the approved mock (corporate-inquiry.html). The proposal-request form is
 * stub-only (validate → fake request_id; golden rule #3). Stats are
 * illustrative INTERNAL DRAFT values.
 */
export const elevateCorporateInquiry: CorporateInquiryConfig = {
  hero: {
    eyebrow: "Corporate Wellness",
    title: "Let's build.",
    titleAccent: "Your program.",
    sub: "Tell us about your team — a coordinator designs a proposal around your people, space, and budget within one business day.",
    image: {
      src: "/assets/corporate/hero-bg.jpg",
      alt: "A team gathered for an all-hands session in a bright open office",
    },
  },

  form: {
    heading: "Request a proposal",
    intro:
      "Tell us about your team and a coordinator follows up with a tailored proposal within one business day.",
    teamSizes: ["5 – 25", "25 – 100", "100 – 500", "500+"],
    services: [
      "Massage",
      "Personal Training",
      "Yoga",
      "Beauty",
      "Nutrition",
      "Life Coaching",
      "Physical Therapy",
      "Speech Therapy",
    ],
    formats: [
      "Recurring on-site program",
      "Wellness event / team day",
      "Employee session credits",
      "Not sure yet — advise us",
    ],
    submitLabel: "Request proposal",
    note: "A coordinator would reply within one business day.",
  },

  nextSteps: {
    heading: "What happens next",
    steps: [
      {
        num: "01",
        title: "We listen",
        body: "A coordinator calls to understand your team, space, and goals — 15 minutes.",
      },
      {
        num: "02",
        title: "You get a proposal",
        body: "Program design, vetted professionals, and transparent all-in pricing within one business day.",
      },
      {
        num: "03",
        title: "We run it",
        body: "Scheduling, delivery, and feedback handled — you just tell your team where to be.",
      },
    ],
  },

  contact: {
    heading: "Prefer to talk?",
    blurb: "Our corporate team, Mon–Sat 8am–9pm ET.",
    email: "corporate@elevatewellness.com",
    phone: "+19195550142",
    phoneDisplay: "(919) 555-0142",
  },

  stats: {
    heading: "Teams that feel good",
    headingAccent: "do great work.",
    sub: "From five-person startups to five-hundred-person campuses — Elevate scales to your floor plan.",
    items: [
      { value: "8", label: "Disciplines" },
      { value: "1 day", label: "Proposal Turnaround" },
      { value: "5–500+", label: "Team Sizes" },
    ],
  },
};
