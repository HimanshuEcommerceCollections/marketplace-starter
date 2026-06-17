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
  logoSublabel?: string;
  cta?: NavItem;
  /** Account entry point (Sign In). Shown only when the authEnabled flag is on. */
  account?: NavItem;
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
  logoSublabel,
  cta = { label: "Book Now", href: "/book" },
  account = { label: "Sign In", href: "/login" },
}: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const showBanner = useFlag("demoBanner");
  const showAuth = useFlag("authEnabled");

  const closeMenu = React.useCallback(() => setOpen(false), []);

  // While the menu is open: close on Escape, and close if the viewport grows to
  // the lg breakpoint (where the inline nav takes over).
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
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
          <div className="col-start-1 flex min-w-0 items-center justify-self-start">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                aria-hidden
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
              >
                {brandName.charAt(0)}
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-heading text-base font-semibold uppercase tracking-wide text-foreground">
                  {brandName}
                </span>
                {logoSublabel ? (
                  <span className="truncate text-xs font-medium text-muted-foreground">
                    {logoSublabel}
                  </span>
                ) : null}
              </span>
            </Link>
          </div>

          <ul className="col-start-2 hidden items-center justify-center gap-1 lg:flex">
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

          <div className="col-start-3 flex items-center justify-end gap-2 justify-self-end">
            {showAuth ? (
              <Link
                href={account.href}
                className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline-flex"
              >
                {account.label}
              </Link>
            ) : null}
            <Button asChild size="sm" className="hidden md:inline-flex">
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
                {showAuth ? (
                  <Link
                    href={account.href}
                    onClick={closeMenu}
                    className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {account.label}
                  </Link>
                ) : null}
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
