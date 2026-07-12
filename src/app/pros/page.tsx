import type { Metadata } from "next";
import { ForProsLandingPage } from "@/components/marketing/for-pros-landing-page";
import { getForProsPage } from "@/lib/brand/load";

export const metadata: Metadata = {
  title: "For Pros",
  description:
    "Join Raleigh's premier wellness platform. Keep 80% of every session, set your own hours, and let a coordinator fill your calendar with quality clients.",
};

export default function ForProsPage() {
  const config = getForProsPage();
  return <ForProsLandingPage config={config} />;
}
