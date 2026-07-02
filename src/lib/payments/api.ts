import { apiClient } from "@/lib/api/client";

/** Mirrors the backend PaymentStatus enum. */
export type PaymentStatusValue =
  | "PENDING"
  | "AUTHORIZED"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

/** Response of POST /payments/intent. `amount` is in minor units (cents). */
export interface CreateIntentResponse {
  paymentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
  publishableKey: string | null;
}

/** A payment as returned by GET /payments/:id (matches the server PaymentResponse). */
export interface PaymentView {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatusValue;
  provider: string | null;
  externalId: string | null;
  createdAt: string;
  updatedAt: string;
}

export class PaymentApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "PaymentApiError";
    this.status = status;
  }
}

interface Envelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ path?: string; message?: string }>;
}

/** Unwrap a `{ success, data }` envelope or throw a PaymentApiError. */
function unwrap<T>(res: { status: number; data: Envelope<T> }): T {
  const body = (res.data ?? {}) as Envelope<T>;
  if (res.status >= 200 && res.status < 300 && body.success !== false && body.data) {
    return body.data;
  }
  const firstError = Array.isArray(body.errors) ? body.errors[0]?.message : undefined;
  throw new PaymentApiError(
    res.status,
    body.message ?? firstError ?? "Payment request failed",
  );
}

/**
 * Create (or reuse) a Stripe PaymentIntent for a PENDING booking. Throws
 * PaymentApiError — status 401 means the customer needs to sign in again.
 */
export async function createPaymentIntent(
  bookingId: string,
): Promise<CreateIntentResponse> {
  return unwrap<CreateIntentResponse>(
    await apiClient.post("/payments/intent", { bookingId }),
  );
}

/** Fetch a payment's current status (server enforces ownership). */
export async function getPayment(id: string): Promise<PaymentView> {
  return unwrap<PaymentView>(await apiClient.get(`/payments/${id}`));
}
