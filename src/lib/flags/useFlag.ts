"use client";

import { useMemo } from "react";
import { resolveFlags } from "./resolve";
import type { FlagKey, FlagState } from "./registry";

export function useFlag(key: FlagKey): boolean {
  return useMemo(() => resolveFlags()[key], [key]);
}

export function useFlags(): FlagState {
  return useMemo(() => resolveFlags(), []);
}
