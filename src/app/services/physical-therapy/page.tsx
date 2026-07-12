import type { Metadata } from "next";
import { ServiceShowcasePage } from "@/components/marketing/service-showcase-page";
import { ServiceViewTracker } from "@/components/marketplace/service-view-tracker";
import { getShowcasePage, getBrandConfig } from "@/lib/brand/load";
import { getService } from "@/lib/catalog/load";
import { loadShowcaseBooking } from "@/lib/service-showcase/booking";
import { showcaseJsonLd } from "@/lib/service-showcase/seo";
import { JsonLd } from "@/lib/seo/json-ld";

// Re-fetch the live service config periodically so admin edits (focus cards,
// descriptions, prices) surface without a redeploy. Physical Therapy is
// coming-soon with no live config yet, so specialties/prices fall back to the
// static editorial content authored in physical-therapy.config.ts.
export const revalidate = 60;

const page = getShowcasePage("physical-therapy");

export const metadata: Metadata = {
  title: page.displayName,
  description: page.hero.sub,
};

/**
 * Bespoke, GSAP-animated Physical Therapy landing page built on the shared
 * service showcase template. Editorial copy comes from
 * physical-therapy.config.ts; specialties/price chips fall back to that config
 * while PT stays coming-soon (all CTAs collect interest via the waitlist). This
 * static segment takes precedence over the generic /services/[slug] route.
 */
export default async function PhysicalTherapyPage() {
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
