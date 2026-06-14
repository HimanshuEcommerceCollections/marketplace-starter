/** Feature flag registry — reusable across all brands. */
export const FLAG_KEYS = [
  "demoBanner", // global demo / INTERNAL DRAFT banner
  "showSampleLabels", // force [Sample] labels on proof (RULE: always on)
  "bookingWizard", // multi-step booking flow
  "pricingEngine", // show computed prices vs "Contact us"
  "proApplyForm", // "become a pro" application form
  "waitlistForm", // waitlist capture form
  "testimonials", // sample testimonials section
  "faqJsonLd", // emit FAQPage JSON-LD
  "analyticsDebug", // verbose analytics logging
  "maintenanceMode", // soft lock; disables submit stubs
] as const;

export type FlagKey = (typeof FLAG_KEYS)[number];

export interface FlagDefinition {
  key: FlagKey;
  description: string;
  default: boolean;
}

export const FLAG_REGISTRY: Record<FlagKey, FlagDefinition> = {
  demoBanner: {
    key: "demoBanner",
    description: "Global demo / internal-draft banner",
    default: true,
  },
  showSampleLabels: {
    key: "showSampleLabels",
    description: "Force [Sample] labels on all proof elements",
    default: true,
  },
  bookingWizard: {
    key: "bookingWizard",
    description: "Multi-step booking wizard (Core Flow)",
    default: true,
  },
  pricingEngine: {
    key: "pricingEngine",
    description: "Compute & show prices via the pricing engine",
    default: true,
  },
  proApplyForm: {
    key: "proApplyForm",
    description: "Pro application form",
    default: true,
  },
  waitlistForm: {
    key: "waitlistForm",
    description: "Waitlist capture form",
    default: true,
  },
  testimonials: {
    key: "testimonials",
    description: "Sample testimonials section",
    default: true,
  },
  faqJsonLd: {
    key: "faqJsonLd",
    description: "Emit FAQPage JSON-LD",
    default: true,
  },
  analyticsDebug: {
    key: "analyticsDebug",
    description: "Verbose analytics logging",
    default: false,
  },
  maintenanceMode: {
    key: "maintenanceMode",
    description: "Soft maintenance lock; disables submit stubs",
    default: false,
  },
};

export type FlagState = Record<FlagKey, boolean>;
