import { apiClient } from "@/lib/api/client";

/** Server booking DTO (mirrors the backend createBookingSchema). */
export interface CreateBookingPayload {
  serviceId: string;
  scheduledStart: string; // ISO
  scheduledEnd: string; // ISO
  locationMode?: "ONSITE" | "REMOTE" | "HYBRID";
  /** Wake County town (ServiceArea enum value) the session takes place in. */
  area?: string;
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
  constructor(status: number, message: string) {
    super(message);
    this.name = "BookingApiError";
    this.status = status;
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
  /** ServiceArea enum value (e.g. "WAKE_FOREST"), or null. */
  area: string | null;
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

interface Envelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: Array<{ path?: string; message?: string }>;
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
  const firstError = Array.isArray(body.errors) ? body.errors[0]?.message : undefined;
  throw new BookingApiError(res.status, body.message ?? firstError ?? "Request failed");
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
  const firstError = Array.isArray(body.errors) ? body.errors[0]?.message : undefined;
  throw new BookingApiError(res.status, body.message ?? firstError ?? "Could not submit booking");
}
