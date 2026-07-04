import type {
  NavItem,
  HowItWorksStep,
  FeatureItem,
  FaqItem,
  TestimonialItem,
} from "@/lib/brand/types";

/** Background treatment for a section, enabling alternating bands.
 *  "inverse" = dark/espresso band (e.g. a trust section). */
export type Surface = "default" | "muted" | "inverse";

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
  /** Zero-based index of the step to emphasize (optional). */
  activeIndex?: number;
}

/**
 * Two-column "what happens" detail — an image beside an icon list of phases
 * (e.g. "What Happens During a Session?"). Reusable across services.
 */
export interface SessionStepsSection extends BaseSection {
  type: "sessionSteps";
  heading?: string;
  subheading?: string;
  /** Image/photo placeholder shown beside the list. */
  image?: {
    src?: string;
    alt?: string;
    caption?: { title: string; lines: string[] };
  };
  /** Image side on desktop (default "left"; mobile always stacks image first). */
  imagePosition?: "left" | "right";
  /** The labeled phases — icon + title + description. */
  items: FeatureItem[];
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

/**
 * Highlighted callout band — leading icon/badge, heading, and body, with an
 * optional tag pill (e.g. a minimum-booking notice). Reusable across services.
 */
export interface NoticeSection extends BaseSection {
  type: "notice";
  /** Lucide icon name shown in the leading badge (default "DollarSign"). */
  icon?: string;
  heading: string;
  body: string;
  /** Optional tag pill on the trailing edge, e.g. "Helpful Info". */
  tag?: string;
}

/**
 * A single pricing tier (e.g. "Evaluation Visit"). Prices are draft/illustrative
 * and always rendered with a "Draft" pill.
 */
export interface PricingTier {
  /** Small badge above the name, e.g. "Initial Visit" / "Ongoing Care". */
  badge?: string;
  name: string;
  /** Display price in minor units (e.g. 16500 = $165). Shown as "From $165". */
  price: { amount: number; currency: string };
  /** e.g. "60–90 minutes". */
  duration?: string;
  /** "What's included" checklist. */
  included: string[];
  /** Muted footnote under the checklist, e.g. "Evaluation required first." */
  footnote?: string;
  /** Per-card CTA — for coming-soon services this points at the interest list. */
  cta?: NavItem;
  /** Emphasize this tier with the dark (inverse) treatment. */
  featured?: boolean;
}

/**
 * "Session Pricing" — two or more side-by-side tier cards. Built for coming-soon
 * services: prices are draft, each card CTA joins the interest list. Reusable.
 */
export interface PricingTiersSection extends BaseSection {
  type: "pricingTiers";
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  /** Caution band above the cards, e.g. "DRAFT PRICING — Do not use…". */
  draftNote?: string;
  tiers: PricingTier[];
}

/** A short value-prop line (icon + text) shown beside the interest-list form. */
export interface InterestListBullet {
  icon?: string;
  text: string;
}

/**
 * Interest-list capture — two-column band (copy + bullets beside a stub form).
 * For coming-soon services in place of a booking flow. The form is stub-only and
 * emits the `waitlist_submit` analytics event.
 */
export interface InterestListSection extends BaseSection {
  type: "interestList";
  eyebrow?: string;
  heading: string;
  subheading?: string;
  /** Service slug recorded with the waitlist submission. */
  serviceId?: string;
  bullets?: InterestListBullet[];
  /** Footnote under the form, e.g. a consent line. */
  footnote?: string;
  /** Submit button label (default "Join the Interest List"). */
  submitLabel?: string;
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

/**
 * A single selector group in a coming-soon configurator preview.
 * "radio" renders togglable pills; "dropdown" renders a native select.
 */
export interface ComingSoonConfigGroup {
  id: string;
  label: string;
  /** Optional lucide icon name shown beside the group label. */
  icon?: string;
  /** Presentation: "radio" (default) = pills; "dropdown" = native select. */
  control?: "radio" | "dropdown";
  options: { id: string; label: string }[];
}

/**
 * Coming-soon configurator — an illustrative, NON-submitting "plan your visit"
 * preview for services without a live booking flow (e.g. Physical/Speech
 * Therapy). Renders selector groups + an optional notes field, and an "OR"
 * summary of draft visit-type tiers. No price is computed live; a coordinator
 * confirms final pricing. Reusable across coming-soon services.
 */
export interface ComingSoonConfiguratorSection extends BaseSection {
  type: "comingSoonConfigurator";
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  groups: ComingSoonConfigGroup[];
  /** Optional free-text notes field (illustrative — never submitted). */
  notes?: { label: string; placeholder?: string };
  /** Draft visit-type tiers shown side-by-side with "OR" in the summary. */
  tiers: { id: string; name: string; price: { amount: number; currency: string } }[];
  /** Footnote under the summary, e.g. "Coordinator will confirm final pricing." */
  footnote?: string;
}

export type ServiceSection =
  | CardsSection
  | ProcessCardsSection
  | TimelineSection
  | SessionStepsSection
  | StepperSection
  | ConfiguratorSection
  | TestimonialsSection
  | NoticeSection
  | PricingTiersSection
  | InterestListSection
  | ComingSoonConfiguratorSection
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
