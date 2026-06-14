import {
  FLAG_KEYS,
  FLAG_REGISTRY,
  type FlagKey,
  type FlagState,
} from "./registry";
import { getBrandConfig } from "@/lib/brand/load";

// NEXT_PUBLIC_* vars must be referenced STATICALLY to be inlined on the client.
// Per-flag dynamic env lookup would be undefined in the browser, so we wire the
// one documented override (demo mode) explicitly. Add more the same way.
const DEMO_MODE_ENV = process.env.NEXT_PUBLIC_DEMO_MODE;

function demoModeOverride(): boolean | undefined {
  if (DEMO_MODE_ENV == null || DEMO_MODE_ENV === "") return undefined;
  return DEMO_MODE_ENV === "1" || DEMO_MODE_ENV.toLowerCase() === "true";
}

/**
 * Resolve flags: brand overrides over registry defaults, plus rule pins.
 * Deterministic & isomorphic (same result on server and client).
 */
export function resolveFlags(): FlagState {
  const brandFlags = getBrandConfig().flags ?? {};
  const out = {} as FlagState;
  for (const k of FLAG_KEYS) {
    out[k] = brandFlags[k] ?? FLAG_REGISTRY[k].default;
  }
  // RULE: [Sample] labels are non-negotiable — always on.
  out.showSampleLabels = true;
  // Demo banner additionally honors NEXT_PUBLIC_DEMO_MODE.
  const demo = demoModeOverride();
  if (demo !== undefined) out.demoBanner = demo;
  return out;
}

export function isEnabled(key: FlagKey): boolean {
  return resolveFlags()[key];
}
