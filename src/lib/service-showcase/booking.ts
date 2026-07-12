import {
  fetchServiceBySlug,
  fetchServiceConfig,
} from "@/lib/catalog/services-api";
import { wholeDollarLabel } from "@/lib/catalog/cards";
import type {
  ShowcaseBookingData,
  ShowcasePageConfig,
} from "@/lib/service-showcase/page";

export interface ShowcaseBookingResult {
  booking: ShowcaseBookingData;
  /** Base priceAmount (minor units) when the live config resolved. */
  displayedPrice?: number;
  currency: string;
}

/**
 * Resolve the live "Choose your focus" + "Simple, all-in prices" (+ optional
 * add-ons) data for a showcase page. Booking options are never authored
 * statically — the database is the single source of truth; the page config
 * only names which groups feed which section (mirrors the Massage page).
 */
export async function loadShowcaseBooking(
  page: ShowcasePageConfig,
): Promise<ShowcaseBookingResult> {
  // Static editorial fallback for coming-soon services with no live config
  // (mirrors the Yoga page). Live data below always takes precedence.
  const fallbackSpecialties = page.specialties.items ?? [];
  const fallbackChips = page.pricing.chips ?? [];

  const live = await fetchServiceBySlug(page.slug);
  const cfg = live ? await fetchServiceConfig(live.id) : null;
  if (!cfg) {
    return {
      booking: {
        specialties: fallbackSpecialties,
        addOns: [],
        priceChips: fallbackChips,
      },
      currency: "USD",
    };
  }

  const currency = cfg.currency;
  const base = cfg.priceAmount;
  const activeOptions = (key?: string) =>
    key
      ? (
          cfg.configGroups.find((g) => g.key === key && g.status === "ACTIVE")
            ?.options ?? []
        ).filter((o) => o.status === "ACTIVE")
      : [];

  // "Choose your focus" ← the focus group's options; fall back to static items.
  const liveSpecialties = activeOptions(page.booking.focusGroupKey).map((o) => ({
    title: o.label,
    body: o.description ?? "",
  }));
  // "Simple, all-in prices" ← base priceAmount + each duration modifier;
  // fall back to static chips.
  const liveChips = activeOptions(page.booking.durationGroupKey).map((o) => ({
    duration: o.label.replace(/\bminutes?\b/i, "min"),
    price: wholeDollarLabel(base + o.priceModifier, currency) ?? "",
  }));

  const booking: ShowcaseBookingData = {
    specialties: liveSpecialties.length ? liveSpecialties : fallbackSpecialties,
    // Optional add-ons ← label + description. The surcharge is not surfaced
    // on the marketing page; it applies in the booking flow.
    addOns: activeOptions(page.booking.addOnsGroupKey).map((o) => ({
      title: o.label,
      body: o.description ?? "",
    })),
    priceChips: liveChips.length ? liveChips : fallbackChips,
  };

  return { booking, displayedPrice: base, currency };
}
