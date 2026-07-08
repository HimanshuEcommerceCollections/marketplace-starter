import type { NavItem, FaqItem } from "@/lib/brand/types";

/**
 * Data-driven configuration for the redesigned "Massage" service page — a
 * full-bleed, GSAP-animated editorial landing that mirrors the approved mock
 * (hero → about split → specialties dark band → price chips → before/during/
 * after dark band → FAQ → CTA). Brand copy lives in
 * brands/<slug>/massage.config.ts; brand colors flow through the token layer,
 * so the theme still applies. Mirrors the shape/quality of the For Pros and
 * How It Works page configs (@/lib/for-pros/page, @/lib/how-it-works/page).
 *
 * All copy, CTA links, prices, specialties, points, and FAQs are declared in
 * config so the sections stay content-agnostic. Full-bleed band background
 * photos are page-fixed and declared in src/styles/massage.css (same approach
 * as how-it-works.css); only the About content photo is passed through here.
 */

export interface MassageHero {
  eyebrow?: string;
  /** First title line (e.g. "Massage."). */
  title: string;
  /** Accent line rendered in the highlight color on its own line (e.g. "At your door."). */
  titleAccent?: string;
  sub?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

export interface MassageAboutSection {
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

export interface MassageSpecialtiesSection {
  eyebrow?: string;
  heading: string;
  sub?: string;
  /** Editorial heading for the add-ons sub-group (options come from the API). */
  addOnsHeading?: string;
}

/**
 * A specialty (session-type) card — resolved at request time from the service's
 * "session-type" config group in the API (label + description). Not authored in
 * config: the database is the single source of truth for booking options.
 */
export interface MassageSpecialty {
  title: string;
  body: string;
}

/**
 * An add-on card — resolved from the "add-ons" config group (label +
 * description). The surcharge is intentionally not surfaced on the marketing
 * page; it applies in the booking flow.
 */
export interface MassageAddOn {
  title: string;
  body: string;
}

export interface MassagePricingSection {
  eyebrow?: string;
  heading: string;
  note?: string;
  cta: NavItem;
}

/**
 * A price tier — resolved from the "duration" config group: the service base
 * price (priceAmount) plus each duration option's priceModifier, formatted.
 */
export interface MassagePriceChip {
  /** e.g. "60 min". */
  duration: string;
  /** Whole-dollar all-in label, e.g. "$200". */
  price: string;
}

export interface MassageExpectStep {
  /** Ordinal label rendered in the numbered chip (e.g. "01"). */
  num: string;
  title: string;
  body: string;
}

export interface MassageExpectSection {
  eyebrow?: string;
  heading: string;
  items: MassageExpectStep[];
}

export interface MassageFaqSection {
  eyebrow?: string;
  heading: string;
  items: FaqItem[];
}

export interface MassageCtaBand {
  eyebrow?: string;
  /** First title line; the accent renders on its own line in the highlight color. */
  title: string;
  titleAccent?: string;
  body?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

export interface MassagePageConfig {
  hero: MassageHero;
  about: MassageAboutSection;
  specialties: MassageSpecialtiesSection;
  pricing: MassagePricingSection;
  expect: MassageExpectSection;
  faq: MassageFaqSection;
  cta: MassageCtaBand;
}

/**
 * Booking options resolved from the live service config API (database is the
 * single source of truth). The route fetches these and passes them into the
 * landing page; there is no static fallback list.
 */
export interface MassageBookingData {
  /** "Choose your focus" cards — the service's session-type options. */
  specialties: MassageSpecialty[];
  /** Add-on options with their surcharge label. */
  addOns: MassageAddOn[];
  /** "Simple, all-in prices" tiers — the service's duration options. */
  priceChips: MassagePriceChip[];
}
