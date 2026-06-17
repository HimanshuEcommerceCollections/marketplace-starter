import type { NavItem, FaqItem } from "@/lib/brand/types";

/** A titled group of FAQ entries with an icon, used by the FAQ explorer. */
export interface FaqCategory {
  /** Stable slug used for anchor links and search filtering, e.g. "booking". */
  id: string;
  /** Lucide icon name (see src/lib/icons.tsx). */
  icon?: string;
  /** Short label for the category nav card and section pill, e.g. "Booking". */
  label: string;
  /** Section heading, e.g. "Booking Questions". */
  heading: string;
  items: FaqItem[];
}

/** A single availability line in the coordinator support card. */
export interface FaqSupportPoint {
  icon?: string;
  label: string;
}

/**
 * Data-driven configuration for the dedicated "/faq" page. Brand-specific copy
 * lives in brands/<slug>/faq-page.config.ts; the page is a thin composition of
 * the shared sections (PageHero), the FaqExplorer (search + category nav +
 * accordions), and the FaqContactSection.
 */
export interface FaqPageConfig {
  hero: {
    variant?: "brand" | "dark" | "light";
    eyebrow?: string;
    title: string;
    subtitle?: string;
    primaryCta?: NavItem;
    secondaryCta?: NavItem;
  };
  search: {
    placeholder: string;
    clearLabel: string;
    /** Heading above the category jump cards. */
    categoryNavLabel: string;
    /** Shown when a query matches no questions. */
    noResults: string;
  };
  categories: FaqCategory[];
  /** "Still Have Questions?" support section. */
  contact: {
    heading: string;
    body?: string;
    note?: string;
    primaryCta?: NavItem;
    secondaryCta?: NavItem;
    card: {
      icon?: string;
      title: string;
      description?: string;
      availability: FaqSupportPoint[];
    };
  };
}
