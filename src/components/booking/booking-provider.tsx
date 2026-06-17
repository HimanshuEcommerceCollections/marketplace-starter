"use client";

import * as React from "react";
import type { Service } from "@/lib/catalog/types";
import type { PricingTable } from "@/lib/pricing/types";
import type { BrandId } from "@/lib/brand/registry";
import type { BookingRequest, Configuration } from "@/lib/booking/contract";
import { createDraftBooking } from "@/lib/booking/contract";
import { computePrice } from "@/lib/pricing/engine";

export type WizardStep =
  | "config"
  | "pricing"
  | "details"
  | "review"
  | "success";

export const WIZARD_STEPS: WizardStep[] = [
  "config",
  "pricing",
  "details",
  "review",
  "success",
];

type SelectionValue = string | number | boolean | string[];

/** A single preferred scheduling window (date + time, both optional). */
export interface SchedWindow {
  date: string;
  time: string;
}

type DetailField = "firstName" | "lastName" | "email" | "phone" | "address";

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
  windows: SchedWindow[];
  notes: string;
  status: "draft" | "submitting" | "submitted" | "error";
  request?: BookingRequest;
}

type Action =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "SET_SELECTION"; key: string; value: SelectionValue }
  | { type: "SET_QUANTITY"; quantity: number }
  | { type: "SET_FIELD"; field: DetailField; value: string }
  | { type: "SET_WINDOW"; index: number; patch: Partial<SchedWindow> }
  | { type: "SET_NOTES"; notes: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_OK"; request: BookingRequest };

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
      return { ...state, status: "submitting" };
    case "SUBMIT_OK":
      return {
        ...state,
        status: "submitted",
        request: action.request,
        step: "success",
      };
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
}

const BookingContext = React.createContext<BookingContextValue | null>(null);

export function BookingProvider({
  service,
  pricing,
  brandId,
  children,
}: {
  service: Service;
  pricing: PricingTable;
  brandId: BrandId;
  children: React.ReactNode;
}) {
  const initial: WizardState = {
    step: "config",
    selections: defaultSelections(service),
    quantity: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
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
    <BookingContext.Provider value={{ state, dispatch, service, pricing, brandId }}>
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

/** Human-readable scheduling window, e.g. "Thu, Jun 19 · 10:00 AM" ("" if no date). */
export function formatWindowLabel(w: SchedWindow): string {
  if (!w.date) return "";
  const datePart = new Date(`${w.date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  if (!w.time) return datePart;
  const [h, m] = w.time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${datePart} · ${h12}:${String(m).padStart(2, "0")} ${period}`;
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
