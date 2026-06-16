import type {
  NavItem,
  HowItWorksStep,
  FeatureItem,
  FaqItem,
  TestimonialItem,
} from "@/lib/brand/types";

/** Background treatment for a section, enabling alternating bands. */
export type Surface = "default" | "muted";

/**
 * A single group of options in the "Configure your session" preview
 * (e.g. Duration, Focus, Location). Pure data — no UI.
 */
export interface ConfiguratorGroup {
  id: string;
  label: string;
  /** Optional lucide icon name shown beside the group label. */
  icon?: string;
  /** "single" = radio-style; "multi" = toggle multiple (interactive variant). */
  type: "single" | "multi";
  options: {
    id: string;
    label: string;
    /** Optional secondary note, e.g. "+$20" (illustrative). */
    note?: string;
  }[];
  /** Pre-selected option for "single" groups (interactive variant). */
  defaultOptionId?: string;
}

/* ── Section types ──────────────────────────────────────────────────────────
 * The page is an ORDERED list of these. Each renders a reusable component, so
 * any service can mix, reorder, and reuse sections without bespoke page code.
 */

interface BaseSection {
  surface?: Surface;
}

/** Icon + title + description cards. "centered" = round icon, centered text
 *  (trust/safety); "stacked" = square icon, left-aligned (benefits). */
export interface CardsSection extends BaseSection {
  type: "cards";
  variant?: "centered" | "stacked";
  heading?: string;
  subheading?: string;
  columns?: 2 | 3 | 4;
  items: FeatureItem[];
}

/** Numbered process cards (01, 02, …) in a grid. */
export interface ProcessCardsSection extends BaseSection {
  type: "processCards";
  heading?: string;
  subheading?: string;
  columns?: 2 | 3 | 4;
  steps: HowItWorksStep[];
}

/** Connected, numbered timeline with descriptions (horizontal on desktop). */
export interface TimelineSection extends BaseSection {
  type: "timeline";
  heading?: string;
  subheading?: string;
  steps: HowItWorksStep[];
}

/** Compact inline stepper — small numbered chips with labels only. */
export interface StepperSection extends BaseSection {
  type: "stepper";
  heading?: string;
  subheading?: string;
  steps: string[];
  /** Zero-based index of the step to highlight (optional). */
  activeIndex?: number;
}

/** "Configure your session" preview. "interactive" = togglable pills + CTA;
 *  "preview" = static option lists (configured later in booking). */
export interface ConfiguratorSection extends BaseSection {
  type: "configurator";
  variant?: "interactive" | "preview";
  heading?: string;
  subheading?: string;
  cta?: NavItem;
  groups: ConfiguratorGroup[];
}

/** Testimonials. Omit `items` to fall back to the brand's shared set. */
export interface TestimonialsSection extends BaseSection {
  type: "testimonials";
  heading?: string;
  subheading?: string;
  items?: TestimonialItem[];
}

/** FAQ. With `items` → accordion; without → just the "view all" link. */
export interface FaqSectionConfig extends BaseSection {
  type: "faq";
  heading?: string;
  items?: FaqItem[];
  viewAll?: NavItem;
}

/** Final CTA banner (brand surface). */
export interface CtaSection extends BaseSection {
  type: "cta";
  eyebrow?: string;
  title: string;
  body?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

export type ServiceSection =
  | CardsSection
  | ProcessCardsSection
  | TimelineSection
  | StepperSection
  | ConfiguratorSection
  | TestimonialsSection
  | FaqSectionConfig
  | CtaSection;

/** Hero is always first and is special (it receives the derived price). */
export interface ServiceHeroConfig {
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
    /** Render a brand gradient behind the placeholder caption. */
    gradient?: boolean;
  };
}

/**
 * Data-driven configuration for a service landing page. Adding a new service
 * page = add one of these to the brand's registry. No page/component code.
 *
 * NOTE: the starting price is NOT stored here — it is derived from the brand's
 * `pricing.v1.json` via the pricing engine (single source of truth), keyed by
 * `slug`.
 */
export interface ServiceLandingConfig {
  /** MUST equal a catalog `service.id` / `pricing.services` key. */
  slug: string;
  hero: ServiceHeroConfig;
  sections: ServiceSection[];
}

/** A brand's service-landing registry, keyed by service slug. */
export type ServiceLandingRegistry = Record<string, ServiceLandingConfig>;
