import type { LifeCoachingPageConfig } from "@/lib/life-coaching/page";

const BOOK: { label: string; href: string } = {
  label: "Book coaching",
  href: "/book?service=life-coaching",
};

/**
 * "Life Coaching" service page content for the Elevate brand. A fixed editorial
 * page: the specialty cards ("Choose your focus") and price chips are resolved
 * live from the service config API, with these static values as the fallback.
 * Prices are illustrative INTERNAL DRAFT values aligned with the catalog
 * (base $119 / +$40 for 90 min = $159). The hero + about photos live in
 * /assets/life-coaching/; the solid dark bands live in src/styles/life-coaching.css.
 */
export const elevateLifeCoaching: LifeCoachingPageConfig = {
  hero: {
    eyebrow: "Life Coaching · Delivered across Wake County",
    title: "Coaching.",
    titleAccent: "Your path.",
    sub: "Certified life coaches help you find direction, build momentum, and follow through — single sessions or a 12-week program.",
    primaryCta: BOOK,
    secondaryCta: { label: "All services", href: "/services" },
  },

  about: {
    kicker: "About this service",
    heading: { lead: "What to", accent: "expect" },
    paragraphs: [
      "Life coaching bridges the gap between knowing what you want and actually moving toward it. Your coach works on direction, decision-making, habits, and the structures that make change stick.",
      "Meet in person at home or virtually — whichever suits the session. Start with a single session, or commit to the 12-week program for structured, accountable progress.",
    ],
    points: [
      "In-person or virtual sessions",
      "Single sessions or 12-week program",
      "Confidential, judgment-free space",
    ],
    image: {
      src: "/assets/life-coaching/about.jpg",
      alt: "A life coach and client in conversation at home",
    },
  },

  specialties: {
    eyebrow: "Specialties",
    heading: { lead: "Choose your", accent: "focus" },
    sub: "Tell us your preference at booking — or describe your goal and let your coordinator match you.",
    items: [
      { title: "Direction", body: "Clarity on what's next" },
      { title: "Habits", body: "Systems that make change automatic" },
      { title: "Career", body: "Transitions and growth" },
      { title: "Accountability", body: "12-week structured program" },
    ],
  },

  pricing: {
    eyebrow: "Pricing",
    heading: { lead: "Simple,", accent: "all-in", trail: "prices" },
    note: "Travel, equipment, and gratuity included. The price you see is the price you pay.",
    cta: BOOK,
    chips: [
      { duration: "60 min", price: "$119" },
      { duration: "90 min", price: "$159" },
    ],
  },

  expect: {
    eyebrow: "The experience",
    heading: { lead: "How your session", accent: "flows" },
    items: [
      {
        num: "01",
        title: "Before",
        body: "Your pro confirms timing the day before and arrives 10 minutes early to set up. You don't prepare anything.",
      },
      {
        num: "02",
        title: "During",
        body: "A brief check-in on your goals and preferences, then the session is entirely yours — adjusted live to your feedback.",
      },
      {
        num: "03",
        title: "After",
        body: "Your pro packs down and leaves your space exactly as found. Rate the session and rebook your favorite in two taps.",
      },
    ],
  },

  faq: {
    eyebrow: "Questions",
    heading: { lead: "Life Coaching", accent: "FAQ" },
    items: [
      {
        id: "lc-therapy",
        question: "Is coaching the same as therapy?",
        answer:
          "No — coaching is future-focused and goal-oriented, not clinical treatment. Coaches work on direction, habits, and performance. For mental health treatment, a licensed therapist is the right professional.",
      },
      {
        id: "lc-program",
        question: "What's the 12-week program?",
        answer:
          "Weekly sessions with a consistent coach, a written goal map, and accountability check-ins between sessions. Most clients see their biggest shifts around weeks 6–8.",
      },
      {
        id: "lc-first",
        question: "What happens in the first session?",
        answer:
          "A structured discovery: where you are, where you want to be, and what's blocked previous attempts. You'll leave with one concrete experiment to run before session two.",
      },
    ],
  },

  cta: {
    eyebrow: "Ready?",
    title: "Book your",
    titleAccent: "session.",
    body: "Vetted professionals. Transparent pricing. Delivered across Wake County.",
    primaryCta: BOOK,
    secondaryCta: { label: "View all pricing", href: "/pricing" },
  },
};
