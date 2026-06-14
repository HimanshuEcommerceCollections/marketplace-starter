import type { BrandConfig } from "@/lib/brand/types";

export const elevateConfig: BrandConfig = {
  id: "elevate",
  name: "Elevate Health & Wellness",
  shortName: "Elevate",
  tagline: "Personalized wellness, training, and recovery.",
  contactEmail: "hello@example.com",
  contactPhone: "+1 (555) 010-0100",
  locale: "en-US",
  currency: "USD",
  nav: [
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "About", href: "/#about" },
    { label: "Corporate", href: "/#corporate" },
    { label: "Become a Pro", href: "/pros/apply" },
    { label: "FAQ", href: "/faq" },
  ],
  footerColumns: [
    {
      heading: "Explore",
      links: [
        { label: "Services", href: "/services" },
        { label: "Pricing", href: "/pricing" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "Become a pro", href: "/pros/apply" },
        { label: "Waitlist", href: "/waitlist" },
      ],
    },
    {
      heading: "Get started",
      links: [{ label: "Book now", href: "/book" }],
    },
  ],
  legalLinks: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
  serviceCategories: ["training", "nutrition", "recovery"],
  organization: {
    legalName: "Elevate Health & Wellness LLC (Sample)",
    sameAs: [],
    contactType: "customer support",
  },
};
