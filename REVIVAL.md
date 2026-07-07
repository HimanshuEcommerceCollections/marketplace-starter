# REVIVAL.md

How to revive this starter into a working brand, what is real vs stubbed, and what
**must** be replaced before any production use.

## What this is

A **demo-grade master starter** for the Fable Portfolio marketplaces. It is
intentionally incomplete: no real backend, no payments, no auth, and all content,
pricing, and proof are illustrative placeholders. It exists to be
**cloned per brand** and built on.

## How to revive

1. Clone the repo (or "Use this template").
2. `npm install`
3. `cp .env.example .env.local` and set `NEXT_PUBLIC_BRAND` to one of
   `elevate | apex | events | education`.
4. `npm run dev` — the full Core Flow (browse → configure → book → success) works
   immediately on that brand's placeholder data.
5. `npm run check` to validate types, tokens, and brand data.

## <a id="create-brand-5"></a>Create brand #5 (runbook)

Standing up a new marketplace touches only `brands/<new>/` plus one registry line.

1. `cp -r brands/elevate brands/<new>`
2. Edit `brands/<new>/brand.config.ts` — `id`, `name`, `nav`, `footerColumns`, `org`,
   `serviceCategories`. (`id` must equal the folder name and theme scope.)
3. Edit `brands/<new>/content.config.ts` — hero/features/FAQ/CTA copy. Keep
   testimonials illustrative (never fabricate real customer claims).
4. Replace `brands/<new>/services.json` and `pricing.v1.json` (keep ids in sync:
   `service.id === service.pricing_ref === pricing.services key`; option ids match
   modifier ids).
5. Rename the block in `brands/<new>/theme.css` to `[data-brand="<new>"]` and set
   every required token (see `npm run brand:check`).
6. Add real `assets/` (logo, og-image, favicon) and point `metadata.ts` at them.
7. Register the slug: add `<new>` to `BRAND_IDS` in
   [`src/lib/brand/registry.ts`](src/lib/brand/registry.ts) and add an entry to the
   `REGISTRY` map in [`src/lib/brand/load.ts`](src/lib/brand/load.ts).
8. `NEXT_PUBLIC_BRAND=<new> npm run dev`, then `npm run brand:check`.
9. Deploy as its own Vercel project with `NEXT_PUBLIC_BRAND=<new>`.

You never open `src/components`, `src/app`, or `src/lib` business logic to add a brand.

## Stub vs real

| Area | Status in starter | Notes |
| --- | --- | --- |
| Forms (booking, pro-apply, waitlist) | **Stub** | Validate + log analytics + return fake `request_id`. No network. |
| Booking submission | **Stub** | `src/lib/forms/stub-submit.ts` + booking wizard. |
| Analytics | **Stub** | Console transport (`src/lib/analytics/transport.ts`); pluggable. |
| Pricing | **Sample** | `pricing.v1.json` holds placeholder amounts; engine is real & deterministic. |
| Testimonials / stats | **Sample** | Illustrative placeholders only. |
| Payments / auth / CMS / i18n | **None** | Out of scope; see "must replace". |

## Backend plug-in point

Replace the stub submit handlers in
[`src/lib/forms/stub-submit.ts`](src/lib/forms/stub-submit.ts) with real calls (read
endpoint URLs/keys from server-only env vars). The wizard assembles a full
`booking_request` (`src/lib/booking/contract.ts`) ready to POST.

## Must replace before production

- [ ] Wire a real booking/lead backend at the stub seam; add payments if needed.
- [ ] Swap the analytics console transport for a real provider (GA4 / PostHog / …).
- [ ] Replace illustrative proof with real, consented testimonials/stats (GDPR).
- [ ] Supply real brand colors/fonts (verify WCAG AA contrast) and load fonts via
      `next/font`; tokens reference families that must be provisioned.
- [ ] Verify pricing with finance; add tax/region logic if required.
- [ ] Provide real legal pages, contact details, metadata, and assets.
- [ ] Provision secrets in Vercel; never commit them.
- [ ] Run a full accessibility + performance audit.

## Known intentional gaps

No auth, no CMS, no i18n, no payments. `content.config.ts` is the intended swap seam
if marketers later need a CMS.
