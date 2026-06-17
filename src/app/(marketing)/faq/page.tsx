import type { Metadata } from "next";
import { FaqLandingPage } from "@/components/marketing/faq-landing-page";
import { getFaqPage } from "@/lib/brand/load";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about booking, scheduling, pricing, safety, and working with independent Elevate professionals.",
};

export default function FaqPage() {
  const config = getFaqPage();
  return <FaqLandingPage config={config} />;
}
