import { apiClient } from "@/lib/api/client";
import { validateForm, type FieldErrors } from "@/lib/forms/validate";
import { CorporateQuoteFormSchema } from "@/lib/forms/schemas";

/** Triage lifecycle — mirrors the server `CorporateInquiryStatus` enum. */
export type CorporateInquiryStatusValue =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "CLOSED";

/** A corporate inquiry row as returned by the backend (raw serialized model). */
export interface CorporateInquiryRow {
  id: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  headcount: string | null;
  eventType: string;
  preferredDate: string | null;
  notes: string | null;
  status: CorporateInquiryStatusValue;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class CorporateInquiryApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "CorporateInquiryApiError";
    this.status = status;
  }
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
  const firstError = Array.isArray(body.errors)
    ? body.errors[0]?.message
    : undefined;
  throw new CorporateInquiryApiError(
    res.status,
    body.message ?? firstError ?? "Request failed",
  );
}

/** Result contract shared with the form UI (mirrors the old stub's shape). */
export interface SubmitResult {
  success: boolean;
  request_id?: string;
  errors?: FieldErrors;
}

/**
 * Submit a corporate inquiry to the live backend via the same-origin BFF.
 *
 * Validates locally first (instant field errors, same UX as the old stub), then
 * maps the form's snake_case fields to the server DTO and POSTs. Field errors
 * stay keyed by the form's dotted zod paths (`company`, `contact.name`, …); any
 * transport/server failure surfaces under `_form`.
 */
export async function submitCorporateInquiry(
  input: unknown,
): Promise<SubmitResult> {
  const v = validateForm(CorporateQuoteFormSchema, input);
  if (!v.success) return { success: false, errors: v.errors };

  const d = v.data!;
  const payload = {
    company: d.company,
    contact: d.contact,
    headcount: d.headcount,
    eventType: d.event_type,
    preferredDate: d.preferred_date,
    notes: d.notes,
  };

  try {
    const res = await apiClient.post("/corporate-inquiries", payload);
    const body = (res.data ?? {}) as Envelope<{ id: string }>;
    if (res.status >= 200 && res.status < 300 && body.success !== false) {
      return { success: true, request_id: body.data?.id };
    }
    const firstError = Array.isArray(body.errors)
      ? body.errors[0]?.message
      : undefined;
    return {
      success: false,
      errors: {
        _form: [
          body.message ?? firstError ?? "Something went wrong. Please try again.",
        ],
      },
    };
  } catch {
    return {
      success: false,
      errors: { _form: ["We couldn't reach the server. Please try again."] },
    };
  }
}

/** Staff list — the server returns ALL inquiries for admin/coordinator roles. */
export async function listCorporateInquiries(params?: {
  page?: number;
  limit?: number;
  status?: CorporateInquiryStatusValue;
}): Promise<{ items: CorporateInquiryRow[]; meta?: PaginationMeta }> {
  const { data, meta } = unwrap<CorporateInquiryRow[]>(
    await apiClient.get("/corporate-inquiries", { params }),
  );
  return { items: data, meta };
}

/** Staff triage transition (NEW → CONTACTED → QUALIFIED → CLOSED). */
export async function setCorporateInquiryStatus(
  id: string,
  status: CorporateInquiryStatusValue,
): Promise<CorporateInquiryRow> {
  return unwrap<CorporateInquiryRow>(
    await apiClient.patch(`/corporate-inquiries/${id}/status`, { status }),
  ).data;
}
