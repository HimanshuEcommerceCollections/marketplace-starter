import type { Metadata } from "next";
import { ServicesGridSection } from "@/components/sections/services-grid-section";
import { ServicesHero } from "@/components/services/services-hero";
import { ServicesExplorer } from "@/components/services/services-explorer";
import { ServicesTrustStrip } from "@/components/services/services-trust-strip";
import { ServicesSteps } from "@/components/services/services-steps";
import { ServicesCta } from "@/components/services/services-cta";
import { getServicesPage } from "@/lib/brand/load";
import { getServices, getCategories } from "@/lib/catalog/load";
import { serviceToGridCard } from "@/lib/catalog/cards";
import {
  fetchPublicServices,
  apiServiceToGridCard,
} from "@/lib/catalog/services-api";

export const metadata: Metadata = { title: "Services" };

// ISR: re-fetch the live services periodically. The page still renders (via the
// static catalog fallback) if the API is unreachable at build/request time.
export const revalidate = 60;

export default async function ServicesPage() {
  const config = getServicesPage();
  // Live services from the API; fall back to the static catalog if it's down.
  const apiServices = await fetchPublicServices();
  const serviceCards = apiServices
    ? apiServices.map(apiServiceToGridCard)
    : getServices().map(serviceToGridCard);

  // Brands without showcase config keep the plain grid layout.
  if (!config.hero) {
    return <ServicesGridSection {...config} cards={serviceCards} />;
  }

  const categories = getCategories().map(({ id, title }) => ({ id, title }));

  return (
    <>
      <ServicesHero {...config.hero} />
      <ServicesExplorer
        categories={categories}
        cards={serviceCards}
        draftNote={config.draftNote}
      />
      {config.trustStrip ? <ServicesTrustStrip {...config.trustStrip} /> : null}
      {config.stepsSection ? <ServicesSteps {...config.stepsSection} /> : null}
      {config.ctaBand ? <ServicesCta {...config.ctaBand} /> : null}
    </>
  );
}
