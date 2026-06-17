import * as React from "react";
import { Card } from "@/components/ui/card";
import { SampleBadge } from "@/components/shared/sample-badge";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SampleNotice } from "@/components/admin/sample-notice";

export default function AdminProfessionalsPage() {
  return (
    <>
      <AdminTopbar searchPlaceholder="Search professionals…" />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AdminPageHeader
          title="Professionals"
          subtitle="Manage providers, availability, and matching."
        />
        <SampleNotice className="mb-6" />
        <Card className="flex flex-col items-start gap-3 p-8">
          <SampleBadge />
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Coming soon
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            This section is part of the SYSTEM console design set and hasn&apos;t
            been built yet. The provider roster, availability calendar, and
            booking-to-pro matching tools will live here.
          </p>
        </Card>
      </div>
    </>
  );
}
