"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HandHeart,
  HeartPulse,
  Flower2,
  Dumbbell,
  Sparkles,
  Salad,
  Speech,
  Compass,
  CalendarDays,
  CalendarX,
  Star,
  CalendarPlus,
  RefreshCw,
  XCircle,
  RotateCcw,
  UserCheck,
  PlusCircle,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useBrand } from "@/components/layout/brand-provider";
import {
  listMyBookings,
  cancelMyBooking,
  submitReview,
  BookingApiError,
  type MyBooking,
} from "@/lib/booking/api";
import { formatBookingDate, formatBookingTime } from "@/lib/booking/format";
import { formatMoney } from "@/lib/money";
import {
  areaLabel,
  formatDuration,
  relativeCountdown,
  statusBadge,
  BOOKING_TABS,
  matchesTab,
  buildIcs,
  type BookingTabKey,
} from "@/lib/booking/display";

/** Per-service icon (by catalog slug); falls back to a calendar. */
const SERVICE_ICON: Record<string, LucideIcon> = {
  massage: HandHeart,
  "physical-therapy": HeartPulse,
  yoga: Flower2,
  "personal-training": Dumbbell,
  beauty: Sparkles,
  "nutrition-coaching": Salad,
  "life-coaching": Compass,
  "speech-therapy": Speech,
};
const iconFor = (slug: string): LucideIcon => SERVICE_ICON[slug] ?? CalendarDays;

