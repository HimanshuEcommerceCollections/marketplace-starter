import type { Appearance } from "@stripe/stripe-js";

/**
 * Map the warm Elevate design tokens onto Stripe's Appearance API so the hosted
 * Payment Element visually matches the rest of the page. Stripe renders in an
 * iframe that cannot read our CSS variables, so we resolve the tokens at runtime
 * (from :root, which carries the active [data-brand]) and pass concrete values.
 *
 * Literal color/px fallbacks live here (under src/styles/, the sanctioned home
 * for raw values) rather than in a component, keeping the token-lint gate happy.
 * Falls back to Stripe's default theme during SSR (no `window`).
 */
export function buildStripeAppearance(): Appearance {
  if (typeof window === "undefined") return { theme: "stripe" };
  const s = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) =>
    s.getPropertyValue(name).trim() || fallback;

  return {
    theme: "stripe",
    variables: {
      colorPrimary: read("--highlight", "oklch(0.63 0.135 47)"),
      colorBackground: read("--card", "oklch(1 0 0)"),
      colorText: read("--foreground", "oklch(0.255 0.012 65)"),
      colorTextSecondary: read("--muted-foreground", "oklch(0.48 0.018 70)"),
      colorDanger: read("--destructive", "oklch(0.577 0.245 27.325)"),
      borderRadius: read("--radius", "0.875rem"),
      spacingUnit: "4px",
    },
    rules: {
      ".Input": { boxShadow: "none" },
      ".Input:focus": {
        boxShadow: "0 0 0 2px var(--colorPrimary)",
        borderColor: "var(--colorPrimary)",
      },
      ".Tab": { boxShadow: "none" },
      ".Tab:hover": { borderColor: "var(--colorPrimary)" },
      ".Tab--selected": {
        borderColor: "var(--colorPrimary)",
        boxShadow: "0 0 0 1px var(--colorPrimary)",
      },
    },
  };
}
