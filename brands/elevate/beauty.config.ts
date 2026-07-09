import type { ShowcasePageConfig } from "@/lib/service-showcase/page";

const BOOK: { label: string; href: string } = {
  label: "Book beauty",
  href: "/book?service=beauty",
};

/**
 * "Beauty" showcase page content for the Elevate brand — editorial copy from
 * the approved mock. Prices are illustrative INTERNAL DRAFT values (sessions
 * start at the catalog's $75 minimum). Booking options (focus cards, price
 * tiers) are resolved live from the service config API; full-bleed band
 * photos live in src/styles/service-showcase.css under `.ssp--beauty`.
 */
export const elevateBeauty: ShowcasePageConfig = {
  slug: "beauty",
  displayName: "In-Home Beauty",

  // Declarative wiring only: which API config groups feed which section.
  booking: {
    focusGroupKey: "services",
    durationGroupKey: "duration",
  },

  hero: {
    eyebrow: "Beauty · Delivered across Wake County",
    title: "Beauty.",
    titleAccent: "Your glow.",
    sub: "Licensed stylists and artists deliver hair, makeup, and nail services at home — a $75 minimum, that's it.",
    primaryCta: BOOK,
    secondaryCta: { label: "All services", href: "/services" },
  },

  about: {
    kicker: "About this service",
    heading: "What to expect",
    paragraphs: [
      "Salon-quality results without the salon trip. Your professional arrives with everything — styling tools, professional products, and a portfolio you can preview before booking.",
      "Perfect before events, weddings, and photoshoots — or as a standing self-care ritual. Group bookings for bridal parties and celebrations are a specialty.",
    ],
    points: [
      "Professional tools & products included",
      "Licensed North Carolina professionals",
      "Great for events and group bookings",
    ],
    image: {
      src: "/assets/beauty/about.jpg",
      alt: "Stylist finishing a client's hair during an in-home beauty session",
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
    heading: "Beauty FAQ",
    items: [
      {
        id: "beauty-minimum",
        question: "What's the $75 minimum?",
        answer:
          "Every beauty booking starts at $75 — most single services fall right around it. Add services or guests and your pro will quote the total upfront before you confirm.",
      },
      {
        id: "beauty-groups",
        question: "Can I book for a group or event?",
        answer:
          "Yes — bridal parties and get-togethers are popular. Multiple professionals can attend larger groups; contact us for group scheduling.",
      },
      {
        id: "beauty-portfolio",
        question: "Can I see the professional's work first?",
        answer:
          "Every beauty pro has a portfolio on their profile. Your coordinator matches you by style, and you can request a specific pro anytime.",
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
