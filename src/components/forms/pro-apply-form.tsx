"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitProApplyStub } from "@/lib/forms/stub-submit";
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
 * Pro / partner application form. Stub-only: validates, emits analytics, and
 * returns a fake request_id — no backend call (golden rule #5). The category
 * options are the brand's service titles.
 */
export function ProApplyForm({ categories }: { categories: string[] }) {
  const [errors, setErrors] = React.useState<FieldErrors>();
  const [done, setDone] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    const name = `${form.get("firstName") ?? ""} ${form.get("lastName") ?? ""}`
      .toString()
      .trim();
    const result = await submitProApplyStub({
      contact: {
        name,
        email: form.get("email"),
        phone: form.get("phone") || undefined,
      },
      service_category: form.get("service_category"),
      experience_years: form.get("experience_years") || undefined,
      service_area: form.get("service_area") || undefined,
      website: form.get("website") || undefined,
      notes: form.get("notes") || undefined,
      consent: form.get("consent") === "on",
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
        Thanks! Your application was captured (stub — nothing is sent to
        a backend). A coordinator would follow up in the real experience.
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
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            className="mt-2"
            placeholder="Your first name"
            aria-invalid={!!errors?.["contact.name"]}
          />
          <FieldError id="firstName" errors={errors?.["contact.name"]} />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            className="mt-2"
            placeholder="Your last name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            className="mt-2"
            placeholder="you@example.com"
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
          <Label htmlFor="service_category">Service Category</Label>
          <select
            id="service_category"
            name="service_category"
            defaultValue=""
            className={cn("mt-2", SELECT_CLS)}
            aria-invalid={!!errors?.service_category}
          >
            <option value="" disabled>
              Select your primary service
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <FieldError id="service_category" errors={errors?.service_category} />
        </div>
        <div>
          <Label htmlFor="experience_years">Years of Experience</Label>
          <Input
            id="experience_years"
            name="experience_years"
            type="number"
            min={0}
            max={60}
            className="mt-2"
            placeholder="e.g. 3"
          />
        </div>

        <div>
          <Label htmlFor="service_area">Service Area</Label>
          <Input
            id="service_area"
            name="service_area"
            className="mt-2"
            placeholder="e.g. Raleigh, Wake County"
          />
        </div>
        <div>
          <Label htmlFor="website">Website / Portfolio</Label>
          <Input
            id="website"
            name="website"
            className="mt-2"
            placeholder="https://"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          className="mt-2"
          placeholder="Tell us more about your experience and practice."
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="consent"
          className="mt-0.5 size-4 shrink-0 accent-primary"
        />
        <span>
          I understand that submission does not guarantee marketplace acceptance.
        </span>
      </label>
      {errors?.consent ? (
        <p className="text-xs text-destructive">{errors.consent[0]}</p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="bg-highlight text-highlight-foreground hover:bg-highlight/90"
      >
        {pending ? "Submitting…" : "Submit Application"}
      </Button>
    </form>
  );
}
