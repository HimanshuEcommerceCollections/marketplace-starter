import type { Metadata } from "next";
import { CorporateLandingPage } from "@/components/marketing/corporate-landing-page";
import { getCorporateLanding } from "@/lib/brand/load";

export const metadata: Metadata = {
  title: "Corporate Wellness",
  description:
    "Corporate wellness experiences and services coordinated for teams, workplaces, and special events throughout Raleigh and Wake County.",
};

export default function CorporatePage() {
  const config = getCorporateLanding();
  return <CorporateLandingPage config={config} />;
}
