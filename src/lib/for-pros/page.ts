import type { NavItem, FaqItem } from "@/lib/brand/types";

/**
 * Data-driven configuration for the redesigned "For Pros" page — a full-bleed,
 * GSAP-animated recruiting landing that mirrors the approved mock (hero →
 * benefits → earnings band → getting-started steps → requirements → FAQ → CTA).
 * Brand copy lives in brands/<slug>/for-pros.config.ts; brand colors flow
 * through the token layer, so the theme still applies. Mirrors the shape/quality
 * of the How It Works page config (@/lib/how-it-works/page).
 *
 * All copy, CTA links, image paths, stats, benefits, and FAQs are declared here
 * so the sections stay content-agnostic — nothing (including mailto: links) is
 * hardcoded inside the components.
 */

export interface ForProsHero {
  eyebrow?: string;
  /** First title line (e.g. "Your craft."). */
  title: string;
  /** Accent line rendered in the highlight color on its own line (e.g. "Your schedule."). */
  titleAccent?: string;
  sub?: string;
  /** Full-bleed background photo (public path, e.g. /assets/for-pros/hero-bg.jpg). */
  image: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

export interface ForProsBenefit {
  /** Phosphor icon name, resolved via the section's local icon map. */
  icon: string;
  title: string;
  body: string;
}

export interface ForProsBenefitsSection {
  eyebrow?: string;
  heading: string;
  sub?: string;
  items: ForProsBenefit[];
}

export interface ForProsStat {
  value: string;
  label: string;
}

export interface ForProsEarnings {
  eyebrow?: string;
  /** First title line (e.g. "Get paid what"). */
  title: string;
  /** Optional second line rendered before the accent (controls the break). */
  titleLine2?: string;
  /** Italic accent word in the highlight color (e.g. "worth."). */
  titleAccent?: string;
  body?: string;
  /** Dark-band background photo (public path). */
  image: string;
  /** Illustrative earnings figures. */
  stats: ForProsStat[];
}

export interface ForProsStep {
  /** Ordinal label rendered in the numbered chip (e.g. "01"). */
  num: string;
  title: string;
  body: string;
}

export interface ForProsStepsSection {
  eyebrow?: string;
  heading: string;
  sub?: string;
  /** Cream-tinted background photo (public path). */
  image: string;
  steps: ForProsStep[];
}

export interface ForProsRequirement {
  /** Phosphor icon name, resolved via the section's local icon map. */
  icon: string;
  /** Bold lead phrase. */
  lead: string;
  /** Supporting text that follows the lead. */
  text: string;
}

export interface ForProsRequirementsSection {
  eyebrow?: string;
  heading: string;
  sub?: string;
  items: ForProsRequirement[];
}

export interface ForProsFaqSection {
  eyebrow?: string;
  heading: string;
  items: FaqItem[];
}

export interface ForProsCtaBand {
  eyebrow?: string;
  /** First title line; the accent word renders in the highlight color. */
  title: string;
  titleAccent?: string;
  body?: string;
  /** Dark-band background photo (public path). */
  image: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

export interface ForProsPageConfig {
  hero: ForProsHero;
  benefits: ForProsBenefitsSection;
  earnings: ForProsEarnings;
  steps: ForProsStepsSection;
  requirements: ForProsRequirementsSection;
  faq: ForProsFaqSection;
  cta: ForProsCtaBand;
}
