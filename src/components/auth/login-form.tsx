"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPw, setShowPw] = React.useState(false);

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
      const safeNext =
        next && next.startsWith("/") && !next.startsWith("//") ? next : null;
      router.push(
        safeNext ?? (result.user ? landingPathForRole(result.user.role) : "/"),
      );
      router.refresh();
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {errors?._form ? (
        <p className="auth-form-error">{errors._form[0]}</p>
      ) : null}

      <div className="af">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          aria-invalid={!!errors?.email}
        />
        {errors?.email ? <p className="af-error">{errors.email[0]}</p> : null}
      </div>

      <div className="af">
        <label htmlFor="login-password">Password</label>
        <div className="pw-wrap">
          <input
            id="login-password"
            name="password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors?.password}
          />
          <button
            type="button"
            className="pw-eye"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Hide password" : "Show password"}
            aria-pressed={showPw}
          >
            {showPw ? (
              <EyeOff size={18} aria-hidden />
            ) : (
              <Eye size={18} aria-hidden />
            )}
          </button>
        </div>
        {errors?.password ? (
          <p className="af-error">{errors.password[0]}</p>
        ) : null}
      </div>

      <div className="auth-row">
        <label className="remember">
          <input type="checkbox" name="remember" defaultChecked />
          Remember me
        </label>
        <Link href="/contact">Forgot password?</Link>
      </div>

      <button type="submit" className="auth-submit" disabled={pending}>
        {pending ? "Signing in…" : "Log in"}
      </button>

      <p className="auth-alt">
        New to {brandName}? <Link href="/signup">Create an account</Link>
      </p>
    </form>
  );
}
