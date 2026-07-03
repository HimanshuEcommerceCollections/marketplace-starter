import type { Service } from "@/lib/catalog/types";
import type { PricingTable } from "@/lib/pricing/types";
import type { ApiServiceWithConfig } from "@/lib/catalog/services-api";

export interface LiveBookingInputs {
  /** Catalog-shaped service the wizard renders (config_options derived from live groups). */
  service: Service;
  /** Synthetic pricing table (live base + option modifiers) so computePrice() yields live prices. */
  pricing: PricingTable;
  /** The live service UUID, for the booking + config/price APIs. */
  serviceId: string;
  /** groupKey -> (optionKey -> option UUID) — resolves wizard selections to backend option ids. */
  optionIdByGroupKey: Record<string, Record<string, string>>;
  /** Service duration (minutes) — used to derive scheduledEnd from the chosen start. */
  durationMinutes: number;
}

const MODE_TO_CATALOG: Record<string, "onsite" | "remote" | "hybrid"> = {
  ONSITE: "onsite",
  REMOTE: "remote",
  HYBRID: "hybrid",
};

/**
 * Adapt a live service + its configuration into the inputs the booking wizard
 * expects. Only ACTIVE groups and ACTIVE options are exposed. The catalog
 * `Service.id` and the pricing key are both the slug, so the existing
 * client pricing engine produces live-accurate prices with no wizard changes;
 * `serviceId` (UUID) + `optionIdByGroupKey` carry what the booking API needs.
 */
export function liveToBookingInputs(live: ApiServiceWithConfig): LiveBookingInputs {
  const activeGroups = live.configGroups
    .filter((g) => g.status === "ACTIVE")
    .map((g) => ({ ...g, options: g.options.filter((o) => o.status === "ACTIVE") }))
    .filter((g) => g.options.length > 0);

  const currency = live.currency;
  const locationModes = (live.locationModes.length ? live.locationModes : [live.locationMode])
    .map((m) => MODE_TO_CATALOG[m] ?? "onsite");

  const service: Service = {
    id: live.slug,
    title: live.name,
    summary: live.summary ?? live.description ?? "",
    description: live.description ?? "",
    category: live.serviceType ?? "service",
    service_type: live.serviceType ?? "service",
    pricing_ref: live.slug,
    currency,
    from_price: live.fromPrice ?? live.priceAmount,
    min_booking: live.minBooking ?? undefined,
    icon: undefined,
    landing_slug: undefined,
    coming_soon: live.status === "COMING_SOON",
    featured: false,
    tag_label: undefined,
    tags: [],
    image: undefined,
    cover_images: [],
    config_options: activeGroups.map((g) => ({
      id: g.key,
      label: g.label,
      input: g.selectionType === "SINGLE_SELECT" ? "select" : "multiselect",
      required: g.isRequired,
      choices: g.options.map((o) => ({ id: o.key, label: o.label })),
    })),
    location_modes: locationModes.length ? locationModes : ["onsite"],
    badges: live.badges ?? [],
    faq: [],
  };

  const pricing: PricingTable = {
    version: "live",
    currency,
    services: {
      [live.slug]: {
        base_price: { amount: live.priceAmount, currency },
        modifiers: activeGroups.map((g) => ({
          id: g.key,
          label: g.label,
          type: g.selectionType === "SINGLE_SELECT" ? "select" : "multiselect",
          applies: "flat",
          options: g.options.map((o) => ({
            id: o.key,
            label: o.label,
            delta: { amount: o.priceModifier, currency },
          })),
        })),
        fees: [],
      },
    },
  };

  const optionIdByGroupKey: Record<string, Record<string, string>> = {};
  for (const g of activeGroups) {
    optionIdByGroupKey[g.key] = Object.fromEntries(g.options.map((o) => [o.key, o.id]));
  }

  return {
    service,
    pricing,
    serviceId: live.id,
    optionIdByGroupKey,
    durationMinutes: live.durationMinutes,
  };
}
