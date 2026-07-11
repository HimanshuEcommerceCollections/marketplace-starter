import type { NavItem, FaqItem } from "@/lib/brand/types";

/**
 * Data-driven configuration for the redesigned "LifeCoaching" service page — a
 * full-bleed, GSAP-animated editorial landing that mirrors the approved mock
 * (hero → about split → specialties dark band → price chips → before/during/
 * after dark band → FAQ → CTA). Brand copy lives in
 * brands/<slug>/life-coaching.config.ts; brand colors flow through the token layer, so
 * the theme still applies. Mirrors the shape/quality of the Massage page config
 * (@/lib/massage/page).
 *
 * Unlike Massage, LifeCoaching's specialties and price tiers are authored statically
 * here (the mock is a fixed editorial page and needs no live booking data). The
 * single hero photo + about photo live in /assets/life-coaching/; the solid dark bands
 * (specialties / experience / CTA) are declared in src/styles/life-coaching.css.
 */

/**
 * A heading with an italic, highlight-colored accent word — mirrors the mock's
 * `Choose your <em>focus</em>` typography. Rendered as
 * `{lead} <em>{accent}</em> {trail}`.
 */
export interface AccentHeading {
  lead: string;
  accent?: string;
  trail?: string;
}

export interface LifeCoachingHero {
  eyebrow?: string;
  /** First title line (e.g. "LifeCoaching."). */
  title: string;
  /** Accent line rendered italic in the highlight color on its own line. */
  titleAccent?: string;
  sub?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

export interface LifeCoachingAboutSection {
  /** Small ruled kicker above the heading (e.g. "About this service"). */
  kicker?: string;
  heading: AccentHeading;
  /** Body copy — one <p> per entry. */
  paragraphs: string[];
  /** Check-list bullets rendered with a CheckCircle glyph. */
  points: string[];
  /** Content photo (public path + alt), rendered with next/image. */
  image: { src: string; alt: string };
}

/** A specialty (focus-area) card — authored statically from the mock. */
export interface LifeCoachingSpecialty {
  title: string;
  body: string;
}

export interface LifeCoachingSpecialtiesSection {
  eyebrow?: string;
  heading: AccentHeading;
  sub?: string;
  items: LifeCoachingSpecialty[];
}

/** A price tier chip, e.g. { duration: "60 min", price: "$89" }. */
export interface LifeCoachingPriceChip {
  duration: string;
  price: string;
}

export interface LifeCoachingPricingSection {
  eyebrow?: string;
  heading: AccentHeading;
  note?: string;
  cta: NavItem;
  chips: LifeCoachingPriceChip[];
}

export interface LifeCoachingExpectStep {
  /** Ordinal label rendered in the numbered chip (e.g. "01"). */
  num: string;
  title: string;
  body: string;
}

export interface LifeCoachingExpectSection {
  eyebrow?: string;
  heading: AccentHeading;
  items: LifeCoachingExpectStep[];
}

export interface LifeCoachingFaqSection {
  eyebrow?: string;
  heading: AccentHeading;
  items: FaqItem[];
}

export interface LifeCoachingCtaBand {
  eyebrow?: string;
  /** First title segment; the accent renders italic in the highlight color. */
  title: string;
  titleAccent?: string;
  body?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

export interface LifeCoachingPageConfig {
  hero: LifeCoachingHero;
  about: LifeCoachingAboutSection;
  specialties: LifeCoachingSpecialtiesSection;
  pricing: LifeCoachingPricingSection;
  expect: LifeCoachingExpectSection;
  faq: LifeCoachingFaqSection;
  cta: LifeCoachingCtaBand;
}

/**
 * Booking options resolved from the live service config API (database is the
 * single source of truth) — mirrors MassageBookingData. The route fetches these
 * and passes them into the landing page, overriding the static config values;
 * when the API is unavailable it falls back to the static config so the page
 * still renders (e.g. during `next build`).
 */
export interface LifeCoachingBookingData {
  /** "Choose your focus" cards — the service's lc-style options. */
  specialties: LifeCoachingSpecialty[];
  /** "Simple, all-in prices" tiers — the service's duration options. */
  priceChips: LifeCoachingPriceChip[];
}
