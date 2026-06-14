import { getActiveBrandId, type BrandId } from "./registry";
import type { BrandConfig, BrandContent } from "./types";

import { elevateConfig } from "@brands/elevate/brand.config";
import { elevateContent } from "@brands/elevate/content.config";
import elevateServices from "@brands/elevate/services.json";
import elevatePricing from "@brands/elevate/pricing.v1.json";

import { apexConfig } from "@brands/apex/brand.config";
import { apexContent } from "@brands/apex/content.config";
import apexServices from "@brands/apex/services.json";
import apexPricing from "@brands/apex/pricing.v1.json";

import { eventsConfig } from "@brands/events/brand.config";
import { eventsContent } from "@brands/events/content.config";
import eventsServices from "@brands/events/services.json";
import eventsPricing from "@brands/events/pricing.v1.json";

import { educationConfig } from "@brands/education/brand.config";
import { educationContent } from "@brands/education/content.config";
import educationServices from "@brands/education/services.json";
import educationPricing from "@brands/education/pricing.v1.json";

export interface LoadedBrand {
  id: BrandId;
  config: BrandConfig;
  content: BrandContent;
  /** Raw JSON — validated lazily by catalog/pricing loaders via zod. */
  services: unknown;
  pricing: unknown;
}

const REGISTRY: Record<BrandId, LoadedBrand> = {
  elevate: {
    id: "elevate",
    config: elevateConfig,
    content: elevateContent,
    services: elevateServices,
    pricing: elevatePricing,
  },
  apex: {
    id: "apex",
    config: apexConfig,
    content: apexContent,
    services: apexServices,
    pricing: apexPricing,
  },
  events: {
    id: "events",
    config: eventsConfig,
    content: eventsContent,
    services: eventsServices,
    pricing: eventsPricing,
  },
  education: {
    id: "education",
    config: educationConfig,
    content: educationContent,
    services: educationServices,
    pricing: educationPricing,
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

export function allBrands(): LoadedBrand[] {
  return Object.values(REGISTRY);
}
