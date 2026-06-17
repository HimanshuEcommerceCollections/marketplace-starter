import * as React from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { getBrandConfig } from "@/lib/brand/load";

export const metadata: Metadata = { title: "Admin Console" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getBrandConfig();
  return (
    <AdminShell brandName={config.shortName} logoSublabel={config.logoSublabel}>
      {children}
    </AdminShell>
  );
}
