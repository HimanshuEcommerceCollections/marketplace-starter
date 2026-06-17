import type {
  NavItem,
  FeatureItem,
  FaqItem,
  TestimonialItem,
} from "@/lib/brand/types";

/**
 * Data-driven configuration for the "About" page. Brand-specific copy lives in
 * brands/<slug>/about-page.config.ts; the page is a thin composition of the
 * shared section components (hero, mission, benefits, service grid, service
 * area, testimonials, FAQ, CTA).
 */
export interface AboutPageConfig {
  hero: {
    variant?: "dark" | "light";
    eyebrow?: string;
    title: string;
    subtitle?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
    trustIndicators?: string[];
    image?: {
      src?: string;
      alt?: string;
      caption?: { title: string; lines: string[] };
      gradient?: boolean;
    };
  };
  /** "Why Elevate Exists" — narrative + pull-quote card + value chips. */
  mission: {
    heading: string;
    paragraphs: string[];
    quote: {
      /** Lucide icon name; defaults to a quote glyph. */
      icon?: string;
      text: string;
      body?: string;
      attribution?: string;
    };
    values: { icon?: string; label: string }[];
  };
  /** "What Makes Elevate Different" — benefit cards. */
  difference: { heading: string; subheading?: string; items: FeatureItem[] };
  /** "How Professionals Are Reviewed" — verification cards + callout note. */
  review: {
    heading: string;
    subheading?: string;
    items: FeatureItem[];
    note?: string;
  };
  /** "Our Service Categories" — headings only; cards come from the catalog. */
  serviceCategories: {
    heading: string;
    subheading?: string;
    draftNote?: string;
  };
  /** "Local to Raleigh and Wake County" — image + copy + location chips. */
  serviceArea: {
    heading: string;
    paragraphs: string[];
    mapLabel?: string;
    areas: string[];
    image?: {
      src?: string;
      alt?: string;
      caption?: { title: string; lines: string[] };
    };
  };
  testimonials: {
    heading?: string;
    subheading?: string;
    items: TestimonialItem[];
  };
  faq: { heading: string; items: FaqItem[]; viewAll?: NavItem };
  cta: {
    eyebrow?: string;
    title: string;
    body?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
  };
}
