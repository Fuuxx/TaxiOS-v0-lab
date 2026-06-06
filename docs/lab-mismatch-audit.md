# TaxiOS v0 Lab Mismatch Audit

Date: 2026-06-07

## Source Of Truth

- Visual source of truth: `public/reference/company-dashboard-screen.png` and related Storybook screenshots.
- Structural source of truth: real TaxiOS.v2 Storybook/component source in `packages/ui/src/components/taxios/dashboard/*` and `packages/ui/src/components/taxios/company-workspace/*`.
- Reconstruction target: the lab render at `/` and `/actual`.

If the lab render differs from the screenshots or real Storybook component structure, the lab render is wrong.

## Visible Mismatches Found Before Repair

1. **Fastbooking card footer/action treatment**
   - Lab had direct orange `Buchen` buttons inside every saved Fastbooking card.
   - Real Storybook card footer is a member/avatar dock with a dark circular plus/member-picker action. Booking is not exposed as a persistent orange CTA on each saved card.

2. **Orange button usage**
   - Lab overused orange for routine saved-card actions.
   - TaxiOS orange is reserved for active accent, primary allowed action, destination route marker, destination arrow, and live pulse.

3. **Card proportions and empty space**
   - Lab cards were shorter and filled like generic SaaS cards.
   - Real Fastbooking cards are tall `304px` route cards with a clear upper route body and a docked footer.

4. **Sidebar width/radius/shadow/active state**
   - Lab sidebar was too narrow and had a generic sidebar rhythm.
   - Real source uses a wider floating workspace shell, rounded surface, subtle glass/sheen, and a thin orange active rail.

5. **Topbar/search positioning**
   - Lab topbar was compact and generic.
   - Real Storybook topbar is part of the workspace shell with breadcrumb, large rounded search, and notification pill.

6. **Greeting typography and spacing**
   - Lab greeting was too small and close to the topbar.
   - Reference has a large page title with strong/subtle split between greeting and user name, plus generous vertical air before Fastbooking.

7. **Fastbooking hero spacing**
   - Lab Fastbooking section was too compressed and used a header CTA treatment that read like a new design.
   - Real Fastbooking is the hero surface with large section title and dark circular add route toggle.

8. **Saved route card density**
   - Lab used generic route cards with CTA-heavy footer.
   - Real cards use route labels, count chip, vertical route rail, destination orange dot, avatar stack, and dark member plus.

9. **Neue Route form proportions**
   - Lab showed a permanently visible right-side form because the first reconstruction copied a v0 layout pattern.
   - Real source has an add-stage/pane model. The lab keeps the pane as a static reference only when needed, but it must not dominate saved cards.

10. **Nächste Fahrten table rhythm**
    - Lab table was too flat and generic.
    - Real table uses separated rows, compact data typography, light rail header, route origin/destination hierarchy, and compact status treatment.

11. **Live Feed proportions**
    - Lab feed rail was generic and too sparse.
    - Real feed card is a compact right rail with live badge, event count, update pulse, and small timeline rows.

12. **Status chip/avatar/route-dot treatment**
    - Lab mixed status and action language.
    - Real system uses dark identity avatars, status chips/dots for state, and orange only for destination/live/action accents.

## Repairs Applied In This Pass

- Replaced `app/page.tsx` with a static Storybook mirror component.
- Added `/actual` as the current reconstruction render.
- Added `/compare` to show reference screenshot and lab render side by side.
- Removed orange `Buchen` buttons from saved Fastbooking cards.
- Restored a member/avatar dock and dark circular member action in saved cards.
- Reworked Fastbooking cards toward the real 304px route-card structure.
- Reworked workspace shell proportions, topbar, hero spacing, table rhythm, and live feed rail toward the Storybook source.

## Remaining Known Limitations

- This is still a static lab and not a byte-for-byte import of the production Tailwind/CSS build.
- The lab intentionally avoids Convex, Clerk, routing logic, permission logic, and backend imports.
- v0 must continue using `/compare` to find and reduce remaining visual mismatch one small edit at a time.
