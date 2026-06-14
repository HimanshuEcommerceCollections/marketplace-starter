import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { getService, getServices } from "@/lib/catalog/load";
import { getPricingTable } from "@/lib/pricing/load";
import { getActiveBrandId } from "@/lib/brand/registry";
import { isEnabled } from "@/lib/flags/resolve";

export const metadata: Metadata = { title: "Book" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  if (!isEnabled("bookingWizard")) {
    return (
      <p className="text-sm text-muted-foreground">
        Booking is currently unavailable.
      </p>
    );
  }

  const { service: serviceParam } = await searchParams;
  const service =
    (serviceParam ? getService(serviceParam) : undefined) ?? getServices()[0];

  if (!service) {
    return (
      <p className="text-sm text-muted-foreground">
        No services available to book.
      </p>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Book {service.title}</h1>
      <BookingWizard
        service={service}
        pricing={getPricingTable()}
        brandId={getActiveBrandId()}
      />
    </div>
  );
}
