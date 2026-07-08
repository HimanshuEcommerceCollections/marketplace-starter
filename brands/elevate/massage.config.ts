import type { MassagePageConfig } from "@/lib/massage/page";

const BOOK: { label: string; href: string } = {
  label: "Book massage",
  href: "/book?service=massage",
};

/**
 * "Massage" service page content for the Elevate brand. Prices are illustrative
 * INTERNAL DRAFT values (they align with the catalog's massage `from_price`,
 * $109). Full-bleed band background photos live in src/styles/massage.css.
 */
export const elevateMassage: MassagePageConfig = {
  hero: {
    eyebrow: "Massage · Delivered across Wake County",
    title: "Massage.",
    titleAccent: "At your door.",
    sub: "Certified massage therapists bring the full spa experience — table, linens, oils — to your living room.",
    primaryCta: BOOK,
    secondaryCta: { label: "All services", href: "/services" },
  },

  about: {
    kicker: "About this service",
    heading: "What to expect",
    paragraphs: [
      "Whether you need deep-tissue relief after training, a prenatal session, or an hour of pure Swedish relaxation, your therapist arrives with everything: professional table, fresh linens, oils, and music if you want it.",
      "Every therapist on Elevate is licensed in North Carolina, background-checked, insured, and personally interviewed. You'll see their profile and credentials before they arrive.",
    ],
    points: [
      "Table, linens, and oils all provided",
      "Licensed & insured NC therapists",
      "Pressure and focus tailored to you",
    ],
    image: {
      src: "/assets/massage/about.jpg",
      alt: "Massage therapist working with a client in a home setting",
    },
  },

  // Editorial only — the session-type and add-on cards are resolved live from
  // the service config API (database is the single source of truth).
  specialties: {
    eyebrow: "Specialties",
    heading: "Choose your focus",
    sub: "Tell us your preference at booking — or describe your goal and let your coordinator match you.",
    addOnsHeading: "Popular add-ons",
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
    heading: "Massage FAQ",
    items: [
      {
        id: "massage-table",
        question: "Do I need a massage table?",
        answer:
          "No — your therapist brings a professional table, fresh linens, and all supplies. You just need a bit of floor space.",
      },
      {
        id: "massage-pressure",
        question: "Can I choose the pressure?",
        answer:
          "Absolutely. Note your preference at booking and communicate during the session — your therapist will adjust throughout.",
      },
      {
        id: "massage-prenatal",
        question: "Is prenatal massage safe?",
        answer:
          "Yes, with a certified prenatal therapist — which is exactly who we'll match you with. Sessions use side-lying positioning and appropriate techniques for each trimester.",
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
