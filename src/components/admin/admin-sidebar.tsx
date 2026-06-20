"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Diamond } from "lucide-react";
import { ADMIN_NAV } from "@/lib/admin/nav";
import { useAuth } from "@/components/auth/auth-provider";
import { initialsFromName } from "@/components/ui/avatar";
import { roleLabel } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

export interface AdminSidebarProps {
  brandName: string;
  logoSublabel?: string;
  onNavigate?: () => void;
}

/**
 * Vertical navigation for the admin console. Rendered inside both the desktop
 * fixed sidebar and the mobile drawer (via AdminShell). Active item is derived
 * from the pathname: exact match for "/admin", prefix match otherwise.
 */
export function AdminSidebar({
  brandName,
  logoSublabel,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : (pathname?.startsWith(href) ?? false);

  return (
    <div className="flex h-full flex-col">
      {/* Wordmark */}
      <div className="flex flex-col gap-2 border-b border-surface-inverse-foreground/15 px-5 py-5">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="font-heading text-lg font-semibold uppercase tracking-widest text-surface-inverse-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {brandName}
        </Link>
        <span className="inline-flex w-fit items-center rounded-full bg-highlight px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-highlight-foreground">
          Admin
        </span>
        {logoSublabel ? (
          <span className="text-xs font-medium text-surface-inverse-foreground/60">
            {logoSublabel}
          </span>
        ) : null}
      </div>

      {/* Nav */}
      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {ADMIN_NAV.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-surface-inverse-foreground/10 text-surface-inverse-foreground"
                      : "text-surface-inverse-foreground/70 hover:bg-surface-inverse-foreground/10 hover:text-surface-inverse-foreground",
                  )}
                >
                  {active ? (
                    <Diamond
                      className="size-2 shrink-0 fill-highlight text-highlight"
                      aria-hidden
                    />
                  ) : (
                    <Icon className="size-4 shrink-0" aria-hidden />
                  )}
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile — reflects the signed-in staff user (/admin is role-gated). */}
      {user ? (
        <div className="flex items-center gap-3 border-t border-surface-inverse-foreground/15 px-5 py-4">
          <span
            aria-hidden
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-inverse-foreground/15 text-sm font-semibold text-surface-inverse-foreground"
          >
            {initialsFromName(user.name)}
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-medium text-surface-inverse-foreground">
              {user.name}
            </span>
            <span className="truncate text-xs text-surface-inverse-foreground/60">
              {roleLabel(user.role)}
            </span>
          </span>
        </div>
      ) : null}
    </div>
  );
}
