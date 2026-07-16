"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { landingPathForRole } from "@/lib/auth/roles";
import { validateForm, type FieldErrors } from "@/lib/forms/validate";
import { SignupFormSchema } from "@/lib/forms/schemas";
import { AREA_OPTIONS } from "@/lib/auth/areas";

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [errors, setErrors] = React.useState<FieldErrors>();
  const [pending, setPending] = React.useState(false);
  const [showPw, setShowPw] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    // Client-only rules (password confirmation + consent) are enforced here;
    // the server validates name/email/password/area/brand. The UI collects a
    // single area from the dropdown.
    const parsed = validateForm(SignupFormSchema, {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone") || undefined,
      area: form.get("area") || undefined,
      password: form.get("password"),
      confirm_password: form.get("confirm_password"),
      consent: form.get("consent") === "on",
    });
    if (!parsed.success || !parsed.data) {
      setErrors(parsed.errors);
      return;
    }
    setPending(true);
    const result = await signup({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      // Wrap the single selected area into an array — the server's `area` is
      // multi-value, so the wire format stays a list even when we send one.
      area: [parsed.data.area],
      password: parsed.data.password,
    });
    setPending(false);
    if (result.success) {
      setErrors(undefined);
      // If the backend returns an already-verified user (email verification is
      // disabled), go straight to their destination; otherwise send them to the
      // "check your inbox" screen.
      if (result.user?.emailVerifiedAt) {
        router.push(landingPathForRole(result.user.role));
      } else {
        router.push("/verify-email");
      }
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
        <label htmlFor="signup-name">Full name</label>
        <input
          id="signup-name"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={!!errors?.name}
        />
        {errors?.name ? <p className="af-error">{errors.name[0]}</p> : null}
      </div>

      <div className="af">
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          aria-invalid={!!errors?.email}
        />
        {errors?.email ? <p className="af-error">{errors.email[0]}</p> : null}
      </div>

      <div className="af">
        <label htmlFor="signup-phone">Phone (optional)</label>
        <input
          id="signup-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(919) 555-0000"
          aria-invalid={!!errors?.phone}
        />
        {errors?.phone ? <p className="af-error">{errors.phone[0]}</p> : null}
      </div>

      <div className="af">
        <label htmlFor="signup-area">Your area</label>
        <select
          id="signup-area"
          name="area"
          defaultValue=""
          aria-invalid={!!errors?.area}
        >
          <option value="" disabled>
            Select your area
          </option>
          {AREA_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors?.area ? <p className="af-error">{errors.area[0]}</p> : null}
      </div>

      <div className="af">
        <label htmlFor="signup-password">Password</label>
        <div className="pw-wrap">
          <input
            id="signup-password"
            name="password"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            placeholder="8+ characters"
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

      <div className="af">
        <label htmlFor="signup-confirm">Confirm password</label>
        <div className="pw-wrap">
          <input
            id="signup-confirm"
            name="confirm_password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            aria-invalid={!!errors?.confirm_password}
          />
          <button
            type="button"
            className="pw-eye"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            aria-pressed={showConfirm}
          >
            {showConfirm ? (
              <EyeOff size={18} aria-hidden />
            ) : (
              <Eye size={18} aria-hidden />
            )}
          </button>
        </div>
        {errors?.confirm_password ? (
          <p className="af-error">{errors.confirm_password[0]}</p>
        ) : null}
      </div>

      <label className="agree">
        <input type="checkbox" name="consent" aria-invalid={!!errors?.consent} />
        <span>
          I agree to the <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </span>
      </label>
      {errors?.consent ? <p className="af-error">{errors.consent[0]}</p> : null}

      <button type="submit" className="auth-submit" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="auth-alt">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
      <p className="auth-alt">
        Want to work with Elevate?{" "}
        <Link href="/corporate/inquiry">Apply as a professional</Link>
      </p>
    </form>
  );
}
