import type { Metadata } from "next";
import { PrivacyLandingPage } from "@/components/marketing/privacy-landing-page";
import { getPrivacyPage } from "@/lib/brand/load";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What we collect, why we collect it, and the promises we make about it — in plain English. Draft placeholder document, final legal language pending counsel review.",
};

export default function PrivacyPage() {
  return <PrivacyLandingPage config={getPrivacyPage()} />;
}
