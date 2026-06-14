import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ProApplyForm } from "@/components/forms/pro-apply-form";
import { getBrandConfig } from "@/lib/brand/load";
import { isEnabled } from "@/lib/flags/resolve";

export const metadata: Metadata = { title: "Become a pro" };

export default function ProApplyPage() {
  const config = getBrandConfig();

  return (
    <Container size="md" className="py-12">
      <h1 className="text-3xl font-bold tracking-tight">Become a pro</h1>
      <p className="mt-2 text-muted-foreground">
        Apply to offer services on {config.shortName}. This is a [Sample]
        stub-only form.
      </p>
      <div className="mt-8">
        {isEnabled("proApplyForm") ? (
          <ProApplyForm categories={config.serviceCategories} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Applications are currently closed.
          </p>
        )}
      </div>
    </Container>
  );
}
