import { ShowcaseHero } from "@/components/service-showcase/showcase-hero";
import { ShowcaseAbout } from "@/components/service-showcase/showcase-about";
import { ShowcaseSpecialties } from "@/components/service-showcase/showcase-specialties";
import { ShowcasePricing } from "@/components/service-showcase/showcase-pricing";
import { ShowcaseExpect } from "@/components/service-showcase/showcase-expect";
import { ShowcaseFaq } from "@/components/service-showcase/showcase-faq";
import { ShowcaseCta } from "@/components/service-showcase/showcase-cta";
import type {
  ShowcasePageConfig,
  ShowcaseBookingData,
} from "@/lib/service-showcase/page";

export interface ServiceShowcasePageProps {
  config: ShowcasePageConfig;
  /** Booking options resolved from the live service config API. */
  booking: ShowcaseBookingData;
}

/**
 * Composes a bespoke, full-bleed service showcase page from its shared
 * sections (hero → about split → specialties dark band → price chips →
 * before/during/after dark band → FAQ → CTA) — the same approved mock the
 * Massage page uses. The `ssp--<slug>` variant class selects the service's
 * band photography in src/styles/service-showcase.css. Server component —
 * each section opts into "use client" for its own GSAP.
 */
export function ServiceShowcasePage({ config, booking }: ServiceShowcasePageProps) {
  return (
    <div className={`ssp--${config.slug}`}>
      <ShowcaseHero {...config.hero} />
      <ShowcaseAbout {...config.about} />
      <ShowcaseSpecialties
        {...config.specialties}
        items={booking.specialties}
        addOns={booking.addOns}
      />
      <ShowcasePricing {...config.pricing} chips={booking.priceChips} />
      <ShowcaseExpect {...config.expect} />
      <ShowcaseFaq {...config.faq} />
      <ShowcaseCta {...config.cta} />
    </div>
  );
}
