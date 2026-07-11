import type { NavItem, FaqItem } from "@/lib/brand/types";

/**
 * Data-driven configuration for the redesigned "Yoga" service page — a
 * full-bleed, GSAP-animated editorial landing that mirrors the approved mock
 * (hero → about split → specialties dark band → price chips → before/during/
 * after dark band → FAQ → CTA). Brand copy lives in
 * brands/<slug>/yoga.config.ts; brand colors flow through the token layer, so
 * the theme still applies. Mirrors the shape/quality of the Massage page config
 * (@/lib/massage/page).
 *
 * Unlike Massage, Yoga's specialties and price tiers are authored statically
 * here (the mock is a fixed editorial page and needs no live booking data). The
 * single hero photo + about photo live in /assets/yoga/; the solid dark bands
 * (specialties / experience / CTA) are declared in src/styles/yoga.css.
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

export interface YogaHero {
  eyebrow?: string;
  /** First title line (e.g. "Yoga."). */
  title: string;
  /** Accent line rendered italic in the highlight color on its own line. */
  titleAccent?: string;
  sub?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

export interface YogaAboutSection {
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

/** A specialty (yoga style) card — authored statically from the mock. */
export interface YogaSpecialty {
  title: string;
  body: string;
}

export interface YogaSpecialtiesSection {
  eyebrow?: string;
  heading: AccentHeading;
  sub?: string;
  items: YogaSpecialty[];
}

/** A price tier chip, e.g. { duration: "60 min", price: "$89" }. */
export interface YogaPriceChip {
  duration: string;
  price: string;
}

export interface YogaPricingSection {
  eyebrow?: string;
  heading: AccentHeading;
  note?: string;
  cta: NavItem;
  chips: YogaPriceChip[];
}

export interface YogaExpectStep {
  /** Ordinal label rendered in the numbered chip (e.g. "01"). */
  num: string;
  title: string;
  body: string;
}

export interface YogaExpectSection {
  eyebrow?: string;
  heading: AccentHeading;
  items: YogaExpectStep[];
}

export interface YogaFaqSection {
  eyebrow?: string;
  heading: AccentHeading;
  items: FaqItem[];
}

export interface YogaCtaBand {
  eyebrow?: string;
  /** First title segment; the accent renders italic in the highlight color. */
  title: string;
  titleAccent?: string;
  body?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

export interface YogaPageConfig {
  hero: YogaHero;
  about: YogaAboutSection;
  specialties: YogaSpecialtiesSection;
  pricing: YogaPricingSection;
  expect: YogaExpectSection;
  faq: YogaFaqSection;
  cta: YogaCtaBand;
}

/**
 * Booking options resolved from the live service config API (database is the
 * single source of truth) — mirrors MassageBookingData. The route fetches these
 * and passes them into the landing page, overriding the static config values;
 * when the API is unavailable it falls back to the static config so the page
 * still renders (e.g. during `next build`).
 */
export interface YogaBookingData {
  /** "Choose your focus" cards — the service's yoga-style options. */
  specialties: YogaSpecialty[];
  /** "Simple, all-in prices" tiers — the service's duration options. */
  priceChips: YogaPriceChip[];
}
