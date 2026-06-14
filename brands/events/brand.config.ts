import type { BrandConfig } from "@/lib/brand/types";

export const eventsConfig: BrandConfig = {
  id: "events",
  name: "Events & Media",
  shortName: "Events & Media",
  tagline: "Plan, capture, and produce unforgettable events.",
  contactEmail: "hello@example.com",
  contactPhone: "+1 (555) 010-0300",
  locale: "en-US",
  currency: "USD",
  nav: [
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "Become a pro", href: "/pros/apply" },
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
  serviceCategories: ["events", "photography", "av"],
  organization: {
    legalName: "Events & Media LLC (Sample)",
    sameAs: [],
    contactType: "customer support",
  },
};
