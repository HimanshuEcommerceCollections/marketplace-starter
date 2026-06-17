import type {
  NavItem,
  FeatureItem,
  HowItWorksStep,
  FaqItem,
  TestimonialItem,
} from "@/lib/brand/types";

/** Data-driven configuration for the "How Elevate Works" page. */
export interface HowItWorksPageConfig {
  hero: {
    variant?: "dark" | "light";
    eyebrow?: string;
    title: string;
    subtitle?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
    trustIndicators?: string[];
    image?: {
      src?: string;
      alt?: string;
      caption?: { title: string; lines: string[] };
      gradient?: boolean;
    };
  };
  journey: {
    heading: string;
    subheading?: string;
    steps: HowItWorksStep[];
    note?: string;
  };
  afterSubmit: { heading: string; subheading?: string; items: FeatureItem[] };
  review: {
    heading: string;
    subheading?: string;
    items: FeatureItem[];
    note?: string;
  };
  coordinator: {
    heading: string;
    subheading?: string;
    card: { icon?: string; title: string; description: string; note?: string };
    items: FeatureItem[];
  };
  /** "Services We Cover" — headings only; cards come from the service catalog. */
  servicesCovered: { heading: string; subheading?: string };
  faq: { heading: string; items: FaqItem[]; viewAll?: NavItem };
  testimonials: {
    heading?: string;
    subheading?: string;
    items: TestimonialItem[];
  };
  cta: {
    eyebrow?: string;
    title: string;
    body?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
  };
}
