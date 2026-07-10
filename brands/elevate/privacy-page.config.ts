import type { PrivacyPageConfig } from "@/lib/privacy/page";

/**
 * "Privacy Policy" page content for Elevate (redesigned bespoke layout). All
 * copy is draft / demonstration content — no real legal language, dates, or
 * contact details; final copy is pending counsel review. Photography currently
 * hotlinks Unsplash like the homepage (see next.config.ts remotePatterns).
 */
export const elevatePrivacyPage: PrivacyPageConfig = {
  hero: {
    eyebrow: "Legal · Effective July 1, 2026",
    title: "Privacy.",
    titleAccent: "Respected.",
    sub: "What we collect, why we collect it, and the promises we make about it — in plain English.",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1600&q=80",
  },

  body: {
    tocHeading: "On this page",
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: [
          'Elevate Health & Wellness LLC ("Elevate," "we," "us") coordinates in-home wellness services across Wake County, North Carolina. This policy explains what information we collect when you use elevatewellness.com and our booking services, how we use it, and the choices you have.',
          "The short version: we collect what we need to coordinate great sessions, we never sell your data, and health-related details you share go only to the professional serving you.",
        ],
      },
      {
        id: "collect",
        title: "Information we collect",
        body: ["We collect information in three ways:"],
        bullets: [
          {
            lead: "You provide it",
            text: " — name, email, phone, service address, booking preferences, and any notes you add for your professional (for example, injury history for a trainer or evaluation details for physical or speech therapy).",
          },
          {
            lead: "Automatically",
            text: " — device type, browser, pages visited, and approximate location, collected through cookies and similar technologies.",
          },
          {
            lead: "From payments",
            text: " — our payment processor handles your card details. Elevate never stores full card numbers on its systems.",
          },
        ],
        callout: {
          label: "Health-related information is sensitive.",
          body: "Anything you share about your health is used solely to match you with the right professional and prepare your session — never for marketing, and never shared beyond your care.",
        },
      },
      {
        id: "use",
        title: "How we use it",
        body: ["We use your information to:"],
        bullets: [
          { text: "Match you with professionals and coordinate, confirm, and deliver sessions" },
          { text: "Process payments and send booking confirmations and reminders" },
          { text: "Respond when you contact us and make things right when they go wrong" },
          {
            text: "Improve the service — understanding which pages and features help people book",
          },
          {
            text: "Send occasional service updates; marketing emails are optional and every one includes unsubscribe",
          },
        ],
      },
      {
        id: "share",
        title: "How we share it",
        body: ["We share personal information only with:"],
        bullets: [
          {
            lead: "Your professional",
            text: " — name, service address, session details, and the notes you chose to share, delivered shortly before your session",
          },
          {
            lead: "Service providers",
            text: " — payment processing, email delivery, and analytics vendors bound by contract to use data only on our behalf",
          },
          {
            lead: "Legal authorities",
            text: " — when the law genuinely requires it",
          },
        ],
        footer: [
          "We do not sell personal information. We do not share it with advertisers.",
        ],
      },
      {
        id: "cookies",
        title: "Cookies",
        body: [
          "We use two kinds of cookies: essential (keeping the site working — these can't be switched off) and analytics (understanding how the site is used, in aggregate). We don't use advertising or cross-site tracking cookies.",
          "You can clear or block cookies in your browser settings; the site will still work, though a few conveniences (like remembering your service area) won't.",
        ],
      },
      {
        id: "retention",
        title: "Data retention",
        body: [
          "We keep account and booking records while your account is active and for up to 7 years afterward where tax, insurance, or legal obligations require it. Session notes shared with professionals are retained per the professional's own licensing requirements. You can request deletion at any time — see Your Rights below.",
        ],
      },
      {
        id: "rights",
        title: "Your rights",
        body: ["Wherever you live, we extend the same rights to everyone:"],
        bullets: [
          { lead: "Access", text: " — ask for a copy of the personal information we hold about you" },
          { lead: "Correction", text: " — fix anything that's wrong" },
          {
            lead: "Deletion",
            text: " — ask us to delete your information, subject to legal retention duties",
          },
          { lead: "Opt out", text: " — stop marketing emails with one click, any time" },
        ],
        footer: [
          "Email privacy@elevatewellness.com and we'll respond within 30 days.",
        ],
      },
      {
        id: "minors",
        title: "Children & minors",
        body: [
          "Elevate accounts are for adults 18 and over. Some services — like speech therapy — may be booked by a parent or legal guardian for a minor. In those cases the guardian holds the account, provides all information, and must be present in the home during sessions. We never knowingly collect information directly from children.",
        ],
      },
      {
        id: "security",
        title: "Security",
        body: [
          "We protect your information with encryption in transit, access controls that limit data to the coordinators who need it, and vetted third-party processors. No system is perfect; if a breach ever affects your data, we'll notify you promptly and tell you exactly what happened.",
        ],
      },
      {
        id: "changes",
        title: "Changes to this policy",
        body: [
          "If we make meaningful changes, we'll update the date at the top and, for significant ones, email you before they take effect. Continued use of Elevate after changes means you accept the updated policy.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        body: [
          "Questions about privacy? Reach our team directly at privacy@elevatewellness.com or (919) 555-0142, Mon–Sat 8am–9pm ET.",
        ],
      },
    ],
  },

  cta: {
    eyebrow: "Still curious?",
    title: "Questions about",
    titleAccent: "your data?",
    body: "A coordinator — not a form letter — will answer within one business day.",
    primaryCta: { label: "Contact us", href: "/contact" },
    secondaryCta: { label: "Read our Terms", href: "/terms" },
    chips: ["privacy@elevatewellness.com", "No data selling, ever", "Delete on request"],
  },
};
