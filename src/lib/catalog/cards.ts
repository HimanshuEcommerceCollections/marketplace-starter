import { formatMoney } from "@/lib/money";
import type { Service } from "@/lib/catalog/types";

/**
 * Source-agnostic data for a marketplace grid card. Built from either a static
 * catalog Service or an API category, so the grid section renders the same way
 * regardless of where the data came from.
 */
export interface GridCard {
  id: string;
  href: string;
  title: string;
  summary?: string;
  icon?: string; // lucide icon name (static catalog services)
  iconUrl?: string; // uploaded SVG icon URL (API categories); takes precedence
  coverImages?: string[]; // ordered cover image URLs (API categories)
  priceLabel?: string | null; // whole-dollar label e.g. "$109"; null = no price
  comingSoon?: boolean;
}

/** Whole-dollar price label (e.g. 10900 USD -> "$109"). */
export function wholeDollarLabel(
  amount: number | null | undefined,
  currency: string,
): string | null {
  if (amount == null) return null;
  return formatMoney({ amount, currency }).replace(/\.00$/, "");
}

/** Adapt a static catalog Service into a grid card. */
export function serviceToGridCard(service: Service): GridCard {
  return {
    id: service.id,
    href: `/services/${service.landing_slug ?? service.id}`,
    title: service.title,
    summary: service.summary,
    icon: service.icon,
    iconUrl: service.icon_path,
    coverImages: service.cover_images.length ? service.cover_images : undefined,
    priceLabel: service.coming_soon
      ? null
      : wholeDollarLabel(service.from_price, service.currency),
    comingSoon: service.coming_soon,
  };
}
