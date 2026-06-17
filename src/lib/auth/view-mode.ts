import { cookies } from "next/headers";
import {
  VIEW_MODE_COOKIE,
  parseViewMode,
  type AuthUserType,
} from "./user-type";

/**
 * SERVER-ONLY (imports next/headers). Reads the persisted view mode so server
 * components render the right design (customer "user" vs internal "system").
 * Defaults to "user" when the cookie is absent.
 */
export async function getViewMode(): Promise<AuthUserType> {
  const store = await cookies();
  return parseViewMode(store.get(VIEW_MODE_COOKIE)?.value);
}
