/**
 * Data-driven configuration for the "Corporate Wellness" page (the destination
 * of the Corporate navbar link). Brand-specific copy lives in
 * brands/<slug>/corporate.config.ts. The page is a focused proposal-request
 * (inquiry) page: a shared full-bleed hero, a stub inquiry form with a
 * "what happens next" sidebar, and a stats band. The hero uses the shared
 * `.hero-*` typography (see src/styles/hero.css); the rest is styled by
 * src/styles/corporate.css.
 */

export interface CorporateStep {
  /** Ordinal chip label (e.g. "01"). */
  num: string;
  title: string;
  body: string;
}

export interface CorporateStat {
  /** Headline figure (e.g. "8", "1 day", "5–500+"). */
  value: string;
  label: string;
}

export interface CorporatePageConfig {
  hero: {
    eyebrow?: string;
    /** First title line (e.g. "Let's build."). */
    title: string;
    /** Accent line rendered in the highlight color (e.g. "Your program."). */
    titleAccent?: string;
    sub?: string;
    /** Full-bleed hero photo (public path + alt), rendered with next/image. */
    image: { src: string; alt: string };
  };
  /** "Request a proposal" inquiry form (stub-only). */
  form: {
    heading: string;
    intro?: string;
    /** Team-size <select> options. */
    teamSizes: string[];
    /** Multi-select "services of interest" chips. */
    services: string[];
    /** Program-format <select> options. */
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
    /** Accent line rendered in the highlight color. */
    headingAccent?: string;
    sub?: string;
    items: CorporateStat[];
  };
}
