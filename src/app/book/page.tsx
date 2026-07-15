import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserCheck, MailOpen, DoorOpen } from "lucide-react";
import { Container } from "@/components/layout/container";
import { BookFlow, type BookTile } from "@/components/booking/book-flow";
import { getService, getServices } from "@/lib/catalog/load";
import { getPricingTable } from "@/lib/pricing/load";
import {
  fetchPublicServices,
  fetchServiceBySlug,
  fetchServiceConfig,
} from "@/lib/catalog/services-api";
import { liveToBookingInputs } from "@/lib/booking/live-adapter";
import { getActiveBrandId } from "@/lib/brand/registry";
import { isEnabled } from "@/lib/flags/resolve";

export const metadata: Metadata = { title: "Book" };
// Re-fetch live services/config periodically; falls back to static on API failure.
export const revalidate = 60;

/** Load the service tiles (live-first, static fallback). */
async function loadTiles(): Promise<BookTile[]> {
  const apiServices = await fetchPublicServices();
  if (apiServices) {
    return apiServices.map((s) => ({
      slug: s.slug,
      title: s.name,
      status: s.status === "COMING_SOON" ? "coming-soon" : "active",
    }));
  }
  return getServices().map((s) => ({
    slug: s.id,
    title: s.title,
    status: s.coming_soon ? "coming-soon" : "active",
  }));
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
  const tiles = await loadTiles();

  // Resolve the selected service's inputs (live-first, static fallback).
  let flowProps: Omit<React.ComponentProps<typeof BookFlow>, "tiles" | "selectedSlug"> = {};
  if (serviceParam) {
    const live = await fetchServiceBySlug(serviceParam);
    if (live) {
      if (live.status === "COMING_SOON") redirect(`/waitlist?service=${live.slug}`);
      const config = await fetchServiceConfig(live.id);
      if (config) {
        const inputs = liveToBookingInputs(config);
        flowProps = {
          service: inputs.service,
          pricing: inputs.pricing,
          brandId,
          liveServiceId: inputs.serviceId,
          optionIdByGroupKey: inputs.optionIdByGroupKey,
          durationMinutes: inputs.durationMinutes,
        };
      }
    }
    // Static fallback (API unreachable). Submission stays stubbed.
    if (!flowProps.service) {
      const service = getService(serviceParam);
      if (service?.coming_soon) redirect(`/waitlist?service=${service.id}`);
      if (!service) redirect("/book");
      flowProps = { service, pricing: getPricingTable(), brandId };
    }
  }

  return (
    <div className="book-page">
      <section className="bk-hero">
        <div className="bk-hero-bg" />
        <div className="bk-hero-inner">
          <div className="hero-eyebrow">Configure · See your price · Confirm</div>
          <h1 className="hero-title">
            Book.
            <br />
            <em>Your way.</em>
          </h1>
          <p className="hero-sub">
            Build your session below. Your exact price updates as you choose — and it
            never changes after you confirm.
          </p>
        </div>
      </section>

      <BookFlow tiles={tiles} selectedSlug={serviceParam ?? null} {...flowProps} />

      <section className="next-band">
        <div className="next-inner">
          <h2>
            What happens <em>next</em>
          </h2>
          <p>
            Booking is a request, not a gamble. Here&apos;s exactly what follows the
            moment you confirm.
          </p>
          <div className="next-grid">
            <div className="next-card">
              <UserCheck size={24} aria-hidden />
              <h4>A human reviews it</h4>
              <p>
                Your coordinator matches you with the right vetted professional — by
                specialty, preference, and availability — within one business hour.
              </p>
            </div>
            <div className="next-card">
              <MailOpen size={24} aria-hidden />
              <h4>You get the details</h4>
              <p>
                Name, photo, credentials, and arrival time. Your card is only charged
                once your session is confirmed.
              </p>
            </div>
            <div className="next-card">
              <DoorOpen size={24} aria-hidden />
              <h4>Your pro arrives</h4>
              <p>
                Ten minutes early, fully equipped. You prepare nothing, tip nothing
                extra, and your space is left exactly as found.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
