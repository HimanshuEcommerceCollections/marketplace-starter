import { apiClient } from "@/lib/api/client";
import { BookingApiError } from "@/lib/booking/api";
import type {
  MyBooking,
  BookingStatusValue,
  PaginationMeta,
} from "@/lib/booking/api";
import type { AdminBooking, BookingStatus as AdminBookingStatus } from "./types";
import { formatBookingShortDate, formatBookingTime } from "@/lib/booking/format";
import { formatMoney } from "@/lib/money";

/** A booking row for staff views — the full server BookingResponse incl. customer + provider. */
export interface AdminBookingRow extends MyBooking {
  customerName: string;
  customerEmail: string;
  providerName: string | null;
}

interface Envelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: Array<{ path?: string; message?: string }>;
}

function unwrap<T>(res: { status: number; data: Envelope<T> }): {
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

/** Staff list — the server returns ALL bookings for admin/coordinator roles. */
export async function listBookings(params?: {
  page?: number;
  limit?: number;
  status?: BookingStatusValue;
}): Promise<{ items: AdminBookingRow[]; meta?: PaginationMeta }> {
  const { data, meta } = unwrap<AdminBookingRow[]>(
    await apiClient.get("/bookings", { params }),
  );
  return { items: data, meta };
}

export async function getBooking(id: string): Promise<AdminBookingRow> {
  return unwrap<AdminBookingRow>(await apiClient.get(`/bookings/${id}`)).data;
}

/** Staff status transition (PENDING → CONFIRMED, etc.). */
export async function setBookingStatus(
  id: string,
  status: BookingStatusValue,
): Promise<AdminBookingRow> {
  return unwrap<AdminBookingRow>(
    await apiClient.patch(`/bookings/${id}/status`, { status }),
  ).data;
}

/** Map the server's 6-value status onto the admin UI's 4 buckets (tabs + dots). */
export function toAdminStatus(s: BookingStatusValue): AdminBookingStatus {
  switch (s) {
    case "PENDING":
      return "pending";
    case "CONFIRMED":
    case "IN_PROGRESS":
      return "active";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
    case "NO_SHOW":
      return "cancelled";
  }
}

/** Adapt a live booking row into the legacy AdminBooking shape used by the
 *  dashboard overview tables. `id` carries the reference for display; sample-only
 *  concepts (stage) have no live equivalent. */
export function toAdminBooking(b: AdminBookingRow): AdminBooking {
  return {
    id: b.id,
    reference: b.reference,
    client: b.customerName,
    clientFullName: b.contactName ?? b.customerName,
    clientEmail: b.customerEmail,
    service: b.serviceName,
    date: formatBookingShortDate(b.scheduledStart),
    time: formatBookingTime(b.scheduledTime),
    total: formatMoney({ amount: b.priceAmount, currency: b.currency }),
    professional: b.providerName ?? "Unassigned",
    professionalMatched: Boolean(b.providerName),
    status: toAdminStatus(b.status),
  };
}
