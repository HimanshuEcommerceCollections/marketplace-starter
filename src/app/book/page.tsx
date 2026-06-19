import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { BookingFlowStepper } from "@/components/booking/booking-flow-stepper";
import { ServiceSelection } from "@/components/booking/service-selection";
import type { ServiceSelectItem } from "@/components/booking/service-select-card";
import { getService, getServices } from "@/lib/catalog/load";
import { getPricingTable } from "@/lib/pricing/load";
import { getActiveBrandId } from "@/lib/brand/registry";
import { formatMoney } from "@/lib/money";
import { isEnabled } from "@/lib/flags/resolve";

export const metadata: Metadata = { title: "Book" };

/** Whole-dollar "From $X" label (e.g. 10900 -> "From $109"). */
function priceLabel(amount: number | undefined, currency: string): string | null {
  if (amount == null) return null;
  return `From ${formatMoney({ amount, currency }).replace(/\.00$/, "")}`;
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  if (!isEnabled("bookingWizard")) {
    return (
      <Container size="md" className="py-12">
        <p className="text-sm text-muted-foreground">
          Booking is currently unavailable.
        </p>
      </Container>
    );
  }

  const { service: serviceParam } = await searchParams;
  const service = serviceParam ? getService(serviceParam) : undefined;

  // Coming-soon services are not bookable — a crafted /book?service=<id> deep
  // link sends the visitor to the interest list, matching the picker + landing.
  if (service?.coming_soon) {
    redirect(`/waitlist?service=${service.id}`);
  }

  // Step 1 — no valid service in the URL: show the service picker.
  if (!service) {
    const items: ServiceSelectItem[] = getServices().map((s) => ({
      slug: s.id,
      title: s.title,
      icon: s.icon,
      priceLabel: priceLabel(s.from_price, s.currency),
      status: s.coming_soon ? "coming-soon" : "active",
    }));

    return (
      <Container size="xl" className="py-8 md:py-10">
        <BookingFlowStepper currentIndex={0} />
        <div className="mt-10 md:mt-12">
          <ServiceSelection items={items} />
        </div>
      </Container>
    );
  }

  // Service chosen — continue into the configurator wizard (it renders its own
  // booking chrome via BookingStepLayout).
  return (
    <BookingWizard
      service={service}
      pricing={getPricingTable()}
      brandId={getActiveBrandId()}
    />
  );
}
