import type { Metadata } from "next";
import { LegalLandingPage } from "@/components/marketing/legal-landing-page";
import { getPrivacyPage } from "@/lib/brand/load";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How we collect, use, and protect your personal information. Draft placeholder document — final legal language pending counsel review.",
};

export default function PrivacyPage() {
  const config = getPrivacyPage();
  return <LegalLandingPage config={config} />;
}
