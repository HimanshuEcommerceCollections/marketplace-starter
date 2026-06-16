import type {
  NavItem,
  ProcessCard,
  HowItWorksStep,
  FeatureItem,
  FaqItem,
  TestimonialItem,
} from "@/lib/brand/types";

/**
 * A single group of options in the "Configure your session" preview
 * (e.g. Duration, Session Type, Add-ons). Pure data — no UI.
 */
export interface ConfiguratorGroup {
  id: string;
  label: string;
  /** "single" = radio-style; "multi" = toggle multiple. */
  type: "single" | "multi";
  options: {
    id: string;
    label: string;
    /** Optional secondary note, e.g. "+$20" (illustrative). */
    note?: string;
  }[];
  /** Pre-selected option for "single" groups (defaults to the first). */
  defaultOptionId?: string;
}

/**
 * Data-driven configuration for a service landing page. Adding a new service
 * page = add one of these to the brand's service-landing registry. No new
 * page/component code required.
 *
 * NOTE: the starting price is NOT stored here — it is derived from the brand's
 * `pricing.v1.json` via the pricing engine (single source of truth), keyed by
 * `slug`. Likewise testimonials default to the brand's shared set unless
 * overridden below.
 */
export interface ServiceLandingConfig {
  /** MUST equal a catalog `service.id` / `pricing.services` key. */
  slug: string;

  hero: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
    trustIndicators?: string[];
    /** Optional real image; falls back to the caption placeholder. */
    image?: {
      src?: string;
      alt?: string;
      caption?: { title: string; lines: string[] };
    };
  };

  trust?: {
    heading: string;
    subheading?: string;
    columns?: 3 | 4;
    items: ProcessCard[];
  };

  /** "Step by step" timeline. */
  timeline?: { heading: string; subheading?: string; steps: HowItWorksStep[] };

  /** "Configure your session" option preview. */
  configurator?: {
    heading?: string;
    subheading?: string;
    cta?: NavItem;
    groups: ConfiguratorGroup[];
  };

  benefits?: { heading: string; subheading?: string; items: FeatureItem[] };

  /** Overrides the brand's shared testimonials when present. */
  testimonials?: {
    heading?: string;
    subheading?: string;
    items: TestimonialItem[];
  };

  faq?: { heading: string; items: FaqItem[]; viewAll?: NavItem };

  cta: {
    eyebrow?: string;
    title: string;
    body?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
  };
}

/** A brand's service-landing registry, keyed by service slug. */
export type ServiceLandingRegistry = Record<string, ServiceLandingConfig>;
