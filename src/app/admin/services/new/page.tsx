import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceForm } from "@/components/admin/services/service-form";

export const metadata: Metadata = { title: "Create service" };

export default function NewServicePage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/admin/services"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to services
      </Link>
      <AdminPageHeader
        title="Create service"
        subtitle="Add a new bookable service. It starts as a draft until you publish it."
      />
      <div className="mx-auto max-w-2xl">
        <ServiceForm mode="create" />
      </div>
    </div>
  );
}
