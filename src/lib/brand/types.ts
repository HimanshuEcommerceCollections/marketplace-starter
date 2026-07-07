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
  /** Short service-area label for booking UI, e.g. "Raleigh, NC". */
  serviceArea?: string;
  /** Prefix for booking reference numbers, e.g. "ELV" -> "ELV-2026-4821". */
  bookingPrefix?: string;
  locale: string;
  currency: string;
  nav: NavItem[];
  footerColumns: FooterColumn[];
  legalLinks: NavItem[];
  /** Editorial copy for the site footer (big serif line + brand blurb). */
  footer?: {
    /** Oversized closing line; `accent` renders as the italic second line. */
    tagline?: { lead: string; accent?: string };
    /** Short brand description shown beside the columns. */
    blurb?: string;
  };
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
  /** Optional small badge, e.g. "Coming Soon". */
  badge?: string;
  /** Optional fine-print line under the description (stacked cards), e.g. a
   *  disclaimer like "Educational overview only. Not a clinical promise." */
  footnote?: string;
  /** Optional "Learn more" link target (rendered by stacked card sections). */
  href?: string;
  /** Override the link label (defaults to "Learn More"). */
  hrefLabel?: string;
}

/** A featured offering — like {@link FeatureItem} but with an inquiry link. */
export interface OfferingItem {
  icon?: string;
  title: string;
  description: string;
  /** Optional small badge, e.g. "Most Requested" / "Custom Quote". */
  badge?: string;
  /** Optional inquiry link, e.g. { label: "Inquire about this", href: "#quote" }. */
  cta?: NavItem;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/** Testimonial / social-proof element. */
export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role?: string;
}

export interface ProcessCard {
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  title: string;
  description: string;
  /** Optional lucide icon name. Rendered beside the step number in process cards. */
  icon?: string;
}

export interface ComparisonRow {
  traditional: string;
  elevate: string;
}

/** A "Why Elevate" value-prop card (Phosphor icon name). */
export interface WhyCard {
  icon: string;
  title: string;
  body: string;
  /** Renders as the larger focal card in the grid. */
  featured?: boolean;
}

/** A "Find your fit" router card linking an intent to a service route. */
export interface FitCard {
  title: string;
  sub: string;
  href: string;
  /** Terracotta-tinted "help me choose" style card. */
  dark?: boolean;
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
    /** Lifestyle photo trio shown beneath the hero (redesigned homepage). */
    photos?: { src: string; alt: string; label: string }[];
    /** Background video for the cinematic hero (redesigned homepage). */
    videoSrc?: string;
    /** Poster frame shown before the video loads / as reduced-motion fallback. */
    videoPoster?: string;
    /** Photos that crossfade in behind the hero copy as the user scrolls. */
    photoSequence?: string[];
  };
  features: { heading?: string; subheading?: string; items: FeatureItem[] };
  faq: { heading?: string; items: FaqItem[] };
  cta: { title: string; body?: string; cta: NavItem };
  testimonials: {
    heading?: string;
    /** Italic terracotta clause appended after the heading. */
    headingAccent?: string;
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
    /** Italic terracotta clause appended after the heading. */
    headingAccent?: string;
    subheading?: string;
    draftNote?: string;
  };
  /** Editorial statement line with a word-by-word reveal (redesigned homepage). */
  statement?: {
    lead: string;
    /** Emphasized (italic, accent) closing phrase of the lead sentence. */
    emphasis: string;
    /** Short follow-up line revealed after the lead. */
    sub?: string;
  };
  howItWorks?: {
    heading: string;
    subheading?: string;
    steps: HowItWorksStep[];
  };
  /** "Why clients choose Elevate" — value-prop card grid (redesigned homepage). */
  whyElevate?: {
    eyebrow?: string;
    heading: string;
    sub?: string;
    trustBadge?: string;
    cards: WhyCard[];
  };
  /** "Find your fit" — intent-to-service router cards (redesigned homepage). */
  findYourFit?: {
    eyebrow?: string;
    heading: string;
    sub?: string;
    cards: FitCard[];
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

  /* Auth screens (login / signup). The brand panel copy + sample quote shown on
     the customer-facing split-screen; structural form labels live in code. */
  auth?: {
    /** Service category chips shown on the brand panel. */
    categories: string[];
    login: { panelTitle: string; testimonial: TestimonialItem };
    signup: { panelTitle: string; testimonial: TestimonialItem };
  };
}
