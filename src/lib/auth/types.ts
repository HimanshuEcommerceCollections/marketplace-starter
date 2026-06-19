/**
 * The authenticated user shape returned by the Elevate server (`PublicUser` —
 * the User row without `passwordHash`). Client-safe; no server imports.
 */
export type SessionRole = "CUSTOMER" | "PROVIDER" | "COORDINATOR" | "ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  brand: string;
  role: SessionRole;
  status: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
