# Fable Portfolio Starter

> **INTERNAL DRAFT — demo only.** All content, pricing, and proof are illustrative
> placeholders. Forms do not submit anywhere.

A single Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui starter that renders as
any of **4 marketplace brands** from one codebase:

| Brand | `NEXT_PUBLIC_BRAND` |
| --- | --- |
| Elevate Health & Wellness | `elevate` |
| Apex Total Home Services | `apex` |
| Events & Media | `events` |
| Education & Creative | `education` |

## Prerequisites

- Node.js ≥ 20
- npm (or pnpm/yarn)

## Install & run

```bash
npm install
cp .env.example .env.local        # then set NEXT_PUBLIC_BRAND
npm run dev
```

### Switch brand

The active brand is selected by `NEXT_PUBLIC_BRAND`:

```bash
NEXT_PUBLIC_BRAND=apex npm run dev
NEXT_PUBLIC_BRAND=events npm run dev
```

Missing → defaults to `elevate` (with a warning). Invalid → the build throws.

## Project structure

```
brands/<slug>/      Brand-specific layer (config, content, services.json,
                    pricing.v1.json, theme.css token values, metadata, assets)
src/app/            App Router routes (home, services, booking flow, marketing)
src/components/     Reusable component library (ui, layout, marketing, marketplace, booking)
src/lib/            Engines & contracts (brand, flags, analytics, booking, pricing, catalog, seo, forms)
src/styles/         tokens.css (token contract) + globals.css
scripts/            lint-tokens + brand-check gates
```

See [CLAUDE.md](CLAUDE.md) for the reusability tiers and golden rules, and
[REVIVAL.md](REVIVAL.md) for cloning a brand and the stub-vs-real map.

## Theming (token-only)

All color/spacing/typography are CSS variables in `src/styles/tokens.css`, exposed to
Tailwind via `@theme inline`. Each brand overrides only the *values* under
`[data-brand="<slug>"]` in `brands/<slug>/theme.css`. No component contains a literal
color — enforced by `npm run lint:tokens` and ESLint.

## Environment variables

| Variable | Public | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BRAND` | yes | Active brand slug |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical URL / sitemap / JSON-LD |
| `NEXT_PUBLIC_DEMO_MODE` | yes | Forces the demo banner on (default) |

Secrets must **not** use the `NEXT_PUBLIC_` prefix and must never be committed.

## Scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run lint:tokens  # no hardcoded color/px/arbitrary values
npm run brand:check  # validate all brand folders
npm run check        # all of the above
```

## Deploy to Vercel

Create **one Vercel project per brand repo**. Framework auto-detected (Next.js).
Set `NEXT_PUBLIC_BRAND` and `NEXT_PUBLIC_SITE_URL` per project, point a custom
domain, deploy. No backend/DB required — data is static and forms are stubs.

## Add a new brand

See the runbook in [REVIVAL.md](REVIVAL.md#create-brand-5). In short: copy
`brands/elevate` → `brands/<new>`, edit the config/content/data/theme, add the slug
to `src/lib/brand/registry.ts`, and deploy.
