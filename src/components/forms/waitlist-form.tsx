"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitWaitlistStub } from "@/lib/forms/stub-submit";
import type { FieldErrors } from "@/lib/forms/validate";

export function WaitlistForm() {
  const [errors, setErrors] = React.useState<FieldErrors>();
  const [done, setDone] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    const result = await submitWaitlistStub({ email: form.get("email") });
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
        You&apos;re on the [Sample] waitlist (stub — nothing sent).
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row" noValidate>
      <div className="flex-1 space-y-2">
        <Label htmlFor="waitlist-email" className="sr-only">
          Email
        </Label>
        <Input
          id="waitlist-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          aria-invalid={!!errors?.email}
        />
        {errors?.email ? (
          <p className="text-xs text-destructive">{errors.email[0]}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Joining…" : "Join waitlist"}
      </Button>
    </form>
  );
}
