import type { YogaPageConfig } from "@/lib/yoga/page";

const BOOK: { label: string; href: string } = {
  label: "Book yoga",
  href: "/book?service=yoga",
};

/**
 * "Yoga" service page content for the Elevate brand. A fixed editorial page
 * (no live booking data): specialties and price chips are authored here. Prices
 * are illustrative INTERNAL DRAFT values that align with the catalog's yoga
 * pricing (base $89 / +$30 for 90 min = $119). The single hero + about photos
 * live in /assets/yoga/; the solid dark bands live in src/styles/yoga.css.
 */
export const elevateYoga: YogaPageConfig = {
  hero: {
    eyebrow: "Yoga · Delivered across Wake County",
    title: "Yoga.",
    titleAccent: "Your space.",
    sub: "Private yoga in your home, garden, or rooftop — every style, every level, mats included.",
    primaryCta: BOOK,
    secondaryCta: { label: "All services", href: "/services" },
  },

  about: {
    kicker: "About this service",
    heading: { lead: "What to", accent: "expect" },
    paragraphs: [
      "A private session means the whole practice is built around you — your level, your body, your goals. No keeping up with a class, no self-consciousness, just focused guidance.",
      "Practice solo or invite up to three others for a semi-private session at no extra cost. Your instructor brings mats, blocks, and straps for everyone.",
    ],
    points: [
      "Mats, blocks, and straps provided",
      "Semi-private for up to 4 people",
      "All levels — true beginners welcome",
    ],
    image: {
      src: "/assets/yoga/about.jpg",
      alt: "An instructor guiding a private in-home yoga session",
    },
  },

  specialties: {
    eyebrow: "Specialties",
    heading: { lead: "Choose your", accent: "focus" },
    sub: "Tell us your preference at booking — or describe your goal and let your coordinator match you.",
    items: [
      { title: "Hatha", body: "Foundational postures, steady pace" },
      { title: "Vinyasa", body: "Flowing, breath-led movement" },
      { title: "Restorative", body: "Deep rest and release" },
      { title: "Yin", body: "Long holds, deep tissue" },
    ],
  },

  pricing: {
    eyebrow: "Pricing",
    heading: { lead: "Simple,", accent: "all-in", trail: "prices" },
    note: "Travel, equipment, and gratuity included. The price you see is the price you pay.",
    cta: BOOK,
    chips: [
      { duration: "60 min", price: "$89" },
      { duration: "90 min", price: "$119" },
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
    heading: { lead: "Yoga", accent: "FAQ" },
    items: [
      {
        id: "yoga-beginner",
        question: "I've never done yoga. Is that okay?",
        answer:
          "It's ideal, actually — a private first session builds proper foundations without the intimidation of a class. Tell us you're new and we'll match you with an instructor who loves teaching beginners.",
      },
      {
        id: "yoga-group",
        question: "Can my partner or friends join?",
        answer:
          "Yes — up to 4 people per session at the same price. Just mention the group size when booking so your instructor brings enough equipment.",
      },
      {
        id: "yoga-equipment",
        question: "Do I need any equipment?",
        answer:
          "None. Your instructor brings mats and props for everyone. Comfortable clothes are all you need.",
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
