import type { NavItem } from "@/lib/brand/types";

/**
 * Data-driven configuration for the redesigned "Terms of Service" page — a
 * full-bleed photo hero, a two-column body (sticky table-of-contents +
 * numbered policy sections with a scroll-spy), and a closing dark CTA band.
 * Mirrors the shape/quality of the How It Works and Pricing page configs
 * (@/lib/how-it-works/page, @/lib/pricing/page); brand copy lives in
 * brands/<slug>/terms-page.config.ts and colors flow through the token layer.
 *
 * Content model note: like every migrated page, fields are plain strings — no
 * inline markup. Emphasis is structural (`titleAccent`, a bullet `lead`, a
 * `callout.label`); email/phone references in section prose are turned into
 * mailto:/tel: links at render time by the Terms body component.
 */

export interface TermsHero {
  eyebrow?: string;
  /** First title line (e.g. "Terms."). */
  title: string;
  /** Accent line rendered in the highlight color on its own line. */
  titleAccent?: string;
  sub?: string;
}

/** A bullet row with an optional bold lead phrase rendered before the rest. */
export interface TermsBullet {
  /** Emphasized lead phrase, rendered bold (e.g. "4+ hours before"). */
  lead?: string;
  /** Remainder of the bullet; author the exact continuation, incl. leading
   *  space or punctuation, since no space is injected after the lead. */
  text: string;
}

/** An emphasized aside within a section (e.g. the health-disclaimer box). */
export interface TermsCallout {
  /** Bold lead-in, e.g. "Licensed care:". */
  label?: string;
  body: string;
}

/** One numbered policy section; `id` is the anchor slug shared by the TOC. */
export interface TermsSection {
  /** Stable slug for the anchor link, e.g. "acceptance". */
  id: string;
  /** Section heading (numbered 01… automatically) and TOC label. */
  title: string;
  /** Body paragraphs. */
  body?: string[];
  /** Optional bullet list. */
  bullets?: TermsBullet[];
  /** Optional emphasized callout box. */
  callout?: TermsCallout;
}

export interface TermsBodyConfig {
  /** Sticky table-of-contents heading, e.g. "On this page". */
  tocHeading: string;
  /** Ordered policy sections; the TOC is derived from these. */
  sections: TermsSection[];
}

export interface TermsDarkBand {
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

export interface TermsPageConfig {
  hero: TermsHero;
  body: TermsBodyConfig;
  darkBand: TermsDarkBand;
}
