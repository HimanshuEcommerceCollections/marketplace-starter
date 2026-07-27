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
  // NOTE: no `area`. Coverage is a property of a BOOKING (resolved server-side
  // from the customer's ZIP), never of an account — the server's PublicUser no
  // longer carries one, and nothing may reintroduce a client-side area enum.
  role: SessionRole;
  status: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
