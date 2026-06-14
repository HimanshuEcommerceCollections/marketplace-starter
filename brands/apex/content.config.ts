import type { BrandContent } from "@/lib/brand/types";

export const apexContent: BrandContent = {
  hero: {
    eyebrow: "Home services, sorted",
    title: "Book trusted pros for any job",
    subtitle:
      "Schedule [Sample] cleaning, plumbing, and handyman services in minutes.",
    primaryCta: { label: "Book now", href: "/book" },
    secondaryCta: { label: "Browse services", href: "/services" },
  },
  features: {
    heading: "Why Apex",
    subheading: "Reliable help, upfront pricing.",
    items: [
      {
        icon: "ShieldCheck",
        title: "Vetted pros",
        description: "Background-checked [Sample] professionals.",
      },
      {
        icon: "Clock",
        title: "On your schedule",
        description: "Pick a time window that works for you.",
      },
      {
        icon: "BadgeDollarSign",
        title: "Upfront pricing",
        description: "See an estimate before you book.",
      },
    ],
  },
  faq: {
    heading: "Questions",
    items: [
      {
        id: "f1",
        question: "Is this a real service? (Sample)",
        answer:
          "No — this is an INTERNAL DRAFT demo with [Sample] placeholder content.",
      },
      {
        id: "f2",
        question: "How does booking work?",
        answer:
          "Configure a service, pick a time window, and submit. Submission is a stub.",
      },
      {
        id: "f3",
        question: "Do you guarantee the work?",
        answer: "This demo does not process real bookings.",
      },
    ],
  },
  cta: {
    title: "Need something fixed?",
    body: "Get a [Sample] estimate and book in minutes.",
    cta: { label: "Book a pro", href: "/book" },
  },
  testimonials: {
    heading: "Trusted by homeowners",
    items: [
      {
        id: "t1",
        quote: "Placeholder testimonial for layout only.",
        author: "A. Sample",
        role: "Homeowner",
        isSample: true,
      },
      {
        id: "t2",
        quote: "Another [Sample] quote — not a real customer.",
        author: "B. Placeholder",
        role: "Homeowner",
        isSample: true,
      },
      {
        id: "t3",
        quote: "Illustrative text, not an endorsement.",
        author: "C. Demo",
        role: "Homeowner",
        isSample: true,
      },
    ],
  },
};
