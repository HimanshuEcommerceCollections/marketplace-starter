import * as React from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { getBrandConfig } from "@/lib/brand/load";

export const metadata: Metadata = { title: "Admin Console" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getBrandConfig();
  // AdminAuthGuard verifies the signed-in user client-side (via /auth/me) and
  // bounces anyone who isn't staff before the shell renders — closing the gap
  // where a forged/stale cookie could slip past the unverified middleware decode.
  return (
    <AdminAuthGuard>
      <AdminShell brandName={config.shortName} logoSublabel={config.logoSublabel}>
        {children}
      </AdminShell>
    </AdminAuthGuard>
  );
}
