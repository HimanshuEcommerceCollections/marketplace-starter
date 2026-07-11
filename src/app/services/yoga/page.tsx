import type { Metadata } from "next";
import { YogaLandingPage } from "@/components/marketing/yoga-landing-page";
import { ServiceViewTracker } from "@/components/marketplace/service-view-tracker";
import { getYogaPage, getBrandConfig } from "@/lib/brand/load";
import { getService } from "@/lib/catalog/load";
import {
  fetchServiceBySlug,
  fetchServiceConfig,
} from "@/lib/catalog/services-api";
import { wholeDollarLabel } from "@/lib/catalog/cards";
import type { YogaBookingData, YogaPageConfig } from "@/lib/yoga/page";
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

// Re-fetch the live service config periodically so admin edits (yoga styles,
// durations, prices) surface without a redeploy. Editorial copy stays static;
// the booking options are resolved from the database (single source of truth).
export const revalidate = 60;

const page = getYogaPage();

export const metadata: Metadata = {
  title: "In-Home Yoga",
  description: page.hero.sub,
};

/**
 * Resolve the live "Choose your focus" (yoga-style options) and "Simple, all-in
 * prices" (base + duration modifiers) from the service config API. Falls back to
 * the static config when the API is unavailable, so the page always renders.
 */
async function loadBooking(config: YogaPageConfig): Promise<YogaBookingData> {
  const fallback: YogaBookingData = {
    specialties: config.specialties.items,
    priceChips: config.pricing.chips,
  };

  const live = await fetchServiceBySlug("yoga");
  const cfg = live ? await fetchServiceConfig(live.id) : null;
  if (!cfg) return fallback;

  const base = cfg.priceAmount;
  const currency = cfg.currency;
  const activeOptions = (key: string) =>
    (
      cfg.configGroups.find((g) => g.key === key && g.status === "ACTIVE")
        ?.options ?? []
    ).filter((o) => o.status === "ACTIVE");

  // "Choose your focus" ← yoga-style options (label + description).
  const styles = activeOptions("yoga-style");
  const specialties = styles.length
    ? styles.map((o) => ({ title: o.label, body: o.description ?? "" }))
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
 * Bespoke, GSAP-animated Yoga landing page — an editorial migration of the
 * approved mock (hero → about → specialties → pricing → experience → FAQ →
 * CTA). Editorial copy is static (brands/<slug>/yoga.config.ts); the specialty
 * cards and price tiers are resolved live from the service config API. This
 * static segment takes precedence over the generic /services/[slug] route,
 * which excludes "yoga" from its generated params.
 */
export default async function YogaPage() {
  const yoga = getYogaPage();
  const config = getBrandConfig();
  const svc = getService("yoga");
  const booking = await loadBooking(yoga);

  const jsonLd: JsonLdThing[] = [
    serviceLd({
      name: "In-Home Yoga",
      description: svc?.summary ?? yoga.hero.sub ?? "",
      provider: config.name,
      url: `${SITE_URL}/services/yoga`,
      serviceType: svc?.service_type,
    }),
    breadcrumbList([
      { name: "Home", url: SITE_URL },
      { name: "Services", url: `${SITE_URL}/services` },
      { name: "Yoga", url: `${SITE_URL}/services/yoga` },
    ]),
  ];
  if (svc?.from_price != null) {
    jsonLd.push(
      productOffer({
        name: "In-Home Yoga",
        description: svc?.summary ?? undefined,
        priceMinor: svc.from_price,
        currency: svc.currency ?? "USD",
      }),
    );
  }
  if (isEnabled("faqJsonLd") && yoga.faq.items.length > 0) {
    jsonLd.push(
      faqPage(yoga.faq.items.map((f) => ({ q: f.question, a: f.answer }))),
    );
  }

  return (
    <>
      <ServiceViewTracker
        serviceId="yoga"
        category={svc?.category}
        price={svc?.from_price}
        currency={svc?.currency ?? "USD"}
      />
      <YogaLandingPage config={yoga} booking={booking} />
      <JsonLd data={jsonLd} />
    </>
  );
}
