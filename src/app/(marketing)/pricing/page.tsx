import type { Metadata } from "next";
import { PricingLandingPage } from "@/components/marketing/pricing-landing-page";
import type { PricingServiceCardVM } from "@/components/pricing/pricing-service-grid";
import { getPricingPage } from "@/lib/brand/load";
import { getService, getServices } from "@/lib/catalog/load";
import { fetchPublicServices } from "@/lib/catalog/services-api";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent, all-inclusive pricing. The price you see at booking is the price you pay — tips and travel included.",
};

// ISR: re-fetch the live services periodically (same idiom as the home/services
// grids). The page still renders — via the static catalog fallback — if the API
// is unreachable at build/request time. A price edited in admin appears here on
// the next revalidation.
export const revalidate = 300;

/**
 * Source-agnostic input to the pricing-card merge. The set of services, their
 * status, and their price come live from the API; the static catalog is the
 * fallback (same shape). `icon` always comes from the static catalog because the
 * grid renders Phosphor glyphs by NAME — the API's `iconPath` is an SVG URL.
 */
interface PricingRow {
  slug: string;
  title: string;
  comingSoon: boolean;
  /** Admin-editable base price, minor units. 0 for services priced by options. */
  basePrice?: number;
  /** Display floor used only when basePrice is 0 (e.g. Beauty/Speech). */
  fromPrice?: number | null;
  currency: string;
  /** Lucide/Phosphor icon name (static catalog). */
  icon?: string;
}

export default async function PricingPage() {
  const config = getPricingPage();

  // Live services from the API; fall back to the static catalog if it's down.
  // Both branches normalize to PricingRow so the merge below is identical.
  const live = await fetchPublicServices();
  const rows: PricingRow[] = live
    ? live.map((s) => {
        // The API carries the base price + status; join the static catalog by
        // slug for the fields it doesn't (Phosphor icon name, the from-price
        // floor for option-priced services, currency).
        const staticSvc = getService(s.slug);
        return {
          slug: s.slug,
          title: s.name,
          comingSoon: s.status === "COMING_SOON",
          basePrice: s.basePrice,
          fromPrice: staticSvc?.from_price,
          currency: staticSvc?.currency ?? "USD",
          icon: staticSvc?.icon,
        };
      })
    : getServices().map((s) => ({
        slug: s.id,
        title: s.title,
        comingSoon: s.coming_soon,
        fromPrice: s.from_price,
        currency: s.currency,
        icon: s.icon,
      }));

  // Assemble the service cards from the (live-or-static) rows + per-service
  // display extras. Price = the admin-editable base price (so edits show here),
  // falling back to the display "from" band for services with a $0 base (priced
  // entirely by options); a config `priceMinor` still overrides both.
  const serviceCards: PricingServiceCardVM[] = rows
    .map((s): PricingServiceCardVM | null => {
      const ex = config.services.extras[s.slug];
      if (!ex) return null;
      const band = s.basePrice && s.basePrice > 0 ? s.basePrice : s.fromPrice;
      const amount = ex.priceMinor ?? band ?? 0;
      return {
        slug: s.slug,
        title: ex.title ?? s.title,
        icon: s.icon,
        price: formatMoney({ amount, currency: s.currency }).replace(/\.00$/, ""),
        duration: ex.duration,
        points: ex.points,
        coordinator: !!ex.coordinator,
        ctaLabel: s.comingSoon
          ? config.services.ctaComingSoon
          : config.services.ctaActive,
        href: s.comingSoon
          ? `/waitlist?service=${s.slug}`
          : `/book?service=${s.slug}`,
      };
    })
    .filter((c): c is PricingServiceCardVM => c !== null);

  return <PricingLandingPage config={config} serviceCards={serviceCards} />;
}
