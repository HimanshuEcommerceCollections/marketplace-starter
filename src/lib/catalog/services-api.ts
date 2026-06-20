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
