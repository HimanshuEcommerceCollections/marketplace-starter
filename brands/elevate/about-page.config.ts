import type { AboutPageConfig } from "@/lib/about/page";

/** "About" page content for the Elevate brand. */
export const elevateAbout: AboutPageConfig = {
  hero: {
    variant: "dark",
    eyebrow: "Vetted Professionals · Coordinator-Confirmed Bookings",
    title: "A More Thoughtful Way to Access Wellness Services",
    subtitle:
      "Elevate helps connect people across Raleigh and Wake County with vetted independent wellness professionals who provide services directly in clients' homes.",
    primaryCta: { label: "Book Now", href: "/book" },
    secondaryCta: { label: "How It Works", href: "/how-it-works" },
    trustIndicators: [
      "Identity Verified",
      "Background Checked",
      "Coordinator Confirmed",
    ],
    image: {
      caption: {
        title: "About imagery",
        lines: ["Vetted professionals · Raleigh & Wake County"],
      },
    },
  },

  mission: {
    heading: "Why Elevate Exists",
    paragraphs: [
      "Getting a wellness service shouldn't mean scrolling through unknown listings, making cold calls, or hoping the person who shows up is trustworthy.",
      "Elevate was built to solve that problem — a structured marketplace with coordinator support, professional verification, and clear pricing, so clients can focus on their wellness, not the logistics.",
    ],
    quote: {
      text: "Your hour. Your home. Your pro.",
      body: "Elevate connects clients in Raleigh and Wake County with vetted, independent wellness professionals — coordinated, confirmed, and delivered to your home.",
      attribution: "Elevate Health & Wellness",
    },
    values: [
      { icon: "Home", label: "Convenience" },
      { icon: "ShieldCheck", label: "Trust" },
      { icon: "Handshake", label: "Coordination" },
      { icon: "Star", label: "Quality" },
    ],
  },

  difference: {
    heading: "What Makes Elevate Different",
    subheading:
      "Not a directory. Not a booking app. A coordinated marketplace built around your safety and comfort.",
    items: [
      {
        icon: "Headphones",
        title: "Coordinator Support",
        description:
          "Every booking is reviewed by a coordinator before anyone is dispatched. You have a human point of contact throughout.",
      },
      {
        icon: "BadgeCheck",
        title: "Vetted Professionals",
        description:
          "Identity verification and background checks are completed for every professional before marketplace activation.",
      },
      {
        icon: "Home",
        title: "In-Home Convenience",
        description:
          "Services come to you. No commute, no unfamiliar spaces — just your own home, on your schedule.",
      },
      {
        icon: "Globe",
        title: "Marketplace Flexibility",
        description:
          "A growing range of service categories with transparent draft pricing. Configure your session before you commit.",
      },
    ],
  },

  review: {
    heading: "How Professionals Are Reviewed",
    subheading: "A structured verification process before anyone enters your home.",
    note: "No professional is activated on the Elevate marketplace until all identity and background verification is complete.",
    items: [
      {
        icon: "BadgeCheck",
        title: "Identity Verification",
        description:
          "Every professional submits a government-issued ID, which is verified before any marketplace activation can occur.",
      },
      {
        icon: "Search",
        title: "Background Checks",
        description:
          "Third-party background screening is completed for all professionals. Results are reviewed before approval.",
      },
      {
        icon: "ClipboardCheck",
        title: "Service Standards",
        description:
          "All marketplace partners agree to Elevate's quality and conduct guidelines before their profile is activated.",
      },
      {
        icon: "RefreshCw",
        title: "Ongoing Review",
        description:
          "Professional standing is monitored on an ongoing basis. Client feedback directly influences marketplace status.",
      },
    ],
  },

  serviceCategories: {
    heading: "Our Service Categories",
    subheading:
      "Eight categories of vetted in-home wellness services, with more planned.",
  },

  serviceArea: {
    heading: "Local to Raleigh and Wake County",
    paragraphs: [
      "Elevate currently serves clients across Raleigh and Wake County, NC. Our service area includes Raleigh, Cary, Apex, Wake Forest, Morrisville, and surrounding communities.",
      "All independent professionals partnered with Elevate serve clients within this area. As the marketplace grows, coverage will expand.",
    ],
    mapLabel: "Raleigh & Wake County, NC",
    areas: [
      "Raleigh",
      "Cary",
      "Apex",
      "Wake Forest",
      "Morrisville",
      "Holly Springs",
    ],
    image: {
      caption: {
        title: "Service-area map",
        lines: ["Raleigh & Wake County, NC"],
      },
    },
  },

  testimonials: {
    heading: "What Clients Say",
    subheading:
      "Experiences from clients on trust, verification, and the coordinator process.",
    items: [
      {
        id: "about-1",
        quote:
          "I was hesitant to book an in-home service — not because of Elevate, but because I'd had bad experiences elsewhere. The coordinator process completely changed that for me.",
        author: "P.L.",
        role: "Raleigh",
        isSample: true,
      },
      {
        id: "about-2",
        quote:
          "The verification process is what made me trust it. Knowing the professional was background-checked before arriving at my home meant a lot.",
        author: "C.M.",
        role: "Cary",
        isSample: true,
      },
      {
        id: "about-3",
        quote:
          "Clean, transparent, and the coordinator actually called me before the session to confirm everything. That level of care is rare.",
        author: "N.A.",
        role: "Wake Forest",
        isSample: true,
      },
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    viewAll: { label: "View FAQ", href: "/faq" },
    items: [
      {
        id: "reviewed",
        question: "How are professionals reviewed?",
        answer:
          "Every professional on the Elevate marketplace completes identity verification and a third-party background check. No one is activated until all requirements are met.",
      },
      {
        id: "coordinator",
        question: "What does the coordinator do?",
        answer:
          "The coordinator reviews every booking request, manages professional matching, confirms scheduling, and serves as your human point of contact before and after your session.",
      },
      {
        id: "matching",
        question: "How does matching work?",
        answer:
          "After you submit a request, the coordinator selects an available, vetted professional based on your service type, location, and scheduling preferences.",
      },
      {
        id: "areas",
        question: "What areas are served?",
        answer:
          "Elevate currently serves Raleigh and Wake County, NC — including Raleigh, Cary, Apex, Wake Forest, Morrisville, Holly Springs, and surrounding communities.",
      },
    ],
  },

  cta: {
    title: "Wellness shouldn't require a commute.",
    body: "Book a vetted professional who comes to you — coordinated, confirmed, and ready.",
    primaryCta: { label: "Book Now", href: "/book" },
    secondaryCta: { label: "How It Works", href: "/how-it-works" },
  },
};
