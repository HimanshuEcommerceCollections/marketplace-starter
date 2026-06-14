import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ServiceFilterBar } from "@/components/marketplace/service-filter-bar";
import { ServiceGrid } from "@/components/marketplace/service-grid";
import { getServices, getCategories } from "@/lib/catalog/load";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categories = getCategories();
  const all = getServices();
  const services = category
    ? all.filter((s) => s.category === category)
    : all;

  return (
    <Container className="py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <p className="mt-2 text-muted-foreground">
          Browse [Sample] services and start a booking.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="mb-8">
          <ServiceFilterBar
            categories={categories.map((c) => ({ id: c.id, title: c.title }))}
          />
        </div>
      ) : null}

      <ServiceGrid services={services} />
    </Container>
  );
}
