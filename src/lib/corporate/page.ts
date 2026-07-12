import type { NavItem } from "@/lib/brand/types";

/**
 * Configuration for the two Corporate pages.
 *
 * - `CorporatePageConfig` — the marketing landing at /corporate (the Corporate
 *   navbar destination): hero → programs → how-it-works → CTA. Its "Request a
 *   proposal" CTA funnels to the inquiry page.
 * - `CorporateInquiryConfig` — the proposal-request page at /corporate/inquiry:
 *   hero → stub inquiry form + "what happens next" sidebar → stats band.
 *
 * Both heroes use the shared `.hero-*` typography (src/styles/hero.css); the
 * bespoke sections are styled by src/styles/corporate.css.
 */

/** A numbered step (shared by the landing "process" and the inquiry sidebar). */
export interface CorporateStep {
  /** Ordinal chip/figure label (e.g. "01"). */
  num: string;
  title: string;
  body: string;
}

/* ───────────────────────── LANDING ───────────────────────── */

export interface CorporateProgram {
  /** Phosphor icon name (resolved by getPhosphorIcon). */
  icon: string;
  title: string;
  body: string;
  /** Supporting bullet points. */
  points: string[];
}

export interface CorporatePageConfig {
  hero: {
    eyebrow?: string;
    /** First title line (e.g. "Wellness."). */
    title: string;
    /** Accent line rendered in the highlight color (e.g. "At work."). */
    titleAccent?: string;
    sub?: string;
    /** Full-bleed hero photo (public path + alt), rendered with next/image. */
    image: { src: string; alt: string };
  };
  /** "Three ways to bring us in" — program cards. */
  programs: {
    eyebrow?: string;
    heading: string;
    headingAccent?: string;
    intro?: string;
    items: CorporateProgram[];
  };
  /** "Up and running in a week" — numbered process steps. */
  process: {
    eyebrow?: string;
    heading: string;
    headingAccent?: string;
    steps: CorporateStep[];
  };
  /** Closing CTA band — funnels to the inquiry page. */
  cta: {
    eyebrow?: string;
    title: string;
    titleAccent?: string;
    sub?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
    chips?: string[];
  };
}

/* ───────────────────────── INQUIRY ───────────────────────── */

export interface CorporateStat {
  /** Headline figure (e.g. "8", "1 day", "5–500+"). */
  value: string;
  label: string;
}

export interface CorporateInquiryConfig {
  hero: {
    eyebrow?: string;
    title: string;
    titleAccent?: string;
    sub?: string;
    image: { src: string; alt: string };
  };
  /** "Request a proposal" inquiry form (stub-only). */
  form: {
    heading: string;
    intro?: string;
    teamSizes: string[];
    services: string[];
    formats: string[];
    submitLabel: string;
    note?: string;
  };
  /** "What happens next" numbered sidebar. */
  nextSteps: { heading: string; steps: CorporateStep[] };
  /** "Prefer to talk?" contact card. */
  contact: {
    heading: string;
    blurb?: string;
    email: string;
    /** Dialable value for the tel: link (e.g. "+19195550142"). */
    phone: string;
    /** Human-readable phone (e.g. "(919) 555-0142"). */
    phoneDisplay: string;
  };
  /** Dark stats band under the form. */
  stats: {
    heading: string;
    headingAccent?: string;
    sub?: string;
    items: CorporateStat[];
  };
}
