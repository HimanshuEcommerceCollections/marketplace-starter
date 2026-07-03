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
  /** Unit the from-price maps to, e.g. "60 min" (shortest duration) or "session". */
  priceUnit?: string;
  comingSoon?: boolean;
  /** Booking slug for /book?service=<slug> (API card ids are UUIDs, not slugs). */
  slug?: string;
  /** Category id (-> catalog categories) driving the showcase filter tabs. */
  category?: string;
  /** Static sub-style pills (display only), e.g. ["Swedish", "Deep Tissue"]. */
  tags?: string[];
  /** Featured cards span two columns in the showcase grid. */
  featured?: boolean;
  /** Corner ribbon label for featured cards, e.g. "Most Popular". */
  tagLabel?: string;
}

/** Whole-dollar price label (e.g. 10900 USD -> "$109"). */
export function wholeDollarLabel(
  amount: number | null | undefined,
  currency: string,
): string | null {
  if (amount == null) return null;
  return formatMoney({ amount, currency }).replace(/\.00$/, "");
}

/**
 * Unit the from-price corresponds to: the shortest bookable duration
 * ("60 min") when the service has a duration option, otherwise "session".
 */
export function priceUnitForService(service: Service): string {
  const duration = service.config_options.find((o) => o.id === "duration");
  const first = duration?.choices?.[0];
  if (!first) return "session";
  return /^\d+$/.test(first.id) ? `${first.id} min` : first.label;
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
    priceUnit: service.coming_soon ? undefined : priceUnitForService(service),
    comingSoon: service.coming_soon,
    slug: service.id,
    category: service.category,
    tags: service.tags.length ? service.tags : undefined,
    featured: service.featured || undefined,
    tagLabel: service.tag_label,
  };
}
