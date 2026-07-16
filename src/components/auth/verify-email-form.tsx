"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Loader2,
  MailCheck,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { landingPathForRole } from "@/lib/auth/roles";
import { validateForm, type FieldErrors } from "@/lib/forms/validate";
import { ResendVerificationFormSchema } from "@/lib/forms/schemas";

/**
 * Reads `?token=` from the URL and verifies it on mount. Covers every state:
 * loading, success, already-verified, expired, invalid, and (no token)
 * "check your inbox". The resend affordance uses the authenticated endpoint when
 * signed in, or an email input when logged out.
 */
type View =
  | "verifying"
  | "success"
  | "already-verified"
  | "expired"
  | "invalid"
  | "error"
  | "check-inbox";

type ResendState = "idle" | "sending" | "sent" | "error";

export function VerifyEmailForm() {
  const { user, verifyEmail, resendVerification, refresh } = useAuth();
  const router = useRouter();
  const [view, setView] = React.useState<View>("verifying");
  const [resendState, setResendState] = React.useState<ResendState>("idle");
  const [resendMsg, setResendMsg] = React.useState<string>();
  const [errors, setErrors] = React.useState<FieldErrors>();
  const tokenRef = React.useRef<string | null>(null);
  const ranRef = React.useRef(false);

  const runVerify = React.useCallback(
    async (token: string) => {
      setView("verifying");
      const res = await verifyEmail(token);
      if (res.success) {
        setView(res.alreadyVerified ? "already-verified" : "success");
        // Re-sync auth state from /auth/me so a signed-in session reflects the
        // now-verified user (banners clear, booking unlocks). No-op if logged out.
        void refresh();
      } else if (res.code === "TOKEN_EXPIRED") {
        setView("expired");
      } else if (res.code === "TOKEN_INVALID") {
        setView("invalid");
      } else {
        // No token verdict from the server → transient failure (rate limit /
        // 5xx / network). Don't mislabel a valid link as invalid.
        setView("error");
      }
    },
    [verifyEmail, refresh],
  );

  React.useEffect(() => {
    // Guard against the effect running twice (React 18 StrictMode dev double-mount).
    if (ranRef.current) return;
    ranRef.current = true;

    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setView("check-inbox");
      return;
    }
    tokenRef.current = token;
    void runVerify(token);
  }, [runVerify]);

  async function handleResend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(undefined);

    let email: string | undefined;
    if (!user) {
      const form = new FormData(e.currentTarget);
      const parsed = validateForm(ResendVerificationFormSchema, {
        email: form.get("email"),
      });
      if (!parsed.success || !parsed.data) {
        setErrors(parsed.errors);
        return;
      }
      email = parsed.data.email;
    }

    setResendState("sending");
    const res = await resendVerification(email ? { email } : undefined);
    setResendState(res.success ? "sent" : "error");
    setResendMsg(res.message);
  }

  function goToApp() {
    router.push(user ? landingPathForRole(user.role) : "/login");
    router.refresh();
  }

  /** Resend block — shared by check-inbox / expired / invalid. */
  function renderResend() {
    return (
      <form onSubmit={handleResend} className="auth-resend" noValidate>
        {!user ? (
          <div className="af">
            <label htmlFor="resend-email">Email</label>
            <input
              id="resend-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              aria-invalid={!!errors?.email}
            />
            {errors?.email ? <p className="af-error">{errors.email[0]}</p> : null}
          </div>
        ) : null}

        {resendState === "sent" ? (
          <p className="auth-form-success">
            {resendMsg ?? "Verification email sent — check your inbox."}
          </p>
        ) : null}
        {resendState === "error" ? (
          <p className="auth-form-error">
            {resendMsg ?? "Could not resend. Please try again."}
          </p>
        ) : null}

        <button
          type="submit"
          className="auth-submit"
          disabled={resendState === "sending"}
        >
          {resendState === "sending" ? "Sending…" : "Resend verification email"}
        </button>
      </form>
    );
  }

  switch (view) {
    case "verifying":
      return (
        <div className="auth-verify">
          <span className="auth-verify-icon is-pending" aria-hidden>
            <Loader2 className="auth-spin" size={26} />
          </span>
          <p className="auth-verify-title">Verifying your email…</p>
          <p className="auth-verify-text">This only takes a moment.</p>
        </div>
      );

    case "success":
      return (
        <div className="auth-verify">
          <span className="auth-verify-icon is-success" aria-hidden>
            <CheckCircle2 size={26} />
          </span>
          <p className="auth-verify-title">Email verified!</p>
          <p className="auth-verify-text">
            Your account is active. You can now book sessions with Elevate.
          </p>
          <button type="button" className="auth-submit" onClick={goToApp}>
            {user ? "Continue" : "Continue to sign in"}
          </button>
        </div>
      );

    case "already-verified":
      return (
        <div className="auth-verify">
          <span className="auth-verify-icon is-success" aria-hidden>
            <MailCheck size={26} />
          </span>
          <p className="auth-verify-title">Already verified</p>
          <p className="auth-verify-text">
            This email address is already confirmed — you&apos;re all set.
          </p>
          <button type="button" className="auth-submit" onClick={goToApp}>
            {user ? "Continue" : "Continue to sign in"}
          </button>
        </div>
      );

    case "expired":
      return (
        <div className="auth-verify">
          <span className="auth-verify-icon is-warning" aria-hidden>
            <Clock size={26} />
          </span>
          <p className="auth-verify-title">This link has expired</p>
          <p className="auth-verify-text">
            Verification links are valid for a limited time. Request a fresh one
            below.
          </p>
          {renderResend()}
        </div>
      );

    case "invalid":
      return (
        <div className="auth-verify">
          <span className="auth-verify-icon is-error" aria-hidden>
            <XCircle size={26} />
          </span>
          <p className="auth-verify-title">This link is invalid</p>
          <p className="auth-verify-text">
            It may have already been used or been mistyped. Request a new
            verification link below.
          </p>
          {renderResend()}
        </div>
      );

    case "error":
      return (
        <div className="auth-verify">
          <span className="auth-verify-icon is-warning" aria-hidden>
            <RefreshCw size={26} />
          </span>
          <p className="auth-verify-title">We couldn&apos;t verify right now</p>
          <p className="auth-verify-text">
            Something went wrong reaching the server — your link is probably
            fine. Please try again in a moment.
          </p>
          <button
            type="button"
            className="auth-submit"
            onClick={() => {
              if (tokenRef.current) void runVerify(tokenRef.current);
            }}
          >
            Try again
          </button>
        </div>
      );

    case "check-inbox":
    default:
      return (
        <div className="auth-verify">
          <span className="auth-verify-icon is-success" aria-hidden>
            <MailCheck size={26} />
          </span>
          <p className="auth-verify-title">Check your inbox</p>
          <p className="auth-verify-text">
            We&apos;ve sent a verification link to{" "}
            <strong>{user?.email ?? "your email address"}</strong>. Open it to
            activate your account. Didn&apos;t get it? Resend below.
          </p>
          {renderResend()}
        </div>
      );
  }
}
