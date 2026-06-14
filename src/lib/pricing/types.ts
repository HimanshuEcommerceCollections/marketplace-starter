import { z } from "zod";
import { MoneySchema } from "@/lib/booking/contract.schema";

export const ModifierType = z.enum([
  "select",
  "multiselect",
  "quantity",
  "toggle",
]);

export const ModifierOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  delta: MoneySchema,
});

export const ModifierSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: ModifierType,
  applies: z.enum(["per_unit", "flat"]).default("flat"),
  options: z.array(ModifierOptionSchema).optional(),
  delta: MoneySchema.optional(),
});

export const FeeSchema = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum(["fee", "discount"]).default("fee"),
  calc: z.enum(["flat", "percent"]),
  value: z.number(),
});

export const ServicePricingSchema = z.object({
  base_price: MoneySchema,
  modifiers: z.array(ModifierSchema).default([]),
  fees: z.array(FeeSchema).default([]),
});

/** Schema of brands/<slug>/pricing.v1.json. */
export const PricingTableSchema = z.object({
  version: z.string(),
  currency: z.string().length(3),
  note: z.string().optional(),
  services: z.record(z.string(), ServicePricingSchema),
});

export type Modifier = z.infer<typeof ModifierSchema>;
export type ModifierOption = z.infer<typeof ModifierOptionSchema>;
export type Fee = z.infer<typeof FeeSchema>;
export type ServicePricing = z.infer<typeof ServicePricingSchema>;
export type PricingTable = z.infer<typeof PricingTableSchema>;
