/**
 * Canonical brand identifiers. The SAME slug is used for NEXT_PUBLIC_BRAND, the
 * brands/<slug>/ folder, the [data-brand="<slug>"] CSS scope, the registry key,
 * and the booking_request.brand enum.
 */
export const BRAND_IDS = ["elevate", "apex", "events", "education"] as const;
export type BrandId = (typeof BRAND_IDS)[number];

export const DEFAULT_BRAND: BrandId = "elevate";

export function isBrandId(value: unknown): value is BrandId {
  return (
    typeof value === "string" &&
    (BRAND_IDS as readonly string[]).includes(value)
  );
}

/**
 * Resolve the active brand from NEXT_PUBLIC_BRAND.
 * - missing/empty -> DEFAULT_BRAND (dev convenience) with a warning
 * - present but invalid -> throws (never silently deploy the wrong brand)
 */
export function getActiveBrandId(): BrandId {
  const raw = process.env.NEXT_PUBLIC_BRAND;
  if (raw == null || raw === "") {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[brand] NEXT_PUBLIC_BRAND is not set — defaulting to "${DEFAULT_BRAND}".`,
      );
    }
    return DEFAULT_BRAND;
  }
  if (!isBrandId(raw)) {
    throw new Error(
      `[brand] Invalid NEXT_PUBLIC_BRAND="${raw}". Expected one of: ${BRAND_IDS.join(", ")}`,
    );
  }
  return raw;
}
