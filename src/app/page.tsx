import { Container } from "@/components/layout/container";
import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { CtaSection } from "@/components/marketing/cta-section";
import { Testimonials } from "@/components/marketing/testimonials";
import { ServiceGrid } from "@/components/marketplace/service-grid";
import { getBrandContent } from "@/lib/brand/load";
import { getServices } from "@/lib/catalog/load";
import { isEnabled } from "@/lib/flags/resolve";

export default function HomePage() {
  const content = getBrandContent();
  const featured = getServices().slice(0, 3);

  return (
    <>
      <Hero {...content.hero} />

      <FeatureGrid
        heading={content.features.heading}
        subheading={content.features.subheading}
        items={content.features.items}
      />

      <section className="py-12 md:py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold md:text-3xl">Popular services</h2>
          </div>
          <ServiceGrid services={featured} />
        </Container>
      </section>

      {isEnabled("testimonials") ? (
        <Testimonials
          heading={content.testimonials.heading}
          items={content.testimonials.items}
        />
      ) : null}

      <CtaSection {...content.cta} />
    </>
  );
}
