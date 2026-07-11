import type { Metadata } from "next";
import { LifeCoachingLandingPage } from "@/components/marketing/life-coaching-landing-page";
import { ServiceViewTracker } from "@/components/marketplace/service-view-tracker";
import { getLifeCoachingPage, getBrandConfig } from "@/lib/brand/load";
import { getService } from "@/lib/catalog/load";
import {
  fetchServiceBySlug,
  fetchServiceConfig,
} from "@/lib/catalog/services-api";
import { wholeDollarLabel } from "@/lib/catalog/cards";
import type {
  LifeCoachingBookingData,
  LifeCoachingPageConfig,
} from "@/lib/life-coaching/page";
import { JsonLd } from "@/lib/seo/json-ld";
import {
  service as serviceLd,
  breadcrumbList,
  faqPage,
  productOffer,
  type JsonLdThing,
} from "@/lib/seo/jsonld";
import { isEnabled } from "@/lib/flags/resolve";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

// Re-fetch the live service config periodically so admin edits (focus areas,
// durations, prices) surface without a redeploy. Editorial copy stays static;
// the booking options are resolved from the database (single source of truth).
export const revalidate = 60;

const page = getLifeCoachingPage();

export const metadata: Metadata = {
  title: "In-Home Life Coaching",
  description: page.hero.sub,
};

/**
 * Resolve the live "Choose your focus" (focus-area options) and "Simple, all-in
 * prices" (base + duration modifiers) from the service config API. Falls back to
 * the static config when the API is unavailable, so the page always renders.
 */
async function loadBooking(
  config: LifeCoachingPageConfig,
): Promise<LifeCoachingBookingData> {
  const fallback: LifeCoachingBookingData = {
    specialties: config.specialties.items,
    priceChips: config.pricing.chips,
  };

  const live = await fetchServiceBySlug("life-coaching");
  const cfg = live ? await fetchServiceConfig(live.id) : null;
  if (!cfg) return fallback;

  const base = cfg.priceAmount;
  const currency = cfg.currency;
  const activeOptions = (key: string) =>
    (
      cfg.configGroups.find((g) => g.key === key && g.status === "ACTIVE")
        ?.options ?? []
    ).filter((o) => o.status === "ACTIVE");

  // "Choose your focus" ← focus-area options (label + description).
  const focus = activeOptions("focus-area");
  const specialties = focus.length
    ? focus.map((o) => ({ title: o.label, body: o.description ?? "" }))
    : fallback.specialties;

  // "Simple, all-in prices" ← base priceAmount + each duration modifier.
  const durations = activeOptions("duration");
  const priceChips = durations.length
    ? durations.map((o) => ({
        duration: o.label.replace(/\bminutes?\b/i, "min"),
        price: wholeDollarLabel(base + o.priceModifier, currency) ?? "",
      }))
    : fallback.priceChips;

  return { specialties, priceChips };
}

/**
 * Bespoke, GSAP-animated Life Coaching landing page — an editorial migration of
 * the approved mock (hero → about → specialties → pricing → experience → FAQ →
 * CTA). Editorial copy is static (brands/<slug>/life-coaching.config.ts); the
 * specialty cards and price tiers are resolved live from the service config API.
 * This static segment takes precedence over the generic /services/[slug] route,
 * which excludes "life-coaching" from its generated params.
 */
export default async function LifeCoachingPage() {
  const lifeCoaching = getLifeCoachingPage();
  const config = getBrandConfig();
  const svc = getService("life-coaching");
  const booking = await loadBooking(lifeCoaching);

  const jsonLd: JsonLdThing[] = [
    serviceLd({
      name: "In-Home Life Coaching",
      description: svc?.summary ?? lifeCoaching.hero.sub ?? "",
      provider: config.name,
      url: `${SITE_URL}/services/life-coaching`,
      serviceType: svc?.service_type,
    }),
    breadcrumbList([
      { name: "Home", url: SITE_URL },
      { name: "Services", url: `${SITE_URL}/services` },
      { name: "Life Coaching", url: `${SITE_URL}/services/life-coaching` },
    ]),
  ];
  if (svc?.from_price != null) {
    jsonLd.push(
      productOffer({
        name: "In-Home Life Coaching",
        description: svc?.summary ?? undefined,
        priceMinor: svc.from_price,
        currency: svc.currency ?? "USD",
      }),
    );
  }
  if (isEnabled("faqJsonLd") && lifeCoaching.faq.items.length > 0) {
    jsonLd.push(
      faqPage(
        lifeCoaching.faq.items.map((f) => ({ q: f.question, a: f.answer })),
      ),
    );
  }

  return (
    <>
      <ServiceViewTracker
        serviceId="life-coaching"
        category={svc?.category}
        price={svc?.from_price}
        currency={svc?.currency ?? "USD"}
      />
      <LifeCoachingLandingPage config={lifeCoaching} booking={booking} />
      <JsonLd data={jsonLd} />
    </>
  );
}
