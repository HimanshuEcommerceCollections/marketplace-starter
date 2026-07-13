import type { BrandContent } from "@/lib/brand/types";

export const elevateContent: BrandContent = {
  hero: {
    eyebrow: "Raleigh's Premier Wellness Platform",
    title: "Move. Heal. Thrive.",
    subtitle:
      "8 disciplines. Vetted pros. Transparent pricing. Delivered to your home across Wake County.",
    primaryCta: { label: "Book a session", href: "/book" },
    secondaryCta: { label: "Explore services", href: "/#services" },
    // Cinematic background video + scroll-driven photo sequence. Drop the real
    // files in Client/public/assets/home/ using these exact names.
    videoSrc: "/assets/home/video-2.mp4",
    videoPoster: "/assets/home/image-1.jpg",
    photoSequence: [
      "/assets/home/image-3.jpg",
      "/assets/home/image-4.jpg",
      "/assets/home/image-5.jpg",
      "/assets/home/image-6.jpg",
      "/assets/home/image-7.jpg",
    ],
    trustIndicators: [
      "Background Checked",
      "Identity Verified",
      "Independent Professionals",
      "Coordinator Confirmed",
    ],
    imageSrc: "/assets/home/lifestyle.jpg",
    imageAlt:
      "Sample lifestyle image — a warm, naturally lit in-home wellness session.",
    imageCaption: {
      title: "Lifestyle photography",
      lines: ["Real home · Natural light", "Professional + client"],
    },
    photos: [
      {
        src: "/assets/home/discipline-yoga.jpg",
        alt: "Sample image — a yoga session at home.",
        label: "Yoga",
      },
      {
        src: "/assets/home/discipline-massage.jpg",
        alt: "Sample image — an in-home massage therapy session.",
        label: "Massage",
      },
      {
        src: "/assets/home/discipline-training.jpg",
        alt: "Sample image — a personal training session.",
        label: "Training",
      },
    ],
  },

  statement: {
    lead: "Raleigh's wellness has never had a",
    emphasis: "single front door.",
    sub: "Until now.",
  },

  trustProcess: {
    heading: "Inviting someone into your home should feel simple.",
    subheading: "We make every step of that process transparent and vetted.",
    items: [
      {
        icon: "ShieldCheck",
        title: "Rigorous Vetting",
        description:
          "Every independent professional on Elevate passes a background and identity check before joining.",
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
    heading: "Eight disciplines.",
    headingAccent: "One door.",
  },

  howItWorks: {
    heading: "Wellness in four steps.",
    subheading: "Book in minutes. Your pro arrives at your door.",
    steps: [
      {
        title: "Pick a service",
        description:
          "Eight disciplines, transparent pricing. No quotes, no callbacks, no guessing.",
      },
      {
        title: "Configure & price",
        description:
          "Duration, format, pack — price updates live. What you see is what you pay.",
      },
      {
        title: "Submit your request",
        description:
          "Details, location, three time windows. Reference number issued instantly.",
      },
      {
        title: "Coordinator confirms",
        description:
          "A real person confirms in under one business hour. Your pro arrives.",
      },
    ],
  },

  whyElevate: {
    eyebrow: "Why Elevate",
    heading: "Why Clients Choose Elevate",
    sub: "We've built the wellness experience that Raleigh deserves — and you've never seen anything like it.",
    trustBadge:
      "100% Background-Checked Professionals · Trusted Across Raleigh",
    cards: [
      {
        icon: "ShieldCheck",
        title: "Independent Professionals",
        body: "Every professional is independently vetted, background-checked, and certified.",
        featured: true,
      },
      {
        icon: "Headset",
        title: "Coordinator Support",
        body: "Your personal coordinator handles scheduling, logistics, and follow-up — completely.",
      },
      {
        icon: "House",
        title: "In-Home Convenience",
        body: "No commute, no waiting rooms. Pure wellness delivered to your door.",
      },
      {
        icon: "MapPin",
        title: "Raleigh-Wide Coverage",
        body: "We serve all of Wake County. Book from anywhere in the Raleigh metro.",
      },
    ],
  },

  findYourFit: {
    eyebrow: "Find your fit",
    heading: "Find the Right Service for You",
    sub: "Not sure where to start? Your coordinator helps you choose.",
    cards: [
      {
        title: "I need physical relief",
        sub: "Massage or Physical Therapy",
        href: "/services/massage",
      },
      {
        title: "I want to get fit",
        sub: "Personal Training or Yoga",
        href: "/services/training",
      },
      {
        title: "I want to look my best",
        sub: "Beauty Services",
        href: "/services/beauty",
      },
      {
        title: "I need clarity & focus",
        sub: "Life or Nutrition Coaching",
        href: "/services/coaching",
      },
      {
        title: "I'm recovering from injury",
        sub: "Physical or Speech Therapy",
        href: "/services/physical-therapy",
      },
      {
        title: "Help me choose",
        sub: "Talk to your coordinator",
        href: "/book/concierge",
        dark: true,
      },
    ],
  },

  testimonials: {
    heading: "Real experiences.",
    headingAccent: "Real results.",
    items: [
      {
        id: "t1",
        quote:
          "Booked a 90-minute massage for the same afternoon. The price was clear upfront — no negotiation, no awkwardness.",
        author: "Sarah M.",
        role: "Massage · Raleigh",
      },
      {
        id: "t2",
        quote:
          "Finally a platform that just tells you the price. The 4-session training pack saves me $40 every month.",
        author: "Marcus T.",
        role: "Training · Cary",
      },
      {
        id: "t3",
        quote:
          "Booked private yoga for six of us. Semi-private pricing was transparent. Coordinator confirmed in 40 minutes.",
        author: "Priya K.",
        role: "Yoga · Durham",
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
    eyebrow: "Ready?",
    title: "Wellness shouldn't require a commute.",
    body: "Book your first session in under two minutes.",
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
        description: "Work with qualified wellness professionals.",
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
          "No — this is an INTERNAL DRAFT demo with placeholder content.",
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
    body: "Build your wellness plan in minutes.",
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
      },
    },
    signup: {
      panelTitle: "Your personal wellness concierge awaits.",
      testimonial: {
        id: "auth-signup",
        quote: "From yoga to beauty — all my wellness needs, handled at home.",
        author: "Elevate client",
      },
    },
  },
};
