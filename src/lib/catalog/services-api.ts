import { callApi } from "@/lib/api/server";
import { wholeDollarLabel, type GridCard } from "./cards";

/** A service as returned by the Elevate server API (camelCase; basePrice cents). */
export interface ApiService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  status: "DRAFT" | "ACTIVE" | "COMING_SOON" | "INACTIVE";
  /** Resolved SVG icon URL (config-managed, with fallback). */
  iconPath: string;
  /** Ordered cover image URLs; first is the default. */
  coverImages: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * SERVER-ONLY: fetch the publicly-visible (ACTIVE) services from the API,
 * oldest-first so the home grid keeps its authored order. Returns `null` on any
 * failure (server down, bad response) so callers fall back to the static catalog
 * — that keeps `next build` working even when the API is unreachable.
 */
export async function fetchPublicServices(): Promise<ApiService[] | null> {
  const res = await callApi<{ data?: ApiService[] }>(
    "/services?limit=100&sort=asc",
  );
  if (!res.ok || !Array.isArray(res.body?.data)) return null;
  return res.body.data;
}

/** A configuration option as returned by GET /services/:id/config. */
export interface ApiConfigOption {
  id: string;
  key: string;
  label: string;
  priceModifier: number;
  description: string | null;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

/** A configuration group (with its options) as returned by the config endpoint. */
export interface ApiConfigGroup {
  id: string;
  serviceId: string;
  key: string;
  label: string;
  selectionType: "SINGLE_SELECT" | "MULTI_SELECT";
  isRequired: boolean;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  options: ApiConfigOption[];
}

/** Service + nested configuration, as returned by GET /services/:id/config. */
export interface ApiServiceWithConfig {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  summary: string | null;
  serviceType: string | null;
  priceAmount: number;
  fromPrice: number | null;
  minBooking: number | null;
  currency: string;
  durationMinutes: number;
  locationMode: "ONSITE" | "REMOTE" | "HYBRID";
  locationModes: Array<"ONSITE" | "REMOTE" | "HYBRID">;
  badges: string[];
  iconPath: string;
  status: "DRAFT" | "ACTIVE" | "COMING_SOON" | "INACTIVE";
  configGroups: ApiConfigGroup[];
}

/** SERVER-ONLY: resolve a single public service by slug. Null on any failure. */
export async function fetchServiceBySlug(slug: string): Promise<ApiService | null> {
  const res = await callApi<{ data?: ApiService }>(`/services/by-slug/${slug}`);
  if (!res.ok || !res.body?.data) return null;
  return res.body.data;
}

/** SERVER-ONLY: fetch a service WITH its configuration groups by id. Null on failure. */
export async function fetchServiceConfig(
  serviceId: string,
): Promise<ApiServiceWithConfig | null> {
  const res = await callApi<{ data?: ApiServiceWithConfig }>(
    `/services/${serviceId}/config`,
  );
  if (!res.ok || !res.body?.data) return null;
  return res.body.data;
}

/** Adapt an API service into a grid card (links to the matching service page). */
export function apiServiceToGridCard(s: ApiService): GridCard {
  return {
    id: s.id,
    href: `/services/${s.slug}`,
    title: s.name,
    summary: s.description ?? undefined,
    // iconPath is now an uploaded SVG URL (not a lucide name) — render as <img>.
    iconUrl: s.iconPath,
    coverImages: s.coverImages,
    priceLabel:
      s.status === "ACTIVE" ? wholeDollarLabel(s.basePrice, "USD") : null,
    // Only COMING_SOON renders the coming-soon treatment (muted, no price,
    // booking disabled). DRAFT/INACTIVE are never sent to users, so they are
    // not — and must not be — treated as coming-soon.
    comingSoon: s.status === "COMING_SOON",
  };
}
