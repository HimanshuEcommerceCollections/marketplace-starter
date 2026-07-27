import { apiClient } from "@/lib/api/client";
import type {
  CoverageCheckResult,
  CoverageCheckServiceEntry,
} from "@/lib/coverage/types";

/** Server booking DTO (mirrors the backend createBookingSchema). */
export interface CreateBookingPayload {
  serviceId: string;
  scheduledStart: string; // ISO
  scheduledEnd: string; // ISO
  locationMode?: "ONSITE" | "REMOTE" | "HYBRID";
  /**
   * The ZIP code the session takes place in — the ONLY geographic input a
   * customer supplies. The server resolves the Area from it, so a client cannot
   * name the market its own coverage is evaluated against. Required by the
   * server's coverage gate for ONSITE/HYBRID, ignored for REMOTE.
   *
   * There is deliberately no `area` field: the server treats a legacy `area` as
   * a hint it overrides, and sending one is how the self-selection bypass came
   * back last time.
   */
  postalCode?: string;
  notes?: string;
  optionIds?: string[];
  contact?: { name?: string; email?: string; phone?: string };
  address?: string;
  schedulePreferences?: {
    windows?: Array<{ date: string; time?: string }>;
    flexibility?: string;
    timezone?: string;
  };
}

export interface CreatedBooking {
  id: string;
  reference: string;
  priceAmount: number;
  currency: string;
  status: string;
}

export class BookingApiError extends Error {
  readonly status: number;
  /**
   * Machine-readable code, e.g. "ZIP_NOT_SERVICEABLE" / "ZIP_REQUIRED". Branch on
   * this, never on the message: every coverage deny is deliberately one identical
   * sentence, so the text carries nothing to switch on.
   *
   * Today it is read out of `errors[0].code` — `ApiError` carries no top-level
   * `code` yet (see `Envelope`). Undefined for a zod 422 and for any bare
   * `ApiError.badRequest(...)`, both of which have no code at all.
   */
  readonly code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "BookingApiError";
    this.status = status;
    this.code = code;
  }
}

export type BookingStatusValue =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

/** One configured option captured on the booking (the priced selections snapshot). */
export interface BookingSelectionItem {
  groupLabel: string;
  optionLabel: string;
  priceModifier: number;
  groupId?: string;
  optionId?: string;
  optionKey?: string;
}

export interface BookingSchedulePreferences {
  windows?: Array<{ date: string; time?: string }>;
  flexibility?: string;
  timezone?: string;
}

/** The customer's review of a booking, as returned inline on the booking. */
export interface BookingReview {
  rating: number;
  comment: string | null;
}

