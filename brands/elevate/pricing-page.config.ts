import type { PricingPageConfig } from "@/lib/pricing/page";

/** "Simple, Transparent Pricing" page content for the Elevate brand. */
export const elevatePricingPage: PricingPageConfig = {
  hero: {
    variant: "dark",
    title: "Simple, Transparent Pricing",
    subtitle:
      "Every service starts with a draft starting price. Final pricing depends on selections made during booking and coordinator confirmation.",
    primaryCta: { label: "Book Now", href: "/book" },
    secondaryCta: { label: "How It Works", href: "#how-it-works" },
    image: {
      caption: {
        title: "Transparent pricing",
        lines: ["Draft estimates · Coordinator confirmed"],
      },
    },
  },

  servicePricing: {
    heading: "Service Pricing",
    subheading: "All prices are draft starting prices. Final pricing is confirmed during booking.",
    footnote:
      "All prices shown are draft starting prices for demonstration purposes. Actual pricing confirmed by coordinator during booking.",
    extras: {
      beauty: {
        minimumBadge: "$75 Min.",
        minimumNote: "Minimum booking value of $75 required.",
      },
      "physical-therapy": {
        comingSoon: {
          tiers: [
            { label: "Follow-Up", amount: 13500 },
            { label: "Evaluation", amount: 16500 },
          ],
          note: "No live calculation · Join interest list for updates",
          description:
            "Physical Therapy pricing is reviewed by our care coordinator. FROM-band shown for planning only. No live pricing calculator available.",
          interest: {
            label: "Join PT Interest List",
            href: "/waitlist?service=physical-therapy",
          },
        },
      },
      "speech-therapy": {
        comingSoon: {
          tiers: [
            { label: "Follow-Up", amount: 9500 },
            { label: "Evaluation", amount: 17500 },
          ],
          note: "No live calculation · Join interest list for updates",
          description:
            "Speech Therapy pricing is reviewed by our care coordinator. FROM-band shown for planning only. No live pricing calculator available.",
          interest: {
            label: "Join Speech Interest List",
            href: "/waitlist?service=speech-therapy",
          },
        },
      },
    },
  },

  whatAffects: {
    heading: "What Affects Pricing",
    subheading: "Prices vary based on a few key factors that you configure during booking.",
    items: [
      {
        icon: "Clock",
        title: "Duration",
        description:
          "Longer sessions cost more. Session length is selected during booking configuration.",
      },
      {
        icon: "Users",
        title: "Session Format",
        description:
          "Individual vs. group sessions vary in price. Format is selected at booking.",
      },
      {
        icon: "Package",
        title: "Package Selection",
        description:
          "Some services offer package options. Package pricing appears during booking configuration.",
      },
      {
        icon: "Sparkles",
        title: "Service Items",
        description:
          "For Beauty services, specific items selected affect your total before the $75 minimum.",
      },
    ],
  },

  fromPrices: {
    heading: "Why Some Services Show FROM Prices",
    subheading:
      "Physical Therapy and Speech Therapy use a coordinator-reviewed pricing model.",
    slugs: ["physical-therapy", "speech-therapy"],
  },

  howYouSee: {
    heading: "How You'll See Pricing",
    subheading: "Pricing appears during the booking flow — before you submit anything.",
    note: "Your draft price breakdown appears at Step 3 — before you submit any contact information.",
    steps: [
      { title: "Pick Service", description: "Browse and select your service from the catalog." },
      { title: "Configure", description: "Choose duration, format, and any add-ons." },
      { title: "See Price", description: "Your draft price breakdown appears before submission." },
      { title: "Details + Schedule", description: "Enter contact info and preferred time windows." },
      { title: "Confirm + Submit", description: "Review your full summary and submit the request." },
      { title: "Success", description: "A coordinator confirms your booking within one business hour." },
    ],
  },

  faq: {
    heading: "Frequent Questions",
    viewAll: { label: "View All FAQs", href: "/faq" },
    items: [
      {
        id: "final",
        question: "Are these final prices?",
        answer:
          "No. All prices shown are draft starting prices for demonstration purposes. Final pricing is confirmed by a coordinator after you submit your booking request.",
      },
      {
        id: "vary",
        question: "Why does pricing vary?",
        answer:
          "Pricing varies based on session duration, format (individual vs. group), and any add-ons or service items you select during booking configuration.",
      },
      {
        id: "pt-speech",
        question: "Why do PT and Speech work differently?",
        answer:
          "Physical Therapy and Speech Therapy involve care coordination that requires individual review. A coordinator will confirm exact pricing based on your specific situation.",
      },
      {
        id: "beauty-min",
        question: "What is the Beauty minimum?",
        answer:
          "Beauty services require a minimum booking value of $75. If your selected items total less than $75, you will need to add more services before submitting.",
      },
    ],
  },

  testimonials: {
    heading: "What Clients Say",
    subheading: "Real experiences from Elevate clients.",
    items: [
      {
        id: "price-1",
        quote:
          "I appreciated seeing the price breakdown before I submitted anything. No surprises.",
        author: "K.M.",
        role: "Raleigh",
        isSample: true,
      },
      {
        id: "price-2",
        quote:
          "The transparency about PT pricing gave me confidence that the coordinator would be fair.",
        author: "D.L.",
        role: "Cary",
        isSample: true,
      },
      {
        id: "price-3",
        quote:
          "Beauty minimum makes sense once you understand it. The coordinator explained everything clearly.",
        author: "A.T.",
        role: "Wake Forest",
        isSample: true,
      },
    ],
  },

  cta: {
    title: "See your options before you book.",
    body: "No commitment required. Pricing appears before you submit.",
    primaryCta: { label: "Book Now", href: "/book" },
    secondaryCta: { label: "How It Works", href: "#how-it-works" },
  },
};
