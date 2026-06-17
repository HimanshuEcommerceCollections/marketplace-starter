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
  const auth = getBrandContent().auth;

  return (
    <AuthShell
      userType={userType}
      brandName={config.shortName}
      logoSublabel={config.logoSublabel}
      formHeading={
        userType === "system" ? "Create a system account" : "Create your account"
      }
      formSub={
        userType === "system"
          ? "Provision internal console access."
          : `Join ${config.shortName} and book your first session today.`
      }
      panelTitle={auth?.signup.panelTitle}
      categories={auth?.categories}
      quote={auth?.signup.testimonial}
    >
      <SignupForm />
    </AuthShell>
  );
}
