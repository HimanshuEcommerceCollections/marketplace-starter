import axios from "axios";

/**
 * Browser-side axios instance for same-origin BFF calls (`/api/*`).
 * `validateStatus` is relaxed so non-2xx responses resolve (we inspect the
 * status/body ourselves) instead of rejecting — only true network failures
 * throw. httpOnly session cookies ride along automatically (same-origin).
 */
export const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  validateStatus: () => true,
});
