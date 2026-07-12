import type { ShowcasePageConfig } from "@/lib/service-showcase/page";

// Speech Therapy is still coming-soon, so every CTA collects interest via the
// waitlist rather than routing to the booking flow.
const BOOK: { label: string; href: string } = {
  label: "Request an SLP consult",
  href: "/waitlist?service=speech-therapy",
};

/**
 * "Speech Therapy" showcase page content for the Elevate brand — editorial copy
 * from the approved mock (speech-therapy.html). Speech Therapy is `coming_soon`
 * with no live booking config, so `specialties.items` / `pricing.chips` supply
 * the static fallback the showcase renders when the service config API has no
 * ACTIVE focus/duration groups (mirrors Physical Therapy and the Yoga page).
 * Prices are illustrative INTERNAL DRAFT values. Unlike the other showcase
 * pages, this mock uses LIGHT specialties/experience bands (not the dark
 * default) — see the `.ssp--speech-therapy` variant in
 * src/styles/service-showcase.css, which also selects the hero photo.
 */
export const elevateSpeechTherapy: ShowcasePageConfig = {
  slug: "speech-therapy",
  displayName: "In-Home Speech Therapy",

  // Declarative wiring only: which API config groups feed which section. Speech
  // Therapy has none yet, so both sections fall back to the static items/chips.
  booking: {
    focusGroupKey: "services",
    durationGroupKey: "duration",
  },

  hero: {
    eyebrow: "Speech Therapy · Delivered across Wake County",
    title: "Speech.",
    titleAccent: "Your voice.",
    sub: "Licensed speech-language pathologists for adults and kids. We connect you with the right SLP and handle the coordination.",
    primaryCta: BOOK,
    secondaryCta: { label: "All services", href: "/services" },
  },

  about: {
    kicker: "About this service",
    heading: "What to expect",
    paragraphs: [
      "From a child's articulation and language development to adult voice, fluency, and post-stroke recovery — Elevate connects you with licensed speech-language pathologists who work with you at home.",
      "Home sessions mean kids stay comfortable and adults practice where they actually communicate. It starts with an evaluation, then a structured plan with the same SLP throughout.",
    ],
    points: [
      "Licensed NC speech-language pathologists",
      "Adults and children welcome",
      "Consistent SLP through your program",
    ],
    image: {
      src: "/assets/speech-therapy/about.jpg",
      alt: "Speech-language pathologist working with a child during an at-home speech therapy session",
    },
  },

  // Static fallback focus cards (Speech Therapy has no live focus group yet).
  specialties: {
    eyebrow: "Specialties",
    heading: "Choose your focus",
    sub: "Tell us your preference at booking — or describe your goal and let your coordinator match you.",
    items: [
      { title: "Kids", body: "Articulation & language development" },
      { title: "Adults", body: "Voice, fluency & clarity" },
      { title: "Recovery", body: "Post-stroke & neurological" },
      { title: "Accent", body: "Modification & presentation" },
    ],
  },

  // Static fallback price chips (illustrative INTERNAL DRAFT — Speech Therapy
  // has no live duration group yet).
  pricing: {
    eyebrow: "Pricing",
    heading: "Simple, all-in prices",
    note: "Travel, equipment, and gratuity included. The price you see is the price you pay.",
    cta: BOOK,
    chips: [
      { duration: "60 min", price: "$95" },
      { duration: "90 min", price: "$129" },
    ],
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
    heading: "Speech Therapy FAQ",
    items: [
      {
        id: "speech-children",
        question: "Do you work with young children?",
        answer:
          "Yes — pediatric speech therapy is one of our most requested services. Home sessions help kids relax, and parents get coached on practice between visits.",
      },
      {
        id: "speech-insurance",
        question: "Does insurance cover it?",
        answer:
          "Sessions are billed directly at the listed price, with detailed superbills provided for out-of-network reimbursement claims.",
      },
      {
        id: "speech-progress",
        question: "How long until we see progress?",
        answer:
          "It depends on goals, but your SLP sets measurable milestones at evaluation and reviews them with you every few weeks so progress is visible, not vague.",
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
