# TaxiOS v0 Lab - Start Here

This repository is a standalone static mirror lab for v0.

It exists so v0 can understand and safely work against the current TaxiOS Company Dashboard without editing the production TaxiOS monorepo.

## Strict Rules For v0

1. Read this file first.
2. The current TaxiOS.v2 main runtime at `/company-dashboard` is the visual source of truth.
3. The real TaxiOS.v2 Company Workspace and Dashboard component source is the structural source of truth.
4. `app/page.tsx`, `/actual`, and `components/storybook-dashboard-mirror.tsx` are only the current static reconstruction target.
5. If the lab differs from current main, the lab is wrong.
6. Do not redesign.
7. Do not improve.
8. Do not premium-polish.
9. First match current main pixel-by-pixel as closely as possible.
10. List mismatches before fixing.
11. Fix only mismatches.

## Source Of Truth Order

1. Current authenticated TaxiOS.v2 main runtime: `http://localhost:3000/company-dashboard`.
2. Real TaxiOS.v2 source:
   - `apps/web/app/(company-workspace)/layout.tsx`
   - `apps/web/app/(company-workspace)/company-dashboard/page.tsx`
   - `packages/ui/src/components/taxios/company-workspace/*`
   - `packages/ui/src/components/taxios/dashboard/*`
   - `packages/ui/src/styles/globals.css`
3. Current main screenshots captured from the authenticated browser session.
4. This lab's static files.
5. Older Storybook screenshots in `public/reference` are historical references only unless explicitly refreshed from current main.

## Current Goal

Reconstruct the current TaxiOS Company Dashboard as closely as possible:

- Smoke Company HQ workspace
- floating sidebar
- dark `Neue Buchung` action in the sidebar
- topbar with breadcrumb, centered search, notification, and user avatar
- greeting: `Guten Morgen, Team.`
- Fastbooking hero
- saved route cards for `test 2`, `Linkstraße 5`, and `Berlin Central Office`
- no invented orange booking CTAs inside saved route cards
- `Nächste Fahrten` table with dark header rail
- compact Live Feed with `Company rides loaded`
- TaxiOS orange usage discipline
- compact operational density

## Forbidden In This Lab

- no Convex
- no Clerk
- no backend imports
- no production runtime dependencies
- no real secrets
- no business logic
- no route, role, permission, or payload changes
- no redesign
- no premium polish
- no generic shadcn defaults

## Files v0 Should Inspect

- `README_START_HERE.md` - rules and workflow
- `docs/lab-mismatch-audit.md` - known mismatch audit
- `app/page.tsx` - current Company Dashboard reconstruction target
- `app/actual/page.tsx` - current rendered reconstruction
- `app/reference/page.tsx` - historical screenshot page
- `app/compare/page.tsx` - local side-by-side mismatch inspection page
- `styles/taxis-tokens.css` - local TaxiOS visual tokens
- `styles/globals.css` - layout and reconstruction styles
- `data/company-dashboard-data.ts` - static mock data copied from the current main runtime shape
- `components/storybook-dashboard-mirror.tsx` - static dashboard clone

## Required v0 Workflow

Before editing code, v0 must open `/compare` and answer:

1. Is the left side current TaxiOS main or only a historical screenshot?
2. What does the current lab already match?
3. What exact visible mismatches remain?
4. Which mismatch will be fixed first?

Only then may v0 make a small edit.

## Premium Polish Gate

Premium polish is not allowed until the reconstruction is very close to current main.

Do not make the lab look better than main. Make it match main first.

When reconstruction is close, ask for explicit approval before changing:

- surface values
- shadows
- radius scale
- spacing rhythm
- typography hierarchy
- status color values
- orange usage
- dashboard layout

## Orange Discipline

TaxiOS orange is reserved for:

- primary booking actions
- live pulse
- route destination marker
- destination arrow
- small active navigation accent

Orange must not be used as a generic status color, generic border, generic background, or decoration.
