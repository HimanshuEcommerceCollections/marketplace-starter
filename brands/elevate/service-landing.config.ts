import type { ServiceLandingRegistry } from "@/lib/services/landing";

/**
 * Elevate service landing pages, keyed by service slug. Each entry fully drives
 * a /services/<slug> landing page — adding a new service page only requires a
 * new object here (no page or component code). The slug MUST match a catalog
 * service.id and a pricing.v1.json services key.
 */
export const elevateServiceLanding: ServiceLandingRegistry = {
  massage: {
    slug: "massage",
    hero: {
      eyebrow: "Massage",
      title: "In-Home Massage",
      subtitle:
        "Premium massage services delivered to your home by vetted independent professionals.",
      primaryCta: { label: "Book Massage", href: "/book?service=massage" },
      secondaryCta: { label: "How It Works", href: "#how-it-works" },
      trustIndicators: [
        "Background Checked",
        "Identity Verified",
        "Coordinator Confirmed",
      ],
      image: {
        caption: {
          title: "Lifestyle image",
          lines: [
            "Professional + client · real home",
            "Natural light · warm residential",
          ],
        },
      },
    },
    trust: {
      heading: "Designed for comfort. Built on trust.",
      columns: 4,
      items: [
        {
          icon: "BadgeCheck",
          title: "Identity Verification",
          description:
            "Every professional's identity is verified before joining the Elevate marketplace.",
        },
        {
          icon: "ShieldCheck",
          title: "Background Checks",
          description:
            "Comprehensive background screening for every independent professional on the platform.",
        },
        {
          icon: "ClipboardCheck",
          title: "Coordinator Confirmation",
          description:
            "A real coordinator confirms every booking — a named human, every time.",
        },
        {
          icon: "Handshake",
          title: "Independent Professionals",
          description:
            "All professionals are independent partners with Elevate — never employees.",
        },
      ],
    },
    timeline: {
      heading: "Your massage experience, step by step",
      steps: [
        {
          title: "Book Request",
          description: "Submit preferences via the booking configurator.",
        },
        {
          title: "Coordinator Review",
          description: "Your coordinator reviews and confirms availability.",
        },
        {
          title: "Professional Match",
          description: "Matched to a vetted independent professional.",
        },
        {
          title: "Arrival at Home",
          description: "Your professional arrives at the scheduled time.",
        },
        {
          title: "Session",
          description: "Your massage, in your space, on your schedule.",
        },
        {
          title: "Follow-Up",
          description: "Rebook when ready — your preferences are remembered.",
        },
      ],
    },
    configurator: {
      heading: "Configure your session",
      subheading:
        "Exact pricing updates live in the booking flow. This is a preview of available options.",
      cta: { label: "Book Massage", href: "/book?service=massage" },
      groups: [
        {
          id: "duration",
          label: "Duration",
          type: "single",
          defaultOptionId: "60",
          options: [
            { id: "60", label: "60 min" },
            { id: "90", label: "90 min" },
            { id: "120", label: "120 min" },
          ],
        },
        {
          id: "session-type",
          label: "Session Type",
          type: "single",
          defaultOptionId: "swedish",
          options: [
            { id: "swedish", label: "Swedish" },
            { id: "deep-tissue", label: "Deep Tissue" },
            { id: "prenatal", label: "Prenatal" },
            { id: "sports", label: "Sports" },
          ],
        },
        {
          id: "add-ons",
          label: "Add-ons",
          type: "multi",
          options: [
            { id: "hot-stones", label: "Hot Stones", note: "+$20" },
            { id: "aromatherapy", label: "Aromatherapy", note: "+$10" },
            { id: "couples", label: "Couples", note: "+$60" },
            { id: "targeted-focus", label: "Targeted Focus" },
          ],
        },
      ],
    },
    benefits: {
      heading: "Why in-home is better",
      items: [
        {
          icon: "Car",
          title: "No commute",
          description:
            "Walk from your session directly to your couch. Recovery starts immediately without traffic or travel.",
        },
        {
          icon: "Home",
          title: "Familiar environment",
          description:
            "Recover in your own space with your preferred setup, playlist, and comfort level.",
        },
        {
          icon: "CalendarDays",
          title: "Flexible scheduling",
          description:
            "Morning, evening, or weekend availability — your schedule drives the experience.",
        },
        {
          icon: "Sparkles",
          title: "Personalized experience",
          description:
            "Your preferences are remembered and communicated before every appointment.",
        },
        {
          icon: "ShieldCheck",
          title: "Vetted professionals",
          description:
            "Background checked and identity verified professionals who meet Elevate standards.",
        },
        {
          icon: "Headphones",
          title: "Coordinator support",
          description:
            "A real person confirms your booking and helps ensure a smooth experience.",
        },
      ],
    },
    faq: {
      heading: "Common questions",
      viewAll: { label: "View Full FAQ", href: "/faq" },
      items: [
        {
          id: "massage-prep",
          question: "What should I prepare before a massage? (Sample)",
          answer:
            "Just a quiet, comfortable space — your professional brings everything needed. Placeholder answer for the INTERNAL DRAFT starter.",
        },
        {
          id: "massage-matching",
          question: "How does provider matching work? (Sample)",
          answer:
            "A coordinator matches you with a vetted independent professional based on your preferences and schedule.",
        },
        {
          id: "massage-reschedule",
          question: "What happens if I need to reschedule? (Sample)",
          answer:
            "This demo does not process real bookings — rescheduling would be handled by your coordinator.",
        },
        {
          id: "massage-vetting",
          question: "Are professionals vetted? (Sample)",
          answer:
            "Yes — every professional passes a [Sample] background and identity check before joining.",
        },
      ],
    },
    cta: {
      title: "Wellness shouldn't require a commute.",
      body: "Book your first in-home massage with a vetted independent professional.",
      primaryCta: { label: "Book Massage", href: "/book?service=massage" },
      secondaryCta: { label: "View Pricing", href: "/pricing" },
    },
  },
};