export default function MyBookingsPage() {
  const { status: authStatus } = useAuth();
  const { config } = useBrand();
  const router = useRouter();
  const [bookings, setBookings] = React.useState<MyBooking[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<BookingTabKey>("all");
  const [cancelingId, setCancelingId] = React.useState<string | null>(null);
  const [ratingBusyId, setRatingBusyId] = React.useState<string | null>(null);
  const [justRatedId, setJustRatedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (authStatus === "unauthenticated") router.replace("/login?next=/bookings");
  }, [authStatus, router]);

  const load = React.useCallback(async () => {
    setError(null);
    try {
      const { items } = await listMyBookings({ limit: 50 });
      setBookings(items);
    } catch (err) {
      setError(
        err instanceof BookingApiError ? err.message : "Failed to load your bookings.",
      );
      setBookings([]);
    }
  }, []);

  React.useEffect(() => {
    if (authStatus === "authenticated") void load();
  }, [authStatus, load]);

  async function cancel(id: string) {
    if (!window.confirm("Cancel this booking? More than 4 hours out — no fee.")) return;
    setCancelingId(id);
    setError(null);
    try {
      const updated = await cancelMyBooking(id);
      setBookings((bs) => bs?.map((b) => (b.id === updated.id ? updated : b)) ?? null);
    } catch (err) {
      setError(
        err instanceof BookingApiError ? err.message : "Could not cancel the booking.",
      );
    } finally {
      setCancelingId(null);
    }
  }

  async function rate(b: MyBooking, rating: number) {
    if (b.review || ratingBusyId) return;
    setRatingBusyId(b.id);
    setError(null);
    try {
      const review = await submitReview({ bookingId: b.id, rating });
      setBookings((bs) => bs?.map((x) => (x.id === b.id ? { ...x, review } : x)) ?? null);
      setJustRatedId(b.id);
    } catch (err) {
      setError(
        err instanceof BookingApiError ? err.message : "Could not submit your rating.",
      );
    } finally {
      setRatingBusyId(null);
    }
  }

  function downloadIcs(b: MyBooking) {
    const blob = new Blob([buildIcs(b)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elevate-${b.reference}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const loading =
    authStatus === "loading" ||
    (authStatus === "authenticated" && bookings === null && !error);

  const all = bookings ?? [];
  const rows = all.filter((b) => matchesTab(b.status, tab));

  // "Next Up" = soonest upcoming confirmed/in-progress session.
  const nextUp = all
    .filter(
      (b) =>
        (b.status === "CONFIRMED" || b.status === "IN_PROGRESS") &&
        new Date(b.scheduledStart).getTime() >= Date.now(),
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime(),
    )[0];

  const coordinatorMail = `mailto:${config.contactEmail}`;

  function renderStars(b: MyBooking) {
    const rated = b.review?.rating ?? 0;
    return (
      <div className="stars">
        <span className="lbl">{b.review ? "Your rating" : "Rate this session"}</span>
        {[1, 2, 3, 4, 5].map((k) => (
          <button
            key={k}
            type="button"
            className={k <= rated ? "fill" : ""}
            disabled={!!b.review || ratingBusyId === b.id}
            aria-label={`${k} star${k > 1 ? "s" : ""}`}
            onClick={() => void rate(b, k)}
          >
            <Star size={19} fill={k <= rated ? "currentColor" : "none"} aria-hidden />
          </button>
        ))}
        {justRatedId === b.id && b.review ? (
          <span className="thanks">
            Thanks
            {b.providerName ? ` — passed to ${b.providerName.split(" ")[0]}!` : "!"}
          </span>
        ) : null}
      </div>
    );
  }

  function renderActions(b: MyBooking) {
    if (b.status === "CONFIRMED" || b.status === "IN_PROGRESS") {
      return (
        <div className="bkg-actions">
          <button type="button" className="mb-btn" onClick={() => downloadIcs(b)}>
            <CalendarPlus size={14} aria-hidden />
            Add to calendar
          </button>
          <a
            className="mb-btn"
            href={`${coordinatorMail}?subject=${encodeURIComponent(`Reschedule ${b.reference}`)}`}
          >
            <RefreshCw size={14} aria-hidden />
            Reschedule
          </a>
          <button
            type="button"
            className="mb-btn danger"
            disabled={cancelingId === b.id}
            onClick={() => void cancel(b.id)}
          >
            <XCircle size={14} aria-hidden />
            {cancelingId === b.id ? "Cancelling…" : "Cancel"}
          </button>
        </div>
      );
    }
    if (b.status === "PENDING") {
      return (
        <>
          <div className="bkg-note">
            <UserCheck size={15} aria-hidden />
            A coordinator is arranging your session and will confirm the final
            details within one business hour.
          </div>
          <div className="bkg-actions">
            <a
              className="mb-btn"
              href={`${coordinatorMail}?subject=${encodeURIComponent(b.reference)}`}
            >
              <MessageCircle size={14} aria-hidden />
              Message coordinator
            </a>
          </div>
        </>
      );
    }
    // COMPLETED / CANCELLED / NO_SHOW → rebook
    return (
      <div className="bkg-actions">
        <Link className="mb-btn solid" href="/book">
          <RotateCcw size={14} aria-hidden />
          Rebook
        </Link>
      </div>
    );
  }

  function renderCard(b: MyBooking) {
    const Icon = iconFor(b.serviceSlug);
    const badge = statusBadge(b.status);
    const dur = formatDuration(b.scheduledStart, b.scheduledEnd);
    const town = areaLabel(b.area);
    return (
      <div className="bkg-card" key={b.id}>
        <div className="bkg-top">
          <div className="bkg-icon">
            <Icon size={21} aria-hidden />
          </div>
          <div className="bkg-main">
            <div className="bkg-title">
              <h3>{b.serviceName}</h3>
              <span className={`badge ${badge.cls}`}>{badge.label}</span>
            </div>
            <div className="bkg-meta">
              <b>{formatBookingDate(b.scheduledDate)}</b>
              <span className="dot">·</span>
              {formatBookingTime(b.scheduledTime)}
              {dur ? (
                <>
                  <span className="dot">·</span>
                  {dur}
                </>
              ) : null}
              <br />
              {b.providerName ? (
                <>
                  {b.providerName}
                  {b.providerCredential ? (
                    <>
                      {" "}
                      <b className="cred">{b.providerCredential}</b>
                    </>
                  ) : null}
                  <span className="dot">·</span>
                </>
              ) : null}
              {town ? (
                <>
                  {town}
                  <span className="dot">·</span>
                </>
              ) : null}
              <span className="ref">{b.reference}</span>
            </div>
          </div>
          <div className="bkg-price">
            <div className="p">
              {formatMoney({ amount: b.priceAmount, currency: b.currency })}
            </div>
            <Link href={`/bookings/${b.id}`} className="l">
              View details
            </Link>
          </div>
        </div>
        {b.status === "COMPLETED" ? renderStars(b) : null}
        {renderActions(b)}
      </div>
    );
  }

  return (
    <div className="mb-page">
      <section className="mb-hero">
        <div className="mb-hero-bg" />
        <div className="mb-hero-inner">
          <div className="hero-eyebrow">Your Account</div>
          <h1 className="hero-title">
            Your.
            <br />
            <em>Sessions.</em>
          </h1>
          <p className="hero-sub">
            Everything you&apos;ve booked — upcoming, pending, and past — in one
            calm place.
          </p>
        </div>
      </section>

      <div className="mb-wrap">
        <div className="mb-main">
          <div className="mb-tabs">
            {BOOKING_TABS.map((t) => {
              const n =
                t.key === "all"
                  ? all.length
                  : all.filter((b) => matchesTab(b.status, t.key)).length;
              return (
                <button
                  key={t.key}
                  type="button"
                  className={`mb-tab${tab === t.key ? " on" : ""}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                  <small>{n}</small>
                </button>
              );
            })}
          </div>

          {error ? <div className="mb-error">{error}</div> : null}

          {loading ? (
            <>
              <div className="mb-skel" />
              <div className="mb-skel" />
              <div className="mb-skel" />
            </>
          ) : rows.length > 0 ? (
            rows.map(renderCard)
          ) : (
            <div className="mb-empty">
              <CalendarX size={40} aria-hidden />
              <p>Nothing here yet.</p>
              <Link href="/book" className="mb-btn solid">
                Book a session
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          )}
        </div>

        <aside className="mb-side">
          <div className="next-card-dark">
            <div className="nc-eyebrow">Next Up</div>
            {nextUp ? (
              <>
                <div className="nc-when">
                  {formatBookingDate(nextUp.scheduledDate)} ·{" "}
                  {formatBookingTime(nextUp.scheduledTime)}
                </div>
                <div className="nc-count">
                  {relativeCountdown(nextUp.scheduledStart) ?? ""}
                </div>
                <div className="nc-line">
                  <span>Session</span>
                  <b>
                    {nextUp.serviceName}
                    {formatDuration(nextUp.scheduledStart, nextUp.scheduledEnd)
                      ? ` · ${formatDuration(nextUp.scheduledStart, nextUp.scheduledEnd)}`
                      : ""}
                  </b>
                </div>
                {nextUp.providerName ? (
                  <div className="nc-line">
                    <span>Professional</span>
                    <b>
                      {nextUp.providerName}
                      {nextUp.providerCredential ? `, ${nextUp.providerCredential}` : ""}
                    </b>
                  </div>
                ) : null}
                <div className="nc-line">
                  <span>Location</span>
                  <b>
                    {areaLabel(nextUp.area)
                      ? `Your home · ${areaLabel(nextUp.area)}`
                      : "Your home"}
                  </b>
                </div>
                <div className="nc-line">
                  <span>Price</span>
                  <b>{formatMoney({ amount: nextUp.priceAmount, currency: nextUp.currency })}</b>
                </div>
              </>
            ) : (
              <>
                <div className="nc-when">Nothing booked</div>
                <div className="nc-count">Your calendar is clear</div>
              </>
            )}
          </div>

          <div className="side-card">
            <h4>Quick actions</h4>
            <Link href="/book" className="mb-btn solid">
              <PlusCircle size={14} aria-hidden />
              Book a new session
            </Link>
            <a href={coordinatorMail} className="mb-btn">
              <MessageCircle size={14} aria-hidden />
              Message my coordinator
            </a>
            <Link href="/faq" className="mb-btn">
              <HelpCircle size={14} aria-hidden />
              Booking questions
            </Link>
          </div>

          <div className="side-card">
            <h4>Good to know</h4>
            <p>
              Reschedule or cancel free up to 4 hours before any session. Inside 4
              hours, a 50% fee supports your professional&apos;s committed time.{" "}
              <Link className="txt" href="/terms">
                Full policy →
              </Link>
            </p>
          </div>
        </aside>
      </div>

      <section className="mb-band">
        <div className="mb-band-inner">
          <h2>
            Plans change.
            <br />
            <em>That&apos;s fine.</em>
          </h2>
          <p>
            Move any session with a tap — free up to four hours before. Your
            coordinator handles the rest.
          </p>
          <div className="mb-band-chips">
            <div className="mb-band-chip">
              <div className="n">Free</div>
              <div className="l">Reschedule ≥ 4 hrs</div>
            </div>
            <div className="mb-band-chip">
              <div className="n">2 taps</div>
              <div className="l">To Rebook</div>
            </div>
            <div className="mb-band-chip">
              <div className="n">&lt;1 hr</div>
              <div className="l">Coordinator Reply</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
