import {
  HandHeart,
  HeartPulse,
  Flower2,
  Dumbbell,
  Sparkles,
  Salad,
  Speech,
  Compass,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

/** Per-service icon keyed by catalog slug; falls back to a calendar. */
const SERVICE_ICON: Record<string, LucideIcon> = {
  massage: HandHeart,
  "physical-therapy": HeartPulse,
  yoga: Flower2,
  "personal-training": Dumbbell,
  beauty: Sparkles,
  "nutrition-coaching": Salad,
  "life-coaching": Compass,
  "speech-therapy": Speech,
};

export function serviceIcon(slug: string): LucideIcon {
  return SERVICE_ICON[slug] ?? CalendarDays;
}
