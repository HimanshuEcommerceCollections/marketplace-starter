import type { Metadata } from "next";
import { ServiceShowcasePage } from "@/components/marketing/service-showcase-page";
import { ServiceViewTracker } from "@/components/marketplace/service-view-tracker";
import { getShowcasePage, getBrandConfig } from "@/lib/brand/load";
import { getService } from "@/lib/catalog/load";
import { loadShowcaseBooking } from "@/lib/service-showcase/booking";
import { showcaseJsonLd } from "@/lib/service-showcase/seo";
import { JsonLd } from "@/lib/seo/json-ld";

// Re-fetch the live service config periodically so admin edits (focus cards,
// descriptions, prices) surface without a redeploy. Speech Therapy is
// coming-soon with no live config yet, so specialties/prices fall back to the
// static editorial content authored in speech-therapy.config.ts.
export const revalidate = 60;

const page = getShowcasePage("speech-therapy");

export const metadata: Metadata = {
  title: page.displayName,
  description: page.hero.sub,
};

/**
 * Bespoke, GSAP-animated Speech Therapy landing page built on the shared
 * service showcase template. Editorial copy comes from speech-therapy.config.ts;
 * specialties/price chips fall back to that config while Speech Therapy stays
 * coming-soon (all CTAs collect interest via the waitlist). This static segment
 * takes precedence over the generic /services/[slug] route.
 */
export default async function SpeechTherapyPage() {
  const config = getBrandConfig();
  const svc = getService(page.slug);
  const { booking, displayedPrice, currency } = await loadShowcaseBooking(page);

  return (
    <>
      <ServiceViewTracker
        serviceId={page.slug}
        category={svc?.category}
        price={displayedPrice ?? svc?.from_price}
        currency={currency}
      />
      <ServiceShowcasePage config={page} booking={booking} />
      <JsonLd
        data={showcaseJsonLd({
          page,
          svc,
          provider: config.name,
          displayedPrice,
          currency,
        })}
      />
    </>
  );
}
