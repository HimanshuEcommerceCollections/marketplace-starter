import { loadBrand } from "@/lib/brand/load";
import {
  ServiceCatalogSchema,
  type ServiceCatalog,
  type Service,
  type Category,
} from "./types";

let cache: ServiceCatalog | null = null;

/** Validate + memoize the active brand's services.json. */
export function getCatalog(): ServiceCatalog {
  if (!cache) cache = ServiceCatalogSchema.parse(loadBrand().services);
  return cache;
}

export function getServices(): Service[] {
  return getCatalog().services;
}

export function getCategories(): Category[] {
  return getCatalog().categories;
}

export function getService(id: string): Service | undefined {
  return getServices().find((s) => s.id === id);
}

export function getServicesByCategory(category: string): Service[] {
  return getServices().filter((s) => s.category === category);
}
