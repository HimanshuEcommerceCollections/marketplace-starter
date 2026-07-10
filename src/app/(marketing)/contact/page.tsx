import type { Metadata } from "next";
import { ContactLandingPage } from "@/components/marketing/contact-landing-page";
import { getContactPage } from "@/lib/brand/load";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to a real Elevate coordinator — bookings, general questions, professional applications, and corporate wellness. We reply within one business day.",
};

export default function ContactPage() {
  return <ContactLandingPage config={getContactPage()} />;
}
