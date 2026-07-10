import type { Metadata } from "next";
import { FaqLandingPage } from "@/components/marketing/faq-landing-page";
import { getFaqPage } from "@/lib/brand/load";
import { JsonLd } from "@/lib/seo/json-ld";
import { faqPage } from "@/lib/seo/jsonld";
import { isEnabled } from "@/lib/flags/resolve";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Everything people ask before their first booking — confirmation times, all-in pricing, how professionals are vetted, and what to prepare at home.",
};

export default function FaqPage() {
  const config = getFaqPage();
  const items = config.browser.items;
  return (
    <>
      <FaqLandingPage config={config} />
      {isEnabled("faqJsonLd") && items.length > 0 ? (
        <JsonLd
          data={faqPage(items.map((f) => ({ q: f.question, a: f.answer })))}
        />
      ) : null}
    </>
  );
}
