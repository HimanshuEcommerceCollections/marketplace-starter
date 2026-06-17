import type { BrandContent } from "@/lib/brand/types";

export const elevateContent: BrandContent = {
  hero: {
    eyebrow: "Raleigh & Wake County, NC · Premium in-home wellness",
    title: "Your hour. Your home. Your pro.",
    subtitle:
      "Elevate connects Raleigh and Wake County with fully vetted, independent wellness providers — massage therapists, personal trainers, yoga instructors, and more — who come directly to your home. Premium care, on your schedule, no commute required.",
    primaryCta: { label: "Book Now", href: "/book" },
    secondaryCta: { label: "How It Works", href: "/#how-it-works" },
    trustIndicators: [
      "Background Checked",
      "Identity Verified",
      "Independent Professionals",
      "Coordinator Confirmed",
    ],
    imageSrc: "/images/placeholder.svg",
    imageAlt:
      "Sample lifestyle image — an independent professional with a client in a warm, naturally lit home.",
    imageCaption: {
      title: "Lifestyle photography",
      lines: ["Real home · Natural light", "Professional + client"],
    },
  },

  trustProcess: {
    heading: "Inviting someone into your home should feel simple.",
    subheading: "We make every step of that process transparent and vetted.",
    items: [
      {
        icon: "ShieldCheck",
        title: "Rigorous Vetting",
        description:
          "Every independent professional on Elevate passes a [Sample] background and identity check before joining.",
      },
      {
        icon: "Handshake",
        title: "Professional Matching",
        description:
          "We match you with providers based on your specific needs, preferences, and schedule.",
      },
      {
        icon: "ClipboardCheck",
        title: "Coordinator Confirmation",
        description:
          "A dedicated Elevate coordinator confirms every booking request before service.",
      },
    ],
  },

  servicesSection: {
    heading: "Wellness services brought to your door",
    subheading:
      "Eight specialties. One trusted marketplace. All independent professionals.",
    draftNote: "DRAFT PRICING — FOR DEMONSTRATION PURPOSES ONLY",
  },

  howItWorks: {
    heading: "How Elevate works",
    subheading: "Book in minutes. Your pro arrives at your door.",
    steps: [
      {
        title: "Pick a Service",
        description: "Choose from eight wellness categories tailored to your goals.",
      },
      {
        title: "Configure",
        description: "Set your preferences, location, and any special requirements.",
      },
      {
        title: "See the Price",
        description: "Transparent pricing with no hidden fees. DRAFT prices shown.",
      },
      {
        title: "Details + Schedule",
        description: "Select your date, time, and session duration.",
      },
      {
        title: "Confirm + Submit",
        description: "Review your booking — a coordinator will follow up.",
      },
      {
        title: "Your Pro Arrives",
        description:
          "Your vetted independent professional arrives at your door on time.",
      },
    ],
  },

  testimonials: {
    heading: "Trusted by busy professionals",
    subheading: "Illustrative [Sample] testimonials — not real clients.",
    items: [
      {
        id: "t1",
        quote:
          "I was nervous about having someone come to my home, but the vetting process gave me real confidence. The session was seamless.",
        author: "A.M.",
        role: "Massage — 90 min",
        isSample: true,
      },
      {
        id: "t2",
        quote:
          "My trainer adapts every session to what I actually need that day. It has completely changed how I think about fitness.",
        author: "D.K.",
        role: "Personal Training",
        isSample: true,
      },
      {
        id: "t3",
        quote:
          "I have tried other in-home services before. Elevate is different — it feels curated, not just convenient.",
        author: "R.T.",
        role: "Massage — Swedish",
        isSample: true,
      },
    ],
  },

  comparison: {
    heading: "Why wellness at home?",
    subheading: "Traditional wellness vs. the Elevate experience.",
    traditionalLabel: "Traditional Wellness",
    elevateLabel: "Elevate at Home",
    rows: [
      {
        traditional: "Commute required",
        elevate: "No commute — pro comes to you",
      },
      {
        traditional: "Shared clinical space",
        elevate: "Your own home environment",
      },
      {
        traditional: "Fixed provider schedule",
        elevate: "Flexible scheduling, your availability",
      },
      {
        traditional: "No personal coordinator",
        elevate: "Dedicated Elevate coordinator included",
      },
    ],
  },

  corporate: {
    eyebrow: "Corporate Wellness",
    title: "Bring Elevate to your team.",
    body: "We partner with HR teams, offsite planners, and corporate wellness coordinators to deliver vetted independent wellness professionals to your team — at your office, offsite, or wherever your people are.",
    tags: [
      "HR Team Programs",
      "Offsite Wellness",
      "Corporate Events",
      "Coordinator Support",
    ],
    cta: { label: "Request a Quote", href: "/book" },
  },

  finalCta: {
    eyebrow: "Your home, your schedule",
    title: "Wellness shouldn't require a commute.",
    body: "Start with your first session. Every independent professional on Elevate is vetted, confirmed, and ready to come to you.",
    primaryCta: { label: "Book Now", href: "/book" },
    secondaryCta: { label: "Explore Services", href: "/services" },
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

  auth: {
    categories: ["Yoga", "Beauty", "Massage", "Personal Training", "Nutrition"],
    login: {
      panelTitle: "Wellness, delivered to your door.",
      testimonial: {
        id: "auth-login",
        quote:
          "Exactly what I needed — professional, convenient, and always on time.",
        author: "Elevate client",
        isSample: true,
      },
    },
    signup: {
      panelTitle: "Your personal wellness concierge awaits.",
      testimonial: {
        id: "auth-signup",
        quote: "From yoga to beauty — all my wellness needs, handled at home.",
        author: "Elevate client",
        isSample: true,
      },
    },
  },
};
