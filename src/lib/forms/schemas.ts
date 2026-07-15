import { z } from "zod";
import {
  ContactSchema,
  LocationPrefSchema,
  SchedulePreferencesSchema,
} from "@/lib/booking/contract.schema";
import { AREA_VALUES } from "@/lib/auth/areas";

/** Reuses the booking contract's nested pieces so forms stay in sync. */
export const BookingContactFormSchema = ContactSchema.extend({
  notes: z.string().max(2000).optional(),
});

export const ProApplyFormSchema = z.object({
  contact: ContactSchema,
  service_category: z.string().min(1, "Choose a category"),
  experience_years: z.coerce.number().int().min(0).max(60).optional(),
  service_area: z.string().max(120).optional(),
  website: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  location: LocationPrefSchema.partial().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required" }),
  }),
});

export const WaitlistFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
  service_id: z.string().optional(),
  // Optional interest-list fields (richer "join the interest list" form). The
  // analytics contract stays locked to waitlist_submit; these are not tracked.
  first_name: z.string().max(80).optional(),
  last_name: z.string().max(80).optional(),
  phone: z.string().max(40).optional(),
  zip: z.string().max(12).optional(),
  notes: z.string().max(2000).optional(),
  schedule_preferences: SchedulePreferencesSchema.partial().optional(),
});

/** Corporate "Request a Quote" inquiry. Reuses the contact contract fields. */
export const CorporateQuoteFormSchema = z.object({
  company: z.string().min(1, "Company name is required").max(160),
  contact: ContactSchema.pick({ name: true, email: true, phone: true }),
  headcount: z.string().max(120).optional(),
  preferred_date: z.string().max(120).optional(),
  event_type: z.string().min(1, "Select an event type"),
  notes: z.string().max(2000).optional(),
});

/** Account sign-in. Stub-only — no credentials are ever sent or stored. */
export const LoginFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Minimum 8 characters"),
  remember: z.boolean().optional(),
});

/** Account creation. Stub-only — no credentials are ever sent or stored. */
export const SignupFormSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(120),
    email: z.string().email("Enter a valid email"),
    phone: z.string().max(40).optional(),
    // The UI collects a SINGLE area (dropdown); it is wrapped into a one-element
    // array before being sent, because the server's `area` is multi-value.
    area: z.enum(AREA_VALUES, {
      errorMap: () => ({ message: "Select your area" }),
    }),
    password: z.string().min(8, "Minimum 8 characters"),
    confirm_password: z.string().min(1, "Re-enter your password"),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Please accept the terms to continue" }),
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type BookingContactForm = z.infer<typeof BookingContactFormSchema>;
export type ProApplyForm = z.infer<typeof ProApplyFormSchema>;
export type WaitlistForm = z.infer<typeof WaitlistFormSchema>;
export type CorporateQuoteForm = z.infer<typeof CorporateQuoteFormSchema>;
export type LoginForm = z.infer<typeof LoginFormSchema>;
export type SignupForm = z.infer<typeof SignupFormSchema>;
