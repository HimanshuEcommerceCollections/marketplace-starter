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
  const content = getBrandContent().auth?.login;

  return (
    <AuthShell
      userType={userType}
      screen="login"
      brandName={config.shortName}
      logoSublabel={config.logoSublabel}
      heading={
        userType === "system"
          ? "Staff sign in"
          : content?.heading ?? "Welcome back."
      }
      sub={
        userType === "system"
          ? "Sign in to the internal console."
          : content?.sub
      }
      quoteLead={content?.quoteLead}
      quoteEm={content?.quoteEm}
      chips={content?.chips}
    >
      <LoginForm brandName={config.shortName} />
    </AuthShell>
  );
}
