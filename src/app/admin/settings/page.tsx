import * as React from "react";
import { Card } from "@/components/ui/card";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminSettingsPage() {
  return (
    <>
      <AdminTopbar searchPlaceholder="Search settings…" />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AdminPageHeader
          title="Settings"
          subtitle="Console preferences and account configuration."
        />
        <Card className="flex flex-col items-start gap-3 p-8">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Coming soon
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            This section is part of the SYSTEM console design set and hasn&apos;t
            been built yet. Team roles, notification preferences, and brand
            configuration will be managed from here.
          </p>
        </Card>
      </div>
    </>
  );
}
