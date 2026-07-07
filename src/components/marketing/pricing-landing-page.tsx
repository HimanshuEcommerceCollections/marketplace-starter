import { PricingHero } from "@/components/pricing/pricing-hero";
import {
  PricingServiceGrid,
  type PricingServiceCardVM,
} from "@/components/pricing/pricing-service-grid";
import { PricingPacks } from "@/components/pricing/pricing-packs";
import { PricingGuarantees } from "@/components/pricing/pricing-guarantees";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { PricingCta } from "@/components/pricing/pricing-cta";
import type { PricingPageConfig } from "@/lib/pricing/page";

export interface PricingLandingPageProps {
  config: PricingPageConfig;
  /** Service cards assembled server-side from the catalog + config extras. */
  serviceCards: PricingServiceCardVM[];
}

/**
 * Composes the redesigned Pricing page from its bespoke, full-bleed sections
 * (hero → service grid + factors → session packs → guarantees → FAQ → CTA).
 * Server component — each section opts into "use client" for its own GSAP.
 */
export function PricingLandingPage({
  config,
  serviceCards,
}: PricingLandingPageProps) {
  return (
    <>
      <PricingHero {...config.hero} />
      <PricingServiceGrid
        eyebrow={config.services.eyebrow}
        heading={config.services.heading}
        subheading={config.services.subheading}
        cards={serviceCards}
        factors={config.services.factors}
      />
      <PricingPacks {...config.packs} />
      <PricingGuarantees items={config.guarantees} />
      <PricingFaq {...config.faq} />
      <PricingCta {...config.cta} />
    </>
  );
}
