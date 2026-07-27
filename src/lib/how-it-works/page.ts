import type { NavItem, FaqItem } from "@/lib/brand/types";

/**
 * Data-driven configuration for the redesigned "How It Works" page — a
 * full-bleed, GSAP-animated layout that mirrors the approved mock (hero → four
 * alternating step rows → coordinator band → coverage → FAQ → CTA). Brand copy
 * lives in brands/<slug>/how-it-works.config.ts; brand colors flow through the
 * token layer, so the theme still applies. Mirrors the shape/quality of the
 * Services page config (@/lib/services/page).
 */

export interface HowItWorksHero {
  eyebrow?: string;
  /** First title line (e.g. "Four steps."). */
  title: string;
  /** Accent line rendered in the highlight color on its own line (e.g. "Zero hassle."). */
  titleAccent?: string;
  sub?: string;
}

export interface HowItWorksStep {
  /** Small uppercase kicker, e.g. "Step One". */
  kicker: string;
  title: string;
  body: string;
  /** Check-marked supporting points. */
  points: string[];
  image: { src: string; alt: string };
}

export interface HowItWorksStepsSection {
  eyebrow?: string;
  heading: string;
  sub?: string;
  steps: HowItWorksStep[];
}

export interface HowItWorksStat {
  value: string;
  label: string;
}

export interface HowItWorksCoordinator {
  eyebrow?: string;
  /** First title line (e.g. "A real human,"). */
  title: string;
  /** Italic accent line in the highlight color (e.g. "not an algorithm."). */
  titleAccent?: string;
  body?: string;
  /** Illustrative stats. */
  stats: HowItWorksStat[];
}

export interface HowItWorksCoverage {
  eyebrow?: string;
  heading: string;
  sub?: string;
  /**
   * FALLBACK coverage areas, each rendered as a map-pin pill.
   *
   * The band is no longer driven by this list: `<CoverageBand>` reads the real
   * ACTIVE markets from `GET /areas` (role-aware, so anonymous visitors see
   * exactly the published footprint in the admin's `sortOrder`). These names are
   * what renders server-side and what stays if that call fails or comes back
   * empty — the band must never be blank, so keep this list populated and roughly
   * accurate, but do NOT treat it as the source of truth. Adding a market here
   * does not make it bookable; creating it in the admin Areas screen does.
   *
   * `heading`/`sub`/`note` are still fixed brand copy, so a heading that names a
   * specific footprint ("All of Wake County") has to be revised by hand when the
   * business expands.
   */
  areas: string[];
  note?: string;
}

export interface HowItWorksFaqSection {
  eyebrow?: string;
  heading: string;
  items: FaqItem[];
}

export interface HowItWorksCtaBand {
  eyebrow?: string;
  /** First title line; the accent word renders in the highlight color. */
  title: string;
  /** Optional second line rendered before the accent (controls the break). */
  titleLine2?: string;
  titleAccent?: string;
  body?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

export interface HowItWorksPageConfig {
  hero: HowItWorksHero;
  steps: HowItWorksStepsSection;
  coordinator: HowItWorksCoordinator;
  coverage: HowItWorksCoverage;
  faq: HowItWorksFaqSection;
  cta: HowItWorksCtaBand;
}
