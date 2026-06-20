import { apiClient } from "@/lib/api/client";
import type { FieldErrors } from "@/lib/forms/validate";
import type {
  AdminService,
  AdminServiceListResult,
  ServiceStatus,
  PaginationMeta,
} from "./types";

export interface ListServicesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ServiceStatus;
  sort?: "asc" | "desc";
}

export interface CreateServiceInput {
  name: string;
  description?: string;
  basePrice: number; // minor units (cents)
  slug?: string;
  durationMinutes?: number;
  publish?: boolean;
}

export interface UpdateServiceInput {
  name?: string;
  slug?: string;
  description?: string | null;
  basePrice?: number;
  durationMinutes?: number;
}

/** Error carrying the HTTP status + per-field messages mapped from the API envelope. */
export class ServiceApiError extends Error {
  readonly status: number;
  readonly fieldErrors: FieldErrors;
  constructor(status: number, message: string, fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = "ServiceApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface Envelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: Array<{ path?: string; message?: string }>;
}

/** Unwrap the `{ success, data, meta }` envelope or throw a ServiceApiError. */
function unwrap<T>(res: { status: number; data: Envelope<T> }): {
  data: T;
  meta?: PaginationMeta;
} {
  const body = res.data ?? {};
  if (res.status >= 200 && res.status < 300 && body.success !== false) {
    return { data: body.data as T, meta: body.meta };
  }
  const fieldErrors: FieldErrors = {};
  if (Array.isArray(body.errors)) {
    for (const issue of body.errors) {
      const key = issue.path && issue.path.length > 0 ? issue.path : "_form";
      (fieldErrors[key] ??= []).push(issue.message ?? "Invalid value");
    }
  }
  throw new ServiceApiError(res.status, body.message ?? "Request failed", fieldErrors);
}

export async function listServices(
  params: ListServicesParams = {},
): Promise<AdminServiceListResult> {
  const res = await apiClient.get("/services", { params });
  const { data, meta } = unwrap<AdminService[]>(res);
  return {
    items: data,
    meta: meta ?? { page: 1, limit: data.length, total: data.length, totalPages: 1 },
  };
}

export async function getService(id: string): Promise<AdminService> {
  return unwrap<AdminService>(await apiClient.get(`/services/${id}`)).data;
}

export async function createService(input: CreateServiceInput): Promise<AdminService> {
  return unwrap<AdminService>(await apiClient.post("/services", input)).data;
}

export async function updateService(
  id: string,
  input: UpdateServiceInput,
): Promise<AdminService> {
  return unwrap<AdminService>(await apiClient.patch(`/services/${id}`, input)).data;
}

export async function publishService(id: string): Promise<AdminService> {
  return unwrap<AdminService>(await apiClient.post(`/services/${id}/publish`)).data;
}

export async function deactivateService(id: string): Promise<AdminService> {
  return unwrap<AdminService>(await apiClient.post(`/services/${id}/deactivate`)).data;
}

/** Generic lifecycle change to any valid target status (server enforces the map). */
export async function setServiceStatus(
  id: string,
  status: ServiceStatus,
): Promise<AdminService> {
  return unwrap<AdminService>(
    await apiClient.post(`/services/${id}/status`, { status }),
  ).data;
}
