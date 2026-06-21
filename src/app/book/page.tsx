import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { BookingFlowStepper } from "@/components/booking/booking-flow-stepper";
import { ServiceSelection } from "@/components/booking/service-selection";
import type { ServiceSelectItem } from "@/components/booking/service-select-card";
import { getService, getServices } from "@/lib/catalog/load";
import { getPricingTable } from "@/lib/pricing/load";
import {
  fetchPublicServices,
  fetchServiceBySlug,
  fetchServiceConfig,
} from "@/lib/catalog/services-api";
import { liveToBookingInputs } from "@/lib/booking/live-adapter";
import { getActiveBrandId } from "@/lib/brand/registry";
import { formatMoney } from "@/lib/money";
import { isEnabled } from "@/lib/flags/resolve";

export const metadata: Metadata = { title: "Book" };
// Re-fetch live services/config periodically; falls back to static on API failure.
export const revalidate = 60;

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
  const brandId = getActiveBrandId();

  // Step 1 — no service in the URL: show the picker (live services, static fallback).
  if (!serviceParam) {
    const apiServices = await fetchPublicServices();
    const items: ServiceSelectItem[] = apiServices
      ? apiServices.map((s) => ({
          slug: s.slug,
          title: s.name,
          priceLabel: s.status === "ACTIVE" ? priceLabel(s.basePrice, "USD") : null,
          status: s.status === "COMING_SOON" ? "coming-soon" : "active",
        }))
      : getServices().map((s) => ({
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

  // A service was chosen — prefer LIVE data (admin-managed); fall back to static.
  const live = await fetchServiceBySlug(serviceParam);
  if (live) {
    if (live.status === "COMING_SOON") {
      redirect(`/waitlist?service=${live.slug}`);
    }
    const config = await fetchServiceConfig(live.id);
    if (config) {
      const inputs = liveToBookingInputs(config);
      return (
        <BookingWizard
          service={inputs.service}
          pricing={inputs.pricing}
          brandId={brandId}
          liveServiceId={inputs.serviceId}
          optionIdByGroupKey={inputs.optionIdByGroupKey}
          durationMinutes={inputs.durationMinutes}
        />
      );
    }
  }

  // Fallback: static catalog (e.g. API unreachable). Submission stays stubbed.
  const service = getService(serviceParam);
  if (service?.coming_soon) {
    redirect(`/waitlist?service=${service.id}`);
  }
  if (!service) {
    redirect("/book");
  }
  return (
    <BookingWizard service={service} pricing={getPricingTable()} brandId={brandId} />
  );
}
