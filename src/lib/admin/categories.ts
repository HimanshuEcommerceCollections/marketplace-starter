import { apiClient } from "@/lib/api/client";
import type { FieldErrors } from "@/lib/forms/validate";
import type {
  Category,
  CategoryDetails,
  CategoryListResult,
  CategoryStatus,
  PaginationMeta,
} from "./types";

export interface ListCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CategoryStatus;
  sort?: "asc" | "desc";
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  basePrice: number; // minor units (cents)
  slug?: string;
  publish?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string | null;
  basePrice?: number;
}

/** Error carrying the HTTP status + per-field messages mapped from the API envelope. */
export class CategoryApiError extends Error {
  readonly status: number;
  readonly fieldErrors: FieldErrors;
  constructor(status: number, message: string, fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = "CategoryApiError";
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

/** Unwrap the `{ success, data, meta }` envelope or throw a CategoryApiError. */
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
  throw new CategoryApiError(res.status, body.message ?? "Request failed", fieldErrors);
}

export async function listCategories(
  params: ListCategoriesParams = {},
): Promise<CategoryListResult> {
  const res = await apiClient.get("/categories", { params });
  const { data, meta } = unwrap<Category[]>(res);
  return {
    items: data,
    meta: meta ?? { page: 1, limit: data.length, total: data.length, totalPages: 1 },
  };
}

export async function getCategory(id: string): Promise<CategoryDetails> {
  return unwrap<CategoryDetails>(await apiClient.get(`/categories/${id}`)).data;
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  return unwrap<Category>(await apiClient.post("/categories", input)).data;
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<Category> {
  return unwrap<Category>(await apiClient.patch(`/categories/${id}`, input)).data;
}

export async function publishCategory(id: string): Promise<Category> {
  return unwrap<Category>(await apiClient.post(`/categories/${id}/publish`)).data;
}

export async function deactivateCategory(id: string): Promise<Category> {
  return unwrap<Category>(await apiClient.post(`/categories/${id}/deactivate`)).data;
}
