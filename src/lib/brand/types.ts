import type { FlagKey } from "@/lib/flags/registry";
import type { BrandId } from "./registry";

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: NavItem[];
}

/** Structural, brand-variable configuration (NOT visual tokens). */
export interface BrandConfig {
  id: BrandId;
  name: string;
  shortName: string;
  /** Small lockup sublabel under the wordmark (e.g. "Health & Wellness"). */
  logoSublabel?: string;
  tagline: string;
  contactEmail: string;
  contactPhone?: string;
  locale: string;
  currency: string;
  nav: NavItem[];
  footerColumns: FooterColumn[];
  legalLinks: NavItem[];
  serviceCategories: string[];
  organization: {
    legalName: string;
    sameAs: string[];
    contactType: string;
  };
  /** Per-brand feature flag overrides (merged over registry defaults). */
  flags?: Partial<Record<FlagKey, boolean>>;
}

export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/** Proof element — `isSample` is required and always true (RULE). */
export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role?: string;
  isSample: true;
}

export interface ProcessCard {
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  title: string;
  description: string;
}

export interface ComparisonRow {
  traditional: string;
  elevate: string;
}

/** Brand-variable marketing copy. */
export interface BrandContent {
  hero: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
    trustIndicators?: string[];
    imageSrc?: string;
    imageAlt?: string;
    imageCaption?: { title: string; lines: string[] };
  };
  features: { heading?: string; subheading?: string; items: FeatureItem[] };
  faq: { heading?: string; items: FaqItem[] };
  cta: { title: string; body?: string; cta: NavItem };
  testimonials: {
    heading?: string;
    subheading?: string;
    items: TestimonialItem[];
  };

  /* Optional home-page sections (present for brands that use them). */
  trustProcess?: {
    heading: string;
    subheading?: string;
    items: ProcessCard[];
  };
  servicesSection?: {
    heading: string;
    subheading?: string;
    draftNote?: string;
  };
  howItWorks?: {
    heading: string;
    subheading?: string;
    steps: HowItWorksStep[];
  };
  comparison?: {
    heading: string;
    subheading?: string;
    traditionalLabel: string;
    elevateLabel: string;
    rows: ComparisonRow[];
  };
  corporate?: {
    eyebrow?: string;
    title: string;
    body?: string;
    tags: string[];
    cta: NavItem;
  };
  finalCta?: {
    eyebrow?: string;
    title: string;
    body?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
  };
}
