"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitCorporateQuoteStub } from "@/lib/forms/stub-submit";
import { cn } from "@/lib/utils";
import type { FieldErrors } from "@/lib/forms/validate";

const SELECT_CLS =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={`${id}-error`} className="mt-1 text-xs text-destructive">
      {errors[0]}
    </p>
  );
}

/**
 * Corporate "Request a Quote" inquiry form. Stub-only: validates, returns a
 * fake request_id — no backend call and no analytics event (golden rule #5;
 * corporate quote is not one of the 8 contract events). Event-type options are
 * brand-supplied.
 */
export function CorporateQuoteForm({ eventTypes }: { eventTypes: string[] }) {
  const [errors, setErrors] = React.useState<FieldErrors>();
  const [done, setDone] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    const result = await submitCorporateQuoteStub({
      company: form.get("company"),
      contact: {
        name: form.get("contact_name"),
        email: form.get("email"),
        phone: form.get("phone") || undefined,
      },
      headcount: form.get("headcount") || undefined,
      preferred_date: form.get("preferred_date") || undefined,
      event_type: form.get("event_type"),
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
        className="rounded-xl border border-success/40 bg-success/10 p-6 text-sm"
      >
        Thanks! Your corporate inquiry was captured (stub — nothing is sent to a
        backend). A coordinator would follow up within one business day in the
        real experience.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {errors?._form ? (
        <p role="alert" className="text-sm text-destructive">
          {errors._form[0]}
        </p>
      ) : null}

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            name="company"
            className="mt-2"
            placeholder="Acme Corp"
            aria-invalid={!!errors?.company}
          />
          <FieldError id="company" errors={errors?.company} />
        </div>
        <div>
          <Label htmlFor="contact_name">Contact Name</Label>
          <Input
            id="contact_name"
            name="contact_name"
            className="mt-2"
            placeholder="Your name"
            aria-invalid={!!errors?.["contact.name"]}
          />
          <FieldError id="contact_name" errors={errors?.["contact.name"]} />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            className="mt-2"
            placeholder="you@company.com"
            aria-invalid={!!errors?.["contact.email"]}
          />
          <FieldError id="email" errors={errors?.["contact.email"]} />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            className="mt-2"
            placeholder="(555) 000-0000"
          />
        </div>

        <div>
          <Label htmlFor="headcount">Estimated Headcount</Label>
          <Input
            id="headcount"
            name="headcount"
            className="mt-2"
            placeholder="e.g. 20-50 people"
          />
        </div>
        <div>
          <Label htmlFor="preferred_date">Desired Date</Label>
          <Input
            id="preferred_date"
            name="preferred_date"
            className="mt-2"
            placeholder="Preferred date or range"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="event_type">Event Type</Label>
        <select
          id="event_type"
          name="event_type"
          defaultValue=""
          className={cn("mt-2", SELECT_CLS)}
          aria-invalid={!!errors?.event_type}
        >
          <option value="" disabled>
            Select event type
          </option>
          {eventTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <FieldError id="event_type" errors={errors?.event_type} />
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          className="mt-2"
          placeholder="Tell us more about your goals, venue, or requirements."
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="bg-highlight text-highlight-foreground hover:bg-highlight/90"
      >
        {pending ? "Submitting…" : "Request a Quote"}
      </Button>

      <p className="text-sm text-muted-foreground">
        A coordinator will contact you within one business day regarding your
        corporate inquiry.
      </p>
    </form>
  );
}
