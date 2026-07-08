import { z } from "zod";

export const ChoiceSchema = z.object({
  id: z.string(),
  label: z.string(),
  // Optional editorial blurb for the choice. Seeded into
  // ServiceConfigOption.description so the API/marketing pages can render it.
  description: z.string().optional(),
});

export const ConfigOptionSchema = z.object({
  id: z.string(), // MUST match a modifier id in pricing.v1.json
  label: z.string(),
  input: z.enum(["select", "multiselect", "quantity", "toggle"]),
  required: z.boolean().default(false),
  choices: z.array(ChoiceSchema).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

export const CategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().default(""),
});

export const ServiceSchema = z.object({
  id: z.string(), // URL slug
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  category: z.string(), // -> CategorySchema.id
  service_type: z.string(),
  pricing_ref: z.string(), // -> pricing.v1.json services key
  currency: z.string().length(3),
  from_price: z.number().optional(), // minor units, display only
  // Minimum booking value in minor units. When set, the booking wizard blocks
  // advancing past Configure until the DRAFT total reaches this floor, and the
  // displayed "From" price never reads below it (e.g. Beauty's $75 minimum).
  min_booking: z.number().optional(),
  icon: z.string().optional(), // lucide icon name (legacy; superseded by icon_path)
  // Root-relative SVG icon URL (served from client public/), e.g.
  // "/services/massage/icon.svg". Mirrors the API's `iconPath` so the static
  // catalog fallback renders the same icon as the live API.
  icon_path: z.string().optional(),
  // Optional: card links to /services/<landing_slug> instead of /services/<id>.
  // Lets one service's card open another service's landing page (data-driven).
  landing_slug: z.string().optional(),
  coming_soon: z.boolean().default(false),
  // Editorial flags for the services showcase grid: a featured card spans two
  // columns, and tag_label renders as its corner ribbon (e.g. "Most Popular").
  featured: z.boolean().default(false),
  tag_label: z.string().optional(),
  // Static sub-style pills shown on the showcase card (display only — the
  // bookable variants remain config_options; keep these in sync by hand).
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  // Ordered cover image URLs (root-relative, served from client public/); first
  // is the default card image. Mirrors the API's `coverImages` so the static
  // catalog fallback shows the same photography when the API is unreachable.
  cover_images: z.array(z.string()).default([]),
  config_options: z.array(ConfigOptionSchema).default([]),
  location_modes: z
    .array(z.enum(["onsite", "remote", "hybrid"]))
    .default(["onsite"]),
  badges: z.array(z.string()).default([]),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
});

export const ServiceCatalogSchema = z.object({
  brand: z.string(),
  note: z.string().optional(),
  categories: z.array(CategorySchema).default([]),
  services: z.array(ServiceSchema),
});

export type Choice = z.infer<typeof ChoiceSchema>;
export type ConfigOption = z.infer<typeof ConfigOptionSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type ServiceCatalog = z.infer<typeof ServiceCatalogSchema>;
