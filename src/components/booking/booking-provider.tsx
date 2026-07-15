"use client";

import * as React from "react";
import type { Service } from "@/lib/catalog/types";
import type { PricingTable } from "@/lib/pricing/types";
import type { BrandId } from "@/lib/brand/registry";
import type { BookingRequest, Configuration } from "@/lib/booking/contract";
import { createDraftBooking } from "@/lib/booking/contract";
import { computePrice } from "@/lib/pricing/engine";
import type { CreateBookingPayload } from "@/lib/booking/api";

export type WizardStep =
  | "build" // single-page redesign: service + config + details on one screen
  | "config"
  | "pricing"
  | "details"
  | "review"
  | "payment"
  | "success";

export const WIZARD_STEPS: WizardStep[] = [
  "config",
  "pricing",
  "details",
  "review",
  "payment",
  "success",
];

type SelectionValue = string | number | boolean | string[];

/** A single preferred scheduling window (date + time, both optional). */
export interface SchedWindow {
  date: string;
  time: string;
}

type DetailField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "address"
  | "area";

export interface WizardState {
  step: WizardStep;
  selections: Record<string, SelectionValue>;
  quantity: number;
  /* Details form */
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  /** Wake County town (ServiceArea enum value) the session takes place in. */
  area: string;
  windows: SchedWindow[];
  notes: string;
  status: "draft" | "submitting" | "paying" | "submitted" | "error";
  request?: BookingRequest;
  /** Backend booking reference (live submit only). */
  reference?: string;
  /** Backend booking id (live submit only) — reused on payment retry. */
  bookingId?: string;
  /** Payment (live submit only): set once the PaymentIntent is created. */
  paymentId?: string;
  clientSecret?: string;
  publishableKey?: string | null;
  amount?: number;
  currency?: string;
  /** Submission error message (status === "error"). */
  error?: string;
}

type Action =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "SET_SELECTION"; key: string; value: SelectionValue }
  | { type: "SET_QUANTITY"; quantity: number }
  | { type: "SET_FIELD"; field: DetailField; value: string }
  | { type: "SET_WINDOW"; index: number; patch: Partial<SchedWindow> }
  | { type: "SET_NOTES"; notes: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_OK"; request: BookingRequest; reference?: string }
  | {
      type: "BOOKING_CREATED";
      request: BookingRequest;
      reference: string;
      bookingId: string;
    }
  | {
      type: "PAYMENT_BEGIN";
      paymentId: string;
      clientSecret: string;
      publishableKey: string | null;
      amount: number;
      currency: string;
    }
  | { type: "PAYMENT_OK" }
  | { type: "SUBMIT_ERROR"; error: string };

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_SELECTION":
      return {
        ...state,
        selections: { ...state.selections, [action.key]: action.value },
      };
    case "SET_QUANTITY":
      return { ...state, quantity: Math.max(1, action.quantity) };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w, i) =>
          i === action.index ? { ...w, ...action.patch } : w,
        ),
      };
    case "SET_NOTES":
      return { ...state, notes: action.notes };
    case "SUBMIT_START":
      return { ...state, status: "submitting", error: undefined };
    case "SUBMIT_OK":
      return {
        ...state,
        status: "submitted",
        request: action.request,
        reference: action.reference,
        step: "success",
      };
    case "BOOKING_CREATED":
      // Booking persisted (status stays "submitting" while we set up payment).
      // bookingId is retained so a payment retry never creates a duplicate.
      return {
        ...state,
        request: action.request,
        reference: action.reference,
        bookingId: action.bookingId,
      };
    case "PAYMENT_BEGIN":
      return {
        ...state,
        status: "paying",
        step: "payment",
        paymentId: action.paymentId,
        clientSecret: action.clientSecret,
        publishableKey: action.publishableKey,
        amount: action.amount,
        currency: action.currency,
      };
    case "PAYMENT_OK":
      return { ...state, status: "submitted", step: "success" };
    case "SUBMIT_ERROR":
      return { ...state, status: "error", error: action.error };
    default:
      return state;
  }
}

