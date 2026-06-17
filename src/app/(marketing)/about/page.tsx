import type { Metadata } from "next";
import { AboutLandingPage } from "@/components/marketing/about-landing-page";
import { getAboutPage } from "@/lib/brand/load";
import { getServices } from "@/lib/catalog/load";

export const metadata: Metadata = {
  title: "About",
  description:
    "A coordinated marketplace connecting Raleigh and Wake County with vetted, independent in-home wellness professionals.",
};

export default function AboutPage() {
  const config = getAboutPage();
  const services = getServices();

  return <AboutLandingPage config={config} services={services} />;
}
