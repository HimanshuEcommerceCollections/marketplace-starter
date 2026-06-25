"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthStatus } from "@/components/auth/auth-status";
import { useFlag } from "@/lib/flags/useFlag";
import { NAV_ITEMS } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/brand/types";

const DRAFT_NOTICE =
  "Demo site · Do not submit real information · INTERNAL DRAFT";

export interface NavbarProps {
  brandName: string;
  logoSublabel?: string;
  cta?: NavItem;
  /** Account entry point (Sign In). Shown only when the authEnabled flag is on. */
  account?: NavItem;
}

/**
 * Floating-pill primary navigation (redesigned). A full-width demo banner sits
 * at the very top; below it a centered frosted pill holds the wordmark, links,
 * and the Book Now CTA. The header is fixed, so SiteChrome offsets page content
 * (the homepage hero deliberately sits behind it).
 */
export function Navbar({
  brandName,
  cta = { label: "Book Now", href: "/book" },
  account = { label: "Sign In", href: "/login" },
}: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const showBanner = useFlag("demoBanner");
  const showAuth = useFlag("authEnabled");

  const closeMenu = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the menu is open: close on Escape, and close at the lg breakpoint.
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
    <header className="z-sticky fixed inset-x-0 top-0">
      {showBanner ? (
        <div
          role="region"
          aria-label="Draft experience notice"
          className="bg-foreground px-4 py-2 text-center text-xs font-medium uppercase tracking-widest text-background/45"
        >
          {DRAFT_NOTICE}
        </div>
      ) : null}

      <div className="flex justify-center px-3 pt-3">
        <nav
          aria-label="Primary"
          className={cn(
            "flex max-w-full items-center gap-1 rounded-full border py-2 pl-5 pr-2 shadow-lg backdrop-blur-xl transition-colors",
            scrolled
              ? "border-border bg-background/90"
              : "border-border/60 bg-background/65",
          )}
        >
          <Link
            href="/"
            onClick={closeMenu}
            className="mr-4 rounded-md font-display text-lg leading-none tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {brandName}
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_ITEMS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {showAuth ? (
            <span className="ml-1 hidden lg:inline-flex">
              <AuthStatus account={account} variant="desktop" />
            </span>
          ) : null}

          <Button
            asChild
            size="sm"
            className="ml-1.5 hidden rounded-full md:inline-flex"
          >
            <Link href={cta.href} onClick={closeMenu}>
              {cta.label} →
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-1 rounded-full lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </Button>
        </nav>
      </div>

      {open ? (
        <div className="flex justify-center px-3 pt-2 lg:hidden">
          <div
            id="mobile-menu"
            className="animate-in fade-in slide-in-from-top-2 w-full max-w-sm rounded-2xl border border-border bg-background p-3 shadow-xl"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {NAV_ITEMS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {link.label}
                </Link>
              ))}
              {showAuth ? (
                <AuthStatus account={account} variant="mobile" onNavigate={closeMenu} />
              ) : null}
              <Button asChild className="mt-2 w-full rounded-full">
                <Link href={cta.href} onClick={closeMenu}>
                  {cta.label} →
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
