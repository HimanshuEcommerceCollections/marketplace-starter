import type { BrandContent } from "@/lib/brand/types";

export const elevateContent: BrandContent = {
  hero: {
    eyebrow: "Wellness, simplified",
    title: "Feel your best, on your schedule",
    subtitle:
      "Book [Sample] training, nutrition, and recovery sessions with vetted pros.",
    primaryCta: { label: "Book now", href: "/book" },
    secondaryCta: { label: "Browse services", href: "/services" },
  },
  features: {
    heading: "Why Elevate",
    subheading: "Everything you need to build a healthier routine.",
    items: [
      {
        icon: "HeartPulse",
        title: "Vetted pros",
        description: "Work with qualified [Sample] wellness professionals.",
      },
      {
        icon: "CalendarCheck",
        title: "Flexible booking",
        description: "Pick a time window that fits your life.",
      },
      {
        icon: "Sparkles",
        title: "Personalized",
        description: "Plans tailored to your goals.",
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
          "Configure a service, pick a time window, and submit. Submission is a stub — nothing is sent.",
      },
      {
        id: "f3",
        question: "Can I cancel?",
        answer: "This demo does not process real bookings.",
      },
    ],
  },
  cta: {
    title: "Ready to start?",
    body: "Build your [Sample] wellness plan in minutes.",
    cta: { label: "Book a session", href: "/book" },
  },
  testimonials: {
    heading: "Loved by members",
    items: [
      {
        id: "t1",
        quote: "Placeholder testimonial for layout only.",
        author: "A. Sample",
        role: "Member",
        isSample: true,
      },
      {
        id: "t2",
        quote: "Another [Sample] quote — not a real customer.",
        author: "B. Placeholder",
        role: "Member",
        isSample: true,
      },
      {
        id: "t3",
        quote: "Illustrative text, not an endorsement.",
        author: "C. Demo",
        role: "Member",
        isSample: true,
      },
    ],
  },
};
