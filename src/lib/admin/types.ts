export type BookingStatus = "pending" | "active" | "completed" | "cancelled";

/** Service lifecycle (mirrors the server `ServiceStatus` enum). */
export type ServiceStatus = "DRAFT" | "ACTIVE" | "COMING_SOON" | "INACTIVE";

/** A bookable service as returned by the server API (camelCase; basePrice in cents). */
export interface AdminService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  durationMinutes: number;
  status: ServiceStatus;
  iconPath: string; // resolved SVG icon URL (config-managed, with fallback)
  coverImages: string[]; // ordered cover image URLs; first is the default
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminServiceListResult {
  items: AdminService[];
  meta: PaginationMeta;
}

export interface AdminBooking {
  id: string;
  client: string;
  clientFullName?: string;
  clientEmail?: string;
  service: string;
  serviceDetail?: string;
  date: string;
  time?: string;
  total: string;
  professional: string;
  professionalMatched?: boolean;
  status: BookingStatus;
  stage?: string;
  priceOverride?: string;
  location?: string;
}

export interface Kpi {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "warning" | "success";
}

export interface ServicesOverviewItem {
  name: string;
  active: number;
  pending: number;
}

export interface AdminUser {
  name: string;
  role: string;
  initials: string;
}
