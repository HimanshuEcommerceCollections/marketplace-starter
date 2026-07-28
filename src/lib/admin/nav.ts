import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Users,
  DollarSign,
  Settings,
  Building2,
  MapPin,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Inquiries", href: "/admin/corporate-inquiries", icon: Building2 },
  { label: "Services", href: "/admin/services", icon: Sparkles },
  // Areas + their ZIP codes. Sits under Services because a service's coverage is
  // authored on the service itself; this section manages the geography it draws on.
  { label: "Coverage", href: "/admin/coverage", icon: MapPin },
  { label: "Professionals", href: "/admin/professionals", icon: Users },
  { label: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
