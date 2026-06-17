import type {
  NavItem,
  FeatureItem,
  HowItWorksStep,
  FaqItem,
  TestimonialItem,
} from "@/lib/brand/types";

/** A named price band, amount in minor units (e.g. 13500 = $135). */
export interface PricingTier {
  label: string;
  amount: number;
}

/** Per-service pricing extras layered on top of the catalog/engine base price. */
export interface ServicePricingExtra {
  /** e.g. "$75 Min." badge for Beauty. */
  minimumBadge?: string;
  /** e.g. "Minimum booking value of $75 required." */
  minimumNote?: string;
  /** Coordinator-reviewed services (PT/Speech) show FROM bands instead of a live price. */
  comingSoon?: {
    tiers: PricingTier[];
    note: string;
    description: string;
    interest: NavItem;
  };
}

/** Data-driven configuration for the "Simple, Transparent Pricing" page. */
export interface PricingPageConfig {
  hero: {
    variant?: "dark" | "light";
    eyebrow?: string;
    title: string;
    subtitle?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
    image?: {
      src?: string;
      alt?: string;
      caption?: { title: string; lines: string[] };
      gradient?: boolean;
    };
  };
  servicePricing: {
    heading: string;
    subheading?: string;
    footnote?: string;
    /** Keyed by service slug. */
    extras: Record<string, ServicePricingExtra>;
  };
  whatAffects: { heading: string; subheading?: string; items: FeatureItem[] };
  /** "Why Some Services Show FROM Prices" — coordinator-reviewed services. */
  fromPrices: { heading: string; subheading?: string; slugs: string[] };
  howYouSee: {
    heading: string;
    subheading?: string;
    steps: HowItWorksStep[];
    note?: string;
  };
  faq: { heading: string; items: FaqItem[]; viewAll?: NavItem };
  testimonials: {
    heading?: string;
    subheading?: string;
    items: TestimonialItem[];
  };
  cta: {
    eyebrow?: string;
    title: string;
    body?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
  };
}
