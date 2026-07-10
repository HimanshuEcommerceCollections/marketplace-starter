import type { NavItem } from "@/lib/brand/types";

/**
 * Data-driven configuration for the redesigned "Privacy Policy" page — a
 * centered full-bleed photo hero, a two-column legal body (sticky
 * table-of-contents with a scroll-spy + numbered policy sections), and a
 * closing solid-dark CTA band. Mirrors the shape/conventions of the other
 * migrated pages (@/lib/contact/page, @/lib/terms/page); brand copy lives in
 * brands/<slug>/privacy-page.config.ts and colors flow through the token layer.
 *
 * Content model: fields are plain strings — no inline markup. Email/phone
 * references in prose are turned into mailto:/tel: links at render time by the
 * body component; emphasis is structural (a bullet `lead`, a `callout.label`).
 */

export interface PrivacyHero {
  eyebrow?: string;
  /** First title line (e.g. "Privacy."). */
  title: string;
  /** Accent line rendered italic in the highlight color on its own line. */
  titleAccent?: string;
  sub?: string;
  /** Full-bleed background photo (public path or whitelisted remote URL). */
  image: string;
}

/** A bullet row with an optional bold lead phrase rendered before the rest. */
export interface PrivacyBullet {
  /** Emphasized lead phrase, rendered bold (e.g. "You provide it"). */
  lead?: string;
  /** Remainder of the bullet; author the exact continuation, incl. leading
   *  space or punctuation, since no space is injected after the lead. */
  text: string;
}

/** An emphasized aside within a section (e.g. the health-data callout). */
export interface PrivacyCallout {
  /** Bold lead-in, e.g. "Health-related information is sensitive.". */
  label?: string;
  body: string;
}

/** One numbered policy section; `id` is the anchor slug shared by the TOC. */
export interface PrivacySection {
  /** Stable slug for the anchor link, e.g. "overview". */
  id: string;
  /** Section heading (numbered 01… automatically) and TOC label. */
  title: string;
  /** Body paragraphs rendered before any bullet list. */
  body?: string[];
  /** Optional bullet list. */
  bullets?: PrivacyBullet[];
  /** Optional paragraphs rendered after the bullet list. */
  footer?: string[];
  /** Optional emphasized callout box. */
  callout?: PrivacyCallout;
}

export interface PrivacyBodyConfig {
  /** Sticky table-of-contents heading, e.g. "On this page". */
  tocHeading: string;
  /** Ordered policy sections; the TOC is derived from these. */
  sections: PrivacySection[];
}

/** Closing solid-dark CTA band. */
export interface PrivacyCta {
  eyebrow?: string;
  /** First title line; the accent renders italic in the highlight color. */
  title: string;
  titleAccent?: string;
  body?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
  /** Reassurance pills beneath the buttons. */
  chips: string[];
}

export interface PrivacyPageConfig {
  hero: PrivacyHero;
  body: PrivacyBodyConfig;
  cta: PrivacyCta;
}
