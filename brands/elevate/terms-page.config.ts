import type { LegalPageConfig } from "@/lib/legal/page";

/**
 * "Terms & Conditions" page content for Elevate. All copy is draft / placeholder
 * demonstration content — no real legal language, dates, or obligations. Final
 * copy is pending counsel review. Reuses the shared {@link LegalPageConfig}.
 */
export const elevateTermsPage: LegalPageConfig = {
  hero: {
    variant: "light",
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
    eyebrow: "Legal Placeholder — Final copy pending",
    title: "Terms & Conditions",
    subtitle:
      "This page is a placeholder and will be updated with final Terms & Conditions before launch. Do not rely on this content for legal guidance.",
    divider: true,
    meta: [
      { label: "Last Updated", value: "TBD" },
      { label: "Effective Date", value: "TBD" },
      { label: "Version", value: "Draft 1.0" },
    ],
  },

  contents: {
    heading: "Jump to Section",
  },

  sections: {
    items: [
      {
        id: "marketplace-usage",
        title: "Marketplace Usage",
        questions: [
          "What is Elevate and how does the marketplace work?",
          "Who is eligible to create an account and book services?",
          "Are Elevate professionals employees of Elevate?",
          "What happens if a professional cannot fulfill a booking?",
        ],
      },
      {
        id: "service-requests",
        title: "Service Requests",
        questions: [
          "How do I submit a service request through Elevate?",
          "Can I specify preferences when requesting a professional?",
          "How long does the coordinator matching process take?",
          "Can I cancel or reschedule a confirmed booking?",
        ],
      },
      {
        id: "pricing-payments",
        title: "Pricing & Payments",
        questions: [
          "How is service pricing determined on the platform?",
          "What is the minimum booking value and how does it apply?",
          "When am I charged for a booked session?",
          "What is the refund policy for cancellations?",
        ],
      },
      {
        id: "professional-relationships",
        title: "Professional Relationships",
        questions: [
          "What does independent professional status mean for users?",
          "Does Elevate verify credentials and conduct background checks?",
          "Who bears responsibility for professional conduct during sessions?",
          "How does Elevate's coordinator process protect both parties?",
        ],
      },
      {
        id: "user-responsibilities",
        title: "User Responsibilities",
        questions: [
          "What accurate information must I provide when booking?",
          "Am I responsible for ensuring a safe environment for sessions?",
          "What actions constitute misuse of the Elevate platform?",
          "How do I report a concern about a professional or session?",
        ],
      },
      {
        id: "contact-information",
        title: "Contact Information",
        questions: [
          "What services does Elevate directly provide vs. facilitate?",
          "Is Elevate liable for professional services delivered in sessions?",
          "How are disputes between users and professionals resolved?",
          "What law governs these Terms & Conditions?",
        ],
      },
    ],
  },

  disclosure: {
    eyebrow: "Marketplace Disclosure",
    heading: "Marketplace Disclosure",
    body: "This section is reserved for important marketplace disclosures required by applicable regulations. Final content will be added before launch.",
    items: [
      {
        icon: "Handshake",
        title: "Independent Professional Relationship Disclosure",
        description: "Placeholder — Content pending legal review",
        badge: "Pending",
      },
      {
        icon: "DollarSign",
        title: "Payment Processing & Fee Disclosure",
        description: "Placeholder — Content pending legal review",
        badge: "Pending",
      },
      {
        icon: "Shield",
        title: "Service Liability Limitation Disclosure",
        description: "Placeholder — Content pending legal review",
        badge: "Pending",
      },
    ],
    note: "The above disclosures are structural placeholders. No legal obligations or representations are made by this page.",
  },

  contact: {
    heading: "Questions About These Terms?",
    body: "Contact a coordinator for general questions while legal content is being finalized. We're happy to clarify anything in plain language.",
    note: "A coordinator will respond within 24 hours",
    actions: [
      { label: "Contact Coordinator", href: "/book" },
      { label: "Return Home", href: "/" },
    ],
  },
};
