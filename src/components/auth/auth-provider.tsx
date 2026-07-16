"use client";

import * as React from "react";
import { apiClient } from "@/lib/api/client";
import type { SessionUser } from "@/lib/auth/types";
import type { FieldErrors } from "@/lib/forms/validate";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthResult {
  success: boolean;
  user?: SessionUser;
  errors?: FieldErrors;
  /** Machine-readable error code from the server (e.g. "EMAIL_NOT_VERIFIED"). */
  code?: string;
}

export interface VerifyEmailResult {
  success: boolean;
  /** True when the account was already verified (idempotent re-click). */
  alreadyVerified?: boolean;
  /** "TOKEN_INVALID" | "TOKEN_EXPIRED" on failure. */
  code?: string;
  message?: string;
}

export interface ActionResult {
  success: boolean;
  message?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface SignupInput {
  name: string;
  email: string;
  phone?: string;
  /** Multi-value coverage area (Wake County towns) selected at signup. */
  area: string[];
  password: string;
}

interface AuthContextValue {
  user: SessionUser | null;
  status: AuthStatus;
  login: (input: LoginInput) => Promise<AuthResult>;
  signup: (input: SignupInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  /** Redeem a verification token (from the emailed link). */
  verifyEmail: (token: string) => Promise<VerifyEmailResult>;
  /**
   * Resend the verification email. With `{ email }` it uses the public endpoint
   * (logged-out); with no argument it uses the authenticated endpoint (the
   * signed-in user). Always resolves to a generic ack (enumeration-safe).
   */
  resendVerification: (input?: { email?: string }) => Promise<ActionResult>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

/** Normalize a server/BFF error body into the FieldErrors the forms render. */
function toFieldErrors(body: unknown): FieldErrors {
  const b = body as { errors?: unknown; message?: string } | null;
  if (Array.isArray(b?.errors)) {
    const out: FieldErrors = {};
    for (const issue of b.errors as Array<{ path?: string; message?: string }>) {
      const key = issue.path && issue.path.length > 0 ? issue.path : "_form";
      (out[key] ??= []).push(issue.message ?? "Invalid value");
    }
    return out;
  }
  return { _form: [b?.message ?? "Something went wrong. Please try again."] };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [status, setStatus] = React.useState<AuthStatus>("loading");

  const refresh = React.useCallback(async () => {
    try {
      const res = await apiClient.get<{ user: SessionUser | null }>("/auth/me");
      if (res.data.user) {
        setUser(res.data.user);
        setStatus("authenticated");
      } else {
        setUser(null);
        setStatus("unauthenticated");
      }
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const post = React.useCallback(
    async (path: string, input: unknown): Promise<AuthResult> => {
      try {
        const res = await apiClient.post(path, input);
        const body = res.data as
          | { success?: boolean; user?: SessionUser; code?: string; errors?: { code?: string } }
          | null;
        if (res.status >= 200 && res.status < 300 && body?.success && body.user) {
          setUser(body.user);
          setStatus("authenticated");
          return { success: true, user: body.user };
        }
        // Surface a machine code (e.g. EMAIL_NOT_VERIFIED) when present, so
        // callers can offer a tailored affordance (like "resend verification").
        const code = body?.code ?? body?.errors?.code;
        return { success: false, errors: toFieldErrors(body), code };
      } catch {
        return { success: false, errors: { _form: ["Network error. Please try again."] } };
      }
    },
    [],
  );

  const login = React.useCallback(
    (input: LoginInput) => post("/auth/login", input),
    [post],
  );
  const signup = React.useCallback(
    (input: SignupInput) => post("/auth/register", input),
    [post],
  );
  const logout = React.useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore — clear local state regardless
    }
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const verifyEmail = React.useCallback(
    async (token: string): Promise<VerifyEmailResult> => {
      try {
        const res = await apiClient.post("/auth/verify-email", { token });
        const body = res.data as
          | {
              success?: boolean;
              user?: SessionUser;
              alreadyVerified?: boolean;
              message?: string;
              errors?: { code?: string };
            }
          | null;
        if (res.status >= 200 && res.status < 300 && body?.success) {
          // Don't optimistically set auth state: a logged-out verifier has no
          // session cookie, so faking "authenticated" would be wrong. Callers
          // re-sync via refresh() and let /auth/me be the source of truth.
          return {
            success: true,
            alreadyVerified: !!body.alreadyVerified,
            message: body.message,
          };
        }
        return { success: false, code: body?.errors?.code, message: body?.message };
      } catch {
        return { success: false, message: "Network error. Please try again." };
      }
    },
    [],
  );

  const resendVerification = React.useCallback(
    async (input?: { email?: string }): Promise<ActionResult> => {
      try {
        const res = input?.email
          ? await apiClient.post("/auth/resend-verification/public", {
              email: input.email,
            })
          : await apiClient.post("/auth/resend-verification");
        const body = res.data as { success?: boolean; message?: string } | null;
        if (res.status >= 200 && res.status < 300 && body?.success) {
          return { success: true, message: body.message };
        }
        return {
          success: false,
          message: body?.message ?? "Could not resend. Please try again.",
        };
      } catch {
        return { success: false, message: "Network error. Please try again." };
      }
    },
    [],
  );

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      login,
      signup,
      logout,
      refresh,
      verifyEmail,
      resendVerification,
    }),
    [user, status, login, signup, logout, refresh, verifyEmail, resendVerification],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Read auth state + actions from any client component under <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
