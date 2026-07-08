import { MassageHero } from "@/components/massage/massage-hero";
import { MassageAbout } from "@/components/massage/massage-about";
import { MassageSpecialties } from "@/components/massage/massage-specialties";
import { MassagePricing } from "@/components/massage/massage-pricing";
import { MassageExpect } from "@/components/massage/massage-expect";
import { MassageFaq } from "@/components/massage/massage-faq";
import { MassageCta } from "@/components/massage/massage-cta";
import type {
  MassagePageConfig,
  MassageBookingData,
} from "@/lib/massage/page";

export interface MassageLandingPageProps {
  config: MassagePageConfig;
  /** Booking options resolved from the live service config API. */
  booking: MassageBookingData;
}

/**
 * Composes the redesigned Massage page from its bespoke, full-bleed sections
 * (hero → about split → specialties dark band → price chips → before/during/
 * after dark band → FAQ → CTA). Server component — each section opts into
 * "use client" for its own GSAP.
 */
export function MassageLandingPage({ config, booking }: MassageLandingPageProps) {
  return (
    <>
      <MassageHero {...config.hero} />
      <MassageAbout {...config.about} />
      <MassageSpecialties
        {...config.specialties}
        items={booking.specialties}
        addOns={booking.addOns}
      />
      <MassagePricing {...config.pricing} chips={booking.priceChips} />
      <MassageExpect {...config.expect} />
      <MassageFaq {...config.faq} />
      <MassageCta {...config.cta} />
    </>
  );
}
