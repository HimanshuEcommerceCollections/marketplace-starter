import type { BrandConfig } from "@/lib/brand/types";

export const educationConfig: BrandConfig = {
  id: "education",
  name: "Education & Creative",
  shortName: "Education & Creative",
  tagline: "Learn new skills and bring creative projects to life.",
  contactEmail: "hello@example.com",
  contactPhone: "+1 (555) 010-0400",
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
  serviceCategories: ["tutoring", "courses", "design"],
  organization: {
    legalName: "Education & Creative LLC (Sample)",
    sameAs: [],
    contactType: "customer support",
  },
};
