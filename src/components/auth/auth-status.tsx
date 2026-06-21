"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, CalendarDays } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NavItem } from "@/lib/brand/types";

export interface AuthStatusProps {
  account: NavItem;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}

const itemClass =
  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Navbar account control. Shows the Sign In link when signed out (preserving
 * the prior behavior). When authenticated, the top-bar instance ("desktop")
 * renders an initials avatar that opens a small menu with Log out; the in-menu
 * instance ("mobile") renders nothing, since the avatar already lives in the
 * bar at all breakpoints.
 */
export function AuthStatus({ account, variant, onNavigate }: AuthStatusProps) {
  const { status, user, logout } = useAuth();
  const router = useRouter();

  const onSignOut = async () => {
    onNavigate?.();
    await logout();
    router.push("/");
    router.refresh();
  };

  if (status === "authenticated" && user) {
    // The avatar lives in the top bar (desktop instance) on every breakpoint,
    // so the hamburger-menu instance renders nothing to avoid duplication.
    if (variant === "mobile") return null;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Account menu"
            className="flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Avatar name={user.name} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={() => {
              onNavigate?.();
              router.push("/bookings");
            }}
          >
            <CalendarDays className="size-4" aria-hidden />
            My Bookings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onSignOut}>
            <LogOut className="size-4" aria-hidden />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // loading or unauthenticated → Sign In link
  if (variant === "desktop") {
    return (
      <Link href={account.href} className={`hidden md:inline-flex ${itemClass}`}>
        {account.label}
      </Link>
    );
  }
  return (
    <Link
      href={account.href}
      onClick={onNavigate}
      className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {account.label}
    </Link>
  );
}
