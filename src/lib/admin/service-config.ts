import { apiClient } from "@/lib/api/client";
import type { FieldErrors } from "@/lib/forms/validate";
import { ServiceApiError } from "./services";

export type ConfigSelectionType = "SINGLE_SELECT" | "MULTI_SELECT";
export type ConfigStatus = "ACTIVE" | "INACTIVE";

export interface ConfigOption {
  id: string;
  key: string;
  label: string;
  priceModifier: number; // minor units (cents)
  description: string | null;
  sortOrder: number;
  status: ConfigStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigGroup {
  id: string;
  serviceId: string;
  key: string;
  label: string;
  selectionType: ConfigSelectionType;
  isRequired: boolean;
  sortOrder: number;
  status: ConfigStatus;
  options: ConfigOption[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceLineItem {
  groupId: string;
  groupLabel: string;
  optionId: string;
  optionKey: string;
  optionLabel: string;
  priceModifier: number; // minor units (cents)
}

export interface PriceQuote {
  serviceId: string;
  currency: string;
  basePrice: number; // minor units (cents)
  lineItems: PriceLineItem[];
  total: number;
}

export interface CreateConfigGroupInput {
  key: string;
  label: string;
  selectionType: ConfigSelectionType;
  isRequired?: boolean;
  sortOrder?: number;
}

export interface UpdateConfigGroupInput {
  key?: string;
  label?: string;
  selectionType?: ConfigSelectionType;
  isRequired?: boolean;
  sortOrder?: number;
  status?: ConfigStatus;
}

export interface CreateConfigOptionInput {
  key: string;
  label: string;
  priceModifier?: number;
  description?: string;
  sortOrder?: number;
  status?: ConfigStatus;
}

export interface UpdateConfigOptionInput {
  key?: string;
  label?: string;
  priceModifier?: number;
  description?: string | null;
  sortOrder?: number;
  status?: ConfigStatus;
}

interface Envelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ path?: string; message?: string }>;
}

/** Unwrap the `{ success, data }` envelope or throw a ServiceApiError (with field errors). */
function unwrap<T>(res: { status: number; data: Envelope<T> }): T {
  const body = res.data ?? {};
  if (res.status >= 200 && res.status < 300 && body.success !== false) {
    return body.data as T;
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

// ── Groups ────────────────────────────────────────────────────────────────────
export async function listConfigGroups(serviceId: string): Promise<ConfigGroup[]> {
  return unwrap<ConfigGroup[]>(await apiClient.get(`/services/${serviceId}/config/groups`));
}

export async function createConfigGroup(
  serviceId: string,
  input: CreateConfigGroupInput,
): Promise<ConfigGroup> {
  return unwrap<ConfigGroup>(
    await apiClient.post(`/services/${serviceId}/config/groups`, input),
  );
}

export async function updateConfigGroup(
  serviceId: string,
  groupId: string,
  input: UpdateConfigGroupInput,
): Promise<ConfigGroup> {
  return unwrap<ConfigGroup>(
    await apiClient.patch(`/services/${serviceId}/config/groups/${groupId}`, input),
  );
}

export async function deleteConfigGroup(serviceId: string, groupId: string): Promise<void> {
  unwrap(await apiClient.delete(`/services/${serviceId}/config/groups/${groupId}`));
}

export async function reorderConfigGroups(
  serviceId: string,
  groupIds: string[],
): Promise<ConfigGroup[]> {
  return unwrap<ConfigGroup[]>(
    await apiClient.patch(`/services/${serviceId}/config/groups/order`, { groupIds }),
  );
}

// ── Options ─────────────────────────────────────────────────────────────────────
export async function createConfigOption(
  serviceId: string,
  groupId: string,
  input: CreateConfigOptionInput,
): Promise<ConfigOption> {
  return unwrap<ConfigOption>(
    await apiClient.post(`/services/${serviceId}/config/groups/${groupId}/options`, input),
  );
}

export async function updateConfigOption(
  serviceId: string,
  groupId: string,
  optionId: string,
  input: UpdateConfigOptionInput,
): Promise<ConfigOption> {
  return unwrap<ConfigOption>(
    await apiClient.patch(
      `/services/${serviceId}/config/groups/${groupId}/options/${optionId}`,
      input,
    ),
  );
}

export async function deleteConfigOption(
  serviceId: string,
  groupId: string,
  optionId: string,
): Promise<void> {
  unwrap(
    await apiClient.delete(
      `/services/${serviceId}/config/groups/${groupId}/options/${optionId}`,
    ),
  );
}

export async function reorderConfigOptions(
  serviceId: string,
  groupId: string,
  optionIds: string[],
): Promise<ConfigGroup> {
  return unwrap<ConfigGroup>(
    await apiClient.patch(
      `/services/${serviceId}/config/groups/${groupId}/options/order`,
      { optionIds },
    ),
  );
}

// ── Pricing ("Option A": base + selected option modifiers) ───────────────────────
/** Quote the price for a set of selected option ids. Throws ServiceApiError on
 *  invalid selections (e.g. a required group with no choice). */
export async function quoteServicePrice(
  serviceId: string,
  optionIds: string[],
): Promise<PriceQuote> {
  return unwrap<PriceQuote>(
    await apiClient.post(`/services/${serviceId}/config/price`, { optionIds }),
  );
}
