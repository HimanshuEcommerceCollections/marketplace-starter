import type { BrandContent } from "@/lib/brand/types";

export const eventsContent: BrandContent = {
  hero: {
    eyebrow: "Events, elevated",
    title: "Make your next event unforgettable",
    subtitle:
      "Book [Sample] planning, photography, and AV production from one place.",
    primaryCta: { label: "Book now", href: "/book" },
    secondaryCta: { label: "Browse services", href: "/services" },
  },
  features: {
    heading: "Why Events & Media",
    subheading: "Everything for a flawless event.",
    items: [
      {
        icon: "PartyPopper",
        title: "End-to-end planning",
        description: "[Sample] coordination from concept to wrap.",
      },
      {
        icon: "Camera",
        title: "Capture every moment",
        description: "Photo and video packages.",
      },
      {
        icon: "Speaker",
        title: "Pro AV & staging",
        description: "Sound, lighting, and staging handled.",
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
        question: "Can you handle large events?",
        answer: "This demo does not process real bookings.",
      },
    ],
  },
  cta: {
    title: "Planning something?",
    body: "Get a [Sample] estimate for your event today.",
    cta: { label: "Start planning", href: "/book" },
  },
  testimonials: {
    heading: "Loved by organizers",
    items: [
      {
        id: "t1",
        quote: "Placeholder testimonial for layout only.",
        author: "A. Sample",
        role: "Organizer",
        isSample: true,
      },
      {
        id: "t2",
        quote: "Another [Sample] quote — not a real customer.",
        author: "B. Placeholder",
        role: "Organizer",
        isSample: true,
      },
      {
        id: "t3",
        quote: "Illustrative text, not an endorsement.",
        author: "C. Demo",
        role: "Organizer",
        isSample: true,
      },
    ],
  },
};
