import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getBrandConfig, getBrandContent } from "@/lib/brand/load";
import { isEnabled } from "@/lib/flags/resolve";
import { getViewMode } from "@/lib/auth/view-mode";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (!isEnabled("authEnabled")) notFound();

  const userType = await getViewMode();
  const config = getBrandConfig();
  const auth = getBrandContent().auth;

  return (
    <AuthShell
      userType={userType}
      brandName={config.shortName}
      logoSublabel={config.logoSublabel}
      formHeading={userType === "system" ? "Staff sign in" : "Welcome back"}
      formSub={
        userType === "system"
          ? "Sign in to the internal console."
          : `Sign in to your ${config.shortName} account`
      }
      panelTitle={auth?.login.panelTitle}
      categories={auth?.categories}
      quote={auth?.login.testimonial}
    >
      <LoginForm brandName={config.shortName} />
    </AuthShell>
  );
}
