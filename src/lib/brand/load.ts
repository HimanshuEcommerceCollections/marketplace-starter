import { getActiveBrandId, type BrandId } from "./registry";
import type { BrandConfig, BrandContent } from "./types";
import type {
  ServiceLandingConfig,
  ServiceLandingRegistry,
} from "@/lib/services/landing";
import type { PricingPageConfig } from "@/lib/pricing/page";
import type { HowItWorksPageConfig } from "@/lib/how-it-works/page";
import type { ForProsPageConfig } from "@/lib/for-pros/page";
import type { AboutPageConfig } from "@/lib/about/page";
import type { ContactPageConfig } from "@/lib/contact/page";
import type {
  CorporatePageConfig,
  CorporateInquiryConfig,
} from "@/lib/corporate/page";
import type { FaqPageConfig } from "@/lib/faq/page";
import type { PrivacyPageConfig } from "@/lib/privacy/page";
import type { TermsPageConfig } from "@/lib/terms/page";
import type { ServicesPageConfig } from "@/lib/services/page";
import type { MassagePageConfig } from "@/lib/massage/page";
import type { YogaPageConfig } from "@/lib/yoga/page";
import type { LifeCoachingPageConfig } from "@/lib/life-coaching/page";
import type { ShowcasePageConfig } from "@/lib/service-showcase/page";

import { elevateConfig } from "@brands/elevate/brand.config";
import { elevateContent } from "@brands/elevate/content.config";
import { elevateServiceLanding } from "@brands/elevate/service-landing.config";
import { elevatePricingPage } from "@brands/elevate/pricing-page.config";
import { elevateHowItWorks } from "@brands/elevate/how-it-works.config";
import { elevateForPros } from "@brands/elevate/for-pros.config";
import { elevateAbout } from "@brands/elevate/about-page.config";
import { elevateContact } from "@brands/elevate/contact-page.config";
import {
  elevateCorporate,
  elevateCorporateInquiry,
} from "@brands/elevate/corporate.config";
import { elevateFaqPage } from "@brands/elevate/faq-page.config";
import { elevatePrivacyPage } from "@brands/elevate/privacy-page.config";
import { elevateTermsPage } from "@brands/elevate/terms-page.config";
import { elevateServicesPage } from "@brands/elevate/services-page.config";
import { elevateMassage } from "@brands/elevate/massage.config";
import { elevateYoga } from "@brands/elevate/yoga.config";
import { elevateLifeCoaching } from "@brands/elevate/life-coaching.config";
import { elevateBeauty } from "@brands/elevate/beauty.config";
import { elevateNutrition } from "@brands/elevate/nutrition.config";
import { elevatePhysicalTherapy } from "@brands/elevate/physical-therapy.config";
import { elevatePersonalTraining } from "@brands/elevate/personal-training.config";
import { elevateSpeechTherapy } from "@brands/elevate/speech-therapy.config";
import elevateServices from "@brands/elevate/services.json";
import elevatePricing from "@brands/elevate/pricing.v1.json";

export interface LoadedBrand {
  id: BrandId;
  config: BrandConfig;
  content: BrandContent;
  /** Per-service landing page configs, keyed by service slug. */
  serviceLanding: ServiceLandingRegistry;
  /** "Simple, Transparent Pricing" page content. */
  pricingPage: PricingPageConfig;
  /** "How Elevate Works" page content. */
  howItWorks: HowItWorksPageConfig;
  /** "For Pros" (Become a Pro) recruiting page content. */
  forPros: ForProsPageConfig;
  /** "About" page content. */
  about: AboutPageConfig;
  /** "Contact" page content. */
  contact: ContactPageConfig;
  /** "Corporate Wellness" marketing landing content. */
  corporate: CorporatePageConfig;
  /** "Corporate Wellness" proposal-request (inquiry) page content. */
  corporateInquiry: CorporateInquiryConfig;
  /** "Frequently Asked Questions" page content. */
  faqPage: FaqPageConfig;
  /** "Privacy Policy" page content (redesigned bespoke layout). */
  privacyPage: PrivacyPageConfig;
  /** "Terms of Service" page content (redesigned bespoke layout). */
  termsPage: TermsPageConfig;
  /** Standalone "Services" page content (same card grid as the home page). */
  servicesPage: ServicesPageConfig;
  /** Bespoke "Massage" service landing page content. */
  massagePage: MassagePageConfig;
  /** Bespoke "Yoga" service landing page content. */
  yogaPage: YogaPageConfig;
  /** Bespoke "Life Coaching" service landing page content. */
  lifeCoachingPage: LifeCoachingPageConfig;
  /** Shared-template showcase landing pages (Beauty, Nutrition, Physical Therapy, Personal Training, Speech Therapy), by slug. */
  showcasePages: Record<string, ShowcasePageConfig>;
  /** Raw JSON — validated lazily by catalog/pricing loaders via zod. */
  services: unknown;
  pricing: unknown;
}

