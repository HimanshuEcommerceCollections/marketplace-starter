import { HomeHero } from "@/components/home/home-hero";
import { HomeMarquee } from "@/components/home/home-marquee";
import { HomeStatement } from "@/components/home/home-statement";
import { HomeServices } from "@/components/home/home-services";
import { HomePinnedFlow } from "@/components/home/home-pinned-flow";
import { HomePhotoStrip } from "@/components/home/home-photo-strip";
import { HomeHowItWorks } from "@/components/home/home-how-it-works";
import { HomeTrust } from "@/components/home/home-trust";
import { HomeCta } from "@/components/home/home-cta";
import { getBrandContent } from "@/lib/brand/load";
import { getServices } from "@/lib/catalog/load";
import { serviceToGridCard } from "@/lib/catalog/cards";
import {
  fetchPublicServices,
  apiServiceToGridCard,
} from "@/lib/catalog/services-api";

// ISR: re-fetch the live services periodically. The page still renders (via the
// static fallback) if the API is unreachable at build/request time.
export const revalidate = 60;

export default async function HomePage() {
  const content = getBrandContent();
  // Live services from the API; fall back to the static catalog if it's down.
  const apiServices = await fetchPublicServices();
  const serviceCards = apiServices
    ? apiServices.map(apiServiceToGridCard)
    : getServices().map(serviceToGridCard);

  const marqueeItems = [
    ...serviceCards.map((card) => card.title),
    "At-Your-Door",
    "Wake County, NC",
  ];

  return (
    <>
      <HomeHero {...content.hero} />

      <HomeMarquee items={marqueeItems} />

      {content.statement ? <HomeStatement {...content.statement} /> : null}

      {content.servicesSection ? (
        <HomeServices {...content.servicesSection} cards={serviceCards} />
      ) : null}

      <HomePinnedFlow />

      <HomePhotoStrip />

      {content.howItWorks ? <HomeHowItWorks {...content.howItWorks} /> : null}

      <HomeTrust {...content.testimonials} />

      {content.finalCta ? (
        <HomeCta
          eyebrow={content.finalCta.eyebrow}
          title={content.finalCta.title}
          body={content.finalCta.body}
          primaryCta={content.finalCta.primaryCta}
        />
      ) : null}
    </>
  );
}
