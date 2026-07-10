import type { NavItem } from "@/lib/brand/types";

/**
 * Data-driven configuration for the redesigned "FAQ" page — a full-bleed
 * photo hero, a sticky category filter bar over a single-open accordion, and
 * a closing "ask a human" dark photo band. Mirrors the shape and conventions
 * of the other migrated pages (@/lib/about/page, @/lib/terms/page); brand
 * copy lives in brands/<slug>/faq-page.config.ts and colors flow through the
 * token layer.
 */

export interface FaqHero {
  eyebrow?: string;
  /** First title line (e.g. "Questions."). */
  title: string;
  /** Accent line rendered in the highlight color on its own line. */
  titleAccent?: string;
  sub?: string;
  /** Full-bleed background photo (public path or whitelisted remote URL). */
  image: string;
}

/** A selectable category pill in the sticky filter bar. */
export interface FaqFilterCategory {
  /** Stable slug matched against FaqEntry.category, e.g. "booking". */
  id: string;
  /** Pill label, e.g. "Our Professionals". */
  label: string;
}

export interface FaqFilterBar {
  /** Label for the show-everything pill, e.g. "All questions". */
  allLabel: string;
  categories: FaqFilterCategory[];
}

/** One question/answer row; `category` must match a filter category id. */
export interface FaqEntry {
  /** Stable id for the accordion item, e.g. "booking-confirmation". */
  id: string;
  /** Filter category slug this entry belongs to. */
  category: string;
  question: string;
  answer: string;
}

/** The filterable question browser — sticky pill bar + accordion. */
export interface FaqBrowserSection {
  filter: FaqFilterBar;
  items: FaqEntry[];
}

/** Closing dark photo band pointing unanswered visitors at a human. */
export interface FaqDarkBand {
  /** First title line; the accent renders italic in the highlight color. */
  title: string;
  titleAccent?: string;
  body?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
  /** Background photo behind the dark scrim. */
  image: string;
}

export interface FaqPageConfig {
  hero: FaqHero;
  browser: FaqBrowserSection;
  band: FaqDarkBand;
}
