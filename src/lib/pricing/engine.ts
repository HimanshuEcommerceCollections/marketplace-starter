import type {
  Configuration,
  DisplayedPrice,
  LineItem,
  Money,
} from "@/lib/booking/contract";
import type { PricingTable } from "./types";
import { addMoney, scaleMoney, zeroMoney, negateMoney } from "@/lib/money";

/**
 * Pure, deterministic pricing: (pricing.v1.json, configuration) -> DisplayedPrice.
 * Integer minor-unit math throughout. No fabricated numbers — sample tables ship
 * clearly-labeled placeholder amounts.
 */
export function computePrice(
  table: PricingTable,
  config: Configuration,
): DisplayedPrice {
  const currency = table.currency;
  const sp = table.services[config.service_id];

  if (!sp) {
    return {
      total: zeroMoney(currency),
      subtotal: zeroMoney(currency),
      line_items: [],
      pricing_version: table.version,
      is_estimate: true,
    };
  }

  const lines: LineItem[] = [];
  let subtotal: Money = scaleMoney(sp.base_price, config.quantity);
  lines.push({ label: "Base (Sample)", amount: subtotal, kind: "base" });

  for (const m of sp.modifiers) {
    const sel = config.selections[m.id];
    if (sel == null || sel === false) continue;
    const ids = Array.isArray(sel) ? sel : [sel];
    for (const raw of ids) {
      const id = String(raw);
      const opt = m.options?.find((o) => o.id === id);
      const delta = opt?.delta ?? m.delta;
      if (!delta) continue;
      const amt =
        m.applies === "per_unit" ? scaleMoney(delta, config.quantity) : delta;
      subtotal = addMoney(subtotal, amt);
      lines.push({
        label: opt?.label ?? m.label,
        amount: amt,
        kind: m.options ? "option" : "modifier",
      });
    }
  }

  let total = subtotal;
  for (const f of sp.fees) {
    const base: Money =
      f.calc === "percent"
        ? { amount: Math.round((subtotal.amount * f.value) / 100), currency }
        : { amount: f.value, currency };
    const amt = f.kind === "discount" ? negateMoney(base) : base;
    total = addMoney(total, amt);
    lines.push({ label: f.label, amount: amt, kind: f.kind });
  }

  return {
    total,
    subtotal,
    line_items: lines,
    pricing_version: table.version,
    is_estimate: true,
  };
}
