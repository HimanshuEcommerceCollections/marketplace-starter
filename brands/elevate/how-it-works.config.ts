import type { HowItWorksPageConfig } from "@/lib/how-it-works/page";

/** "How Elevate Works" page content for the Elevate brand. */
export const elevateHowItWorks: HowItWorksPageConfig = {
  hero: {
    variant: "dark",
    eyebrow: "Vetted Professionals Only",
    title: "How Elevate Works",
    subtitle:
      "A simple, guided process designed to make in-home wellness services feel safe, transparent, and easy to schedule.",
    primaryCta: { label: "Book Now", href: "/book" },
    secondaryCta: { label: "View Pricing", href: "/pricing" },
    trustIndicators: [
      "Identity Verified",
      "Background Checked",
      "Coordinator Confirmed",
    ],
    image: {
      caption: {
        title: "Guided booking",
        lines: ["Vetted professionals · Coordinator confirmed"],
      },
    },
  },

  journey: {
    heading: "The 6-Step Booking Journey",
    subheading: "From browsing to booked — a clear, guided process with no surprises.",
    note: "Your coordinator is notified the moment you submit. Expect a follow-up within one business hour.",
    steps: [
      { title: "Pick a Service", description: "Browse the service catalog and select the type of wellness service you need." },
      { title: "Configure Your Request", description: "Choose your session details — duration, format, and any preferences or add-ons." },
      { title: "See the Price", description: "Your draft price breakdown appears before you enter any contact information." },
      { title: "Details + Schedule", description: "Enter your contact info and preferred appointment time windows." },
      { title: "Confirm + Submit", description: "Review your full summary and submit your booking request to the coordinator." },
      { title: "Success", description: "A coordinator confirms your request and follows up within one business hour." },
    ],
  },

  afterSubmit: {
    heading: "What Happens After You Submit",
    subheading: "Your request is never left unattended. Here's exactly what follows.",
    items: [
      {
        icon: "ClipboardCheck",
        title: "Coordinator Review",
        description:
          "A coordinator reviews your request, verifies your information, and confirms details within one business hour.",
      },
      {
        icon: "Handshake",
        title: "Professional Matching",
        description:
          "The coordinator matches your request with an available, vetted professional suited to your service and area.",
      },
      {
        icon: "CalendarCheck",
        title: "Scheduling Confirmation",
        description:
          "You receive a scheduling confirmation with your professional's information and session details.",
      },
      {
        icon: "Home",
        title: "Visit Preparation",
        description:
          "Before the session, you'll receive preparation guidance and a reminder with all details for the day.",
      },
    ],
  },

  review: {
    heading: "How Professionals Are Reviewed",
    subheading: "Every professional on Elevate goes through a structured verification process.",
    note: "Elevate does not activate any professional on the marketplace until all verification requirements are met.",
    items: [
      {
        icon: "BadgeCheck",
        title: "Identity Verification",
        description:
          "All professionals complete a government-issued photo ID verification before joining the marketplace.",
      },
      {
        icon: "Search",
        title: "Background Checks",
        description:
          "Third-party background screening is completed for every professional before marketplace activation.",
      },
      {
        icon: "ClipboardCheck",
        title: "Marketplace Standards",
        description:
          "All partners follow Elevate's quality and conduct guidelines before and during every session.",
      },
      {
        icon: "RefreshCw",
        title: "Ongoing Review Process",
        description:
          "Professional standing is reviewed on an ongoing basis. Client feedback influences marketplace status.",
      },
    ],
  },

  coordinator: {
    heading: "Why a Coordinator Is Involved",
    subheading:
      "Elevate uses a coordinator model to ensure every request is handled with care — not just automated.",
    card: {
      icon: "Headphones",
      title: "Your Coordinator",
      description:
        "A dedicated coordinator reviews your request, coordinates professional matching, and confirms your session before anyone enters your home.",
      note: "Coordinator response: within one business hour",
    },
    items: [
      {
        icon: "ShieldCheck",
        title: "Verifies Requests",
        description:
          "The coordinator reviews every booking request to confirm completeness and accuracy before matching.",
      },
      {
        icon: "Handshake",
        title: "Handles Matching",
        description:
          "The coordinator selects a vetted professional based on your service needs, location, and availability.",
      },
      {
        icon: "CalendarCheck",
        title: "Supports Scheduling",
        description:
          "The coordinator manages the scheduling process and sends you confirmation with all session details.",
      },
      {
        icon: "Headphones",
        title: "Human Point of Contact",
        description:
          "If questions arise before or after your session, the coordinator is your first point of contact.",
      },
    ],
  },

  servicesCovered: {
    heading: "Services We Cover",
    subheading: "Elevate connects you with vetted professionals across eight service categories.",
  },

  faq: {
    heading: "Frequent Questions",
    viewAll: { label: "View All FAQs", href: "/faq" },
    items: [
      {
        id: "who-confirms",
        question: "Who confirms my request?",
        answer:
          "Your dedicated coordinator reviews and confirms your booking request. You will receive a direct follow-up from the coordinator — not an automated system — within one business hour of submission.",
      },
      {
        id: "matching",
        question: "How does matching work?",
        answer:
          "The coordinator reviews your request details — service type, location, time preferences — and selects an available, vetted professional suited to your needs. You receive their information before anyone arrives.",
      },
      {
        id: "confirmation",
        question: "When do I receive confirmation?",
        answer:
          "Confirmation is sent by the coordinator within one business hour. The confirmation includes your professional's information, session time, and any preparation notes.",
      },
      {
        id: "after-submission",
        question: "What happens after submission?",
        answer:
          "After submitting, your request enters coordinator review. No professional is dispatched without coordinator confirmation. You remain in full control until you receive confirmation and choose to proceed.",
      },
    ],
  },

  testimonials: {
    heading: "What Clients Say",
    subheading: "Experiences from Elevate clients on trust and the booking process.",
    items: [
      {
        id: "hiw-1",
        quote:
          "Knowing a coordinator reviewed my request before anyone was sent to my home made me feel completely at ease. The process was exactly as described.",
        author: "R.K.",
        role: "Raleigh",
        isSample: true,
      },
      {
        id: "hiw-2",
        quote:
          "I had a question before my session and the coordinator responded within the hour. That level of care is rare.",
        author: "M.J.",
        role: "Cary",
        isSample: true,
      },
      {
        id: "hiw-3",
        quote:
          "The background check process gave me confidence I hadn't expected. I felt genuinely prepared for the session.",
        author: "S.T.",
        role: "Wake Forest",
        isSample: true,
      },
    ],
  },

  cta: {
    title: "A more personal way to access wellness services.",
    body: "Vetted professionals. Coordinator-confirmed bookings. No surprises.",
    primaryCta: { label: "Book Now", href: "/book" },
    secondaryCta: { label: "View Pricing", href: "/pricing" },
  },
};
