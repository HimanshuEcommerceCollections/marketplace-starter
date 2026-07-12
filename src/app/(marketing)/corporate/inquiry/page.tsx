import type { Metadata } from "next";
import { CorporateInquiryPage } from "@/components/marketing/corporate-inquiry-page";
import { getCorporateInquiry } from "@/lib/brand/load";

export const metadata: Metadata = {
  title: "Request a Corporate Proposal",
  description:
    "Tell us about your team and a coordinator designs a tailored corporate wellness proposal — programs, vetted professionals, and transparent all-in pricing.",
};

export default function CorporateInquiryRoute() {
  return <CorporateInquiryPage config={getCorporateInquiry()} />;
}
