import type { Metadata } from "next";
import { ServiceShowcasePage } from "@/components/marketing/service-showcase-page";
import { ServiceViewTracker } from "@/components/marketplace/service-view-tracker";
import { getShowcasePage, getBrandConfig } from "@/lib/brand/load";
import { getService } from "@/lib/catalog/load";
import { loadShowcaseBooking } from "@/lib/service-showcase/booking";
import { showcaseJsonLd } from "@/lib/service-showcase/seo";
import { JsonLd } from "@/lib/seo/json-ld";

// Re-fetch the live service config periodically so admin edits (focus cards,
// descriptions, prices) surface without a redeploy. When the API is
// unavailable, specialties/prices fall back to the static editorial content in
// personal-training.config.ts.
export const revalidate = 60;

const page = getShowcasePage("personal-training");

export const metadata: Metadata = {
  title: page.displayName,
  description: page.hero.sub,
};

/**
 * Bespoke, GSAP-animated Personal Training landing page built on the shared
 * service showcase template. Editorial copy comes from
 * personal-training.config.ts; booking options (focus cards, price chips)
 * resolve live from the service config API, falling back to the config's static
 * content. This static segment takes precedence over the generic
 * /services/[slug] route.
 */
export default async function PersonalTrainingPage() {
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
