"use client";

import { usePathname } from "next/navigation";
import * as React from "react";
import { cn } from "@/lib/utils";

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
  // Pages with a full-bleed photo hero that deliberately sits behind the
  // floating nav: the homepage, the services showcase (listing only —
  // generic /services/<slug> detail pages keep the offset, but the bespoke
  // massage/beauty/nutrition landings have their own full-bleed heroes),
  // How It Works, For Pros, Pricing, Terms, About, FAQ, and Contact.
  const fullBleedHero =
    pathname === "/" ||
    // During ISR regeneration on Vercel the root route is rendered as
    // "/index", so the server-side pathname never equals "/" there.
    pathname === "/index" ||
    pathname === "/services" ||
    pathname === "/services/massage" ||
    pathname === "/services/beauty" ||
    pathname === "/services/nutrition-coaching" ||
    pathname === "/how-it-works" ||
    pathname === "/pricing" ||
    pathname === "/terms" ||
    pathname === "/pros/apply" ||
    pathname === "/about" ||
    pathname === "/faq" ||
    pathname === "/contact";

  return (
    <>
      {!bareLayout ? navbar : null}
      {/* The fixed floating nav overlaps content; offset every page except
          those whose hero deliberately sits behind the nav. */}
      <main className={cn("flex-1", !bareLayout && !fullBleedHero && "pt-28")}>
        {children}
      </main>
      {!bareLayout ? footer : null}
    </>
  );
}
