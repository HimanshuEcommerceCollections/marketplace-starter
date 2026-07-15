/**
 * The authenticated user shape returned by the Elevate server (`PublicUser` —
 * the User row without `passwordHash`). Client-safe; no server imports.
 */
export type SessionRole =
  | "USER_CUSTOMER"
  | "SYSTEM_PROVIDER"
  | "SYSTEM_COORDINATOR"
  | "SYSTEM_ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  brand: string;
  /** Coverage areas the user selected (Wake County towns). Multi-value. */
  area: string[];
  role: SessionRole;
  status: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
