"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, ArrowUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { serviceIcon } from "@/lib/catalog/service-icons";
import { AREA_OPTIONS } from "@/lib/auth/areas";
import { TIME_RANGES, MAX_WINDOWS } from "@/lib/booking/time-ranges";
import { analytics } from "@/lib/analytics/analytics";
import { computePrice } from "@/lib/pricing/engine";
import { formatMoney, addMoney } from "@/lib/money";
import { submitBooking, BookingApiError } from "@/lib/booking/api";
import { createPaymentIntent, PaymentApiError } from "@/lib/payments/api";
import {
  BookingProvider,
  useBookingDraft,
  toConfiguration,
  toServerBooking,
  buildBookingRequest,
  selectionSummary,
  addOnsSummary,
} from "./booking-provider";
import { WizardStepPayment } from "./wizard-step-payment";
import { BookingSuccessScreen } from "./booking-success-screen";
import type { Service } from "@/lib/catalog/types";
import type { PricingTable } from "@/lib/pricing/types";
import type { Money } from "@/lib/booking/contract";
import type { BrandId } from "@/lib/brand/registry";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export interface BookTile {
  slug: string;
  title: string;
  status: "active" | "coming-soon";
}

export interface BookFlowProps {
  tiles: BookTile[];
  selectedSlug: string | null;
  /** Present when a bookable service is selected (interactive). */
  service?: Service;
  pricing?: PricingTable;
  brandId?: BrandId;
  liveServiceId?: string;
  optionIdByGroupKey?: Record<string, Record<string, string>>;
  durationMinutes?: number;
}

/** Whole-dollar money (e.g. "$109"). */
function money(m: Money): string {
  return formatMoney(m).replace(/\.00$/, "");
}

