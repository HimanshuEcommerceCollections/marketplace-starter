import type { BrandConfig } from "@/lib/brand/types";

export const elevateConfig: BrandConfig = {
  id: "elevate",
  name: "Elevate Health & Wellness",
  shortName: "Elevate",
  logoSublabel: "Health & Wellness",
  tagline: "Personalized wellness, training, and recovery.",
  contactEmail: "hello@example.com",
  contactPhone: "+1 (555) 010-0100",
  serviceArea: "Raleigh, NC",
  bookingPrefix: "ELV",
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
      heading: "Services",
      links: [
        { label: "Massage", href: "/services/massage" },
        { label: "Personal Training", href: "/services/personal-training" },
        { label: "Yoga", href: "/services/yoga" },
        { label: "Beauty", href: "/services/beauty" },
        { label: "Nutrition Coaching", href: "/services/nutrition-coaching" },
        { label: "Life Coaching", href: "/services/life-coaching" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About Us", href: "/#about" },
        { label: "How It Works", href: "/#how-it-works" },
        { label: "Corporate Wellness", href: "/#corporate" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      heading: "Professionals",
      links: [
        { label: "Become a Pro", href: "/pros/apply" },
        { label: "Partner with Elevate", href: "/pros/apply" },
        { label: "Pro Resources", href: "#" },
        { label: "Pro Login", href: "#" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Accessibility", href: "#" },
      ],
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
