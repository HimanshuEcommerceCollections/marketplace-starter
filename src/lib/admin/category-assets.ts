import type { AxiosProgressEvent } from "axios";
import { apiClient } from "@/lib/api/client";
import { CategoryApiError } from "./categories";

/** Asset state as returned by the management endpoints (null/[] when empty). */
export interface CategoryAssets {
  iconPath: string | null;
  coverImages: string[];
}

interface Envelope {
  success?: boolean;
  message?: string;
  data?: CategoryAssets;
  errors?: Array<{ path?: string; message?: string }>;
}

/** Unwrap the `{ success, data }` envelope or throw a CategoryApiError. */
function unwrap(res: { status: number; data: Envelope }): CategoryAssets {
  const body = res.data ?? {};
  if (res.status >= 200 && res.status < 300 && body.success !== false && body.data) {
    return body.data;
  }
  const firstFieldError = Array.isArray(body.errors)
    ? body.errors[0]?.message
    : undefined;
  throw new CategoryApiError(
    res.status,
    body.message ?? firstFieldError ?? "Request failed",
    {},
  );
}

export interface UploadProgress {
  onProgress?: (percent: number) => void;
}

function progressConfig(opts?: UploadProgress) {
  return {
    // Override the apiClient's default application/json. In the browser, axios's
    // XHR adapter detects the FormData body and replaces this with a properly
    // boundaried multipart/form-data header, so we must not (and cannot usefully)
    // set the boundary ourselves.
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e: AxiosProgressEvent) => {
      if (opts?.onProgress && e.total) {
        opts.onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
  };
}

/** GET current uploaded assets for a category (by slug). */
export async function getCategoryAssets(slug: string): Promise<CategoryAssets> {
  return unwrap(await apiClient.get(`/categories/${slug}/assets`));
}

/** POST — initial upload of icon and/or covers. */
export async function createCategoryAssets(
  slug: string,
  form: FormData,
  opts?: UploadProgress,
): Promise<CategoryAssets> {
  return unwrap(
    await apiClient.post(`/categories/${slug}/assets`, form, progressConfig(opts)),
  );
}

/** PUT — apply a batch of changes (replace icon, add covers, remove, reorder). */
export async function updateCategoryAssets(
  slug: string,
  form: FormData,
  opts?: UploadProgress,
): Promise<CategoryAssets> {
  return unwrap(
    await apiClient.put(`/categories/${slug}/assets`, form, progressConfig(opts)),
  );
}

/** DELETE — remove every asset for a category. */
export async function deleteCategoryAssets(slug: string): Promise<CategoryAssets> {
  return unwrap(await apiClient.delete(`/categories/${slug}/assets`));
}

/** DELETE a single cover by its stored filename (e.g. "cover-2.webp"). */
export async function deleteCategoryCover(
  slug: string,
  coverId: string,
): Promise<CategoryAssets> {
  return unwrap(
    await apiClient.delete(`/categories/${slug}/assets/covers/${coverId}`),
  );
}

/** PATCH — set the cover order (full URLs or filenames); first is the default. */
export async function reorderCategoryCovers(
  slug: string,
  coverImages: string[],
): Promise<CategoryAssets> {
  return unwrap(
    await apiClient.patch(`/categories/${slug}/assets/covers/order`, {
      coverImages,
    }),
  );
}

/** Last path segment of a cover URL — its server-side filename / coverId. */
export function coverFilename(coverUrl: string): string {
  return coverUrl.split("/").pop() ?? coverUrl;
}
