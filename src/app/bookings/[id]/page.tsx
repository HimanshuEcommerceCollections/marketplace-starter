"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import {
  getMyBooking,
  cancelMyBooking,
  submitReview,
  BookingApiError,
  type MyBooking,
} from "@/lib/booking/api";
import { isCancellable } from "@/lib/booking/status";
import { formatBookingDate, formatBookingTime } from "@/lib/booking/format";
import { formatMoney } from "@/lib/money";
import { areaLabel, statusBadge } from "@/lib/booking/display";

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { status: authStatus } = useAuth();
  const router = useRouter();
  const [booking, setBooking] = React.useState<MyBooking | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [canceling, setCanceling] = React.useState(false);
  const [ratingBusy, setRatingBusy] = React.useState(false);

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
      setError(
        err instanceof BookingApiError ? err.message : "Failed to load this booking.",
      );
    }
  }, [id]);

  React.useEffect(() => {
    if (authStatus === "authenticated") void load();
  }, [authStatus, load]);

  async function cancel() {
    if (!window.confirm("Cancel this booking? More than 4 hours out — no fee.")) return;
    setCanceling(true);
    setError(null);
    try {
      setBooking(await cancelMyBooking(id));
    } catch (err) {
      setError(
        err instanceof BookingApiError ? err.message : "Could not cancel the booking.",
      );
    } finally {
      setCanceling(false);
    }
  }

  async function rate(rating: number) {
    if (!booking || booking.review || ratingBusy) return;
    setRatingBusy(true);
    setError(null);
    try {
      const review = await submitReview({ bookingId: booking.id, rating });
      setBooking({ ...booking, review });
    } catch (err) {
      setError(
        err instanceof BookingApiError ? err.message : "Could not submit your rating.",
      );
    } finally {
      setRatingBusy(false);
    }
  }

  const loading =
    authStatus === "loading" || (authStatus === "authenticated" && !booking && !error);

  const lineItems = booking?.selections ?? [];
  const modifiersTotal = lineItems.reduce((sum, li) => sum + (li.priceModifier ?? 0), 0);
  const base = booking ? booking.priceAmount - modifiersTotal : 0;
  const windows = booking?.schedulePreferences?.windows ?? [];
  const town = booking ? areaLabel(booking.area) : null;

  return (
    <div className="mb-page">
      <div className="mb-detail">
        <Link href="/bookings" className="mb-back">
          <ArrowLeft size={15} aria-hidden />
          Back to my bookings
        </Link>

        {error ? <div className="mb-error">{error}</div> : null}

        {loading ? (
          <div className="mb-skel tall" />
        ) : !booking ? (
          !error ? (
            <div className="mb-panel">Booking not found.</div>
          ) : null
        ) : (
          <>
            <div className="mb-detail-head">
              <div>
                <h1>{booking.serviceName}</h1>
                <div className="mb-detail-badges">
                  <span className={`badge ${statusBadge(booking.status).cls}`}>
                    {statusBadge(booking.status).label}
                  </span>
                  <span className="ref">{booking.reference}</span>
                </div>
              </div>
              {isCancellable(booking.status) ? (
                <button
                  type="button"
                  className="mb-btn danger"
                  disabled={canceling}
                  onClick={() => void cancel()}
                >
                  {canceling ? "Cancelling…" : "Cancel booking"}
                </button>
              ) : null}
            </div>

            {/* Price */}
            <div className="mb-panel">
              <h2>Price</h2>
              <dl>
                <div className="mb-row">
                  <dt>Base</dt>
                  <dd>{formatMoney({ amount: base, currency: booking.currency })}</dd>
                </div>
                {lineItems.map((li, i) => (
                  <div className="mb-row muted" key={li.optionId ?? i}>
                    <dt>
                      {li.groupLabel}: {li.optionLabel}
                    </dt>
                    <dd>
                      + {formatMoney({ amount: li.priceModifier, currency: booking.currency })}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mb-total">
                <span>Total</span>
                <span className="p">
                  {formatMoney({ amount: booking.priceAmount, currency: booking.currency })}
                </span>
              </div>
            </div>

            {/* Schedule */}
            <div className="mb-panel">
              <h2>Schedule</h2>
              <dl>
                <div className="mb-row">
                  <dt>Date</dt>
                  <dd>{formatBookingDate(booking.scheduledDate)}</dd>
                </div>
                <div className="mb-row">
                  <dt>Time</dt>
                  <dd>{formatBookingTime(booking.scheduledTime)}</dd>
                </div>
                {windows.length > 1 ? (
                  <div className="mb-row muted">
                    <dt>Alternate windows</dt>
                    <dd>
                      {windows
                        .slice(1)
                        .map((w) => `${w.date}${w.time ? ` ${w.time}` : ""}`)
                        .join(" · ")}
                    </dd>
                  </div>
                ) : null}
                <div className="mb-row">
                  <dt>Location</dt>
                  <dd>{town ? `Your home · ${town}` : booking.locationMode.toLowerCase()}</dd>
                </div>
                {booking.providerName ? (
                  <div className="mb-row">
                    <dt>Professional</dt>
                    <dd>
                      {booking.providerName}
                      {booking.providerCredential ? `, ${booking.providerCredential}` : ""}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            {/* Your details */}
            <div className="mb-panel">
              <h2>Your details</h2>
              <dl>
                {booking.contactName ? (
                  <div className="mb-row">
                    <dt>Name</dt>
                    <dd>{booking.contactName}</dd>
                  </div>
                ) : null}
                {booking.contactEmail ? (
                  <div className="mb-row">
                    <dt>Email</dt>
                    <dd>{booking.contactEmail}</dd>
                  </div>
                ) : null}
                {booking.contactPhone ? (
                  <div className="mb-row">
                    <dt>Phone</dt>
                    <dd>{booking.contactPhone}</dd>
                  </div>
                ) : null}
                {booking.address ? (
                  <div className="mb-row">
                    <dt>Address</dt>
                    <dd>{booking.address}</dd>
                  </div>
                ) : null}
                {booking.notes ? (
                  <div className="mb-row muted">
                    <dt>Notes</dt>
                    <dd>{booking.notes}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            {/* Rating (completed only) */}
            {booking.status === "COMPLETED" ? (
              <div className="mb-panel">
                <h2>{booking.review ? "Your rating" : "Rate this session"}</h2>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((k) => {
                    const rated = booking.review?.rating ?? 0;
                    return (
                      <button
                        key={k}
                        type="button"
                        className={k <= rated ? "fill" : ""}
                        disabled={!!booking.review || ratingBusy}
                        aria-label={`${k} star${k > 1 ? "s" : ""}`}
                        onClick={() => void rate(k)}
                      >
                        <Star
                          size={22}
                          fill={k <= rated ? "currentColor" : "none"}
                          aria-hidden
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <p className="mb-fineprint">
              A coordinator will confirm availability and final pricing.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
