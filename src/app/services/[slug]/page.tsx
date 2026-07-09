import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getService, getServices } from "@/lib/catalog/load";
import { fetchServiceBySlug } from "@/lib/catalog/services-api";
import { getPricingTable } from "@/lib/pricing/load";
import { computePrice } from "@/lib/pricing/engine";
import type { DisplayedPrice } from "@/lib/booking/contract";
import {
  getBrandConfig,
  getBrandContent,
  getServiceLanding,
  getShowcasePageSlugs,
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

// Re-fetch live service core (price/status/description) periodically; static
// marketing content is unaffected, and the page falls back to static on failure.
export const revalidate = 60;

export function generateStaticParams() {
  // Massage and the showcase pages (beauty, nutrition-coaching) have bespoke
  // static routes that take precedence over this dynamic segment — exclude
  // them here so the same paths aren't statically generated twice.
  const bespoke = new Set(["massage", ...getShowcasePageSlugs()]);
  return getServices()
    .filter((s) => !bespoke.has(s.id))
    .map((s) => ({ slug: s.id }));
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
  // Hybrid: prefer the live (admin-managed) base price + status; fall back to the
  // static catalog when the API is unavailable. Marketing copy (hero/landing/FAQ)
  // stays from the static catalog.
  const live = await fetchServiceBySlug(slug);
  const staticBreakdown = computePrice(getPricingTable(), {
    service_id: svc.id,
    selections: {},
    quantity: 1,
  });
  const currency = staticBreakdown.total.currency;
  // Displayed "From" price never reads below the service's booking minimum
  // (e.g. Beauty's $75 floor, where the base price is $0).
  const baseAmount = live ? live.basePrice : staticBreakdown.total.amount;
  const fromAmount = Math.max(baseAmount, svc.min_booking ?? 0);
  const fromMoney = { amount: fromAmount, currency };
  const breakdown: DisplayedPrice = live
    ? {
        total: fromMoney,
        subtotal: fromMoney,
        line_items: [{ label: "Base (Sample)", amount: fromMoney, kind: "base" }],
        pricing_version: "live",
        is_estimate: true,
      }
    : staticBreakdown;
  const comingSoon = live ? live.status === "COMING_SOON" : svc.coming_soon;
  const aboutDescription = live?.description ?? svc.description;

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
          priceLabel={comingSoon ? undefined : `From ${formatMoney(fromMoney)}`}
          category={svc.category}
          price={fromAmount}
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
          <p className="text-muted-foreground">{aboutDescription}</p>
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
