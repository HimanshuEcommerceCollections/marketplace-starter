import type {
  NavItem,
  FeatureItem,
  OfferingItem,
  HowItWorksStep,
  FaqItem,
  TestimonialItem,
} from "@/lib/brand/types";

/**
 * Data-driven configuration for the "Corporate Wellness" page (the destination
 * of the Corporate navbar link). Brand-specific copy lives in
 * brands/<slug>/corporate.config.ts; the page is a thin composition of the
 * shared section components plus the stub corporate-quote form.
 */
export interface CorporatePageConfig {
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
  /** "Corporate Wellness Offerings" — cards with badges + inquiry links. */
  offerings: {
    heading: string;
    subheading?: string;
    items: OfferingItem[];
    note?: string;
  };
  whoItsFor: { heading: string; subheading?: string; items: FeatureItem[] };
  process: {
    heading: string;
    subheading?: string;
    steps: HowItWorksStep[];
    note?: string;
  };
  whyWorkWith: { heading: string; subheading?: string; items: FeatureItem[] };
  /** "Request a Corporate Quote" — form section copy + Event Type options. */
  quote: { heading: string; subheading?: string; eventTypes: string[] };
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
