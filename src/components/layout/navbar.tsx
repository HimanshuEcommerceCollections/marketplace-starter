"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { useFlag } from "@/lib/flags/useFlag";
import { NAV_ITEMS } from "@/config/navigation";
import type { NavItem } from "@/lib/brand/types";

const DRAFT_NOTICE =
  "DRAFT EXPERIENCE — Pricing and service availability shown for demonstration purposes.";

export interface NavbarProps {
  brandName: string;
  cta?: NavItem;
}

/**
 * Responsive top navigation.
 * - lg and above: logo (left), navigation (centered), Book Now (right).
 * - below lg: logo (left), Book Now + hamburger (right); links collapse into a
 *   slide-down menu rendered beneath the bar.
 * Full-width draft banner sits above the bar on every breakpoint.
 */
export function Navbar({
  brandName,
  cta = { label: "Book Now", href: "/book" },
}: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const showBanner = useFlag("demoBanner");

  const closeMenu = React.useCallback(() => setOpen(false), []);

  // Close the slide-down menu on Escape for keyboard users.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {showBanner ? (
        <div
          role="region"
          aria-label="Draft experience notice"
          className="bg-secondary px-4 py-1.5 text-center text-xs font-medium text-secondary-foreground"
        >
          {DRAFT_NOTICE}
        </div>
      ) : null}

      <header className="z-sticky sticky top-0 border-b border-border bg-background/80 backdrop-blur">
        <Container
          as="nav"
          aria-label="Primary"
          className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4"
        >
          {/* Left: logo */}
          <div className="flex items-center justify-self-start">
            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-md text-base font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {brandName}
            </Link>
          </div>

          {/* Center: desktop navigation (lg and above) */}
          <ul className="hidden items-center justify-center gap-1 lg:flex">
            {NAV_ITEMS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: Book Now (all sizes) + hamburger (below lg) */}
          <div className="flex items-center justify-end gap-2 justify-self-end">
            <Button asChild size="sm">
              <Link href={cta.href} onClick={closeMenu}>
                {cta.label}
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                <X className="size-5" aria-hidden />
              ) : (
                <Menu className="size-5" aria-hidden />
              )}
            </Button>
          </div>
        </Container>

        {/* Slide-down mobile menu (below lg) */}
        {open ? (
          <div
            id="mobile-menu"
            className="animate-in fade-in slide-in-from-top-2 border-t border-border bg-background lg:hidden"
          >
            <Container className="py-4">
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {NAV_ITEMS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild className="mt-3 w-full">
                  <Link href={cta.href} onClick={closeMenu}>
                    {cta.label}
                  </Link>
                </Button>
              </nav>
            </Container>
          </div>
        ) : null}
      </header>
    </>
  );
}
