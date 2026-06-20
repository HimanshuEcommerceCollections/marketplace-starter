import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Users,
  DollarSign,
  Settings,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Services", href: "/admin/services", icon: Sparkles },
  { label: "Professionals", href: "/admin/professionals", icon: Users },
  { label: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
