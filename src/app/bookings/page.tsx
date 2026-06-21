"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, TriangleAlert } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SampleBadge } from "@/components/shared/sample-badge";
import { useAuth } from "@/components/auth/auth-provider";
import {
  listMyBookings,
  cancelMyBooking,
  BookingApiError,
  type MyBooking,
} from "@/lib/booking/api";
import { bookingStatusBadge, isCancellable } from "@/lib/booking/status";
import { formatBookingWhen } from "@/lib/booking/format";
import { formatMoney } from "@/lib/money";

export default function MyBookingsPage() {
  const { status: authStatus } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = React.useState<MyBooking[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [cancelingId, setCancelingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (authStatus === "unauthenticated") router.replace("/login?next=/bookings");
  }, [authStatus, router]);

  const load = React.useCallback(async () => {
    setError(null);
    try {
      const { items } = await listMyBookings({ limit: 50 });
      setBookings(items);
    } catch (err) {
      setError(err instanceof BookingApiError ? err.message : "Failed to load your bookings.");
      setBookings([]);
    }
  }, []);

  React.useEffect(() => {
    if (authStatus === "authenticated") void load();
  }, [authStatus, load]);

  async function cancel(id: string) {
    if (!window.confirm("Cancel this booking request? This cannot be undone.")) return;
    setCancelingId(id);
    setError(null);
    try {
      const updated = await cancelMyBooking(id);
      setBookings((bs) => bs?.map((b) => (b.id === updated.id ? updated : b)) ?? null);
    } catch (err) {
      setError(err instanceof BookingApiError ? err.message : "Could not cancel the booking.");
    } finally {
      setCancelingId(null);
    }
  }

  const loading =
    authStatus === "loading" ||
    (authStatus === "authenticated" && bookings === null && !error);

  return (
    <Container size="lg" className="py-10 md:py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your booking requests and their status.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/book">Book a service</Link>
        </Button>
      </div>

      {error ? (
        <Card className="mb-6 flex items-center gap-2 px-4 py-3 text-sm text-destructive">
          <TriangleAlert className="size-4 shrink-0" aria-hidden />
          {error}
        </Card>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="h-32 animate-pulse bg-muted/60" />
          ))}
        </div>
      ) : bookings && bookings.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <CalendarDays className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">
            You don&apos;t have any bookings yet.
          </p>
          <Button asChild>
            <Link href="/book">Browse services</Link>
          </Button>
        </Card>
      ) : (
        <ul className="space-y-4">
          {bookings?.map((b) => {
            const badge = bookingStatusBadge(b.status);
            const options = (b.selections ?? []).map((s) => s.optionLabel).filter(Boolean);
            return (
              <li key={b.id}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-heading text-lg font-semibold text-foreground">
                          {b.serviceName}
                        </h2>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {b.reference}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 text-lg font-semibold text-foreground">
                        {formatMoney({ amount: b.priceAmount, currency: b.currency })}
                        <SampleBadge />
                      </span>
                    </div>
                  </div>

                  <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="size-4 shrink-0" aria-hidden />
                      {formatBookingWhen(b.scheduledStart)}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4 shrink-0" aria-hidden />
                      {b.locationMode.toLowerCase()}
                    </div>
                  </dl>

                  {options.length > 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Options:</span>{" "}
                      {options.join(" · ")}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/bookings/${b.id}`}>View details</Link>
                    </Button>
                    {isCancellable(b.status) ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={cancelingId === b.id}
                        onClick={() => void cancel(b.id)}
                      >
                        {cancelingId === b.id ? "Cancelling…" : "Cancel"}
                      </Button>
                    ) : null}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
