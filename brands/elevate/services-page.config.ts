import type { ServicesPageConfig } from "@/lib/services/page";

/** Standalone "Services" page content for the Elevate brand. */
export const elevateServicesPage: ServicesPageConfig = {
  heading: "Browse all wellness services",
  subheading:
    "Eight specialties. One trusted marketplace. All independent professionals.",
  draftNote: "DRAFT PRICING — FOR DEMONSTRATION PURPOSES ONLY",

  hero: {
    eyebrow: "8 Disciplines · Raleigh & Wake County",
    title: "Wellness.",
    titleAccent: "Delivered.",
    sub: "Every service, every professional — booked in one place with transparent pricing and a real coordinator confirming within the hour.",
  },

  trustStrip: {
    heading: "Every professional is independently vetted",
    pills: [
      { icon: "ShieldCheck", label: "Background Checked" },
      { icon: "Certificate", label: "Certified & Licensed" },
      { icon: "Star", label: "Rated & Reviewed" },
      { icon: "Lock", label: "Insured & Bonded" },
      { icon: "Clock", label: "Confirmed in 1 Hour" },
      { icon: "CurrencyDollar", label: "Transparent Pricing" },
    ],
  },

  stepsSection: {
    eyebrow: "Simple by design",
    heading: "Book in four steps",
    sub: "No negotiations. No back-and-forth. Just wellness, delivered.",
    steps: [
      {
        title: "Pick your service",
        body: "Choose from 8 disciplines. Select duration and any add-ons.",
      },
      {
        title: "Set your details",
        body: "Choose your date, time, and location. We serve all of Wake County.",
      },
      {
        title: "Coordinator confirms",
        body: "A real human coordinator matches you and confirms within one hour.",
      },
      {
        title: "Enjoy your session",
        body: "Your pro arrives on time. You relax. It's that simple.",
      },
    ],
  },

  ctaBand: {
    eyebrow: "Ready?",
    title: "Book your first",
    titleLine2: "session",
    titleAccent: "today.",
    body: "Vetted professionals. Transparent pricing. Delivered across Wake County.",
    primaryCta: { label: "Book a session", href: "/book" },
    secondaryCta: { label: "View pricing", href: "/pricing" },
  },
};
