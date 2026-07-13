import type { ContactPageConfig } from "@/lib/contact/page";

/**
 * "Contact" page content for the Elevate brand (bespoke redesign layout).
 * Photography is served from local /assets/contact/* (mirrors the other
 * migrated pages) — swap for final designer art in place. Email addresses,
 * phone, and hours are draft / demonstration placeholders — do not present as
 * real contact channels.
 */
export const elevateContact: ContactPageConfig = {
  hero: {
    eyebrow: "We answer personally",
    title: "Talk.",
    titleAccent: "To us.",
    sub: "No ticket numbers, no bots. Coordinators read every message and reply within one business day — usually much faster.",
    image: "/assets/contact/hero-bg.jpg",
  },

  methodsHeading: "Contact us",
  methods: [
    {
      icon: "CalendarCheck",
      title: "Bookings & scheduling",
      body: "Changes, special requests, same-day availability.",
      linkLabel: "book@elevatewellness.com",
      href: "mailto:book@elevatewellness.com",
    },
    {
      icon: "ChatCircleDots",
      title: "General questions",
      body: "Anything else — we'll route you to the right human.",
      linkLabel: "hello@elevatewellness.com",
      href: "mailto:hello@elevatewellness.com",
    },
    {
      icon: "Briefcase",
      title: "For professionals",
      body: "Applications, onboarding, partner questions.",
      linkLabel: "pros@elevatewellness.com",
      href: "mailto:pros@elevatewellness.com",
    },
    {
      icon: "Buildings",
      title: "Corporate wellness",
      body: "Programs for teams of 5 to 500.",
      linkLabel: "corporate@elevatewellness.com",
      href: "mailto:corporate@elevatewellness.com",
    },
    {
      icon: "Phone",
      title: "Prefer to call?",
      body: "Mon–Sat, 8am–9pm ET.",
      linkLabel: "(919) 555-0142",
      href: "tel:+19195550142",
    },
  ],

  form: {
    heading: "Send us a message",
    intro:
      "Fill this in and it opens ready-to-send in your email app, addressed to the right team.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    topicLabel: "Topic",
    topics: [
      { id: "hello", label: "General question", email: "hello@elevatewellness.com" },
      { id: "book", label: "Booking help", email: "book@elevatewellness.com" },
      { id: "pros", label: "Becoming a professional", email: "pros@elevatewellness.com" },
      {
        id: "corporate",
        label: "Corporate wellness",
        email: "corporate@elevatewellness.com",
      },
    ],
    messageLabel: "Message",
    messagePlaceholder: "How can we help?",
    emptyMessageError: "Write a short message first.",
    submitLabel: "Open in your email app",
    note: "We reply within one business day — usually within the hour.",
    subject: "Website enquiry",
  },

  band: {
    eyebrow: "Raleigh, NC",
    title: "Local, and",
    titleAccent: "reachable.",
    body: "Elevate is coordinated from Raleigh and serves every corner of Wake County — travel always included.",
    chips: [
      { value: "Mon–Sat", label: "8am – 9pm ET" },
      { value: "12", label: "Areas Served" },
      { value: "<1 day", label: "Reply Time" },
    ],
  },
};
