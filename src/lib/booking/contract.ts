import { z } from "zod";
import {
  BookingRequestSchema,
  MoneySchema,
  LineItemSchema,
  DisplayedPriceSchema,
  ConfigurationSchema,
  ContactSchema,
  LocationPrefSchema,
  SchedulePreferencesSchema,
} from "./contract.schema";
import type { BrandId } from "@/lib/brand/registry";
import type { BookingSource } from "./enums";

export type Money = z.infer<typeof MoneySchema>;
export type LineItem = z.infer<typeof LineItemSchema>;
export type DisplayedPrice = z.infer<typeof DisplayedPriceSchema>;
export type Configuration = z.infer<typeof ConfigurationSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type LocationPref = z.infer<typeof LocationPrefSchema>;
export type SchedulePreferences = z.infer<typeof SchedulePreferencesSchema>;
export type BookingRequest = z.infer<typeof BookingRequestSchema>;

/** Build a fresh draft booking_request for the wizard. */
export function createDraftBooking(seed: {
  brand: BrandId;
  service_type: string;
  source: BookingSource;
  configuration: Configuration;
  displayed_price: DisplayedPrice;
}): BookingRequest {
  return {
    request_id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    status: "draft",
    notes: "",
    contact: {
      name: "",
      email: "",
      preferred_method: "email",
      consent_marketing: false,
    },
    location_pref: { mode: "onsite" },
    schedule_preferences: {
      preferred_dates: [],
      time_windows: ["anytime"],
      timezone: "UTC",
      flexibility: "flexible",
    },
    ...seed,
  };
}

export { BookingRequestSchema };
