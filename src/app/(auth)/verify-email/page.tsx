import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { getBrandConfig } from "@/lib/brand/load";
import { isEnabled } from "@/lib/flags/resolve";
import { getViewMode } from "@/lib/auth/view-mode";

export const metadata: Metadata = { title: "Verify your email" };

export default async function VerifyEmailPage() {
  if (!isEnabled("authEnabled")) notFound();

  const userType = await getViewMode();
  const config = getBrandConfig();

  return (
    <AuthShell
      userType={userType}
      screen="verify"
      brandName={config.shortName}
      logoSublabel={config.logoSublabel}
      heading={userType === "system" ? "Verify your email" : "Verify your email."}
      sub="Confirm your email address to activate your account."
      quoteLead="One quick step keeps your account secure —"
      quoteEm="then you're ready to book."
      chips={["Secure by design", "Takes seconds"]}
    >
      <VerifyEmailForm />
    </AuthShell>
  );
}
