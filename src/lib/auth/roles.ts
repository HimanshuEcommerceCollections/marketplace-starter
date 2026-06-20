import type { SessionRole } from "./types";

/** Roles allowed into the /admin area. */
export const STAFF_ROLES: readonly SessionRole[] = ["SYSTEM_ADMIN", "SYSTEM_COORDINATOR"];

export function isStaffRole(role: SessionRole): boolean {
  return STAFF_ROLES.includes(role);
}

/** Where a user lands after authenticating, based on their role. */
export function landingPathForRole(role: SessionRole): string {
  return isStaffRole(role) ? "/admin" : "/";
}

/** Human-readable labels for session roles, shown in the admin UI. */
const ROLE_LABELS: Record<SessionRole, string> = {
  USER_CUSTOMER: "Customer",
  SYSTEM_PROVIDER: "Provider",
  SYSTEM_COORDINATOR: "Coordinator",
  SYSTEM_ADMIN: "Admin",
};

export function roleLabel(role: SessionRole): string {
  return ROLE_LABELS[role] ?? role;
}
