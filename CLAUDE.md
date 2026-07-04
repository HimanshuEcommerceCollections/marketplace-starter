# CLAUDE.md — Fable Portfolio Starter (agent guide)

This is the **master starter repository** for 4 separate Fable Portfolio marketplace
websites (Elevate Health & Wellness, Apex Total Home Services, Events & Media,
Education & Creative). It is **INTERNAL DRAFT / demo-grade** — not production.

## Golden rules (non-negotiable)

1. **Token-only styling.** No hardcoded colors, spacing, or typography. All design
   values come from CSS variables in `src/styles/tokens.css` exposed via Tailwind v4
   `@theme inline`. Use semantic utilities (`bg-primary`, `text-muted-foreground`,
   `rounded-lg`). Literals are allowed **only** in `src/styles/**` and
   `brands/*/theme.css`. Enforced by ESLint + `npm run lint:tokens`.
2. **Proof is illustrative only.** Testimonials, statistics, and prices are
   placeholder INTERNAL DRAFT content — never present them as real customer claims,
   and never fabricate specific ones.
3. **Footer carries `INTERNAL DRAFT`.** Do not remove the marker in
   `src/components/layout/footer.tsx`.
4. **Global draft banner.** The "DRAFT EXPERIENCE" banner is rendered by the
   Navbar (`src/components/layout/navbar.tsx`), so it appears on every page.
5. **Forms are stub-only.** Validate → emit analytics → return a fake `request_id`.
   No `fetch`/backend calls. The real backend would plug in at
   `src/lib/forms/stub-submit.ts`.
6. **Secrets via env vars.** Only `NEXT_PUBLIC_*` values are public; never commit
   secrets, never inline them. `.env*` is gitignored (except `.env.example`).
7. **No fabricated testimonials or statistics.** Use only illustrative placeholders.
8. **Plan before code. Core Flow first.** Build browse → configure → book → success
   before marketing polish.

## Reusability tiers

- **Reusable core (identical across brands):** everything in `src/` — `components/`,
  `lib/`, `app/` route shells, `src/styles/tokens.css` (the token *system*),
  `types/`, `hooks/`. Never name a brand here.
- **Brand-specific layer:** `brands/<slug>/` — `brand.config.ts`, `content.config.ts`,
  `services.json`, `pricing.v1.json`, `theme.css` (token *values*), `metadata.ts`,
  `assets/`.
- **Shared shell + override hook:** `src/app/layout.tsx` (emits `data-brand`),
  `src/lib/brand/*`, `tokens.css` (names reusable, `[data-brand]` values per brand).

## Brand mechanism

`NEXT_PUBLIC_BRAND` (`elevate|apex|events|education`) → `getActiveBrandId()` →
`loadBrand()` returns `{ config, content, services, pricing }`. Root layout sets
`<html data-brand={slug}>`; `brands/<slug>/theme.css` scopes token values under
`[data-brand="<slug>"]`. Components read config/content via props or the
`useBrand()` context — they never embed brand copy or colors.

## Contracts (do not break)

- `booking_request` — `src/lib/booking/contract.ts` (exactly 12 fields).
- Analytics — `src/lib/analytics/events.ts` (exactly 8 events).
- Pricing — `src/lib/pricing/{types,engine}.ts` consuming `pricing.v1.json`.
- Catalog — `src/lib/catalog/types.ts` (schema of `services.json`).
- Feature flags — `src/lib/flags/*`.

`config_option.id` MUST match a pricing `modifier.id`; select choice ids must match
modifier option ids; `service.id === service.pricing_ref === pricing.services key`.
`npm run brand:check` verifies all of this.

## Adding a component

Accept brand data via props/`useBrand()`, be mobile-first, accessible (use Radix via
`src/components/ui/*`), and token-styled. Default to a Server Component; add
`"use client"` only for interactivity.

## Commands

- `npm run dev` — run (set `NEXT_PUBLIC_BRAND` to switch brand)
- `npm run typecheck` / `npm run lint` / `npm run lint:tokens` / `npm run brand:check`
- `npm run check` — all of the above
- `npm run build` — production build

## PR / done checklist

- [ ] Token-clean (no new literals outside `src/styles` / `brands/*/theme.css`)
- [ ] Proof is illustrative only; footer still says `INTERNAL DRAFT`
- [ ] No secrets; forms still stub-only
- [ ] Contracts intact; `npm run check` passes for ≥1 brand
- [ ] Works at mobile width; keyboard-accessible
