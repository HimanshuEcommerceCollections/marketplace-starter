"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
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
 * the prior behavior), or the user's name + Sign out when authenticated.
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
    if (variant === "desktop") {
      return (
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-sm font-medium text-foreground">{user.name}</span>
          <button type="button" onClick={onSignOut} className={itemClass}>
            Sign out
          </button>
        </div>
      );
    }
    return (
      <button
        type="button"
        onClick={onSignOut}
        className="rounded-md px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Sign out ({user.name})
      </button>
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
