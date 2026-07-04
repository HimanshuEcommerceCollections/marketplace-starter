import type { ForProsPageConfig } from "@/lib/for-pros/page";

const PRO_APPLICATION = "mailto:pros@elevatewellness.com?subject=Pro%20Application";
const PRO_QUESTION = "mailto:pros@elevatewellness.com?subject=Pro%20Question";

/** "For Pros" (Become a Pro) page content for the Elevate brand. */
export const elevateForPros: ForProsPageConfig = {
  hero: {
    eyebrow: "For Wellness Professionals",
    title: "Your craft.",
    titleAccent: "Your schedule.",
    sub: "Join Raleigh's premier wellness platform. We fill your calendar with quality clients — you keep your independence, your rates, and your freedom.",
    image: "/assets/for-pros/hero-bg.jpg",
    primaryCta: { label: "Start your application", href: PRO_APPLICATION },
    secondaryCta: { label: "Why join Elevate", href: "#fp-benefits" },
  },

  benefits: {
    eyebrow: "Why pros choose Elevate",
    heading: "Built for independents",
    sub: "You're a professional, not an employee. Elevate works around that — not the other way round.",
    items: [
      {
        icon: "CalendarCheck",
        title: "A full calendar, zero marketing",
        body: "No more chasing clients, running ads, or discounting your worth. We bring you pre-qualified bookings from clients who've already paid — you just show up and do great work.",
      },
      {
        icon: "HandCoins",
        title: "Keep 80% of every session",
        body: "A flat, transparent 20% platform fee — that's it. No hidden deductions, no pay-to-play placement, no surprise charges. Gratuity is built into client pricing, so you're always paid fairly.",
      },
      {
        icon: "Clock",
        title: "You set your hours",
        body: "Open your availability when you want it, close it when you don't. Take holidays without asking anyone. Work mornings only, weekends only, or full weeks — it's entirely up to you.",
      },
      {
        icon: "Headset",
        title: "A coordinator has your back",
        body: "Our coordination team handles scheduling, client communication, payments, and any awkward conversations. You focus on the session — we handle everything around it.",
      },
    ],
  },

  earnings: {
    eyebrow: "Real earnings",
    title: "Get paid what",
    titleLine2: "you're",
    titleAccent: "worth.",
    body: "Our pros earn more per session than industry averages — because clients pay for quality, travel is priced in, and tips are guaranteed.",
    image: "/assets/for-pros/earnings-bg.jpg",
    stats: [
      { value: "80%", label: "You Keep" },
      { value: "$65–95", label: "Avg Hourly Payout" },
      { value: "Weekly", label: "Direct Deposit" },
    ],
  },

  steps: {
    eyebrow: "Getting started",
    heading: "From application to first booking",
    sub: "Most pros are live on the platform within two weeks of applying.",
    image: "/assets/for-pros/steps-bg.jpg",
    steps: [
      {
        num: "01",
        title: "Apply online",
        body: "Tell us about your practice, credentials, and experience. Takes about 10 minutes.",
      },
      {
        num: "02",
        title: "Get vetted",
        body: "Background check, credential verification, insurance review, and a friendly in-person interview.",
      },
      {
        num: "03",
        title: "Set your profile",
        body: "Your specialties, your service area, your availability. You control all of it.",
      },
      {
        num: "04",
        title: "Start earning",
        body: "Bookings arrive matched to your profile. Accept, show up, get paid weekly.",
      },
    ],
  },

  requirements: {
    eyebrow: "What we look for",
    heading: "Requirements",
    sub: "We keep the bar high — that's why clients trust every pro on the platform.",
    items: [
      {
        icon: "Certificate",
        lead: "Current certification or license",
        text: "in your discipline, recognised in North Carolina",
      },
      {
        icon: "Briefcase",
        lead: "2+ years professional experience",
        text: "working directly with clients",
      },
      {
        icon: "ShieldCheck",
        lead: "Clean background check",
        text: "— we run and pay for it during vetting",
      },
      {
        icon: "FileText",
        lead: "Active liability insurance",
        text: "appropriate to your practice",
      },
      {
        icon: "Car",
        lead: "Reliable transport",
        text: "and your own professional equipment",
      },
      {
        icon: "Heart",
        lead: "A genuine care for clients",
        text: "— we interview every applicant in person",
      },
    ],
  },

  faq: {
    eyebrow: "Pro questions",
    heading: "Before you apply",
    items: [
      {
        id: "pay",
        question: "How and when do I get paid?",
        answer:
          "Weekly direct deposit, every Friday, for all sessions completed through the previous Sunday. No invoicing, no chasing payments — it just arrives.",
      },
      {
        id: "fee",
        question: "What does the 20% platform fee cover?",
        answer:
          "Client acquisition, marketing, booking coordination, payment processing, customer support, and platform insurance. Most independent pros spend far more than 20% acquiring clients on their own.",
      },
      {
        id: "exclusivity",
        question: "Am I locked into exclusivity?",
        answer:
          "Never. You remain fully independent — keep your private clients, work with other platforms, run your own studio. Elevate is a channel, not a cage.",
      },
      {
        id: "decline",
        question: "Can I decline bookings?",
        answer:
          "Yes. You'll see the session details before accepting. Decline anything that doesn't fit — no penalties for reasonable declines, though consistent reliability earns you priority matching.",
      },
      {
        id: "equipment",
        question: "What equipment do I need to bring?",
        answer:
          "Your own professional kit — massage table, mats, weights, products, whatever your discipline requires. Clients expect a fully equipped session, and travel costs are built into their price.",
      },
    ],
  },

  cta: {
    eyebrow: "Ready to grow?",
    title: "Apply in",
    titleAccent: "10 minutes.",
    body: "Join Raleigh's most trusted wellness platform. Applications reviewed within 3 business days.",
    image: "/assets/for-pros/cta-bg.jpg",
    primaryCta: { label: "Start your application", href: PRO_APPLICATION },
    secondaryCta: { label: "Ask a question", href: PRO_QUESTION },
  },
};
