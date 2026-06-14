"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitProApplyStub } from "@/lib/forms/stub-submit";
import type { FieldErrors } from "@/lib/forms/validate";

export function ProApplyForm({ categories }: { categories: string[] }) {
  const [errors, setErrors] = React.useState<FieldErrors>();
  const [done, setDone] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    const result = await submitProApplyStub({
      contact: {
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone") || undefined,
      },
      service_category: form.get("service_category"),
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
        className="rounded-lg border border-success/40 bg-success/10 p-4 text-sm"
      >
        Thanks! Your [Sample] application was captured (stub — nothing sent).
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

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" aria-invalid={!!errors?.["contact.name"]} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="service_category">Service category</Label>
        <select
          id="service_category"
          name="service_category"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="consent" className="size-4 accent-primary" />
        I agree to be contacted about this [Sample] application.
      </label>
      {errors?.consent ? (
        <p className="text-xs text-destructive">{errors.consent[0]}</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Apply"}
      </Button>
    </form>
  );
}
