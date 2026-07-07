import type { NavItem, FaqItem } from "@/lib/brand/types";

/**
 * Per-service display extras layered on top of the catalog for the pricing grid.
 * Base data (title, icon, slug, coming-soon, from-price) comes from services.json;
 * these are the marketing-authored highlights the mock shows on each card.
 * Keyed by service slug.
 */
export interface PricingServiceExtra {
  /** Optional short display title (e.g. "Nutrition" for nutrition-coaching). */
  title?: string;
  /** e.g. "60 or 90 min sessions" or "$75 booking minimum" or "Evaluation first". */
  duration: string;
  /** Three short configurable-highlight bullets. */
  points: string[];
  /** Coordinator-confirmed quote pill (PT / Speech). */
  coordinator?: boolean;
  /**
   * Optional "starting from" display amount in minor units. Overrides the
   * catalog `from_price` for display only (never used for booking math).
   */
  priceMinor?: number;
}

/** A "What shapes your price" factor tile. */
export interface PricingFactor {
  icon: string;
  title: string;
  text: string;
}

/** A session-pack tier. Static, illustrative content — no purchase backend yet. */
export interface PricingPackTier {
  slug: string;
  name: string;
  tagline: string;
  /** Per-cycle price in minor units. */
  priceMinor: number;
  /** Cadence suffix rendered next to the price, e.g. "/mo". */
  cadence: string;
  /** e.g. "4 session credits per month". */
  per: string;
  /** e.g. "Save $40 every month". */
  save?: string;
  features: string[];
  cta: NavItem;
  /** "Most Popular" highlight card. */
  featured?: boolean;
}

/** A price/booking guarantee tile in the dark strip. */
export interface PricingGuarantee {
  icon: string;
  title: string;
  body: string;
}

/** Data-driven configuration for the redesigned "Pricing" page. */
export interface PricingPageConfig {
  hero: {
    eyebrow?: string;
    title: string;
    titleAccent?: string;
    sub?: string;
  };
  services: {
    eyebrow?: string;
    heading: string;
    subheading?: string;
    /** Display extras keyed by service slug. */
    extras: Record<string, PricingServiceExtra>;
    /** Card CTA label for bookable services. */
    ctaActive: string;
    /** Card CTA label for coming-soon services (routes to the waitlist). */
    ctaComingSoon: string;
    factors: { title: string; items: PricingFactor[] };
  };
  packs: {
    eyebrow?: string;
    heading: string;
    subheading?: string;
    tiers: PricingPackTier[];
    /** Illustrative / INTERNAL DRAFT disclaimer under the grid. */
    note?: string;
  };
  guarantees: PricingGuarantee[];
  faq: {
    eyebrow?: string;
    heading: string;
    items: FaqItem[];
  };
  cta: {
    eyebrow?: string;
    title: string;
    titleAccent?: string;
    body?: string;
    primaryCta: NavItem;
  };
}
