import type { Metadata } from "next";
import { HowItWorksLandingPage } from "@/components/marketing/how-it-works-landing-page";
import { getHowItWorksPage } from "@/lib/brand/load";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Four steps, zero hassle. Book in-home wellness in minutes and let a real coordinator handle the rest.",
};

export default function HowItWorksPage() {
  const config = getHowItWorksPage();
  return <HowItWorksLandingPage config={config} />;
}
