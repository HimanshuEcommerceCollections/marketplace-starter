/** Public contract re-exports — the stable surface components/pages import. */
export type {
  BrandId,
} from "@/lib/brand/registry";
export type {
  BrandConfig,
  BrandContent,
  NavItem,
  FooterColumn,
  FeatureItem,
  FaqItem,
  TestimonialItem,
} from "@/lib/brand/types";
export type {
  Money,
  LineItem,
  DisplayedPrice,
  Configuration,
  Contact,
  LocationPref,
  SchedulePreferences,
  BookingRequest,
} from "@/lib/booking/contract";
export type {
  BookingStatus,
  BookingSource,
  ContactMethod,
  TimeWindowKind,
  LocationMode,
  Flexibility,
} from "@/lib/booking/enums";
export type {
  Service,
  ServiceCatalog,
  Category,
  ConfigOption,
  Choice,
} from "@/lib/catalog/types";
export type {
  PricingTable,
  ServicePricing,
  Modifier,
  ModifierOption,
  Fee,
} from "@/lib/pricing/types";
export type {
  AnalyticsEventName,
  AnalyticsEventMap,
} from "@/lib/analytics/events";
export type { FlagKey, FlagState } from "@/lib/flags/registry";
