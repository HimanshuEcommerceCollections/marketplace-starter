import type { LegalPageConfig } from "@/lib/legal/page";

/**
 * "Privacy Policy" page content for Elevate. All copy is draft / placeholder
 * demonstration content — no real legal language, dates, or contact details.
 * Final copy is pending counsel review.
 */
export const elevatePrivacyPage: LegalPageConfig = {
  hero: {
    variant: "light",
    eyebrow: "Legal Document",
    title: "Privacy Policy",
    subtitle: "How we collect, use, and protect your personal information",
    divider: true,
    meta: [
      { label: "Last Updated", value: "TBD" },
      { label: "Effective Date", value: "TBD" },
    ],
    notice:
      "Placeholder document. Final legal language is being prepared with counsel.",
  },

  contents: {
    heading: "Contents",
    subtitle: "Quick navigation to each policy section",
  },

  sections: {
    heading: "Policy Sections",
    subtitle: "Final legal language will be added before launch.",
    items: [
      {
        id: "information-we-collect",
        title: "Information We Collect",
        body: [
          "This section will describe the types of personal information collected through the Elevate platform, including account registration data, service booking details, health preferences you share voluntarily, and technical data collected automatically during platform use. [Placeholder — Final legal copy pending counsel review]",
        ],
      },
      {
        id: "how-we-use-your-information",
        title: "How We Use Your Information",
        body: [
          "This section will explain how collected information is used to facilitate bookings, match clients with appropriate independent wellness professionals, improve platform functionality, send relevant communications, and comply with applicable legal obligations. [Placeholder — Final legal copy pending counsel review]",
        ],
      },
      {
        id: "information-sharing",
        title: "Information Sharing",
        body: [
          "This section will detail when information may be shared with independent wellness professionals, third-party service providers, and regulatory authorities as required by law. Elevate Health & Wellness does not sell personal information to third parties. [Placeholder — Final legal copy pending counsel review]",
        ],
      },
      {
        id: "data-security",
        title: "Data Security",
        body: [
          "This section will describe the technical and organizational measures implemented to protect your personal information, including encryption standards, access controls, and security incident response procedures. [Placeholder — Final legal copy pending counsel review]",
        ],
      },
      {
        id: "your-privacy-rights",
        title: "Your Privacy Rights",
        body: [
          "This section will outline rights available under applicable privacy laws — including rights to access, correct, delete, or export your data — and explain how to submit such requests to Elevate Health & Wellness. [Placeholder — Final legal copy pending counsel review]",
        ],
      },
      {
        id: "contact-our-privacy-team",
        title: "Contact Our Privacy Team",
        body: [
          "For privacy-related questions or to exercise your rights, please contact our Privacy Team. Contact details and response timeframes will be confirmed in the final policy version. [Placeholder — Final legal copy pending counsel review]",
        ],
      },
    ],
  },

  contact: {
    heading: "Questions About This Policy?",
    body: "Our Privacy Team is here to help with any questions or to assist with privacy rights requests.",
    card: {
      icon: "Mail",
      title: "Privacy Team",
      email: "privacy@elevatehealth.com (placeholder)",
      note: "Typical response within 5 business days",
    },
  },
};
