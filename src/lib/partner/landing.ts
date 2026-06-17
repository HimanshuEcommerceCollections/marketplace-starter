import type {
  NavItem,
  FeatureItem,
  HowItWorksStep,
  FaqItem,
  TestimonialItem,
} from "@/lib/brand/types";

/**
 * Data-driven configuration for the "Partner with Elevate" (Become a Pro) page.
 * Brand-specific copy lives in brands/<slug>/partner.config.ts; the page is a
 * thin composition of the shared section components.
 */
export interface PartnerLandingConfig {
  hero: {
    variant?: "dark" | "light";
    eyebrow?: string;
    title: string;
    subtitle?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
    image?: {
      src?: string;
      alt?: string;
      caption?: { title: string; lines: string[] };
      gradient?: boolean;
    };
  };
  /** "Who We Work With" — headings only; cards come from the service catalog. */
  whoWeWorkWith: { heading: string; subheading?: string };
  whyPartner: { heading: string; subheading?: string; items: FeatureItem[] };
  process: { heading: string; subheading?: string; steps: HowItWorksStep[] };
  standards: { heading: string; subheading?: string; items: FeatureItem[] };
  apply: { heading: string; subheading?: string };
  testimonials: {
    heading?: string;
    subheading?: string;
    items: TestimonialItem[];
  };
  faq: { heading: string; items: FaqItem[]; viewAll?: NavItem };
  cta: {
    eyebrow?: string;
    title: string;
    body?: string;
    primaryCta: NavItem;
    secondaryCta?: NavItem;
  };
}
