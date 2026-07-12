import type { ShowcasePageConfig } from "@/lib/service-showcase/page";

// Personal Training is a live, bookable service, so CTAs route to the booking
// flow (not the waitlist).
const BOOK: { label: string; href: string } = {
  label: "Book training",
  href: "/book?service=personal-training",
};

/**
 * "Personal Training" showcase page content for the Elevate brand — editorial
 * copy from the approved mock (personal-training.html). Like Beauty, booking
 * options resolve live from the service config API (focus = the "goal-focus"
 * group; price chips = the "duration" group). The static `specialties.items` /
 * `pricing.chips` below are the editorial fallback rendered when the live config
 * is unavailable (e.g. local dev without the backend, or `next build`). Prices
 * are illustrative INTERNAL DRAFT values. The hero photo is selected by
 * `.ssp--personal-training` in src/styles/service-showcase.css.
 */
export const elevatePersonalTraining: ShowcasePageConfig = {
  slug: "personal-training",
  displayName: "In-Home Personal Training",

  // Live wiring: goal-focus → "Choose your focus"; duration → price chips.
  booking: {
    focusGroupKey: "goal-focus",
    durationGroupKey: "duration",
  },

  hero: {
    eyebrow: "Personal Training · Delivered across Wake County",
    title: "Training.",
    titleAccent: "At your door.",
    sub: "Certified trainers bring the equipment and the program to your home — one transparent price, solo or with a partner.",
    primaryCta: BOOK,
    secondaryCta: { label: "All services", href: "/services" },
  },

  about: {
    kicker: "About this service",
    heading: "What to expect",
    paragraphs: [
      "Your trainer arrives with everything the session needs — weights, bands, mats — and turns whatever space you have into a working gym. No commute, no crowded floor, no waiting for machines.",
      "Every program is built around your goals, your level, and your space. Train solo or bring a partner — sessions adjust to both of you, and progress carries over from one visit to the next.",
    ],
    points: [
      "Certified & vetted trainers",
      "All equipment included",
      "Solo or partner sessions",
    ],
    image: {
      src: "/assets/personal-training/about.jpg",
      alt: "Certified trainer coaching a client through an at-home strength session",
    },
  },

  // Editorial fallback focus cards (live "goal-focus" group wins when present).
  specialties: {
    eyebrow: "Specialties",
    heading: "Choose your focus",
    sub: "Tell us your goal at booking — or describe where you're starting from and let your coordinator match you.",
    items: [
      { title: "Strength & conditioning", body: "Progressive, structured lifting" },
      { title: "HIIT & fat loss", body: "High-intensity work, scaled to you" },
      { title: "Mobility & recovery", body: "Move better, ache less" },
      { title: "Foundations", body: "Proper form from session one" },
    ],
  },

  // Editorial fallback price chips (illustrative INTERNAL DRAFT — the live
  // "duration" group wins when present).
  pricing: {
    eyebrow: "Pricing",
    heading: "Simple, all-in prices",
    note: "Partner sessions and 4, 8, and 12-session packs at a saving — travel, equipment, and program planning included.",
    cta: BOOK,
    chips: [
      { duration: "Solo · 60 min", price: "from $79" },
      { duration: "Session packs", price: "4 · 8 · 12" },
    ],
  },

  expect: {
    eyebrow: "The experience",
    heading: "How your session flows",
    items: [
      {
        num: "01",
        title: "Before",
        body: "Your trainer checks in on your goals and your space the day before, then arrives early with everything the session needs.",
      },
      {
        num: "02",
        title: "During",
        body: "A fully coached session — warm-up, work, cool-down — with all equipment provided and every set adjusted to how you're moving.",
      },
      {
        num: "03",
        title: "After",
        body: "Your trainer packs down, leaves program notes and next steps, and your space exactly as found. Rebook in two taps.",
      },
    ],
  },

  faq: {
    eyebrow: "Questions",
    heading: "Training FAQ",
    items: [
      {
        id: "pt-equipment",
        question: "Do I need my own equipment?",
        answer:
          "No. Your trainer brings weights, bands, mats, and anything else the program calls for. If you have equipment you'd like to use, mention it at booking and they'll build it in.",
      },
      {
        id: "pt-partner",
        question: "Can two people train together?",
        answer:
          "Yes — partner sessions are a standard option with partner pricing. Just mention the second person when booking so your trainer plans and packs for both of you.",
      },
      {
        id: "pt-space",
        question: "What space do I need?",
        answer:
          "A living-room-sized area works for most programs. Trainers adapt the session to what you have — indoors, garage, garden, or driveway all work.",
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
