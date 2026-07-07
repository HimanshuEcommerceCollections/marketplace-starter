import {
  FLAG_KEYS,
  FLAG_REGISTRY,
  type FlagKey,
  type FlagState,
} from "./registry";
import { getBrandConfig } from "@/lib/brand/load";

/**
 * Resolve flags: brand overrides over registry defaults.
 * Deterministic & isomorphic (same result on server and client).
 */
export function resolveFlags(): FlagState {
  const brandFlags = getBrandConfig().flags ?? {};
  const out = {} as FlagState;
  for (const k of FLAG_KEYS) {
    out[k] = brandFlags[k] ?? FLAG_REGISTRY[k].default;
  }
  return out;
}

export function isEnabled(key: FlagKey): boolean {
  return resolveFlags()[key];
}
