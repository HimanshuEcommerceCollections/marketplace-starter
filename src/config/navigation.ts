import type { NavItem } from "@/lib/brand/types";

/**
 * Shared, data-driven primary navigation. Edit here to change the navbar links
 * for every brand. Labels are structural (not brand copy) and hrefs are app
 * routes, so this stays brand-agnostic and reusable.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Corporate", href: "/corporate" },
  { label: "Become a Pro", href: "/pros/apply" },
  { label: "FAQ", href: "/faq" },
];
