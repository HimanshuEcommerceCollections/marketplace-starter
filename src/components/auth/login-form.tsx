"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/auth-provider";
import { landingPathForRole } from "@/lib/auth/roles";
import { validateForm, type FieldErrors } from "@/lib/forms/validate";
import { LoginFormSchema } from "@/lib/forms/schemas";

export interface LoginFormProps {
  brandName: string;
}

export function LoginForm({ brandName }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [errors, setErrors] = React.useState<FieldErrors>();
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = validateForm(LoginFormSchema, {
      email: form.get("email"),
      password: form.get("password"),
      remember: form.get("remember") === "on",
    });
    if (!parsed.success || !parsed.data) {
      setErrors(parsed.errors);
      return;
    }
    setPending(true);
    const result = await login({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setPending(false);
    if (result.success) {
      setErrors(undefined);
      // Honor a safe in-app ?next= (e.g. returning to the booking wizard);
      // otherwise route by role. Reject protocol-relative ("//") targets.
      const next = new URLSearchParams(window.location.search).get("next");
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
      router.push(
        safeNext ?? (result.user ? landingPathForRole(result.user.role) : "/"),
      );
      router.refresh();
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {errors?._form ? (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {errors._form[0]}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="login-email">Email address</Label>
        <Input
          id="login-email"
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
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-invalid={!!errors?.password}
        />
        {errors?.password ? (
          <p className="text-xs text-destructive">{errors.password[0]}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="remember"
            className="size-4 rounded border-input accent-primary"
          />
          Remember me
        </label>
        <Link
          href="#"
          className="text-sm font-medium text-highlight hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign In"}
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        New to {brandName}?{" "}
        <Link
          href="/signup"
          className="font-medium text-highlight hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
