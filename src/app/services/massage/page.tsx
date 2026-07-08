import type { Metadata } from "next";
import { MassageLandingPage } from "@/components/marketing/massage-landing-page";
import { ServiceViewTracker } from "@/components/marketplace/service-view-tracker";
import { getMassagePage, getBrandConfig } from "@/lib/brand/load";
import { getService } from "@/lib/catalog/load";
import {
  fetchServiceBySlug,
  fetchServiceConfig,
} from "@/lib/catalog/services-api";
import { wholeDollarLabel } from "@/lib/catalog/cards";
import type { MassageBookingData } from "@/lib/massage/page";
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

// Re-fetch the live service config periodically so admin edits (session types,
// add-ons, descriptions, prices) surface without a redeploy. Booking options are
// never authored statically — the database is the single source of truth.
export const revalidate = 60;

const page = getMassagePage();

export const metadata: Metadata = {
  title: "In-Home Massage",
  description: page.hero.sub,
};

const EMPTY_BOOKING: MassageBookingData = {
  specialties: [],
  addOns: [],
  priceChips: [],
};

/** Resolve the live "Choose your focus" + "Simple, all-in prices" data. */
async function loadBooking(): Promise<{
  booking: MassageBookingData;
  displayedPrice?: number;
  currency: string;
}> {
  const live = await fetchServiceBySlug("massage");
  const cfg = live ? await fetchServiceConfig(live.id) : null;
  if (!cfg) return { booking: EMPTY_BOOKING, currency: "USD" };

  const currency = cfg.currency;
  const base = cfg.priceAmount;
  const activeOptions = (key: string) =>
    (cfg.configGroups.find((g) => g.key === key && g.status === "ACTIVE")
      ?.options ?? []).filter((o) => o.status === "ACTIVE");

  const booking: MassageBookingData = {
    // "Choose your focus" ← session-type options (label + description).
    specialties: activeOptions("session-type").map((o) => ({
      title: o.label,
      body: o.description ?? "",
    })),
    // Add-ons ← add-on options (label + description). The surcharge is not
    // surfaced on the marketing page; it applies in the booking flow.
    addOns: activeOptions("add-ons").map((o) => ({
      title: o.label,
      body: o.description ?? "",
    })),
    // "Simple, all-in prices" ← base priceAmount + each duration modifier.
    priceChips: activeOptions("duration").map((o) => ({
      duration: o.label.replace(/\bminutes?\b/i, "min"),
      price: wholeDollarLabel(base + o.priceModifier, currency) ?? "",
    })),
  };

  return { booking, displayedPrice: base, currency };
}

/**
 * Bespoke, GSAP-animated Massage landing page. Editorial copy comes from
 * massage.config.ts; all booking options (session types, add-ons, price tiers)
 * are resolved live from the service config API. This static segment takes
 * precedence over the generic /services/[slug] route.
 */
export default async function MassagePage() {
  const massage = getMassagePage();
  const config = getBrandConfig();
  const svc = getService("massage");
  const { booking, displayedPrice, currency } = await loadBooking();

  const jsonLd: JsonLdThing[] = [
    serviceLd({
      name: "In-Home Massage",
      description: svc?.summary ?? massage.hero.sub ?? "",
      provider: config.name,
      url: `${SITE_URL}/services/massage`,
      serviceType: svc?.service_type,
    }),
    breadcrumbList([
      { name: "Home", url: SITE_URL },
      { name: "Services", url: `${SITE_URL}/services` },
      { name: "Massage", url: `${SITE_URL}/services/massage` },
    ]),
  ];
  if (displayedPrice != null) {
    jsonLd.push(
      productOffer({
        name: "In-Home Massage",
        description: svc?.summary ?? undefined,
        priceMinor: displayedPrice,
        currency,
      }),
    );
  }
  if (isEnabled("faqJsonLd") && massage.faq.items.length > 0) {
    jsonLd.push(
      faqPage(massage.faq.items.map((f) => ({ q: f.question, a: f.answer }))),
    );
  }

  return (
    <>
      <ServiceViewTracker
        serviceId="massage"
        category={svc?.category}
        price={displayedPrice ?? svc?.from_price}
        currency={currency}
      />
      <MassageLandingPage config={massage} booking={booking} />
      <JsonLd data={jsonLd} />
    </>
  );
}
