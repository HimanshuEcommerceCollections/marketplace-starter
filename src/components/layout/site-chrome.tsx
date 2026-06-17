"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

export interface SiteChromeProps {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Wraps the page in the site navbar + footer, EXCEPT on flows that render their
 * own full-screen chrome: the booking flow (/book*), the auth screens
 * (/login, /signup), and the admin console (/admin*), which all provide their
 * own header and no public footer.
 */
export function SiteChrome({ navbar, footer, children }: SiteChromeProps) {
  const pathname = usePathname();
  const bookingFlow = pathname?.startsWith("/book") ?? false;
  const authFlow = pathname === "/login" || pathname === "/signup";
  const adminFlow = pathname?.startsWith("/admin") ?? false;
  const bareLayout = bookingFlow || authFlow || adminFlow;

  return (
    <>
      {!bareLayout ? navbar : null}
      <main className="flex-1">{children}</main>
      {!bareLayout ? footer : null}
    </>
  );
}
