import type { FaqPageConfig } from "@/lib/faq/page";

/**
 * "Frequently Asked Questions" page content for Elevate. All copy is draft /
 * Demonstration content — no real claims, statistics, or final prices.
 */
export const elevateFaqPage: FaqPageConfig = {
  hero: {
    variant: "brand",
    title: "Frequently Asked Questions",
    subtitle:
      "Everything you need to know about booking, scheduling, pricing, and working with Elevate professionals.",
    primaryCta: { label: "Book Now", href: "/book" },
    secondaryCta: { label: "Contact Coordinator", href: "/book" },
  },

  search: {
    placeholder: "Search FAQs",
    clearLabel: "Clear",
    categoryNavLabel: "Jump to Category",
    noResults:
      "No questions match your search. Try a different term or browse by category.",
  },

  categories: [
    {
      id: "booking",
      icon: "CalendarCheck",
      label: "Booking",
      heading: "Booking Questions",
      items: [
        {
          id: "booking-how",
          question: "How do I book a service?",
          answer:
            "Browse our service catalog, select a service, configure your session details (duration, format, add-ons), review the price breakdown, then enter your contact information and preferred time windows. A coordinator reviews your submission and follows up within one business hour.",
        },
        {
          id: "booking-after-submit",
          question: "What happens after I submit a request?",
          answer:
            "After submission, a coordinator reviews your request within one business hour. They verify your information, match you with an available vetted professional, and send a scheduling confirmation with all session details.",
        },
        {
          id: "booking-coordinator-role",
          question: "What does the coordinator do?",
          answer:
            "The coordinator is your human point of contact throughout the booking process. They review your request, handle professional matching, manage scheduling logistics, and are available for questions before and after your session.",
        },
        {
          id: "booking-confirmation",
          question: "When will I receive confirmation?",
          answer:
            "You will receive a scheduling confirmation from your coordinator within one business hour of submitting your request. The confirmation includes your professional's information, session details, and any preparation guidance.",
        },
      ],
    },
    {
      id: "pricing",
      icon: "DollarSign",
      label: "Pricing",
      heading: "Pricing Questions",
      items: [
        {
          id: "pricing-final",
          question: "Are prices final?",
          answer:
            "No. All prices displayed are starting prices. Final pricing is confirmed by the coordinator after you submit your booking request. The price breakdown you see in the booking flow is an estimate, not a final charge.",
        },
        {
          id: "pricing-vary",
          question: "Why do prices vary?",
          answer:
            "Pricing varies based on session duration, session format (individual or group), and any add-ons or service items selected during booking configuration. Each of these factors is configurable in the booking flow.",
        },
        {
          id: "pricing-beauty-minimum",
          question: "How does Beauty minimum pricing work?",
          answer:
            "Beauty services require a minimum booking value of $75. If the services you select total less than $75, you will be prompted to add more items before proceeding. The minimum applies to the total of all Beauty items selected — not per item.",
        },
        {
          id: "pricing-pt-speech",
          question: "Why are PT and Speech priced differently?",
          answer:
            "Physical Therapy and Speech Therapy are currently Coming Soon services using a coordinator-reviewed pricing model. FROM-based pricing is shown for planning only — no live pricing calculator is available. A coordinator reviews each request individually and confirms pricing directly with you.",
        },
      ],
    },
    {
      id: "safety",
      icon: "ShieldCheck",
      label: "Safety & Trust",
      heading: "Safety & Trust Questions",
      items: [
        {
          id: "safety-reviewed",
          question: "How are professionals reviewed?",
          answer:
            "Every professional on the Elevate marketplace must complete identity verification and a third-party background check before their profile is activated. Marketplace standing is reviewed on an ongoing basis and is influenced by client feedback.",
        },
        {
          id: "safety-background-checks",
          question: "Are background checks performed?",
          answer:
            "Yes. Third-party background screening is a mandatory requirement for all professionals before marketplace activation. Results are reviewed before any professional is approved.",
        },
        {
          id: "safety-identity",
          question: "How does identity verification work?",
          answer:
            "All applicants submit a government-issued photo ID, which is verified as part of the marketplace approval process. No professional is activated until identity verification is complete.",
        },
        {
          id: "safety-contact",
          question: "Who can I contact if I have questions?",
          answer:
            "Your coordinator is your primary point of contact for any questions before, during, or after your session. You will never be routed to an automated system for safety-related questions.",
        },
      ],
    },
    {
      id: "scheduling",
      icon: "CalendarClock",
      label: "Scheduling",
      heading: "Scheduling Questions",
      items: [
        {
          id: "scheduling-multiple-windows",
          question: "Can I request multiple time windows?",
          answer:
            "Yes. During booking, you can enter up to three preferred time windows. The coordinator reviews your preferences and selects the best available time when matching your professional.",
        },
        {
          id: "scheduling-reschedule",
          question: "What if I need to reschedule?",
          answer:
            "If you need to reschedule, contact your coordinator directly. Scheduling changes are handled by the coordinator — not through an automated portal. Your coordinator will work with you and the professional to find an alternative time.",
        },
        {
          id: "scheduling-confirmation",
          question: "How does confirmation work?",
          answer:
            "After the coordinator reviews your request and matches a professional, they send you a scheduling confirmation. This confirmation includes your professional's name, the confirmed session time, and any preparation notes for your session.",
        },
        {
          id: "scheduling-advance",
          question: "How far in advance should I book?",
          answer:
            "We recommend submitting your request at least 48–72 hours before your preferred appointment time. For specialty services or specific time requirements, earlier requests improve availability. For corporate events, we recommend 2–3 weeks in advance.",
        },
      ],
    },
    {
      id: "professionals",
      icon: "Users",
      label: "Professionals",
      heading: "Professionals Questions",
      items: [
        {
          id: "professionals-employees",
          question: "Are providers employees of Elevate?",
          answer:
            "No. All wellness providers on the Elevate marketplace are independent professionals who partner with Elevate to connect with clients. Elevate does not employ, staff, or hire professionals. Every professional operates independently and sets their own practice standards.",
        },
        {
          id: "professionals-independent",
          question: "What does “independent professional” mean?",
          answer:
            "An independent professional is a self-employed wellness practitioner who has joined the Elevate marketplace to connect with clients. They manage their own scheduling, pricing, and practice — Elevate provides the marketplace infrastructure, coordinator support, and client connection.",
        },
        {
          id: "professionals-matched",
          question: "How are professionals matched to my request?",
          answer:
            "The coordinator reviews your request details — service type, location, scheduling preferences, and any special requirements — and selects an available, vetted professional who meets your needs. You receive their information in your confirmation before anyone arrives.",
        },
        {
          id: "professionals-services",
          question: "What services are available?",
          answer:
            "Elevate currently supports Massage, Personal Training, Yoga, Beauty, Nutrition Coaching, and Life Coaching. Physical Therapy and Speech Therapy are Coming Soon and currently accepting interest registrations only.",
        },
      ],
    },
    {
      id: "corporate",
      icon: "Building2",
      label: "Corporate",
      heading: "Corporate Wellness Questions",
      items: [
        {
          id: "corporate-how",
          question: "How does corporate wellness work?",
          answer:
            "Corporate wellness is a separate B2B inquiry process — not the standard consumer booking flow. You submit a corporate inquiry form, and a coordinator reviews it and reaches out within one business day to begin the discovery process.",
        },
        {
          id: "corporate-quotes",
          question: "How do quotes work for corporate events?",
          answer:
            "After an initial discovery conversation with your coordinator, you will receive a tailored proposal with program options and pricing. All corporate pricing is customized by the coordinator based on your headcount, event type, and specific requirements. No standard pricing applies.",
        },
        {
          id: "corporate-event-size",
          question: "Can Elevate support events of any size?",
          answer:
            "Yes. Elevate supports corporate wellness events for small teams through large organizations. Headcount, event type, and complexity are all reviewed during the coordinator discovery process to ensure appropriate planning and staffing.",
        },
        {
          id: "corporate-contact",
          question: "Who contacts us after we submit a corporate inquiry?",
          answer:
            "A coordinator — not an automated system — will reach out within one business day of your corporate inquiry submission. All corporate wellness planning is handled by a dedicated coordinator from initial contact through event execution.",
        },
      ],
    },
  ],

  contact: {
    heading: "Still Have Questions?",
    body:
      "A coordinator can help explain services, scheduling, pricing, and next steps. Every inquiry is handled by a human — not an automated system.",
    note: "Coordinator response within one business hour",
    primaryCta: { label: "Contact Coordinator", href: "/book" },
    secondaryCta: { label: "Book Now", href: "/book" },
    card: {
      icon: "Headphones",
      title: "Your Coordinator",
      description:
        "Available to answer questions about services, scheduling, professional matching, and anything else you need before booking.",
      availability: [
        { icon: "Mail", label: "Email response within one business hour" },
        { icon: "Phone", label: "Coordinator call available" },
        { icon: "RefreshCw", label: "Follow up on your terms" },
      ],
    },
  },
};
