import type { BrandConfig } from "@/lib/brand/types";

export const apexConfig: BrandConfig = {
  id: "apex",
  name: "Apex Total Home Services",
  shortName: "Apex",
  tagline: "Trusted pros for every job around the home.",
  contactEmail: "hello@example.com",
  contactPhone: "+1 (555) 010-0200",
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
  serviceCategories: ["cleaning", "plumbing", "handyman"],
  organization: {
    legalName: "Apex Total Home Services LLC (Sample)",
    sameAs: [],
    contactType: "customer support",
  },
};
