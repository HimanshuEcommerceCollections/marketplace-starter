"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

export interface SiteChromeProps {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Wraps the page in the site navbar + footer, EXCEPT on the booking flow
 * (/book*), which renders its own dedicated header (and no footer).
 */
export function SiteChrome({ navbar, footer, children }: SiteChromeProps) {
  const pathname = usePathname();
  const bookingFlow = pathname?.startsWith("/book") ?? false;

  return (
    <>
      {!bookingFlow ? navbar : null}
      <main className="flex-1">{children}</main>
      {!bookingFlow ? footer : null}
    </>
  );
}
