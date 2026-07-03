/**
 * Data-driven configuration for the standalone "Services" page. Brand-specific
 * copy lives in brands/<slug>/services-page.config.ts; the page composes the
 * showcase sections (hero, filterable photo grid, trust strip, steps, CTA)
 * with cards sourced from the live API or the static catalog (services.json).
 */

export interface ServicesPageCta {
  label: string;
  href: string;
}

export interface ServicesPageHero {
  eyebrow?: string;
  /** First title line (e.g. "Wellness."). */
  title: string;
  /** Accent second line rendered in the highlight color (e.g. "Delivered."). */
  titleAccent?: string;
  sub?: string;
}

export interface ServicesTrustPill {
  /** Phosphor icon name resolved via getPhosphorIcon. */
  icon: string;
  label: string;
}

export interface ServicesTrustStrip {
  heading: string;
  pills: ServicesTrustPill[];
}

export interface ServicesStep {
  title: string;
  body: string;
}

export interface ServicesStepsSection {
  eyebrow?: string;
  heading: string;
  sub?: string;
  steps: ServicesStep[];
}

export interface ServicesCtaBand {
  eyebrow?: string;
  /** First title line; the accent word renders in the highlight color. */
  title: string;
  /** Optional second line rendered before the accent (controls the break). */
  titleLine2?: string;
  titleAccent?: string;
  body?: string;
  primaryCta: ServicesPageCta;
  secondaryCta?: ServicesPageCta;
}

export interface ServicesPageConfig {
  heading: string;
  subheading?: string;
  draftNote?: string;
  /** Full-bleed photo hero; when present the page renders the showcase design. */
  hero?: ServicesPageHero;
  trustStrip?: ServicesTrustStrip;
  stepsSection?: ServicesStepsSection;
  ctaBand?: ServicesCtaBand;
}
