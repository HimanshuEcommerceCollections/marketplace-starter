import type { NavItem } from "@/lib/brand/types";

/**
 * Data-driven configuration for legal / policy pages ("/privacy", "/terms",
 * etc.). Brand-specific copy lives in brands/<slug>/privacy-page.config.ts and
 * brands/<slug>/terms-page.config.ts, both reusing this same type. The page is
 * a thin composition of the shared PageHero, LegalContentsSection,
 * LegalSectionsSection, optional LegalDisclosureSection, and LegalContactSection.
 *
 * Two section styles are supported per document:
 *  - document style (Privacy): each section renders `body` paragraphs.
 *  - summary style (Terms): each section renders a `questions` chevron list.
 */

/** A single meta line in the legal hero, e.g. { label: "Last Updated", value: "TBD" }. */
export interface LegalMetaItem {
  label: string;
  value: string;
}

/** One policy section. `id` is the anchor slug shared by the contents nav. */
export interface LegalSection {
  /** Stable slug for the anchor link, e.g. "information-we-collect". */
  id: string;
  /** Section heading, e.g. "Information We Collect" (numbered automatically). */
  title: string;
  /** Body paragraphs (document-style pages such as Privacy). */
  body?: string[];
  /** Question rows (summary-style pages such as Terms); rendered as a chevron list. */
  questions?: string[];
}

/** "Questions About This Policy?" contact callout. */
export interface LegalContactConfig {
  heading: string;
  body?: string;
  /** Response-time chip, e.g. "A coordinator will respond within 24 hours". */
  note?: string;
  /** A single contact card (icon, team name, email) — used by Privacy. */
  card?: {
    icon?: string;
    title: string;
    /** Contact email; may include a "(placeholder)" suffix while in draft. */
    email: string;
    /** Response-time chip, e.g. "Typical response within 5 business days". */
    note?: string;
  };
  /** Action buttons (e.g. Contact Coordinator / Return Home) — used by Terms. */
  actions?: NavItem[];
}

/** One placeholder row in the Marketplace Disclosure block. */
export interface LegalDisclosureItem {
  icon?: string;
  title: string;
  /** Placeholder line, e.g. "Placeholder — Content pending legal review". */
  description: string;
  /** Status pill, e.g. "Pending". */
  badge?: string;
}

/** Optional "Marketplace Disclosure" block — regulatory disclosure placeholders. */
export interface LegalDisclosureConfig {
  /** Small pill label above the heading, e.g. "Marketplace Disclosure". */
  eyebrow?: string;
  heading: string;
  body?: string;
  items: LegalDisclosureItem[];
  /** Footer disclaimer beneath the disclosure rows. */
  note?: string;
}

export interface LegalPageConfig {
  hero: {
    variant?: "brand" | "dark" | "light";
    /** Breadcrumb trail rendered above the eyebrow, e.g. Home › Terms. */
    breadcrumb?: NavItem[];
    eyebrow?: string;
    title: string;
    subtitle?: string;
    /** Render a short accent rule beneath the subtitle. */
    divider?: boolean;
    /** Meta lines, e.g. Last Updated / Effective Date / Version. */
    meta?: LegalMetaItem[];
    /** Draft / placeholder notice rendered as a callout in the hero band. */
    notice?: string;
  };
  /** "Contents" table of contents; entries are derived from `sections.items`. */
  contents: {
    heading: string;
    subtitle?: string;
  };
  sections: {
    /** Optional band heading; omitted when sections follow the contents directly. */
    heading?: string;
    subtitle?: string;
    items: LegalSection[];
  };
  /** Optional regulatory disclosure block, rendered between sections and contact. */
  disclosure?: LegalDisclosureConfig;
  contact: LegalContactConfig;
}
