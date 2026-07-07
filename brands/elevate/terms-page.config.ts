import type { TermsPageConfig } from "@/lib/terms/page";

/**
 * "Terms of Service" page content for the Elevate brand — the redesigned,
 * plain-English document (hero → sticky-TOC sections → dark CTA band). Uses the
 * dedicated {@link TermsPageConfig}; email/phone references become mailto:/tel:
 * links at render time.
 */
export const elevateTermsPage: TermsPageConfig = {
  hero: {
    eyebrow: "Legal · Effective July 1, 2026",
    title: "Terms.",
    titleAccent: "In plain English.",
    sub: "The agreement behind every booking — written to be read, not skimmed past.",
  },

  body: {
    tocHeading: "On this page",
    sections: [
      {
        id: "acceptance",
        title: "Acceptance of these terms",
        body: [
          "These Terms of Service are an agreement between you and Elevate Health & Wellness LLC. By creating an account, requesting a booking, or using elevatewellness.com, you accept them. If you don't agree, please don't use the service.",
        ],
      },
      {
        id: "service",
        title: "What Elevate is",
        body: [
          "Elevate is a coordination platform: we match you with independent, vetted wellness professionals who deliver sessions in your home or chosen location across Wake County, NC. Our coordinators review every booking, verify every professional, and stand behind every session.",
        ],
      },
      {
        id: "eligibility",
        title: "Eligibility & accounts",
        body: [
          "You must be 18 or older to hold an account and book sessions. Sessions for minors — such as pediatric speech therapy — must be booked by a parent or legal guardian who remains present throughout. You're responsible for keeping your account details accurate and your login private.",
        ],
      },
      {
        id: "booking",
        title: "Bookings & payment",
        body: [
          "Prices shown are all-in: professional time, travel within Wake County, equipment, and gratuity. You configure your session — service, duration, add-ons — and see your exact price before confirming.",
        ],
        bullets: [
          {
            text: "A booking is a request until a coordinator confirms it, typically within one business hour",
          },
          { text: "Your card is charged only at confirmation" },
          {
            text: "Physical and speech therapy begin with an evaluation; final quotes are confirmed by your coordinator before any charge",
          },
        ],
      },
      {
        id: "cancellation",
        title: "Cancellations & rescheduling",
        body: [
          "Plans change — here's how we handle it fairly for you and your professional:",
        ],
        bullets: [
          {
            lead: "4+ hours before",
            text: " your session: cancel or reschedule free, unlimited",
          },
          {
            lead: "Inside 4 hours",
            text: ": a 50% fee applies, paid to your professional for their committed time",
          },
          {
            lead: "Professional no-show or our error",
            text: ": full refund plus a credit, no questions",
          },
        ],
      },
      {
        id: "responsibilities",
        title: "Your responsibilities",
        body: [
          "You agree to provide a safe, lawful environment for your session: accurate address and access instructions, a reasonably clear space, secured pets if requested, and respectful conduct. Professionals may end a session — with full charge — if they feel unsafe or the environment is materially misrepresented.",
        ],
      },
      {
        id: "professionals",
        title: "Our professionals",
        body: [
          "Professionals on Elevate are independent practitioners, not Elevate employees. Every one passes license/certification verification, background check, insurance review, and an in-person interview before their first session — and must maintain those standards to stay on the platform.",
        ],
      },
      {
        id: "health",
        title: "Health disclaimer",
        body: [
          "Elevate coordinates wellness services; we don't provide medical advice. Content on this site is informational only.",
        ],
        callout: {
          label: "Licensed care:",
          body: "physical therapy and speech therapy sessions are delivered by independent North Carolina-licensed providers responsible for their own clinical judgment. Always consult your physician before starting new treatment or exercise — and in an emergency, call 911.",
        },
      },
      {
        id: "liability",
        title: "Limitation of liability",
        body: [
          "To the fullest extent permitted by North Carolina law, Elevate's liability for any claim arising from the service is limited to the amount you paid for the session giving rise to the claim. We're not liable for indirect or consequential damages. Nothing in these terms limits liability that can't lawfully be limited.",
        ],
      },
      {
        id: "law",
        title: "Governing law & disputes",
        body: [
          "These terms are governed by the laws of North Carolina. Before any formal dispute, contact us — almost everything is resolved by a coordinator making it right. Unresolved disputes will be handled in the state or federal courts of Wake County, NC.",
        ],
      },
      {
        id: "accessibility",
        title: "Accessibility",
        body: [
          "We want Elevate usable by everyone. The site is built toward WCAG 2.1 AA — semantic structure, keyboard navigation, reduced-motion support, and readable contrast. If anything gets in your way, tell us at hello@elevatewellness.com and we'll fix it or help you book by phone at (919) 555-0142.",
        ],
      },
      {
        id: "changes",
        title: "Changes to these terms",
        body: [
          "We may update these terms as the service evolves. Significant changes are announced by email before taking effect; the date above always reflects the current version. Using Elevate after changes means you accept them.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        body: [
          "Questions about these terms? legal@elevatewellness.com — a human reads it, promise.",
        ],
      },
    ],
  },

  darkBand: {
    title: "Clear terms.",
    titleAccent: "Clearer sessions.",
    body: "Everything else you'd want to know lives in our FAQ — or ask a coordinator directly.",
    primaryCta: { label: "Read the FAQ", href: "/faq" },
    secondaryCta: { label: "Privacy Policy", href: "/privacy" },
    chips: [
      "legal@elevatewellness.com",
      "Free cancellation ≥ 4 hrs",
      "Charged only on confirmation",
    ],
  },
};
