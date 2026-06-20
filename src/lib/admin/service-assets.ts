import type { AxiosProgressEvent } from "axios";
import { apiClient } from "@/lib/api/client";
import { ServiceApiError } from "./services";

/** Asset state as returned by the management endpoints (null/[] when empty). */
export interface ServiceAssets {
  iconPath: string | null;
  coverImages: string[];
}

interface Envelope {
  success?: boolean;
  message?: string;
  data?: ServiceAssets;
  errors?: Array<{ path?: string; message?: string }>;
}

/** Unwrap the `{ success, data }` envelope or throw a ServiceApiError. */
function unwrap(res: { status: number; data: Envelope }): ServiceAssets {
  const body = res.data ?? {};
  if (res.status >= 200 && res.status < 300 && body.success !== false && body.data) {
    return body.data;
  }
  const firstFieldError = Array.isArray(body.errors)
    ? body.errors[0]?.message
    : undefined;
  throw new ServiceApiError(
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

/** GET current uploaded assets for a service (by slug). */
export async function getServiceAssets(slug: string): Promise<ServiceAssets> {
  return unwrap(await apiClient.get(`/services/${slug}/assets`));
}

/** POST — initial upload of icon and/or covers. */
export async function createServiceAssets(
  slug: string,
  form: FormData,
  opts?: UploadProgress,
): Promise<ServiceAssets> {
  return unwrap(
    await apiClient.post(`/services/${slug}/assets`, form, progressConfig(opts)),
  );
}

/** PUT — apply a batch of changes (replace icon, add covers, remove, reorder). */
export async function updateServiceAssets(
  slug: string,
  form: FormData,
  opts?: UploadProgress,
): Promise<ServiceAssets> {
  return unwrap(
    await apiClient.put(`/services/${slug}/assets`, form, progressConfig(opts)),
  );
}

/** DELETE — remove every asset for a service. */
export async function deleteServiceAssets(slug: string): Promise<ServiceAssets> {
  return unwrap(await apiClient.delete(`/services/${slug}/assets`));
}

/** DELETE a single cover by its stored filename (e.g. "cover-2.webp"). */
export async function deleteServiceCover(
  slug: string,
  coverId: string,
): Promise<ServiceAssets> {
  return unwrap(
    await apiClient.delete(`/services/${slug}/assets/covers/${coverId}`),
  );
}

/** PATCH — set the cover order (full URLs or filenames); first is the default. */
export async function reorderServiceCovers(
  slug: string,
  coverImages: string[],
): Promise<ServiceAssets> {
  return unwrap(
    await apiClient.patch(`/services/${slug}/assets/covers/order`, {
      coverImages,
    }),
  );
}

/** Last path segment of a cover URL — its server-side filename / coverId. */
export function coverFilename(coverUrl: string): string {
  return coverUrl.split("/").pop() ?? coverUrl;
}
