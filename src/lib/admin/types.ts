export type BookingStatus = "pending" | "active" | "completed" | "cancelled";
export type ServiceStatus = "active" | "inactive";

/** Category lifecycle (mirrors the server `CategoryStatus` enum). */
export type CategoryStatus = "DRAFT" | "ACTIVE" | "COMING_SOON" | "INACTIVE";

/** A category as returned by the server API (camelCase; basePrice in cents). */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  status: CategoryStatus;
  coverImagePath: string;
  iconPath: string;
  servicesCount?: number; // present on list + details
  createdAt: string;
  updatedAt: string;
}

/** Details response — `servicesCount` is always present. */
export interface CategoryDetails extends Category {
  servicesCount: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CategoryListResult {
  items: Category[];
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

export interface AdminService {
  id: string;
  name: string;
  category: string;
  basePrice: string;
  maxPrice?: string;
  duration: string;
  status: ServiceStatus;
  description?: string;
  availability?: { weekdays: boolean; weekends: boolean; sameDay: boolean };
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
