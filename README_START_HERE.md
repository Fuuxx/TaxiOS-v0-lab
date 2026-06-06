# TaxiOS v0 Lab - Start Here

This repository is a standalone reconstruction lab for v0.

It exists so v0 can understand the current TaxiOS Company Dashboard without access to the production TaxiOS monorepo.

## Strict Rules For v0

1. Read this file first.
2. Treat `app/page.tsx` as the runnable baseline.
3. Treat `styles/taxis-tokens.css` as the visual source of truth.
4. Treat `public/reference` screenshots as visual comparison.
5. Do not redesign.
6. Do not improve.
7. First match the current reference.
8. List mismatches before fixing.
9. Fix only mismatches.
10. Premium polish is forbidden until reconstruction is close.

## Current Goal

Reconstruct the current TaxiOS Company Dashboard as closely as possible:

- booking-first Company Dashboard
- floating sidebar
- personal greeting
- Fastbooking hero
- saved route cards
- Neue Route form
- Nächste Fahrten table
- Live Feed
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
- no premium polish yet

## Files v0 Should Inspect

- `README_START_HERE.md` - rules and workflow
- `app/page.tsx` - runnable Company Dashboard baseline
- `app/reference/page.tsx` - screenshot comparison page
- `styles/taxis-tokens.css` - local TaxiOS visual tokens
- `styles/globals.css` - layout and reconstruction styles
- `data/company-dashboard-data.ts` - static mock data copied from the TaxiOS Storybook shape
- `components/*` - local UI primitives and composed parts
- `public/reference/*` - current Storybook screenshot references

## Required v0 Workflow

Before editing code, v0 must answer:

1. Which screenshot(s) did you compare against?
2. What does the current lab already match?
3. What exact mismatches remain?
4. Which mismatch will you fix first?

Only then may v0 make a small edit.

## Premium Polish Gate

Premium polish is not allowed until the reconstruction is close to the current Storybook reference.

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
- small active navigation accent

Orange must not be used as a generic status color, generic border, generic background, or decoration.
