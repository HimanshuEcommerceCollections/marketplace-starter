"use client";

import * as React from "react";
import type { BrandConfig, BrandContent } from "@/lib/brand/types";

export interface BrandContextValue {
  config: BrandConfig;
  content: BrandContent;
}

const BrandContext = React.createContext<BrandContextValue | null>(null);

export function BrandProvider({
  value,
  children,
}: {
  value: BrandContextValue;
  children: React.ReactNode;
}) {
  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
}

/** Read the active brand's config + content from any client component. */
export function useBrand(): BrandContextValue {
  const ctx = React.useContext(BrandContext);
  if (!ctx) {
    throw new Error("useBrand must be used within a <BrandProvider>");
  }
  return ctx;
}
