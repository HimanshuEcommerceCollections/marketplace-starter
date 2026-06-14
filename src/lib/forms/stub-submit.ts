"use client";

import { analytics } from "@/lib/analytics/analytics";
import { isEnabled } from "@/lib/flags/resolve";
import { validateForm, type ValidateResult } from "./validate";
import {
  ProApplyFormSchema,
  WaitlistFormSchema,
  BookingContactFormSchema,
} from "./schemas";

export interface StubResult {
  success: boolean;
  request_id?: string;
  errors?: Record<string, string[]>;
}

function maintenanceBlocked(): StubResult | null {
  if (isEnabled("maintenanceMode")) {
    return { success: false, errors: { _form: ["Temporarily unavailable."] } };
  }
  return null;
}

function fail(v: ValidateResult<unknown>): StubResult {
  return { success: false, errors: v.errors };
}

/**
 * STUB submit handlers — validate, emit analytics, return a fake request_id.
 * NO network calls, nothing persisted. The real backend would plug in here.
 */
export async function submitProApplyStub(input: unknown): Promise<StubResult> {
  const blocked = maintenanceBlocked();
  if (blocked) return blocked;
  const v = validateForm(ProApplyFormSchema, input);
  if (!v.success) return fail(v);
  analytics.proApplySubmit({
    service_category: v.data!.service_category,
    is_stub: true,
  });
  return { success: true, request_id: crypto.randomUUID() };
}

export async function submitWaitlistStub(input: unknown): Promise<StubResult> {
  const blocked = maintenanceBlocked();
  if (blocked) return blocked;
  const v = validateForm(WaitlistFormSchema, input);
  if (!v.success) return fail(v);
  analytics.waitlistSubmit({ service_id: v.data!.service_id, is_stub: true });
  return { success: true, request_id: crypto.randomUUID() };
}

export async function submitBookingContactStub(
  input: unknown,
): Promise<StubResult> {
  const blocked = maintenanceBlocked();
  if (blocked) return blocked;
  const v = validateForm(BookingContactFormSchema, input);
  if (!v.success) return fail(v);
  return { success: true, request_id: crypto.randomUUID() };
}
