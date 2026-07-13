import type { NavItem } from "@/lib/brand/types";

/**
 * Data-driven configuration for the redesigned "About" page — a centered
 * full-bleed photo hero, a two-column origin story, a values card grid on a
 * tinted band, a solid-dark belief band with stat chips, and a closing
 * solid-dark CTA band. Mirrors the shape and conventions of the other migrated
 * pages (@/lib/contact/page, @/lib/privacy/page); brand copy lives in
 * brands/<slug>/about-page.config.ts and colors flow through the token layer.
 */

export interface AboutHero {
  eyebrow?: string;
  /** First title line (e.g. "Care."). */
  title: string;
  /** Accent line rendered italic in the highlight color on its own line. */
  titleAccent?: string;
  sub?: string;
  /** Full-bleed background photo (public path or whitelisted remote URL). */
  image: string;
}

/** Two-column origin story: narrative left, photo right. */
export interface AboutStory {
  /** Small dash-prefixed kicker label (e.g. "Why we exist"). */
  kicker?: string;
  heading: string;
  /** Trailing italic-accent phrase appended to the heading (e.g. "a commute"). */
  headingAccent?: string;
  paragraphs: string[];
  image: { src: string; alt: string };
}

export interface AboutValueItem {
  /** Phosphor icon name resolved via getPhosphorIcon (e.g. "UsersThree"). */
  icon?: string;
  title: string;
  body: string;
}

export interface AboutValuesSection {
  eyebrow?: string;
  heading: string;
  /** Trailing italic-accent phrase appended to the heading (e.g. "won't compromise"). */
  headingAccent?: string;
  sub?: string;
  items: AboutValueItem[];
}

export interface AboutBandChip {
  /** Stat value (e.g. "8", "100%"). Illustrative placeholder only. */
  value: string;
  label: string;
}

/** Dark belief band with a statement and stat chips. */
export interface AboutDarkBand {
  /** First title line; the accent renders italic in the highlight color. */
  title: string;
  titleAccent?: string;
  body?: string;
  chips: AboutBandChip[];
  /** Optional background photo behind a dark scrim; omit for a solid-dark band. */
  image?: string;
}

/** Closing dark CTA band. */
export interface AboutCta {
  eyebrow?: string;
  title: string;
  /** Accent line rendered italic in the highlight color. */
  titleAccent?: string;
  body?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
  /** Optional background photo behind a dark scrim; omit for a solid-dark band. */
  image?: string;
}

export interface AboutPageConfig {
  hero: AboutHero;
  story: AboutStory;
  values: AboutValuesSection;
  band: AboutDarkBand;
  cta: AboutCta;
}
