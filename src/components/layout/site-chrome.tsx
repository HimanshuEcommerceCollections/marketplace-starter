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
 * own full-screen chrome: the booking flow (/book*) and the admin console
 * (/admin*), which provide their own header and no public footer.
 *
 * The auth screens (/login, /signup) keep the nav + footer but render a
 * full-bleed split-screen behind the floating nav — so they are treated as
 * full-bleed heroes (no top offset), not bare.
 */
export function SiteChrome({ navbar, footer, children }: SiteChromeProps) {
  const pathname = usePathname();
  // The single-page /book screen now carries full chrome (see below); only its
  // sub-routes (e.g. the standalone /book/success fallback) stay bare. The
  // customer's "My Bookings" pages (/bookings, /bookings/[id]) keep chrome too.
  const bookingFlow = pathname?.startsWith("/book/") ?? false;
  const authFlow = pathname === "/login" || pathname === "/signup";
  const adminFlow = pathname?.startsWith("/admin") ?? false;
  const bareLayout = bookingFlow || adminFlow;
  // Pages with a full-bleed photo hero that deliberately sits behind the
  // floating nav: the homepage, the services listing, every service-detail page
  // (the bespoke landings AND the generic /services/[slug] fallback, which now
  // share one full-bleed photo hero), How It Works, For Pros, Pricing, Terms,
  // About, FAQ, Contact, and Privacy.
  const fullBleedHero =
    authFlow ||
    // The single-page /book screen leads with a full-bleed photo hero.
    pathname === "/book" ||
    // "My Bookings" list has a full-bleed photo hero behind the nav; the detail
    // page (/bookings/[id]) has no hero, so it keeps the normal nav offset.
    pathname === "/bookings" ||
    pathname === "/" ||
    // During ISR regeneration on Vercel the root route is rendered as
    // "/index", so the server-side pathname never equals "/" there.
    pathname === "/index" ||
    pathname === "/services" ||
    // Any service-detail route (/services/<slug>) — bespoke or generic fallback.
    (pathname?.startsWith("/services/") ?? false) ||
    pathname === "/how-it-works" ||
    pathname === "/pricing" ||
    pathname === "/terms" ||
    pathname === "/pros" ||
    pathname === "/about" ||
    pathname === "/faq" ||
    pathname === "/contact" ||
    pathname === "/privacy" ||
    pathname === "/corporate" ||
    pathname === "/corporate/inquiry";

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
