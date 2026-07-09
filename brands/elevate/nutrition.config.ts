import type { ShowcasePageConfig } from "@/lib/service-showcase/page";

const BOOK: { label: string; href: string } = {
  label: "Book nutrition",
  href: "/book?service=nutrition-coaching",
};

/**
 * "Nutrition Coaching" showcase page content for the Elevate brand —
 * editorial copy from the approved mock. Prices are illustrative INTERNAL
 * DRAFT values (they align with the catalog's $129 base). Booking options
 * (focus cards, price tiers) are resolved live from the service config API;
 * full-bleed band photos live in src/styles/service-showcase.css under
 * `.ssp--nutrition-coaching`.
 */
export const elevateNutrition: ShowcasePageConfig = {
  slug: "nutrition-coaching",
  displayName: "In-Home Nutrition Coaching",

  // Declarative wiring only: which API config groups feed which section.
  booking: {
    focusGroupKey: "goal",
    durationGroupKey: "duration",
  },

  hero: {
    eyebrow: "Nutrition · Delivered across Wake County",
    title: "Nutrition.",
    titleAccent: "Your plate.",
    sub: "Certified nutrition coaches build sustainable eating habits through structured 4-week and 12-week programs.",
    primaryCta: BOOK,
    secondaryCta: { label: "All services", href: "/services" },
  },

  about: {
    kicker: "About this service",
    heading: "What to expect",
    paragraphs: [
      "Forget generic meal plans. Your coach starts with how you actually live — your schedule, your kitchen, your preferences — and builds an approach you can sustain.",
      "Choose a single consultation, or commit to a 4-week or 12-week program with weekly sessions, pantry reviews, grocery guidance, and support between visits.",
    ],
    points: [
      "In-home consultations at your kitchen table",
      "4-week & 12-week structured programs",
      "Ongoing support between sessions",
    ],
    image: {
      src: "/assets/nutrition-coaching/about.jpg",
      alt: "Nutrition coach reviewing a meal plan with a client at a kitchen table",
    },
  },

  // Editorial only — the focus cards are resolved live from the service
  // config API (database is the single source of truth).
  specialties: {
    eyebrow: "Specialties",
    heading: "Choose your focus",
    sub: "Tell us your preference at booking — or describe your goal and let your coordinator match you.",
  },

  // Editorial only — the price tiers are resolved live from the service's
  // "duration" options (base priceAmount + each option's priceModifier).
  pricing: {
    eyebrow: "Pricing",
    heading: "Simple, all-in prices",
    note: "Travel, equipment, and gratuity included. The price you see is the price you pay.",
    cta: BOOK,
  },

  expect: {
    eyebrow: "The experience",
    heading: "How your session flows",
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
    heading: "Nutrition FAQ",
    items: [
      {
        id: "nutrition-diet",
        question: "Is this a diet program?",
        answer:
          "No — it's education and structure. Your coach helps you understand what works for your body and builds habits that last, rather than handing you a restrictive plan you'll abandon.",
      },
      {
        id: "nutrition-programs",
        question: "What's in the 4-week and 12-week programs?",
        answer:
          "Weekly one-on-one sessions, a personalized plan that evolves as you progress, and message support between sessions. The 12-week adds quarterly goal reviews and maintenance planning.",
      },
      {
        id: "nutrition-restrictions",
        question: "Can you work with dietary restrictions?",
        answer:
          "Yes — vegetarian, vegan, gluten-free, allergies, and medical dietary needs are all within scope. Mention them at booking so we match you with the right specialist.",
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
