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
