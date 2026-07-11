import { LifeCoachingHero } from "@/components/life-coaching/lc-hero";
import { LifeCoachingAbout } from "@/components/life-coaching/lc-about";
import { LifeCoachingSpecialties } from "@/components/life-coaching/lc-specialties";
import { LifeCoachingPricing } from "@/components/life-coaching/lc-pricing";
import { LifeCoachingExpect } from "@/components/life-coaching/lc-expect";
import { LifeCoachingFaq } from "@/components/life-coaching/lc-faq";
import { LifeCoachingCta } from "@/components/life-coaching/lc-cta";
import type { LifeCoachingPageConfig, LifeCoachingBookingData } from "@/lib/life-coaching/page";

export interface LifeCoachingLandingPageProps {
  config: LifeCoachingPageConfig;
  /** Live booking options (specialties + price chips) resolved from the API. */
  booking: LifeCoachingBookingData;
}

/**
 * Composes the redesigned LifeCoaching page from its bespoke, full-bleed sections
 * (centered photo hero → about split → specialties dark band → price chips →
 * before/during/after dark band → FAQ → CTA). Editorial copy is static config;
 * the specialty cards and price chips are resolved live from the service config
 * API (with the static config as fallback). Server component — each section
 * opts into "use client" for its own GSAP.
 */
export function LifeCoachingLandingPage({ config, booking }: LifeCoachingLandingPageProps) {
  return (
    <>
      <LifeCoachingHero {...config.hero} />
      <LifeCoachingAbout {...config.about} />
      <LifeCoachingSpecialties {...config.specialties} items={booking.specialties} />
      <LifeCoachingPricing {...config.pricing} chips={booking.priceChips} />
      <LifeCoachingExpect {...config.expect} />
      <LifeCoachingFaq {...config.faq} />
      <LifeCoachingCta {...config.cta} />
    </>
  );
}
