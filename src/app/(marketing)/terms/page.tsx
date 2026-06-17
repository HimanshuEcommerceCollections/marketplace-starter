import type { Metadata } from "next";
import { LegalLandingPage } from "@/components/marketing/legal-landing-page";
import { getTermsPage } from "@/lib/brand/load";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms & Conditions for the Elevate marketplace. Draft placeholder document — final legal language pending counsel review.",
};

export default function TermsPage() {
  const config = getTermsPage();
  return <LegalLandingPage config={config} />;
}
