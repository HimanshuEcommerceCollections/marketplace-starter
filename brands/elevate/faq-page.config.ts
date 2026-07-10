import type { FaqPageConfig } from "@/lib/faq/page";

/**
 * "FAQ" page content for Elevate (redesigned bespoke layout). All copy is
 * draft / demonstration content — no real claims, statistics, or final
 * prices. Photography currently hotlinks Unsplash like the homepage; swap
 * for /assets/faq/* files once the designer supplies final art.
 */
export const elevateFaqPage: FaqPageConfig = {
  hero: {
    eyebrow: "Help Center",
    title: "Questions.",
    titleAccent: "Answered.",
    sub: "Everything people ask before their first booking — and a real human on the other end if we missed yours.",
    image:
      "https://images.unsplash.com/photo-1622587133988-70349a7942c8?w=1600&q=85&fit=crop&auto=format",
  },

  browser: {
    filter: {
      allLabel: "All questions",
      categories: [
        { id: "booking", label: "Booking" },
        { id: "pricing", label: "Pricing" },
        { id: "pros", label: "Our Professionals" },
        { id: "home", label: "At Your Home" },
      ],
    },
    items: [
    {
      id: "booking-confirmation",
      category: "booking",
      question: "How fast will my booking be confirmed?",
      answer:
        "Within one business hour. A real coordinator reviews your request, matches you with the right vetted professional, and sends you their name, photo, and credentials.",
    },
    {
      id: "booking-same-day",
      category: "booking",
      question: "Can I book a same-day session?",
      answer:
        "Often, yes — especially mornings for evening slots. Submit your request and your coordinator will tell you immediately what's possible; you're never charged until confirmed.",
    },
    {
      id: "booking-cancellation",
      category: "booking",
      question: "What's the cancellation policy?",
      answer:
        "Cancel or reschedule free up to 4 hours before your session. Inside 4 hours, a 50% fee applies to respect your professional's committed time.",
    },
    {
      id: "booking-same-pro",
      category: "booking",
      question: "Can I request the same professional every time?",
      answer:
        "Absolutely — most clients do. Tell your coordinator once and we'll prioritize matching you with your favorite for every future session.",
    },
    {
      id: "booking-for-someone-else",
      category: "booking",
      question: "Can I book a session for someone else?",
      answer:
        "Yes — sessions make great gifts. Add the recipient's details at booking and our coordinator handles the rest discreetly.",
    },
    {
      id: "pricing-hidden-fees",
      category: "pricing",
      question: "Are there any hidden fees?",
      answer:
        "None. Every price includes the professional's time, travel anywhere in Wake County, all equipment, and gratuity. What you see at confirmation is exactly what you pay.",
    },
    {
      id: "pricing-calculated",
      category: "pricing",
      question: "How is my price calculated?",
      answer:
        "You configure it: choose your service, duration, and any add-ons — each shows its price before you select it. Your exact total is on screen before you confirm, and it never changes after.",
    },
    {
      id: "pricing-tipping",
      category: "pricing",
      question: "Do I need to tip?",
      answer:
        "No — gratuity is built into every price. Your professional is paid fairly, and you never do awkward math at the door.",
    },
    {
      id: "pricing-charge-timing",
      category: "pricing",
      question: "When is my card charged?",
      answer:
        "Only after your coordinator confirms your session. Requesting a booking costs nothing.",
    },
    {
      id: "pricing-from-prices",
      category: "pricing",
      question: 'Why do Physical & Speech Therapy show "from" prices?',
      answer:
        "Both start with a licensed professional's evaluation. Your coordinator confirms the treatment plan and final quote after that first visit — the listed prices are your starting point.",
    },
    {
      id: "pros-vetting",
      category: "pros",
      question: "How are professionals vetted?",
      answer:
        "Four gates: North Carolina license or certification verification, a clean background check, active liability insurance, and an in-person interview. Every professional, no exceptions.",
    },
    {
      id: "pros-employees",
      category: "pros",
      question: "Are the professionals Elevate employees?",
      answer:
        "They're independent, vetted practitioners — the best in the Raleigh area, who choose to work with Elevate for quality clients and fair pay.",
    },
    {
      id: "pros-unhappy",
      category: "pros",
      question: "What if I'm not happy with a session?",
      answer:
        "Tell us within 24 hours and we'll make it right — a credit or a full refund, your choice. We also read every review personally.",
    },
    {
      id: "home-preparation",
      category: "home",
      question: "Do I need to prepare anything at home?",
      answer:
        "Nothing. Your professional brings everything — table, mats, weights, products. You just need a bit of floor space and yourself.",
    },
    {
      id: "home-space",
      category: "home",
      question: "How much space do I need?",
      answer:
        "Roughly the footprint of a yoga mat plus walking room. Your pro adapts to apartments, garages, gardens — wherever suits you.",
    },
    {
      id: "home-pets",
      category: "home",
      question: "I have pets. Is that a problem?",
      answer:
        "Not at all — just mention them at booking so we match you with a pet-comfortable professional and they know what to expect.",
    },
    ],
  },

  band: {
    title: "Didn't find it?",
    titleAccent: "Ask a human.",
    body: "Our coordinators answer every message personally — usually within the hour on business days.",
    primaryCta: {
      label: "Contact us",
      href: "mailto:hello@elevatewellness.com?subject=Question%20for%20Elevate",
    },
    secondaryCta: { label: "Just book — ask along the way", href: "/book" },
    image:
      "https://images.unsplash.com/photo-1620302044868-e061ebf02bfb?w=1600&q=85&fit=crop&auto=format",
  },
};
