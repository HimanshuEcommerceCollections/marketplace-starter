import type { Metadata } from "next";
import { TermsLandingPage } from "@/components/marketing/terms-landing-page";
import { getTermsPage } from "@/lib/brand/load";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms behind every Elevate booking, in plain English — bookings and payment, cancellations, our vetted professionals, and your responsibilities.",
};

export default function TermsPage() {
  return <TermsLandingPage config={getTermsPage()} />;
}
