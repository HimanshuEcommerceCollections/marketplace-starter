import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { getBrandConfig, getBrandContent } from "@/lib/brand/load";
import { isEnabled } from "@/lib/flags/resolve";
import { getViewMode } from "@/lib/auth/view-mode";

export const metadata: Metadata = { title: "Create your account" };

export default async function SignupPage() {
  if (!isEnabled("authEnabled")) notFound();

  const userType = await getViewMode();
  const config = getBrandConfig();
  const content = getBrandContent().auth?.signup;

  return (
    <AuthShell
      userType={userType}
      screen="signup"
      brandName={config.shortName}
      logoSublabel={config.logoSublabel}
      heading={
        userType === "system"
          ? "Create a system account"
          : content?.heading ?? "Create your account."
      }
      sub={
        userType === "system"
          ? "Provision internal console access."
          : content?.sub
      }
      quoteLead={content?.quoteLead}
      quoteEm={content?.quoteEm}
      chips={content?.chips}
    >
      <SignupForm />
    </AuthShell>
  );
}
