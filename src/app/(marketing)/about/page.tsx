import type { Metadata } from "next";
import { AboutLandingPage } from "@/components/marketing/about-landing-page";
import { getAboutPage } from "@/lib/brand/load";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Elevate story — why Raleigh's best wellness professionals come to you, with human coordination, honest all-in pricing, and a vetting bar that stays high.",
};

export default function AboutPage() {
  return <AboutLandingPage config={getAboutPage()} />;
}
