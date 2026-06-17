"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitWaitlistStub } from "@/lib/forms/stub-submit";
import type { FieldErrors } from "@/lib/forms/validate";

export interface InterestListFormProps {
  /** Service slug recorded with the waitlist submission. */
  serviceId?: string;
  /** Submit button label (default "Join the Interest List"). */
  submitLabel?: string;
}

/**
 * Richer interest-list capture (name / email / phone / ZIP / notes). STUB ONLY —
 * validates, emits the `waitlist_submit` analytics event, returns a fake
 * request_id. No network calls. Reuses submitWaitlistStub + WaitlistFormSchema.
 */
export function InterestListForm({
  serviceId,
  submitLabel = "Join the Interest List",
}: InterestListFormProps) {
  const [errors, setErrors] = React.useState<FieldErrors>();
  const [done, setDone] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    const result = await submitWaitlistStub({
      service_id: serviceId,
      first_name: form.get("first_name") || undefined,
      last_name: form.get("last_name") || undefined,
      email: form.get("email"),
      phone: form.get("phone") || undefined,
      zip: form.get("zip") || undefined,
      notes: form.get("notes") || undefined,
    });
    setPending(false);
    if (result.success) {
      setErrors(undefined);
      setDone(true);
    } else {
      setErrors(result.errors);
    }
  }

  if (done) {
    return (
      <p
        role="status"
        className="rounded-lg border border-success/40 bg-success/10 p-4 text-sm text-foreground"
      >
        You&apos;re on the [Sample] interest list (stub — nothing was sent).
        We&apos;ll reach out when service availability opens.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="interest-first-name">First Name</Label>
          <Input id="interest-first-name" name="first_name" placeholder="Jamie" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interest-last-name">Last Name</Label>
          <Input id="interest-last-name" name="last_name" placeholder="Chen" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interest-email">Email Address</Label>
        <Input
          id="interest-email"
          name="email"
          type="email"
          placeholder="jamie.chen@email.com"
          aria-invalid={!!errors?.email}
          aria-describedby={errors?.email ? "interest-email-error" : undefined}
        />
        {errors?.email ? (
          <p id="interest-email-error" className="text-xs text-destructive">
            {errors.email[0]}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="interest-phone">Phone Number</Label>
          <Input
            id="interest-phone"
            name="phone"
            type="tel"
            placeholder="(919) 555-0100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interest-zip">ZIP Code</Label>
          <Input id="interest-zip" name="zip" inputMode="numeric" placeholder="27601" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interest-notes">Notes / Condition (optional)</Label>
        <Textarea
          id="interest-notes"
          name="notes"
          placeholder="e.g. post-surgery knee rehab…"
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Joining…" : submitLabel}
      </Button>
    </form>
  );
}
