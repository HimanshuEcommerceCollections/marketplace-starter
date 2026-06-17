"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitSignupStub } from "@/lib/forms/stub-submit";
import type { FieldErrors } from "@/lib/forms/validate";

export function SignupForm() {
  const [errors, setErrors] = React.useState<FieldErrors>();
  const [done, setDone] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    const result = await submitSignupStub({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone") || undefined,
      password: form.get("password"),
      confirm_password: form.get("confirm_password"),
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
        Account created (stub — nothing sent, no account stored).
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {errors?._form ? (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {errors._form[0]}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="signup-name">Full name</Label>
        <Input
          id="signup-name"
          name="name"
          autoComplete="name"
          placeholder="Sarah Collins"
          aria-invalid={!!errors?.name}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive">{errors.name[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email address</Label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          aria-invalid={!!errors?.email}
        />
        {errors?.email ? (
          <p className="text-xs text-destructive">{errors.email[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-phone">Phone (optional)</Label>
        <Input
          id="signup-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 (919) 000-0000"
          aria-invalid={!!errors?.phone}
        />
        {errors?.phone ? (
          <p className="text-xs text-destructive">{errors.phone[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimum 8 characters"
          aria-invalid={!!errors?.password}
        />
        {errors?.password ? (
          <p className="text-xs text-destructive">{errors.password[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm">Confirm password</Label>
        <Input
          id="signup-confirm"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          aria-invalid={!!errors?.confirm_password}
        />
        {errors?.confirm_password ? (
          <p className="text-xs text-destructive">
            {errors.confirm_password[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 size-4 rounded border-input accent-primary"
            aria-invalid={!!errors?.consent}
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="font-medium text-foreground hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-foreground hover:underline"
            >
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors?.consent ? (
          <p className="mt-1 text-xs text-destructive">{errors.consent[0]}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="w-full bg-highlight text-highlight-foreground hover:bg-highlight/90"
        disabled={pending}
      >
        {pending ? "Creating account…" : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-highlight hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
