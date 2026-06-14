import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck,
  Handshake,
  ClipboardCheck,
  HandHelping,
  Dumbbell,
  Flower2,
  Sparkles,
  Salad,
  Compass,
  Activity,
  MessageCircle,
  HeartPulse,
  CalendarCheck,
  Headphones,
  Star,
  BadgeCheck,
} from "lucide-react";

/** Maps content/services icon name strings to Lucide components (data-driven). */
const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  Handshake,
  ClipboardCheck,
  HandHelping,
  Dumbbell,
  Flower2,
  Sparkles,
  Salad,
  Compass,
  Activity,
  MessageCircle,
  HeartPulse,
  CalendarCheck,
  Headphones,
  Star,
  BadgeCheck,
};

export function getIcon(name?: string): LucideIcon {
  return (name && ICONS[name]) || Sparkles;
}
