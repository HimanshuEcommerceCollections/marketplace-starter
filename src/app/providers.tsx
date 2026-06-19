"use client";

import * as React from "react";
import { BrandProvider } from "@/components/layout/brand-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import type { BrandConfig, BrandContent } from "@/lib/brand/types";

/** Client provider tree. Add future providers (theme, analytics) here. */
export function Providers({
  config,
  content,
  children,
}: {
  config: BrandConfig;
  content: BrandContent;
  children: React.ReactNode;
}) {
  return (
    <BrandProvider value={{ config, content }}>
      <AuthProvider>{children}</AuthProvider>
    </BrandProvider>
  );
}
