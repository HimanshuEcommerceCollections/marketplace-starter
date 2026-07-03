"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SampleBadge } from "@/components/shared/sample-badge";
import { useAuth } from "@/components/auth/auth-provider";
import {
  getMyBooking,
  cancelMyBooking,
  BookingApiError,
  type MyBooking,
} from "@/lib/booking/api";
import { bookingStatusBadge, isCancellable } from "@/lib/booking/status";
import { formatBookingDate, formatBookingTime } from "@/lib/booking/format";
import { formatMoney } from "@/lib/money";

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { status: authStatus } = useAuth();
  const router = useRouter();
  const [booking, setBooking] = React.useState<MyBooking | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [canceling, setCanceling] = React.useState(false);

  React.useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace(`/login?next=/bookings/${id}`);
    }
  }, [authStatus, router, id]);

  const load = React.useCallback(async () => {
    setError(null);
    try {
      setBooking(await getMyBooking(id));
    } catch (err) {
      setError(err instanceof BookingApiError ? err.message : "Failed to load this booking.");
    }
  }, [id]);

  React.useEffect(() => {
    if (authStatus === "authenticated") void load();
  }, [authStatus, load]);

  async function cancel() {
    if (!window.confirm("Cancel this booking request? This cannot be undone.")) return;
    setCanceling(true);
    setError(null);
    try {
      setBooking(await cancelMyBooking(id));
    } catch (err) {
      setError(err instanceof BookingApiError ? err.message : "Could not cancel the booking.");
    } finally {
      setCanceling(false);
    }
  }

  const loading =
    authStatus === "loading" || (authStatus === "authenticated" && !booking && !error);

  const lineItems = booking?.selections ?? [];
  const modifiersTotal = lineItems.reduce((sum, li) => sum + (li.priceModifier ?? 0), 0);
  const base = booking ? booking.priceAmount - modifiersTotal : 0;
  const windows = booking?.schedulePreferences?.windows ?? [];

  return (
    <Container size="md" className="py-10 md:py-12">
      <Link
        href="/bookings"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to my bookings
      </Link>

      {error ? (
        <Card className="mb-6 flex items-center gap-2 px-4 py-3 text-sm text-destructive">
          <TriangleAlert className="size-4 shrink-0" aria-hidden />
          {error}
        </Card>
      ) : null}

      {loading ? (
        <Card className="h-64 animate-pulse bg-muted/60" />
      ) : !booking ? (
        !error ? (
          <Card className="px-4 py-8 text-center text-sm text-muted-foreground">
            Booking not found.
          </Card>
        ) : null
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                  {booking.serviceName}
                </h1>
                <Badge variant={bookingStatusBadge(booking.status).variant}>
                  {bookingStatusBadge(booking.status).label}
                </Badge>
              </div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {booking.reference}
              </p>
            </div>
            {isCancellable(booking.status) ? (
              <Button
                type="button"
                variant="outline"
                disabled={canceling}
                onClick={() => void cancel()}
              >
                {canceling ? "Cancelling…" : "Cancel booking"}
              </Button>
            ) : null}
          </div>

          {/* Price breakdown */}
          <Card className="p-5">
            <h2 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
              Price <SampleBadge />
            </h2>
            <dl className="space-y-1.5 text-sm">
              <Row label="Base" value={formatMoney({ amount: base, currency: booking.currency })} />
              {lineItems.map((li, i) => (
                <Row
                  key={li.optionId ?? i}
                  label={`${li.groupLabel}: ${li.optionLabel}`}
                  value={`+ ${formatMoney({ amount: li.priceModifier, currency: booking.currency })}`}
                  muted
                />
              ))}
            </dl>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-lg font-semibold text-foreground">
                {formatMoney({ amount: booking.priceAmount, currency: booking.currency })}
              </span>
            </div>
          </Card>

          {/* Schedule */}
          <Card className="p-5">
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">Schedule</h2>
            <dl className="space-y-1.5 text-sm">
              <Row label="Date" value={formatBookingDate(booking.scheduledDate)} />
              <Row label="Time" value={formatBookingTime(booking.scheduledTime)} />
              {windows.length > 1 ? (
                <Row
                  label="Alternate windows"
                  value={windows
                    .slice(1)
                    .map((w) => `${w.date}${w.time ? ` ${w.time}` : ""}`)
                    .join(" · ")}
                  muted
                />
              ) : null}
              <Row label="Location" value={booking.locationMode.toLowerCase()} />
            </dl>
          </Card>

          {/* Contact + details */}
          <Card className="p-5">
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">Your details</h2>
            <dl className="space-y-1.5 text-sm">
              {booking.contactName ? <Row label="Name" value={booking.contactName} /> : null}
              {booking.contactEmail ? <Row label="Email" value={booking.contactEmail} /> : null}
              {booking.contactPhone ? <Row label="Phone" value={booking.contactPhone} /> : null}
              {booking.address ? <Row label="Address" value={booking.address} /> : null}
              {booking.notes ? <Row label="Notes" value={booking.notes} muted /> : null}
            </dl>
          </Card>

          <p className="text-xs text-muted-foreground">
            A coordinator will confirm availability and final pricing.
          </p>
        </div>
      )}
    </Container>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={muted ? "text-right text-muted-foreground" : "text-right font-medium text-foreground"}>
        {value}
      </dd>
    </div>
  );
}
