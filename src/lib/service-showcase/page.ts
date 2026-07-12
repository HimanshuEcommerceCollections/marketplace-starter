import type { NavItem, FaqItem } from "@/lib/brand/types";

/**
 * Shared, data-driven configuration for the bespoke full-bleed service
 * showcase pages (Beauty, Nutrition Coaching, …) — the same approved mock the
 * Massage page follows: hero → about split → specialties dark band → price
 * chips → before/during/after dark band → FAQ → CTA. One component set
 * (components/service-showcase) and one stylesheet (styles/service-showcase.css)
 * render every service; per-service editorial copy lives in
 * brands/<slug>/<service>.config.ts and the band photography is selected by
 * the page's `slug` variant class (ssp--<slug>) in the stylesheet.
 *
 * Operational booking data (focus cards, add-ons, price tiers) is NEVER
 * authored here — the route resolves it live from the service config API
 * (database is the single source of truth); `booking` only names which config
 * groups feed which section.
 */

export interface ShowcaseHero {
  eyebrow?: string;
  /** First title line (e.g. "Beauty."). */
  title: string;
  /** Accent line rendered in the highlight color on its own line. */
  titleAccent?: string;
  sub?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

export interface ShowcaseAboutSection {
  /** Small ruled kicker above the heading (e.g. "About this service"). */
  kicker?: string;
  heading: string;
  /** Body copy — one <p> per entry. */
  paragraphs: string[];
  /** Check-list bullets rendered with a CheckCircle glyph. */
  points: string[];
  /** Content photo (public path + alt), rendered with next/image. */
  image: { src: string; alt: string };
}

export interface ShowcaseSpecialtiesSection {
  eyebrow?: string;
  heading: string;
  sub?: string;
  /** Editorial heading for the optional add-ons sub-group (options come from the API). */
  addOnsHeading?: string;
  /**
   * Static fallback focus cards, used ONLY when the live focus group resolves no
   * ACTIVE options (e.g. a coming-soon service with no booking config yet).
   * Mirrors the Yoga page: live data always wins; this backfills editorial pages.
   */
  items?: ShowcaseSpecialty[];
}

/**
 * A focus card — resolved at request time from the service's focus config
 * group in the API (label + description). Not authored in config: the
 * database is the single source of truth for booking options.
 */
export interface ShowcaseSpecialty {
  title: string;
  body: string;
}

/**
 * An add-on card — resolved from the add-ons config group (label +
 * description). The surcharge is intentionally not surfaced on the marketing
 * page; it applies in the booking flow.
 */
export interface ShowcaseAddOn {
  title: string;
  body: string;
}

export interface ShowcasePricingSection {
  eyebrow?: string;
  heading: string;
  note?: string;
  cta: NavItem;
  /**
   * Static fallback price chips, used ONLY when the live duration group resolves
   * no ACTIVE options (coming-soon services). Live data always wins.
   */
  chips?: ShowcasePriceChip[];
}

/**
 * A price tier — resolved from the duration config group: the service base
 * price (priceAmount) plus each duration option's priceModifier, formatted.
 */
export interface ShowcasePriceChip {
  /** e.g. "60 min". */
  duration: string;
  /** Whole-dollar all-in label, e.g. "$75". */
  price: string;
}

export interface ShowcaseExpectStep {
  /** Ordinal label rendered in the numbered chip (e.g. "01"). */
  num: string;
  title: string;
  body: string;
}

export interface ShowcaseExpectSection {
  eyebrow?: string;
  heading: string;
  items: ShowcaseExpectStep[];
}

export interface ShowcaseFaqSection {
  eyebrow?: string;
  heading: string;
  items: FaqItem[];
}

export interface ShowcaseCtaBand {
  eyebrow?: string;
  /** First title line; the accent renders on its own line in the highlight color. */
  title: string;
  titleAccent?: string;
  body?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

/**
 * Names the service config groups (by key) that feed each API-driven section.
 * This is declarative wiring, not a mapping layer: the page renders whatever
 * ACTIVE options those groups contain.
 */
export interface ShowcaseBookingSource {
  /** Group whose options become the "Choose your focus" cards. */
  focusGroupKey: string;
  /** Group whose options become the all-in price chips (base + modifier). */
  durationGroupKey: string;
  /** Optional group rendered as the add-ons sub-grid (e.g. massage). */
  addOnsGroupKey?: string;
}

export interface ShowcasePageConfig {
  /** Service slug — API lookup, analytics id, route + variant class (ssp--<slug>). */
  slug: string;
  /** Human name used for metadata and JSON-LD (e.g. "In-Home Beauty"). */
  displayName: string;
  booking: ShowcaseBookingSource;
  hero: ShowcaseHero;
  about: ShowcaseAboutSection;
  specialties: ShowcaseSpecialtiesSection;
  pricing: ShowcasePricingSection;
  expect: ShowcaseExpectSection;
  faq: ShowcaseFaqSection;
  cta: ShowcaseCtaBand;
}

/**
 * Booking options resolved from the live service config API (database is the
 * single source of truth for bookable services). The route fetches these and
 * passes them into the page. For coming-soon services with no live config, the
 * loader backfills from the page config's static `specialties.items` /
 * `pricing.chips` (Yoga-style editorial fallback) so the bands still render.
 */
export interface ShowcaseBookingData {
  /** "Choose your focus" cards — the focus group's ACTIVE options. */
  specialties: ShowcaseSpecialty[];
  /** Add-on cards (empty when the service declares no add-ons group). */
  addOns: ShowcaseAddOn[];
  /** "Simple, all-in prices" tiers — the duration group's ACTIVE options. */
  priceChips: ShowcasePriceChip[];
}
