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
import type { CorporatePageConfig } from "@/lib/corporate/page";
import type { FaqPageConfig } from "@/lib/faq/page";
import type { LegalPageConfig } from "@/lib/legal/page";
import type { TermsPageConfig } from "@/lib/terms/page";
import type { ServicesPageConfig } from "@/lib/services/page";
import type { MassagePageConfig } from "@/lib/massage/page";

import { elevateConfig } from "@brands/elevate/brand.config";
import { elevateContent } from "@brands/elevate/content.config";
import { elevateServiceLanding } from "@brands/elevate/service-landing.config";
import { elevatePricingPage } from "@brands/elevate/pricing-page.config";
import { elevateHowItWorks } from "@brands/elevate/how-it-works.config";
import { elevateForPros } from "@brands/elevate/for-pros.config";
import { elevateAbout } from "@brands/elevate/about-page.config";
import { elevateCorporate } from "@brands/elevate/corporate.config";
import { elevateFaqPage } from "@brands/elevate/faq-page.config";
import { elevatePrivacyPage } from "@brands/elevate/privacy-page.config";
import { elevateTermsPage } from "@brands/elevate/terms-page.config";
import { elevateServicesPage } from "@brands/elevate/services-page.config";
import { elevateMassage } from "@brands/elevate/massage.config";
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
  /** "Corporate Wellness" page content. */
  corporate: CorporatePageConfig;
  /** "Frequently Asked Questions" page content. */
  faqPage: FaqPageConfig;
  /** "Privacy Policy" page content. */
  privacyPage: LegalPageConfig;
  /** "Terms of Service" page content (redesigned bespoke layout). */
  termsPage: TermsPageConfig;
  /** Standalone "Services" page content (same card grid as the home page). */
  servicesPage: ServicesPageConfig;
  /** Bespoke "Massage" service landing page content. */
  massagePage: MassagePageConfig;
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
    corporate: elevateCorporate,
    faqPage: elevateFaqPage,
    privacyPage: elevatePrivacyPage,
    termsPage: elevateTermsPage,
    servicesPage: elevateServicesPage,
    massagePage: elevateMassage,
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

/** The active brand's "Corporate Wellness" page content. */
export function getCorporateLanding(): CorporatePageConfig {
  return loadBrand().corporate;
}

/** The active brand's "Frequently Asked Questions" page content. */
export function getFaqPage(): FaqPageConfig {
  return loadBrand().faqPage;
}

/** The active brand's "Privacy Policy" page content. */
export function getPrivacyPage(): LegalPageConfig {
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

export function allBrands(): LoadedBrand[] {
  return Object.values(REGISTRY);
}
