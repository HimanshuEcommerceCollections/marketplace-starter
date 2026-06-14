"use client";

import * as React from "react";
import type { Service } from "@/lib/catalog/types";
import type { PricingTable } from "@/lib/pricing/types";
import type { BrandId } from "@/lib/brand/registry";
import type {
  BookingRequest,
  Configuration,
  Contact,
} from "@/lib/booking/contract";
import type {
  LocationMode,
  TimeWindowKind,
  Flexibility,
} from "@/lib/booking/enums";
import { createDraftBooking } from "@/lib/booking/contract";
import { computePrice } from "@/lib/pricing/engine";

export type WizardStep =
  | "config"
  | "schedule"
  | "contact"
  | "review"
  | "success";

export const WIZARD_STEPS: WizardStep[] = [
  "config",
  "schedule",
  "contact",
  "review",
  "success",
];

type SelectionValue = string | number | boolean | string[];

export interface WizardState {
  step: WizardStep;
  selections: Record<string, SelectionValue>;
  quantity: number;
  scheduleDates: string[];
  timeWindows: TimeWindowKind[];
  flexibility: Flexibility;
  contact: Partial<Contact>;
  locationMode: LocationMode;
  notes: string;
  status: "draft" | "submitting" | "submitted" | "error";
  request?: BookingRequest;
}

type Action =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "SET_SELECTION"; key: string; value: SelectionValue }
  | { type: "SET_QUANTITY"; quantity: number }
  | {
      type: "SET_SCHEDULE";
      dates: string[];
      windows: TimeWindowKind[];
      flexibility: Flexibility;
    }
  | { type: "SET_CONTACT"; patch: Partial<Contact> }
  | { type: "SET_LOCATION_MODE"; mode: LocationMode }
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
    case "SET_SCHEDULE":
      return {
        ...state,
        scheduleDates: action.dates,
        timeWindows: action.windows,
        flexibility: action.flexibility,
      };
    case "SET_CONTACT":
      return { ...state, contact: { ...state.contact, ...action.patch } };
    case "SET_LOCATION_MODE":
      return { ...state, locationMode: action.mode };
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
    scheduleDates: [],
    timeWindows: ["anytime"],
    flexibility: "flexible",
    contact: { preferred_method: "email", consent_marketing: false },
    locationMode: service.location_modes[0] ?? "onsite",
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
  const configuration = toConfiguration(ctx.state, ctx.service);
  const displayed_price = computePrice(ctx.pricing, configuration);
  const draft = createDraftBooking({
    brand: ctx.brandId,
    service_type: ctx.service.service_type,
    source: "web_wizard",
    configuration,
    displayed_price,
  });
  return {
    ...draft,
    contact: {
      name: ctx.state.contact.name ?? "",
      email: ctx.state.contact.email ?? "",
      phone: ctx.state.contact.phone,
      preferred_method: ctx.state.contact.preferred_method ?? "email",
      consent_marketing: ctx.state.contact.consent_marketing ?? false,
    },
    location_pref: { mode: ctx.state.locationMode },
    schedule_preferences: {
      preferred_dates: ctx.state.scheduleDates,
      time_windows: ctx.state.timeWindows,
      timezone: "UTC",
      flexibility: ctx.state.flexibility,
    },
    notes: ctx.state.notes,
    status: "submitted",
  };
}
