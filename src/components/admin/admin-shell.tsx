"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./admin-sidebar";

export interface AdminShellProps {
  brandName: string;
  logoSublabel?: string;
  children: React.ReactNode;
}

/**
 * Frame for the SYSTEM (internal/admin) console: a fixed dark sidebar on desktop,
 * and a slide-in drawer on mobile.
 */
export function AdminShell({
  brandName,
  logoSublabel,
  children,
}: AdminShellProps) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  // Close on Escape, and close once the viewport reaches the lg breakpoint
  // (where the fixed sidebar takes over) — same idiom as the public navbar.
  // While the drawer is open (mobile only) lock body scroll so the page behind
  // it doesn't move under the overlay.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-muted">
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-sticky lg:flex lg:w-64 lg:flex-col bg-surface-inverse text-surface-inverse-foreground">
        <AdminSidebar brandName={brandName} logoSublabel={logoSublabel} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-sticky flex h-14 items-center gap-3 border-b border-border bg-surface-inverse px-4 text-surface-inverse-foreground">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="admin-drawer"
          className="text-surface-inverse-foreground hover:bg-surface-inverse-foreground/10 hover:text-surface-inverse-foreground"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" aria-hidden />
        </Button>
        <span className="flex items-center gap-2 leading-tight">
          <span className="font-heading text-sm font-semibold uppercase tracking-widest">
            {brandName}
          </span>
          <span className="inline-flex items-center rounded-full bg-highlight px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-highlight-foreground">
            Admin
          </span>
        </span>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <>
          <div
            className="fixed inset-0 z-modal bg-foreground/50 lg:hidden"
            onClick={close}
            aria-hidden
          />
          <aside
            id="admin-drawer"
            className="fixed inset-y-0 left-0 z-modal flex w-64 flex-col bg-surface-inverse text-surface-inverse-foreground animate-in slide-in-from-left lg:hidden"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              className="absolute right-2 top-2 text-surface-inverse-foreground hover:bg-surface-inverse-foreground/10 hover:text-surface-inverse-foreground"
              onClick={close}
            >
              <X className="size-5" aria-hidden />
            </Button>
            <AdminSidebar
              brandName={brandName}
              logoSublabel={logoSublabel}
              onNavigate={close}
            />
          </aside>
        </>
      ) : null}

      {/* Main column */}
      <div className="lg:pl-64">
        <main>{children}</main>
        <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
          System console · Illustrative sample data only.
        </footer>
      </div>
    </div>
  );
}