// ── Service tiles (shared by the empty + interactive states) ─────────────────
function ServiceTiles({
  tiles,
  selectedSlug,
}: {
  tiles: BookTile[];
  selectedSlug: string | null;
}) {
  return (
    <div className="bk-step">
      <div className="bk-step-head">
        <div className="bk-num">01</div>
        <div>
          <h3>Choose your service</h3>
          <small>Delivered to your door across Wake County</small>
        </div>
      </div>
      <div className="svc-pick">
        {tiles.map((t) => {
          const Icon = serviceIcon(t.slug);
          const soon = t.status === "coming-soon";
          return (
            <Link
              key={t.slug}
              href={`/book?service=${t.slug}`}
              className={cn(
                "svc-tile",
                t.slug === selectedSlug && "sel",
                soon && "soon",
              )}
            >
              <Icon size={22} aria-hidden />
              <span>{t.title}</span>
              {soon ? <span className="soon-tag">Soon</span> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ── Entry ────────────────────────────────────────────────────────────────────
export function BookFlow(props: BookFlowProps) {
  if (!props.service || !props.pricing || !props.brandId) {
    // No service chosen yet — tiles + placeholder + inert summary.
    return (
      <div className="book-wrap">
        <div className="bk-steps">
          <ServiceTiles tiles={props.tiles} selectedSlug={null} />
          <div className="bk-step">
            <div className="bk-step-head">
              <div className="bk-num">02</div>
              <div>
                <h3>Configure your session</h3>
                <small>Options and live pricing appear once you pick a service</small>
              </div>
            </div>
            <div className="coord-note">
              <ArrowUp size={18} aria-hidden />
              Choose a service above to build your session.
            </div>
          </div>
        </div>
        <aside className="bk-summary">
          <div className="bk-sum-eyebrow">Your Session</div>
          <div className="bk-sum-line">
            <span>Service</span>
            <b>—</b>
          </div>
          <div className="bk-total">
            <span className="lbl">Your price</span>
            <span className="amt">
              <small>from</small> $—
            </span>
          </div>
          <button className="bk-cta" disabled>
            Request booking
          </button>
        </aside>
      </div>
    );
  }

  return (
    <BookingProvider
      service={props.service}
      pricing={props.pricing}
      brandId={props.brandId}
      liveServiceId={props.liveServiceId}
      optionIdByGroupKey={props.optionIdByGroupKey}
      durationMinutes={props.durationMinutes}
      initialStep="build"
    >
      <BookInner tiles={props.tiles} selectedSlug={props.selectedSlug} />
    </BookingProvider>
  );
}

type FieldErrors = {
  name?: string;
  email?: string;
  area?: string;
  /** Per preferred-window (index → message). */
  windows?: Record<number, string>;
};

// ── Interactive flow ─────────────────────────────────────────────────────────
function BookInner({
  tiles,
  selectedSlug,
}: {
  tiles: BookTile[];
  selectedSlug: string | null;
}) {
  const ctx = useBookingDraft();
  const { state, dispatch, service, pricing } = ctx;
  const { status: authStatus } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [windowCount, setWindowCount] = React.useState(1);
  const [submitPhase, setSubmitPhase] = React.useState<"idle" | "creating" | "preparing">(
    "idle",
  );

  const draftKey = `elevate:book-draft:${service.id}`;
  const loginRedirect = `/login?next=${encodeURIComponent(`/book?service=${service.id}`)}`;

  // config_start once on mount.
  React.useEffect(() => {
    analytics.configStart({ service_id: service.id, service_type: service.service_type });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Draft persistence: survive the login round-trip (sessionStorage) ────────
  const restored = React.useRef(false);
  React.useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const raw = sessionStorage.getItem(draftKey);
      if (!raw) return;
      const d = JSON.parse(raw) as Partial<{
        selections: Record<string, string | number | boolean | string[]>;
        quantity: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        area: string;
        windows: Array<{ date: string; time: string }>;
      }>;
      if (d.selections) {
        for (const [key, value] of Object.entries(d.selections)) {
          dispatch({ type: "SET_SELECTION", key, value });
        }
      }
      if (typeof d.quantity === "number") dispatch({ type: "SET_QUANTITY", quantity: d.quantity });
      (["firstName", "lastName", "email", "phone", "address", "area"] as const).forEach((f) => {
        if (typeof d[f] === "string" && d[f]) dispatch({ type: "SET_FIELD", field: f, value: d[f] as string });
      });
      d.windows?.forEach((w, i) => dispatch({ type: "SET_WINDOW", index: i, patch: w }));
      const filledWindows = (d.windows ?? []).filter((w) => w?.date || w?.time).length;
      if (filledWindows > 1) setWindowCount(Math.min(filledWindows, MAX_WINDOWS));
    } catch {
      /* ignore malformed draft */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!restored.current) return;
    try {
      sessionStorage.setItem(
        draftKey,
        JSON.stringify({
          selections: state.selections,
          quantity: state.quantity,
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email,
          phone: state.phone,
          address: state.address,
          area: state.area,
          windows: state.windows,
        }),
      );
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [state, draftKey]);

  // ── Pricing helpers (mirror wizard-step-config) ─────────────────────────────
  const sp = pricing.services[service.id];
  const base: Money = sp?.base_price ?? { amount: 0, currency: service.currency };
  const modifierOf = (id: string) => sp?.modifiers.find((m) => m.id === id);
  const deltaOf = (modId: string, choiceId: string) =>
    modifierOf(modId)?.options?.find((o) => o.id === choiceId)?.delta;
  const groupAffectsPrice = (modId: string) =>
    (modifierOf(modId)?.options ?? []).some((o) => o.delta && o.delta.amount !== 0);

  const breakdown = computePrice(pricing, toConfiguration(state, service));
  const sessionLabel = selectionSummary(service, state.selections);
  const addOns = addOnsSummary(service, state.selections);

  function setField(field: "firstName" | "email" | "phone" | "address" | "area", value: string) {
    dispatch({ type: "SET_FIELD", field, value });
  }

  function clearDraft() {
    try {
      sessionStorage.removeItem(draftKey);
    } catch {
      /* ignore */
    }
  }

  function addWindow() {
    setWindowCount((n) => Math.min(n + 1, MAX_WINDOWS));
  }
  function removeWindow(index: number) {
    dispatch({ type: "SET_WINDOW", index, patch: { date: "", time: "" } });
    setWindowCount((n) => Math.max(1, n - 1));
  }

  async function requestBooking() {
    const errs: FieldErrors = {};
    if (!state.firstName.trim()) errs.name = "Enter your name";
    if (!EMAIL_RE.test(state.email)) errs.email = "Enter a valid email";
    if (!state.area) errs.area = "Select your area";

    // Preferred windows: #1 needs date + range; extras need both-or-neither.
    const winErrs: Record<number, string> = {};
    for (let i = 0; i < windowCount; i += 1) {
      const w = state.windows[i];
      const hasDate = !!w?.date;
      const hasTime = !!w?.time;
      if (i === 0) {
        if (!hasDate && !hasTime) winErrs[0] = "Choose a date and time range";
        else if (!hasDate) winErrs[0] = "Choose a date";
        else if (!hasTime) winErrs[0] = "Pick a time range";
      } else if (hasDate !== hasTime) {
        winErrs[i] = "Add both a date and a time range, or remove this option";
      }
    }
    if (Object.keys(winErrs).length > 0) errs.windows = winErrs;

    setErrors(errs);
    if (errs.name || errs.email || errs.area || errs.windows) return;
    if (state.status === "submitting") return;

    // Static fallback (no live service) — keep the stub behavior.
    if (!ctx.liveServiceId) {
      const request = buildBookingRequest(ctx);
      dispatch({ type: "SUBMIT_START" });
      analytics.bookSubmit({
        request_id: request.request_id,
        service_type: request.service_type,
        displayed_price: request.displayed_price.total.amount,
        currency: request.displayed_price.total.currency,
        is_stub: true,
      });
      clearDraft();
      dispatch({ type: "SUBMIT_OK", request });
      return;
    }

    // Live submit requires an authenticated customer.
    if (authStatus !== "authenticated") {
      router.push(loginRedirect); // draft already persisted to sessionStorage
      return;
    }

    dispatch({ type: "SUBMIT_START" });
    try {
      let bookingId = state.bookingId;
      if (!bookingId) {
        setSubmitPhase("creating");
        const created = await submitBooking(toServerBooking(ctx));
        bookingId = created.id;
        analytics.bookSubmit({
          request_id: created.reference,
          service_type: service.service_type,
          displayed_price: created.priceAmount,
          currency: created.currency,
          is_stub: false,
        });
        dispatch({
          type: "BOOKING_CREATED",
          request: buildBookingRequest(ctx),
          reference: created.reference,
          bookingId,
        });
      }
      setSubmitPhase("preparing");
      const intent = await createPaymentIntent(bookingId);
      clearDraft();
      dispatch({
        type: "PAYMENT_BEGIN",
        paymentId: intent.paymentId,
        clientSecret: intent.clientSecret,
        publishableKey: intent.publishableKey,
        amount: intent.amount,
        currency: intent.currency,
      });
    } catch (err) {
      if (
        (err instanceof BookingApiError || err instanceof PaymentApiError) &&
        err.status === 401
      ) {
        router.push(loginRedirect);
        return;
      }
      dispatch({
        type: "SUBMIT_ERROR",
        error:
          err instanceof BookingApiError || err instanceof PaymentApiError
            ? err.message
            : "Could not start payment. Please try again.",
      });
    } finally {
      setSubmitPhase("idle");
    }
  }

  // ── Payment page ────────────────────────────────────────────────────────────
  if (state.step === "payment") {
    return (
      <div className="bk-panel">
        <button
          type="button"
          className="bk-back"
          onClick={() => dispatch({ type: "SET_STEP", step: "build" })}
        >
          <ArrowLeft size={15} aria-hidden />
          Back to my booking
        </button>
        <div className="bk-panel-head">
          <h2>Secure payment</h2>
          <p>Complete payment to lock in your session. No charge until it&apos;s confirmed.</p>
        </div>
        <WizardStepPayment />
      </div>
    );
  }

  // ── Success ─────────────────────────────────────────────────────────────────
  if (state.step === "success") {
    return (
      <div className="bk-panel">
        <BookingSuccessScreen
          request={state.request}
          reference={state.reference}
          live={Boolean(ctx.liveServiceId)}
        />
      </div>
    );
  }

  // ── Build (single-page) ─────────────────────────────────────────────────────
  const submitting = state.status === "submitting";
  let stepNo = 1;
  const nextNum = () => String(++stepNo).padStart(2, "0");

  return (
    <div className="book-wrap">
      <div className="bk-steps">
        <ServiceTiles tiles={tiles} selectedSlug={selectedSlug} />

        {/* Config groups (data-driven) */}
        {service.config_options.map((option) => {
          const num = nextNum();
          if (option.input === "multiselect") {
            const selected = Array.isArray(state.selections[option.id])
              ? (state.selections[option.id] as string[])
              : [];
            const toggle = (id: string, on: boolean) =>
              dispatch({
                type: "SET_SELECTION",
                key: option.id,
                value: on ? [...selected, id] : selected.filter((x) => x !== id),
              });
            return (
              <div className="bk-step" key={option.id}>
                <div className="bk-step-head">
                  <div className="bk-num">{num}</div>
                  <div>
                    <h3>{option.label}</h3>
                    <small>Optional — each shows its price before you add it</small>
                  </div>
                </div>
                <div className="addon-list">
                  {option.choices?.map((c) => {
                    const on = selected.includes(c.id);
                    const delta = deltaOf(option.id, c.id);
                    return (
                      <label key={c.id} className={cn("addon", on && "sel")}>
                        <span className="l">
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={(e) => toggle(c.id, e.target.checked)}
                          />
                          <span className="box">
                            <Check size={12} aria-hidden />
                          </span>
                          {c.label}
                        </span>
                        <span className="p">
                          {delta && delta.amount !== 0 ? `+${money(delta)}` : "Free"}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          }

          // Single-select → chip row
          const current = String(state.selections[option.id] ?? "");
          const showPrice = groupAffectsPrice(option.id);
          return (
            <div className="bk-step" key={option.id}>
              <div className="bk-step-head">
                <div className="bk-num">{num}</div>
                <div>
                  <h3>{option.label}</h3>
                  <small>Prices are all-in — travel, equipment &amp; gratuity included</small>
                </div>
              </div>
              <div className="bk-chips" role="group" aria-label={option.label}>
                {option.choices?.map((c) => {
                  const on = current === c.id;
                  const delta = deltaOf(option.id, c.id);
                  const price = showPrice ? money(delta ? addMoney(base, delta) : base) : null;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      className={cn("bk-chip", on && "sel")}
                      aria-pressed={on}
                      onClick={() =>
                        dispatch({ type: "SET_SELECTION", key: option.id, value: c.id })
                      }
                    >
                      {c.label}
                      {price ? <b>{price}</b> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Preferred times (up to MAX_WINDOWS date + range options) */}
        <div className="bk-step">
          <div className="bk-step-head">
            <div className="bk-num">{nextNum()}</div>
            <div>
              <h3>Preferred times</h3>
              <small>
                Give up to {MAX_WINDOWS} date + time-range options — your coordinator
                confirms one
              </small>
            </div>
          </div>
          <div className="bk-windows">
            {Array.from({ length: windowCount }).map((_, i) => (
              <div className="bk-window" key={i}>
                <div className="bk-fields">
                  <div className="bk-field">
                    <label htmlFor={`f-date-${i}`}>
                      {i === 0 ? "Date" : `Date (option ${i + 1})`}
                    </label>
                    <input
                      id={`f-date-${i}`}
                      type="date"
                      value={state.windows[i]?.date ?? ""}
                      aria-invalid={!!errors.windows?.[i]}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_WINDOW",
                          index: i,
                          patch: { date: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="bk-field">
                    <label htmlFor={`f-time-${i}`}>Preferred time</label>
                    <select
                      id={`f-time-${i}`}
                      value={state.windows[i]?.time ?? ""}
                      aria-invalid={!!errors.windows?.[i]}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_WINDOW",
                          index: i,
                          patch: { time: e.target.value },
                        })
                      }
                    >
                      <option value="">Select a time range</option>
                      {TIME_RANGES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {errors.windows?.[i] ? (
                  <span className="err">{errors.windows[i]}</span>
                ) : null}
                {i > 0 && i === windowCount - 1 ? (
                  <button
                    type="button"
                    className="bk-window-remove"
                    onClick={() => removeWindow(i)}
                  >
                    Remove this option
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          {windowCount < MAX_WINDOWS ? (
            <button type="button" className="bk-add-window" onClick={addWindow}>
              + Add another time
            </button>
          ) : null}
        </div>

        {/* Details */}
        <div className="bk-step">
          <div className="bk-step-head">
            <div className="bk-num">{nextNum()}</div>
            <div>
              <h3>Your details</h3>
              <small>A coordinator confirms within one business hour</small>
            </div>
          </div>
          <div className="bk-fields">
            <div className="bk-field">
              <label htmlFor="f-area">Area</label>
              <select
                id="f-area"
                value={state.area}
                aria-invalid={!!errors.area}
                onChange={(e) => setField("area", e.target.value)}
              >
                <option value="">Select your area</option>
                {AREA_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.area ? <span className="err">{errors.area}</span> : null}
            </div>
            <div className="bk-field">
              <label htmlFor="f-name">Name</label>
              <input
                id="f-name"
                type="text"
                placeholder="Your name"
                value={state.firstName}
                aria-invalid={!!errors.name}
                onChange={(e) => setField("firstName", e.target.value)}
              />
              {errors.name ? <span className="err">{errors.name}</span> : null}
            </div>
            <div className="bk-field">
              <label htmlFor="f-phone">Phone</label>
              <input
                id="f-phone"
                type="tel"
                placeholder="(919) 555-0000"
                value={state.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
            </div>
            <div className="bk-field">
              <label htmlFor="f-email">Email</label>
              <input
                id="f-email"
                type="email"
                placeholder="you@email.com"
                value={state.email}
                aria-invalid={!!errors.email}
                onChange={(e) => setField("email", e.target.value)}
              />
              {errors.email ? <span className="err">{errors.email}</span> : null}
            </div>
            <div className="bk-field full">
              <label htmlFor="f-address">Home address</label>
              <input
                id="f-address"
                type="text"
                placeholder="Street, unit, city"
                value={state.address}
                onChange={(e) => setField("address", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky summary */}
      <aside className="bk-summary">
        <div className="bk-sum-eyebrow">Your Session</div>
        <div className="bk-sum-line">
          <span>Service</span>
          <b>{service.title}</b>
        </div>
        <div className="bk-sum-line">
          <span>Selections</span>
          <b>{sessionLabel || "—"}</b>
        </div>
        <div className="bk-sum-line">
          <span>Add-ons</span>
          <b>{addOns || "None"}</b>
        </div>
        <div className="bk-sum-line">
          <span>Travel &amp; gratuity</span>
          <b>Included</b>
        </div>
        <div className="bk-total">
          <span className="lbl">Your price</span>
          <span className="amt">
            {breakdown.is_estimate ? <small>from</small> : null} {money(breakdown.total)}
          </span>
        </div>

        {state.status === "error" && state.error ? (
          <p className="bk-sum-error" role="alert">
            {state.error}
          </p>
        ) : null}

        <button
          type="button"
          className="bk-cta"
          onClick={() => void requestBooking()}
          disabled={submitting}
        >
          {submitting
            ? submitPhase === "preparing"
              ? "Preparing payment…"
              : "Creating booking…"
            : "Request booking"}
          {!submitting ? <ArrowRight size={16} aria-hidden /> : null}
        </button>
        <div className="bk-fine">
          No charge until your coordinator confirms. Free rescheduling up to 4 hours
          before.
        </div>
        {ctx.liveServiceId ? null : (
          <div className="bk-fine">Preview mode — no real booking is created.</div>
        )}
      </aside>
    </div>
  );
}