const REGISTRY: Record<BrandId, LoadedBrand> = {
  elevate: {
    id: "elevate",
    config: elevateConfig,
    content: elevateContent,
    serviceLanding: elevateServiceLanding,
    pricingPage: elevatePricingPage,
    howItWorks: elevateHowItWorks,
    forPros: elevateForPros,
    about: elevateAbout,
    contact: elevateContact,
    corporate: elevateCorporate,
    corporateInquiry: elevateCorporateInquiry,
    faqPage: elevateFaqPage,
    privacyPage: elevatePrivacyPage,
    termsPage: elevateTermsPage,
    servicesPage: elevateServicesPage,
    massagePage: elevateMassage,
    yogaPage: elevateYoga,
    lifeCoachingPage: elevateLifeCoaching,
    showcasePages: {
      [elevateBeauty.slug]: elevateBeauty,
      [elevateNutrition.slug]: elevateNutrition,
      [elevatePhysicalTherapy.slug]: elevatePhysicalTherapy,
      [elevatePersonalTraining.slug]: elevatePersonalTraining,
      [elevateSpeechTherapy.slug]: elevateSpeechTherapy,
    },
    services: elevateServices,
    pricing: elevatePricing,
  },
};

export function loadBrand(): LoadedBrand {
  return REGISTRY[getActiveBrandId()];
}

export function getBrandConfig(): BrandConfig {
  return loadBrand().config;
}

export function getBrandContent(): BrandContent {
  return loadBrand().content;
}

/** Look up the landing-page config for a service slug (undefined if none). */
export function getServiceLanding(
  slug: string,
): ServiceLandingConfig | undefined {
  return loadBrand().serviceLanding[slug];
}

/** All service slugs that have a dedicated landing page in the active brand. */
export function getServiceLandingSlugs(): string[] {
  return Object.keys(loadBrand().serviceLanding);
}

/** The active brand's "Simple, Transparent Pricing" page content. */
export function getPricingPage(): PricingPageConfig {
  return loadBrand().pricingPage;
}

/** The active brand's "How Elevate Works" page content. */
export function getHowItWorksPage(): HowItWorksPageConfig {
  return loadBrand().howItWorks;
}

/** The active brand's "For Pros" (Become a Pro) page content. */
export function getForProsPage(): ForProsPageConfig {
  return loadBrand().forPros;
}

/** The active brand's "About" page content. */
export function getAboutPage(): AboutPageConfig {
  return loadBrand().about;
}

/** The active brand's "Contact" page content. */
export function getContactPage(): ContactPageConfig {
  return loadBrand().contact;
}

/** The active brand's "Corporate Wellness" marketing landing content. */
export function getCorporateLanding(): CorporatePageConfig {
  return loadBrand().corporate;
}

/** The active brand's Corporate proposal-request (inquiry) page content. */
export function getCorporateInquiry(): CorporateInquiryConfig {
  return loadBrand().corporateInquiry;
}

/** The active brand's "Frequently Asked Questions" page content. */
export function getFaqPage(): FaqPageConfig {
  return loadBrand().faqPage;
}

/** The active brand's "Privacy Policy" page content. */
export function getPrivacyPage(): PrivacyPageConfig {
  return loadBrand().privacyPage;
}

/** The active brand's "Terms of Service" page content. */
export function getTermsPage(): TermsPageConfig {
  return loadBrand().termsPage;
}

/** The active brand's standalone "Services" page content. */
export function getServicesPage(): ServicesPageConfig {
  return loadBrand().servicesPage;
}

/** The active brand's bespoke "Massage" service landing page content. */
export function getMassagePage(): MassagePageConfig {
  return loadBrand().massagePage;
}

/** The active brand's bespoke "Yoga" service landing page content. */
export function getYogaPage(): YogaPageConfig {
  return loadBrand().yogaPage;
}

/** The active brand's bespoke "Life Coaching" service landing page content. */
export function getLifeCoachingPage(): LifeCoachingPageConfig {
  return loadBrand().lifeCoachingPage;
}

/**
 * A showcase landing page config by service slug. Throws (build-time) rather
 * than returning undefined — the static routes that call this only exist for
 * slugs registered in the brand's showcasePages map.
 */
export function getShowcasePage(slug: string): ShowcasePageConfig {
  const page = loadBrand().showcasePages[slug];
  if (!page) {
    throw new Error(`No showcase page config registered for slug "${slug}"`);
  }
  return page;
}

/** All service slugs rendered by the shared showcase template. */
export function getShowcasePageSlugs(): string[] {
  return Object.keys(loadBrand().showcasePages);
}

export function allBrands(): LoadedBrand[] {
  return Object.values(REGISTRY);
}
