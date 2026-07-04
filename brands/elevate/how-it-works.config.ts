import type { HowItWorksPageConfig } from "@/lib/how-it-works/page";

/** "How Elevate Works" page content for the Elevate brand. */
export const elevateHowItWorks: HowItWorksPageConfig = {
  hero: {
    eyebrow: "From booking to bliss",
    title: "Four steps.",
    titleAccent: "Zero hassle.",
    sub: "No apps to download, no accounts to manage, no phone tag. Book in minutes and let a real coordinator handle the rest.",
  },

  steps: {
    eyebrow: "The process",
    heading: "How Elevate works",
    sub: "Every session follows the same simple path — designed so the only thing you think about is your wellness.",
    steps: [
      {
        kicker: "Step One",
        title: "Pick your service",
        body: "Choose from 8 disciplines — massage, yoga, training, nutrition, beauty, coaching, stretching, or meditation. Select your duration and see the exact price before you commit.",
        points: [
          "Transparent pricing on every option — tips included",
          "Add-ons and preferences declared upfront",
          "No account required to browse",
        ],
        image: {
          src: "/assets/how-it-works/step-1.jpg",
          alt: "Browsing wellness services on Elevate",
        },
      },
      {
        kicker: "Step Two",
        title: "Set your details",
        body: "Tell us when and where. Morning energizer or evening wind-down, living room or backyard — your session happens on your schedule, anywhere in Wake County.",
        points: [
          "Same-day slots often available",
          "Travel to your home is always included",
          "Special requests welcome — just leave a note",
        ],
        image: {
          src: "/assets/how-it-works/step-2.jpg",
          alt: "A calm in-home wellness setting",
        },
      },
      {
        kicker: "Step Three",
        title: "A real coordinator confirms",
        body: "A human — not an algorithm — reviews your request, matches you with the right vetted professional, and confirms within one business hour. You'll know exactly who's coming and when.",
        points: [
          "Confirmation within 1 business hour",
          "Your pro's name, photo, and credentials upfront",
          "Free rescheduling up to 4 hours before",
        ],
        image: {
          src: "/assets/how-it-works/step-3.jpg",
          alt: "A coordinator reviewing a booking request",
        },
      },
      {
        kicker: "Step Four",
        title: "Enjoy your session",
        body: "Your professional arrives on time with everything needed — table, mats, equipment, the lot. You don't prepare anything. You just show up as yourself, in your own space.",
        points: [
          "All equipment brought to you",
          "No awkward tipping — it's already included",
          "Rate your session after — we read every review",
        ],
        image: {
          src: "/assets/how-it-works/step-4.jpg",
          alt: "Enjoying a wellness session at home",
        },
      },
    ],
  },

  coordinator: {
    eyebrow: "The Elevate difference",
    title: "A real human,",
    titleAccent: "not an algorithm.",
    body: "Every booking is reviewed by a coordinator who knows our professionals personally. They match you based on your needs, preferences, and goals — not just availability.",
    stats: [
      { value: "<1hr", label: "Confirmation" },
      { value: "100%", label: "Vetted Pros" },
      { value: "4.9★", label: "Avg Rating" },
    ],
  },

  coverage: {
    eyebrow: "Where we serve",
    heading: "All of Wake County",
    sub: "Wherever you are in the county, travel is included in your price — no distance fees, ever.",
    areas: [
      "Raleigh",
      "Cary",
      "Apex",
      "Wake Forest",
      "Morrisville",
      "Garner",
      "Holly Springs",
      "Fuquay-Varina",
      "Knightdale",
      "Wendell",
      "Zebulon",
      "Rolesville",
    ],
    note: "Just outside the county line? Reach out — we can often make it work.",
  },

  faq: {
    eyebrow: "Good to know",
    heading: "Common questions",
    items: [
      {
        id: "prepare",
        question: "Do I need to prepare anything at home?",
        answer:
          "Nothing at all. Your professional brings everything — massage table, yoga mats, weights, skincare products. All you need is a bit of floor space and yourself.",
      },
      {
        id: "professionals",
        question: "Who are the professionals?",
        answer:
          "Independent, certified practitioners from the Raleigh area. Every pro passes a background check, credential verification, insurance review, and an in-person interview before joining Elevate.",
      },
      {
        id: "same-pro",
        question: "Can I request the same pro every time?",
        answer:
          "Absolutely — most of our clients do. Once you find someone you love, tell your coordinator and we'll prioritize matching you with them for every future session.",
      },
      {
        id: "cancel",
        question: "What if I need to cancel?",
        answer:
          "Cancel or reschedule free up to 4 hours before your session — no questions asked. Inside 4 hours, a 50% fee applies to respect your professional's committed time.",
      },
      {
        id: "safety",
        question: "Is it safe to have someone in my home?",
        answer:
          "Safety is the foundation of Elevate. Every professional is background-checked, insured, bonded, and identity-verified. You see their full profile before they arrive, and every session is logged with our coordination team.",
      },
    ],
  },

  cta: {
    eyebrow: "Ready?",
    title: "Your first session",
    titleLine2: "is",
    titleAccent: "minutes away.",
    body: "Pick a service, set your time, and let your coordinator handle the rest.",
    primaryCta: { label: "Book a session", href: "/book" },
    secondaryCta: { label: "Browse services", href: "/services" },
  },
};
