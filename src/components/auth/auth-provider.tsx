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
}

interface LoginInput {
  email: string;
  password: string;
}

interface SignupInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

interface AuthContextValue {
  user: SessionUser | null;
  status: AuthStatus;
  login: (input: LoginInput) => Promise<AuthResult>;
  signup: (input: SignupInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
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
        const body = res.data as { success?: boolean; user?: SessionUser } | null;
        if (res.status >= 200 && res.status < 300 && body?.success && body.user) {
          setUser(body.user);
          setStatus("authenticated");
          return { success: true, user: body.user };
        }
        return { success: false, errors: toFieldErrors(body) };
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

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, status, login, signup, logout, refresh }),
    [user, status, login, signup, logout, refresh],
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