function defaultSelections(service: Service): Record<string, SelectionValue> {
  const sel: Record<string, SelectionValue> = {};
  for (const opt of service.config_options) {
    if (opt.input === "quantity") continue; // tracked via state.quantity
    if (opt.default !== undefined) sel[opt.id] = opt.default;
    else if (
      (opt.input === "select" || opt.input === "multiselect") &&
      opt.choices?.[0]
    )
      sel[opt.id] = opt.input === "multiselect" ? [] : opt.choices[0].id;
    else if (opt.input === "toggle") sel[opt.id] = false;
  }
  return sel;
}

interface BookingContextValue {
  state: WizardState;
  dispatch: React.Dispatch<Action>;
  service: Service;
  pricing: PricingTable;
  brandId: BrandId;
  /** Live backend service UUID — present only when wired to the live API. */
  liveServiceId?: string;
  /** groupKey -> (optionKey -> option UUID), to resolve selections for the API. */
  optionIdByGroupKey?: Record<string, Record<string, string>>;
  /** Live service duration (minutes) — derives scheduledEnd from the start. */
  durationMinutes?: number;
}

const BookingContext = React.createContext<BookingContextValue | null>(null);

export function BookingProvider({
  service,
  pricing,
  brandId,
  liveServiceId,
  optionIdByGroupKey,
  durationMinutes,
  initialStep = "config",
  children,
}: {
  service: Service;
  pricing: PricingTable;
  brandId: BrandId;
  liveServiceId?: string;
  optionIdByGroupKey?: Record<string, Record<string, string>>;
  durationMinutes?: number;
  /** Starting step — the single-page redesign passes "build". */
  initialStep?: WizardStep;
  children: React.ReactNode;
}) {
  const initial: WizardState = {
    step: initialStep,
    selections: defaultSelections(service),
    quantity: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    windows: [
      { date: "", time: "" },
      { date: "", time: "" },
      { date: "", time: "" },
    ],
    notes: "",
    status: "draft",
  };
  const [state, dispatch] = React.useReducer(reducer, initial);
  return (
    <BookingContext.Provider
      value={{
        state,
        dispatch,
        service,
        pricing,
        brandId,
        liveServiceId,
        optionIdByGroupKey,
        durationMinutes,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingDraft(): BookingContextValue {
  const ctx = React.useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBookingDraft must be used within a <BookingProvider>");
  }
  return ctx;
}

/**
 * Human-readable summary of the chosen single-select options, e.g.
 * "60 minutes · Swedish (Relaxation)". Used for summary/pricing line labels.
 */
export function selectionSummary(
  service: Service,
  selections: Record<string, SelectionValue>,
): string {
  return service.config_options
    .filter((o) => o.input === "select")
    .map((o) => o.choices?.find((c) => c.id === selections[o.id])?.label)
    .filter(Boolean)
    .join(" · ");
}

/** Joined labels of the chosen multi-select options (e.g. "Hot Stones, Aromatherapy Oil"). */
export function addOnsSummary(
  service: Service,
  selections: Record<string, SelectionValue>,
): string {
  return service.config_options
    .filter((o) => o.input === "multiselect")
    .flatMap((o) => {
      const sel = selections[o.id];
      const ids = Array.isArray(sel) ? sel : [];
      return (o.choices ?? [])
        .filter((c) => ids.includes(c.id))
        .map((c) => c.label);
    })
    .join(", ");
}

/** Long-form date label, e.g. "Thu, Jun 19" ("" when no date). */
export function formatDateLabel(date: string): string {
  if (!date) return "";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** 12-hour time label, e.g. "10:00 AM" ("" when no time). */
export function formatTimeLabel(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Human-readable scheduling window, e.g. "Thu, Jun 19 · 10:00 AM" ("" if no date). */
export function formatWindowLabel(w: SchedWindow): string {
  const datePart = formatDateLabel(w.date);
  if (!datePart) return "";
  const timePart = formatTimeLabel(w.time);
  return timePart ? `${datePart} · ${timePart}` : datePart;
}

/** Build the Configuration from wizard state. service.id MUST key pricing.services. */
export function toConfiguration(
  state: WizardState,
  service: Service,
): Configuration {
  return {
    service_id: service.id,
    selections: state.selections,
    quantity: state.quantity,
  };
}

/** Assemble a submitted booking_request from wizard state (stub — no backend). */
export function buildBookingRequest(ctx: BookingContextValue): BookingRequest {
  const { state, service } = ctx;
  const configuration = toConfiguration(state, service);
  const displayed_price = computePrice(ctx.pricing, configuration);
  const draft = createDraftBooking({
    brand: ctx.brandId,
    service_type: service.service_type,
    source: "web_wizard",
    configuration,
    displayed_price,
  });

  // Each filled window becomes an ISO date(+time) string in preferred_dates.
  const preferred_dates = state.windows
    .filter((w) => w.date)
    .map((w) => (w.time ? `${w.date}T${w.time}` : w.date));

  return {
    ...draft,
    contact: {
      name: `${state.firstName} ${state.lastName}`.trim(),
      email: state.email,
      phone: state.phone || undefined,
      preferred_method: "email",
      consent_marketing: false,
    },
    location_pref: {
      mode: service.location_modes[0] ?? "onsite",
      address_line1: state.address || undefined,
    },
    schedule_preferences: {
      preferred_dates,
      time_windows: ["anytime"],
      timezone: "UTC",
      flexibility: "flexible",
    },
    notes: state.notes,
    status: "submitted",
  };
}

const MODE_TO_SERVER: Record<string, "ONSITE" | "REMOTE" | "HYBRID"> = {
  onsite: "ONSITE",
  remote: "REMOTE",
  hybrid: "HYBRID",
};

/**
 * Map wizard state to the backend booking DTO (live submit). Selections (keyed
 * by groupKey -> optionKey) are resolved to backend option UUIDs; the first
 * preferred window becomes the concrete slot (end = start + duration), and the
 * remaining windows + the full schedule preferences + contact/address are
 * persisted on the booking. Requires `liveServiceId`.
 */
export function toServerBooking(ctx: BookingContextValue): CreateBookingPayload {
  const { state, service, liveServiceId, optionIdByGroupKey, durationMinutes } = ctx;
  if (!liveServiceId) throw new Error("toServerBooking requires a live service");

  const map = optionIdByGroupKey ?? {};
  const optionIds: string[] = [];
  for (const [groupKey, value] of Object.entries(state.selections)) {
    const keys = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
    for (const k of keys) {
      const id = map[groupKey]?.[k];
      if (id) optionIds.push(id);
    }
  }

  const filled = state.windows.filter((w) => w.date);
  const first = filled[0] ?? state.windows[0];
  const startDate = new Date(`${first.date}T${first.time || "09:00"}:00`);
  const dur = durationMinutes && durationMinutes > 0 ? durationMinutes : 60;
  const endDate = new Date(startDate.getTime() + dur * 60_000);

  const altWindows = filled.slice(1).map(formatWindowLabel).filter(Boolean);
  const notesParts: string[] = [];
  if (state.notes.trim()) notesParts.push(state.notes.trim());
  if (altWindows.length) notesParts.push(`Alternate preferred windows: ${altWindows.join("; ")}`);

  return {
    serviceId: liveServiceId,
    scheduledStart: startDate.toISOString(),
    scheduledEnd: endDate.toISOString(),
    locationMode: MODE_TO_SERVER[service.location_modes[0] ?? "onsite"] ?? "ONSITE",
    area: state.area || undefined,
    notes: notesParts.join("\n") || undefined,
    optionIds,
    contact: {
      name: `${state.firstName} ${state.lastName}`.trim() || undefined,
      email: state.email || undefined,
      phone: state.phone || undefined,
    },
    address: state.address || undefined,
    schedulePreferences: {
      windows: filled.map((w) => ({ date: w.date, time: w.time || undefined })),
      flexibility: "flexible",
      timezone: "UTC",
    },
  };
}