/** A booking as returned to the customer (matches the server BookingResponse). */
export interface MyBooking {
  id: string;
  reference: string;
  status: BookingStatusValue;
  serviceName: string;
  serviceSlug: string;
  providerName: string | null;
  providerCredential: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  scheduledDate: string; // "YYYY-MM-DD"
  scheduledTime: string; // "HH:mm"
  priceAmount: number;
  currency: string;
  locationMode: string;
  /**
   * DEPRECATED legacy `ServiceArea` enum value (e.g. "WAKE_FOREST"), or null —
   * null for any area an admin created that has no enum member. Use
   * `areaNameSnapshot` for display when present; see `areaLabel()`.
   */
  area: string | null;
  /**
   * Immutable snapshot of the area name the customer was shown at booking time.
   * DISPLAY authority (survives a rename or a ZIP being re-homed). Optional
   * because the server's `BookingResponse` does not serialize it yet — see the
   * wiring note in the module report.
   */
  areaNameSnapshot?: string | null;
  /** Normalized 5-digit ZIP resolved at booking time. Same caveat as above. */
  postalCode?: string | null;
  notes: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  schedulePreferences: BookingSchedulePreferences | null;
  selections: BookingSelectionItem[] | null;
  review: BookingReview | null;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** One entry of the envelope's `errors`. */
interface ApiErrorDetail {
  path?: string;
  message?: string;
  code?: string;
}

interface Envelope<T> {
  success?: boolean;
  message?: string;
  /**
   * RESERVED, not yet emitted. Verified against the server: `ApiError` has no
   * `code` field and `middleware/error-handler.ts` writes only
   * `{ success, message, errors: err.details }` — so today every machine code
   * arrives INSIDE `errors`, never at the top level. Read in preference to
   * `errors[].code` purely so the planned `ApiError.coded()` needs no client
   * change; do not "simplify" the reader down to this key.
   */
  code?: string;
  data?: T;
  meta?: PaginationMeta;
  /**
   * `err.details`, passed straight through. The server emits TWO shapes through
   * this one key and both carry codes:
   *   coverage / bookings  `errors: [{ path?, code, message }]`   (coverage.service `coded()`)
   *   areas / zip-codes    `errors: { code, ...extras }`          (a bare object)
   *   zod 422              `errors: [{ path, message }]`          (no code)
   */
  errors?: ApiErrorDetail | ApiErrorDetail[];
}

/** Flatten `errors` (array, bare object, or absent) to its first detail. */
function firstDetail(errors: Envelope<unknown>["errors"]): ApiErrorDetail | undefined {
  if (Array.isArray(errors)) return errors[0];
  if (errors && typeof errors === "object") return errors;
  return undefined;
}

/** Unwrap a `{ success, data, meta }` envelope or throw a BookingApiError. */
function unwrapData<T>(res: { status: number; data: Envelope<T> }): {
  data: T;
  meta?: PaginationMeta;
} {
  const body = (res.data ?? {}) as Envelope<T>;
  if (res.status >= 200 && res.status < 300 && body.success !== false) {
    return { data: body.data as T, meta: body.meta };
  }
  const detail = firstDetail(body.errors);
  throw new BookingApiError(
    res.status,
    body.message ?? detail?.message ?? "Request failed",
    body.code ?? detail?.code,
  );
}

/** List the signed-in customer's bookings (server scopes to them). */
export async function listMyBookings(params?: {
  page?: number;
  limit?: number;
  status?: BookingStatusValue;
}): Promise<{ items: MyBooking[]; meta?: PaginationMeta }> {
  const { data, meta } = unwrapData<MyBooking[]>(
    await apiClient.get("/bookings", { params }),
  );
  return { items: data, meta };
}

/** Fetch one of the customer's bookings (server enforces ownership). */
export async function getMyBooking(id: string): Promise<MyBooking> {
  return unwrapData<MyBooking>(await apiClient.get(`/bookings/${id}`)).data;
}

/** Cancel one of the customer's bookings. */
export async function cancelMyBooking(id: string): Promise<MyBooking> {
  return unwrapData<MyBooking>(await apiClient.patch(`/bookings/${id}/cancel`)).data;
}

/** Submit a star rating (+ optional comment) for a completed booking. */
export async function submitReview(input: {
  bookingId: string;
  rating: number;
  comment?: string;
}): Promise<BookingReview> {
  const res = await apiClient.post("/reviews", input);
  const { data } = unwrapData<{ rating: number; comment: string | null }>(res);
  return { rating: data.rating, comment: data.comment ?? null };
}

/**
 * Submit a booking to the live backend (via the same-origin BFF, which attaches
 * the auth cookie). Throws BookingApiError — status 401 means the customer needs
 * to sign in.
 */
export async function submitBooking(payload: CreateBookingPayload): Promise<CreatedBooking> {
  const res = await apiClient.post("/bookings", payload);
  const body = (res.data ?? {}) as Envelope<CreatedBooking>;
  if (res.status >= 200 && res.status < 300 && body.success !== false && body.data) {
    return body.data;
  }
  const detail = firstDetail(body.errors);
  throw new BookingApiError(
    res.status,
    body.message ?? detail?.message ?? "Could not submit booking",
    body.code ?? detail?.code,
  );
}

// ── Public coverage check ────────────────────────────────────────────────────

/**
 * `BookingApiError.code` for a coverage deny from `POST /bookings`.
 *
 * Branch on this, never on the message: every deny reason (unknown ZIP, inactive
 * ZIP, inactive market, service excludes it) produces one byte-identical
 * sentence on purpose, so the text carries no information to switch on.
 */
export const COVERAGE_DENY_CODE = "ZIP_NOT_SERVICEABLE";

/**
 * `GET /coverage/check` — the anonymous availability answer.
 *
 * 200 even when `serviceable` is false: a valid answer to a valid question.
 * `area` is populated only inside the published footprint, and `message` is
 * server-authored copy that must be rendered VERBATIM — never compose a
 * coverage sentence on the client, and never infer *why* a ZIP was denied.
 *
 * The SHAPE is not redeclared here. `@/lib/coverage/types` is the one hand-
 * mirrored wire contract for this feature (areas, ZIPs, coverage, the check) and
 * a second local copy is exactly how a server field rename stops arriving on one
 * screen and keeps arriving on another. Only the transport differs: this wrapper
 * throws `BookingApiError` so the booking flow has a single error class, while
 * the admin wrapper throws `CoverageApiError`. Type-only import, so no admin code
 * reaches the public booking bundle.
 */
export type { CoverageCheckResult, CoverageCheckServiceEntry };

/**
 * Ask whether a ZIP is serviceable. Anonymous-safe (the BFF attaches a token
 * only when one exists).
 *
 * Pass `serviceId` (a live UUID) XOR `serviceSlug` — sending BOTH is a 422. With
 * NEITHER the server answers a different question ("what is bookable at this
 * ZIP at all"), whose `serviceable` says nothing about the service the customer
 * is actually configuring, so callers in the booking flow must always name one.
 * `serviceSlug` must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` or the whole query 422s.
 *
 * Callers MUST debounce and pass an `AbortSignal`: the endpoint is rate-limited
 * to 30 checks per ZIP per minute and is never cached server-side.
 */
export async function checkCoverage(input: {
  zip: string;
  serviceId?: string;
  serviceSlug?: string;
  signal?: AbortSignal;
}): Promise<CoverageCheckResult> {
  const params: Record<string, string> = { zip: input.zip };
  if (input.serviceId) params.serviceId = input.serviceId;
  else if (input.serviceSlug) params.serviceSlug = input.serviceSlug;
  const res = await apiClient.get("/coverage/check", {
    params,
    signal: input.signal,
  });
  return unwrapData<CoverageCheckResult>(res).data;
}
