import { getActiveBrandId, type BrandId } from "./registry";
import type { BrandConfig, BrandContent } from "./types";
import type {
  ServiceLandingConfig,
  ServiceLandingRegistry,
} from "@/lib/services/landing";

import { elevateConfig } from "@brands/elevate/brand.config";
import { elevateContent } from "@brands/elevate/content.config";
import { elevateServiceLanding } from "@brands/elevate/service-landing.config";
import elevateServices from "@brands/elevate/services.json";
import elevatePricing from "@brands/elevate/pricing.v1.json";

export interface LoadedBrand {
  id: BrandId;
  config: BrandConfig;
  content: BrandContent;
  /** Per-service landing page configs, keyed by service slug. */
  serviceLanding: ServiceLandingRegistry;
  /** Raw JSON — validated lazily by catalog/pricing loaders via zod. */
  services: unknown;
  pricing: unknown;
}

const REGISTRY: Record<BrandId, LoadedBrand> = {
  elevate: {
    id: "elevate",
    config: elevateConfig,
    content: elevateContent,
    serviceLanding: elevateServiceLanding,
    services: elevateServices,
    pricing: elevatePricing,
  },
};

export function loadBrand(): LoadedBrand {
  return REGISTRY[getActiveBrandId()];
}

export function getBrandConfig(): BrandConfig {
  return loadBrand().config;
}

export function getBrandContent(): BrandContent {
  return loadBrand().content;
}

/** Look up the landing-page config for a service slug (undefined if none). */
export function getServiceLanding(
  slug: string,
): ServiceLandingConfig | undefined {
  return loadBrand().serviceLanding[slug];
}

/** All service slugs that have a dedicated landing page in the active brand. */
export function getServiceLandingSlugs(): string[] {
  return Object.keys(loadBrand().serviceLanding);
}

export function allBrands(): LoadedBrand[] {
  return Object.values(REGISTRY);
}
