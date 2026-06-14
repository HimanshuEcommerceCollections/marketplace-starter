import { loadBrand } from "@/lib/brand/load";
import { PricingTableSchema, type PricingTable } from "./types";

let cache: PricingTable | null = null;

/** Validate + memoize the active brand's pricing.v1.json. */
export function getPricingTable(): PricingTable {
  if (!cache) cache = PricingTableSchema.parse(loadBrand().pricing);
  return cache;
}
