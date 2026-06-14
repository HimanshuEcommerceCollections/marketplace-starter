import { z } from "zod";
import { BRAND_IDS } from "@/lib/brand/registry";

export const BrandSchema = z.enum(BRAND_IDS);

export const BookingStatus = z.enum([
  "draft",
  "submitted",
  "pending",
  "confirmed",
  "cancelled",
]);
export type BookingStatus = z.infer<typeof BookingStatus>;

export const BookingSource = z.enum([
  "web_wizard",
  "service_card",
  "service_detail",
  "waitlist",
  "pro_apply",
  "import",
]);
export type BookingSource = z.infer<typeof BookingSource>;

export const ContactMethod = z.enum(["email", "phone", "sms"]);
export type ContactMethod = z.infer<typeof ContactMethod>;

export const TimeWindowKind = z.enum([
  "morning",
  "afternoon",
  "evening",
  "anytime",
]);
export type TimeWindowKind = z.infer<typeof TimeWindowKind>;

export const LocationMode = z.enum(["onsite", "remote", "hybrid"]);
export type LocationMode = z.infer<typeof LocationMode>;

export const Flexibility = z.enum(["exact", "flexible", "asap"]);
export type Flexibility = z.infer<typeof Flexibility>;
