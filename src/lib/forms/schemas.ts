import { z } from "zod";
import {
  ContactSchema,
  LocationPrefSchema,
  SchedulePreferencesSchema,
} from "@/lib/booking/contract.schema";

/** Reuses the booking contract's nested pieces so forms stay in sync. */
export const BookingContactFormSchema = ContactSchema.extend({
  notes: z.string().max(2000).optional(),
});

export const ProApplyFormSchema = z.object({
  contact: ContactSchema,
  service_category: z.string().min(1, "Choose a category"),
  experience_years: z.coerce.number().int().min(0).max(60).optional(),
  location: LocationPrefSchema.partial().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required" }),
  }),
});

export const WaitlistFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
  service_id: z.string().optional(),
  schedule_preferences: SchedulePreferencesSchema.partial().optional(),
});

export type BookingContactForm = z.infer<typeof BookingContactFormSchema>;
export type ProApplyForm = z.infer<typeof ProApplyFormSchema>;
export type WaitlistForm = z.infer<typeof WaitlistFormSchema>;
