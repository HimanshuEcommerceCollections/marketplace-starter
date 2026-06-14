import { z } from "zod";
import {
  BrandSchema,
  BookingStatus,
  BookingSource,
  ContactMethod,
  TimeWindowKind,
  LocationMode,
  Flexibility,
} from "./enums";

/** Money stored in integer MINOR units (e.g. cents) to avoid float drift. */
export const MoneySchema = z.object({
  amount: z.number().int(),
  currency: z.string().length(3),
});

export const LineItemSchema = z.object({
  label: z.string(),
  amount: MoneySchema,
  kind: z.enum(["base", "modifier", "option", "fee", "discount"]),
});

export const DisplayedPriceSchema = z.object({
  total: MoneySchema,
  subtotal: MoneySchema.optional(),
  line_items: z.array(LineItemSchema).default([]),
  pricing_version: z.string(),
  is_estimate: z.boolean().default(true),
});

const ConfigValue = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
]);

export const ConfigurationSchema = z.object({
  service_id: z.string(),
  selections: z.record(z.string(), ConfigValue).default({}),
  quantity: z.number().int().positive().default(1),
  variant_id: z.string().optional(),
});

export const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  preferred_method: ContactMethod.default("email"),
  consent_marketing: z.boolean().default(false),
});

export const LocationPrefSchema = z.object({
  mode: LocationMode.default("onsite"),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().length(2).optional(),
  address_line1: z.string().optional(),
  notes: z.string().optional(),
});

export const SchedulePreferencesSchema = z.object({
  preferred_dates: z.array(z.string()).default([]),
  time_windows: z.array(TimeWindowKind).default(["anytime"]),
  timezone: z.string().default("UTC"),
  flexibility: Flexibility.default("flexible"),
});

/** booking_request — EXACTLY the 12 specified top-level fields. */
export const BookingRequestSchema = z.object({
  request_id: z.string().uuid(),
  brand: BrandSchema,
  created_at: z.string(),
  service_type: z.string(),
  configuration: ConfigurationSchema,
  displayed_price: DisplayedPriceSchema,
  contact: ContactSchema,
  location_pref: LocationPrefSchema,
  schedule_preferences: SchedulePreferencesSchema,
  notes: z.string().max(2000).optional(),
  status: BookingStatus.default("draft"),
  source: BookingSource,
});
