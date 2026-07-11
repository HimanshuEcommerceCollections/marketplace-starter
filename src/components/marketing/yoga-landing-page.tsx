import { YogaHero } from "@/components/yoga/yoga-hero";
import { YogaAbout } from "@/components/yoga/yoga-about";
import { YogaSpecialties } from "@/components/yoga/yoga-specialties";
import { YogaPricing } from "@/components/yoga/yoga-pricing";
import { YogaExpect } from "@/components/yoga/yoga-expect";
import { YogaFaq } from "@/components/yoga/yoga-faq";
import { YogaCta } from "@/components/yoga/yoga-cta";
import type { YogaPageConfig, YogaBookingData } from "@/lib/yoga/page";

export interface YogaLandingPageProps {
  config: YogaPageConfig;
  /** Live booking options (specialties + price chips) resolved from the API. */
  booking: YogaBookingData;
}

/**
 * Composes the redesigned Yoga page from its bespoke, full-bleed sections
 * (centered photo hero → about split → specialties dark band → price chips →
 * before/during/after dark band → FAQ → CTA). Editorial copy is static config;
 * the specialty cards and price chips are resolved live from the service config
 * API (with the static config as fallback). Server component — each section
 * opts into "use client" for its own GSAP.
 */
export function YogaLandingPage({ config, booking }: YogaLandingPageProps) {
  return (
    <>
      <YogaHero {...config.hero} />
      <YogaAbout {...config.about} />
      <YogaSpecialties {...config.specialties} items={booking.specialties} />
      <YogaPricing {...config.pricing} chips={booking.priceChips} />
      <YogaExpect {...config.expect} />
      <YogaFaq {...config.faq} />
      <YogaCta {...config.cta} />
    </>
  );
}
