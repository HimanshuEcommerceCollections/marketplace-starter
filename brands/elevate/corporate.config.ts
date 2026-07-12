import type { CorporatePageConfig } from "@/lib/corporate/page";

/**
 * "Corporate Wellness" inquiry page content for the Elevate brand — editorial
 * copy from the approved mock (corporate-inquiry.html). The proposal-request
 * form is stub-only (validate → fake request_id; golden rule #3). Stats are
 * illustrative INTERNAL DRAFT values.
 */
export const elevateCorporate: CorporatePageConfig = {
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
