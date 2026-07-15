/**
 * Service coverage areas (Wake County towns) offered at signup.
 *
 * `area` is MULTI-VALUE — a customer may select several towns — so it is stored
 * and sent as a string[] of these values. The values MUST stay identical to the
 * server's `ServiceArea` Prisma enum (Server/prisma/schema.prisma); the labels
 * are display-only.
 */
export const AREA_VALUES = [
  "RALEIGH",
  "CARY",
  "APEX",
  "WAKE_FOREST",
  "MORRISVILLE",
  "GARNER",
  "HOLLY_SPRINGS",
  "FUQUAY_VARINA",
  "KNIGHTDALE",
  "WENDELL",
  "ZEBULON",
  "ROLESVILLE",
] as const;

export type AreaValue = (typeof AREA_VALUES)[number];

export const AREA_LABELS: Record<AreaValue, string> = {
  RALEIGH: "Raleigh",
  CARY: "Cary",
  APEX: "Apex",
  WAKE_FOREST: "Wake Forest",
  MORRISVILLE: "Morrisville",
  GARNER: "Garner",
  HOLLY_SPRINGS: "Holly Springs",
  FUQUAY_VARINA: "Fuquay-Varina",
  KNIGHTDALE: "Knightdale",
  WENDELL: "Wendell",
  ZEBULON: "Zebulon",
  ROLESVILLE: "Rolesville",
};

/** `{ value, label }` list for rendering the multi-select area control. */
export const AREA_OPTIONS: ReadonlyArray<{ value: AreaValue; label: string }> =
  AREA_VALUES.map((value) => ({ value, label: AREA_LABELS[value] }));
