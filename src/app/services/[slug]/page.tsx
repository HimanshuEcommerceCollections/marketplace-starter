import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getService, getServices } from "@/lib/catalog/load";
import { getPricingTable } from "@/lib/pricing/load";
import { computePrice } from "@/lib/pricing/engine";
import {
  getBrandConfig,
  getBrandContent,
  getServiceLanding,
} from "@/lib/brand/load";
import { formatMoney } from "@/lib/money";
import { ServiceHero } from "@/components/marketplace/service-hero";
import { ServiceDetailLayout } from "@/components/marketplace/service-detail-layout";
import { ServiceViewTracker } from "@/components/marketplace/service-view-tracker";
import { ServiceLandingPage } from "@/components/marketplace/service-landing-page";
import { PriceSummaryCard } from "@/components/booking/price-summary-card";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/lib/seo/json-ld";
import {
  service as serviceLd,
  breadcrumbList,
  faqPage,
  type JsonLdThing,
} from "@/lib/seo/jsonld";
import { isEnabled } from "@/lib/flags/resolve";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = getServiceLanding(slug);
  if (landing) {
    return { title: landing.hero.title, description: landing.hero.subtitle };
  }
  const svc = getService(slug);
  if (!svc) return {};
  return { title: svc.title, description: svc.summary };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = getService(slug);
  if (!svc) notFound();

  const config = getBrandConfig();
  const breakdown = computePrice(getPricingTable(), {
    service_id: svc.id,
    selections: {},
    quantity: 1,
  });

  const landing = getServiceLanding(svc.id);

  // Config-driven landing page (preferred). Falls back to the detail layout
  // below for services that don't yet have a landing config.
  if (landing) {
    const jsonLd: JsonLdThing[] = [
      serviceLd({
        name: landing.hero.title,
        description: svc.summary,
        provider: config.name,
        url: `${SITE_URL}/services/${svc.id}`,
        serviceType: svc.service_type,
      }),
      breadcrumbList([
        { name: "Home", url: SITE_URL },
        { name: "Services", url: `${SITE_URL}/services` },
        { name: landing.hero.title, url: `${SITE_URL}/services/${svc.id}` },
      ]),
    ];
    const faqSection = landing.sections.find((s) => s.type === "faq");
    if (
      isEnabled("faqJsonLd") &&
      faqSection?.type === "faq" &&
      faqSection.items &&
      faqSection.items.length > 0
    ) {
      jsonLd.push(
        faqPage(faqSection.items.map((f) => ({ q: f.question, a: f.answer }))),
      );
    }

    return (
      <>
        <ServiceLandingPage
          config={landing}
          priceLabel={`From ${formatMoney(breakdown.total)}`}
          category={svc.category}
          price={breakdown.total.amount}
          currency={breakdown.total.currency}
          fallbackTestimonials={getBrandContent().testimonials}
        />
        <JsonLd data={jsonLd} />
      </>
    );
  }

  const jsonLd: JsonLdThing[] = [
    serviceLd({
      name: svc.title,
      description: svc.summary,
      provider: config.name,
      url: `${SITE_URL}/services/${svc.id}`,
      serviceType: svc.service_type,
    }),
    breadcrumbList([
      { name: "Home", url: SITE_URL },
      { name: "Services", url: `${SITE_URL}/services` },
      { name: svc.title, url: `${SITE_URL}/services/${svc.id}` },
    ]),
  ];
  if (isEnabled("faqJsonLd") && svc.faq.length > 0) {
    jsonLd.push(faqPage(svc.faq));
  }

  return (
    <>
      <ServiceViewTracker
        serviceId={svc.id}
        category={svc.category}
        price={breakdown.total.amount}
        currency={breakdown.total.currency}
      />
      <ServiceHero service={svc} />

      <ServiceDetailLayout
        sidebar={
          <PriceSummaryCard
            breakdown={breakdown}
            sample
            ctaSlot={
              <Button asChild className="w-full">
                <Link href={`/book?service=${svc.id}`}>Book now</Link>
              </Button>
            }
          />
        }
      >
        <article className="prose-none space-y-4">
          <h2 className="text-2xl font-bold">About this service</h2>
          <p className="text-muted-foreground">{svc.description}</p>
        </article>

        {svc.faq.length > 0 ? (
          <div className="mt-10">
            <FaqAccordion
              heading="Frequently asked questions"
              items={svc.faq.map((f, i) => ({
                id: `faq-${i}`,
                question: f.q,
                answer: f.a,
              }))}
            />
          </div>
        ) : null}
      </ServiceDetailLayout>

      <JsonLd data={jsonLd} />
    </>
  );
}
