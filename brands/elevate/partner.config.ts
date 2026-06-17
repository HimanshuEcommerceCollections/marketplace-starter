import type { PartnerLandingConfig } from "@/lib/partner/landing";

/** "Partner with Elevate" (Become a Pro) page content for the Elevate brand. */
export const elevatePartner: PartnerLandingConfig = {
  hero: {
    variant: "dark",
    title: "Partner with Elevate",
    subtitle:
      "Connect with clients seeking premium in-home wellness services across Raleigh and Wake County.",
    primaryCta: { label: "Apply to Partner with Elevate", href: "#apply" },
    secondaryCta: { label: "How It Works", href: "#how-it-works" },
    image: {
      caption: {
        title: "Partner imagery",
        lines: ["Independent professionals · Raleigh & Wake County"],
      },
    },
  },

  whoWeWorkWith: {
    heading: "Who We Work With",
    subheading:
      "Elevate connects clients with independent professionals across eight service categories.",
  },

  whyPartner: {
    heading: "Why Partner with Elevate",
    subheading: "We've built the infrastructure — you bring the expertise.",
    items: [
      {
        icon: "CalendarDays",
        title: "Flexible Scheduling",
        description:
          "Set your own availability. Accept requests that fit your schedule.",
      },
      {
        icon: "Globe",
        title: "Marketplace Visibility",
        description:
          "Get discovered by premium clients actively seeking your services.",
      },
      {
        icon: "Headphones",
        title: "Coordinator Support",
        description:
          "Our coordinators handle client communication and logistics.",
      },
      {
        icon: "Star",
        title: "Premium Client Experience",
        description:
          "Work with clients who value quality and are prepared for sessions.",
      },
    ],
  },

  process: {
    heading: "How the Process Works",
    subheading:
      "Five straightforward steps from application to active marketplace listing.",
    steps: [
      { title: "Apply", description: "Submit your application and service details." },
      { title: "Review", description: "Our team reviews your background and credentials." },
      { title: "Verification", description: "Identity and background verification is completed." },
      { title: "Approval", description: "You receive your marketplace approval decision." },
      { title: "Activation", description: "Your profile goes live and you start receiving requests." },
    ],
  },

  standards: {
    heading: "Standards & Verification",
    subheading:
      "Elevate maintains high standards to protect clients and marketplace integrity.",
    items: [
      {
        icon: "BadgeCheck",
        title: "Identity Verification",
        description:
          "All applicants complete a photo ID verification before approval.",
      },
      {
        icon: "Search",
        title: "Background Checks",
        description:
          "Third-party background screening is required for marketplace activation.",
      },
      {
        icon: "ClipboardCheck",
        title: "Service Standards",
        description:
          "Partners follow Elevate's quality and conduct guidelines.",
      },
      {
        icon: "Shield",
        title: "Client Safety",
        description:
          "Client safety protocols are reviewed during the onboarding process.",
      },
    ],
  },

  apply: {
    heading: "Apply to Partner with Elevate",
    subheading: "Tell us about yourself and the services you provide.",
  },

  testimonials: {
    heading: "What Partners Say",
    subheading: "Independent professionals on partnering with Elevate.",
    items: [
      {
        id: "partner-1",
        quote:
          "Joining the marketplace completely changed how I grow my practice. I now have consistent, quality clients without any marketing effort on my part.",
        author: "M.T.",
        role: "Licensed Massage Therapist",
        isSample: true,
      },
      {
        id: "partner-2",
        quote:
          "The coordinator support is incredible. I focus entirely on my clients — Elevate handles the rest.",
        author: "J.R.",
        role: "Certified Personal Trainer",
        isSample: true,
      },
      {
        id: "partner-3",
        quote:
          "I was skeptical at first, but the vetting process made me feel confident that I'd be working with serious clients.",
        author: "A.L.",
        role: "Registered Dietitian",
        isSample: true,
      },
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    viewAll: { label: "View All FAQs", href: "/faq" },
    items: [
      {
        id: "approval",
        question: "How does approval work?",
        answer:
          "Applications are reviewed within 3–5 business days. You'll receive an email with next steps.",
      },
      {
        id: "services",
        question: "What services are accepted?",
        answer:
          "Massage, personal training, yoga, beauty, nutrition coaching, and life coaching. Physical and speech therapy coming soon.",
      },
      {
        id: "review",
        question: "Is there a review process?",
        answer:
          "Yes. All applicants complete identity verification and background screening before activation.",
      },
      {
        id: "onboarding",
        question: "How long does onboarding take?",
        answer:
          "Typically 7–10 business days from submission to marketplace activation.",
      },
    ],
  },

  cta: {
    title: "Grow your practice with a trusted local marketplace.",
    body: "Elevate connects you with premium clients in Raleigh and Wake County.",
    primaryCta: { label: "Apply to Partner with Elevate", href: "#apply" },
    secondaryCta: { label: "Learn More", href: "#how-it-works" },
  },
};
