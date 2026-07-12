import type { ShowcasePageConfig } from "@/lib/service-showcase/page";

// Physical Therapy is still coming-soon, so every CTA collects interest via the
// waitlist rather than routing to the booking flow.
const BOOK: { label: string; href: string } = {
  label: "Request a PT consult",
  href: "/waitlist?service=physical-therapy",
};

/**
 * "Physical Therapy" showcase page content for the Elevate brand — editorial
 * copy from the approved mock (physical-therapy.html). PT is `coming_soon` with
 * no live booking config, so `specialties.items` / `pricing.chips` supply the
 * static fallback the showcase renders when the service config API has no
 * ACTIVE focus/duration groups (mirrors the Yoga page). Prices are illustrative
 * INTERNAL DRAFT values. The hero photo is selected by `.ssp--physical-therapy`
 * in src/styles/service-showcase.css.
 */
export const elevatePhysicalTherapy: ShowcasePageConfig = {
  slug: "physical-therapy",
  displayName: "In-Home Physical Therapy",

  // Declarative wiring only: which API config groups feed which section. PT has
  // none yet, so both sections fall back to the static items/chips below.
  booking: {
    focusGroupKey: "services",
    durationGroupKey: "duration",
  },

  hero: {
    eyebrow: "Physical Therapy · Delivered across Wake County",
    title: "Physio.",
    titleAccent: "Your recovery.",
    sub: "Licensed physical therapists, at home. We connect you with the right PT and coordinate everything around your recovery.",
    primaryCta: BOOK,
    secondaryCta: { label: "All services", href: "/services" },
  },

  about: {
    kicker: "About this service",
    heading: "What to expect",
    paragraphs: [
      "Recovering from injury or surgery is hard enough without commuting to a clinic. Elevate connects you with licensed North Carolina physical therapists who evaluate and treat you at home.",
      "It starts with an evaluation: your PT assesses movement, strength, and goals, then builds a treatment plan. We coordinate scheduling and continuity so you see the same therapist throughout.",
    ],
    points: [
      "Licensed NC physical therapists",
      "Evaluation-first treatment plans",
      "Same therapist through your recovery",
    ],
    image: {
      src: "/assets/physical-therapy/about.jpg",
      alt: "Physical therapist guiding a client through an at-home recovery session",
    },
  },

  // Static fallback focus cards (PT has no live focus group yet).
  specialties: {
    eyebrow: "Specialties",
    heading: "Choose your focus",
    sub: "Tell us your preference at booking — or describe your goal and let your coordinator match you.",
    items: [
      { title: "Post-surgery", body: "Guided, safe rehabilitation" },
      { title: "Injury Recovery", body: "Sprains, strains & overuse" },
      { title: "Mobility", body: "Range, balance & falls prevention" },
      { title: "Chronic Pain", body: "Movement-based management" },
    ],
  },

  // Static fallback price chips (illustrative INTERNAL DRAFT — PT has no live
  // duration group yet).
  pricing: {
    eyebrow: "Pricing",
    heading: "Simple, all-in prices",
    note: "Travel, equipment, and gratuity included. The price you see is the price you pay.",
    cta: BOOK,
    chips: [
      { duration: "60 min", price: "$135" },
      { duration: "90 min", price: "$175" },
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
    heading: "Physical Therapy FAQ",
    items: [
      {
        id: "pt-referral",
        question: "Do I need a physician referral?",
        answer:
          "North Carolina allows direct access to physical therapy evaluation. Your PT will advise if your situation or insurance requires a physician referral for ongoing treatment.",
      },
      {
        id: "pt-insurance",
        question: "Does insurance cover it?",
        answer:
          "Sessions are billed directly to you at the listed price, and we provide detailed superbills you can submit to your insurer for out-of-network reimbursement.",
      },
      {
        id: "pt-first-visit",
        question: "What happens at the first visit?",
        answer:
          "A full evaluation — movement screening, strength and range testing, and history — followed by the start of treatment and a written plan with clear milestones.",
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
