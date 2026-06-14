import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { getBrandContent } from "@/lib/brand/load";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  const { faq } = getBrandContent();
  return (
    <Container size="md" className="py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        {faq.heading ?? "Frequently asked questions"}
      </h1>
      <FaqAccordion items={faq.items} />
    </Container>
  );
}
