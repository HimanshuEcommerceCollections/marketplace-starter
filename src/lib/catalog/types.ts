import { z } from "zod";

export const ChoiceSchema = z.object({ id: z.string(), label: z.string() });

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
  icon: z.string().optional(), // lucide icon name for cards
  // Optional: card links to /services/<landing_slug> instead of /services/<id>.
  // Lets one service's card open another service's landing page (data-driven).
  landing_slug: z.string().optional(),
  coming_soon: z.boolean().default(false),
  image: z.string().optional(),
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
