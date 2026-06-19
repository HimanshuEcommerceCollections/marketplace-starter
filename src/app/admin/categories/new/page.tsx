import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SampleNotice } from "@/components/admin/sample-notice";
import { CategoryForm } from "@/components/admin/categories/category-form";

export const metadata: Metadata = { title: "Create category" };

export default function NewCategoryPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/admin/categories"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to categories
      </Link>
      <AdminPageHeader
        title="Create category"
        subtitle="Add a new service category. It starts as a draft until you publish it."
      />
      <SampleNotice className="mb-6" />
      <div className="mx-auto max-w-2xl">
        <CategoryForm mode="create" />
      </div>
    </div>
  );
}
