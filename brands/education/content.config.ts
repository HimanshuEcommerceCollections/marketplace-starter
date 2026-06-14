import type { BrandContent } from "@/lib/brand/types";

export const educationContent: BrandContent = {
  hero: {
    eyebrow: "Learn & create",
    title: "Grow your skills with expert guidance",
    subtitle:
      "Book [Sample] tutoring, courses, and creative services from vetted experts.",
    primaryCta: { label: "Book now", href: "/book" },
    secondaryCta: { label: "Browse services", href: "/services" },
  },
  features: {
    heading: "Why Education & Creative",
    subheading: "Personalized learning and creative help.",
    items: [
      {
        icon: "GraduationCap",
        title: "Expert mentors",
        description: "Learn from vetted [Sample] tutors and creators.",
      },
      {
        icon: "BookOpen",
        title: "Flexible formats",
        description: "1:1 sessions, courses, or project-based work.",
      },
      {
        icon: "Palette",
        title: "Creative services",
        description: "Design and creative gigs on demand.",
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
        question: "Are sessions online?",
        answer: "This demo does not process real bookings.",
      },
    ],
  },
  cta: {
    title: "Ready to learn?",
    body: "Book a [Sample] session or course in minutes.",
    cta: { label: "Get started", href: "/book" },
  },
  testimonials: {
    heading: "Loved by learners",
    items: [
      {
        id: "t1",
        quote: "Placeholder testimonial for layout only.",
        author: "A. Sample",
        role: "Learner",
        isSample: true,
      },
      {
        id: "t2",
        quote: "Another [Sample] quote — not a real customer.",
        author: "B. Placeholder",
        role: "Learner",
        isSample: true,
      },
      {
        id: "t3",
        quote: "Illustrative text, not an endorsement.",
        author: "C. Demo",
        role: "Learner",
        isSample: true,
      },
    ],
  },
};
