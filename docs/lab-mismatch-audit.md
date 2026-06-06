# TaxiOS v0 Lab Mismatch Audit

Date: 2026-06-07

## Source Of Truth

- Visual source of truth: current authenticated TaxiOS.v2 main runtime at `http://localhost:3000/company-dashboard`.
- Structural source of truth: real TaxiOS.v2 Company Workspace and Dashboard source.
- Reconstruction target: the static lab render at `/` and `/actual`.

If the lab render differs from current main, the lab render is wrong.

## Why The Previous Lab Was Wrong

The previous lab matched an older Storybook/demo target and then drifted into a v0-style interpretation. It did not match the current main runtime that the user sees locally.

Major wrong assumptions:

1. It used `Your Companyname` / `Katerina` demo data instead of `Smoke Company HQ` / `Team`.
2. It showed a permanently visible `Neue Route` form in the Fastbooking hero.
3. It omitted the dark sidebar `Neue Buchung` action.
4. It rendered orange or generic CTA concepts inside saved Fastbooking cards in earlier iterations.
5. It used a light/table-chip table language instead of the current main dark table header and vehicle medallion rows.
6. It used a multi-event live feed instead of the current compact `Company rides loaded` read-model feed.

## Current Main Runtime Details To Match

1. **Sidebar**
   - Floating porcelain sidebar.
   - TaxiOS logo at top.
   - Dark `Neue Buchung` button below logo.
   - Navigation: Dashboard, Buchungen, Organisation, Berichte, Finanzen.
   - Active Dashboard row has soft white surface and orange left rail.
   - Footer has Einstellungen and `Smoke Company HQ` account card.

2. **Topbar**
   - Floating full-width topbar to the right of the sidebar.
   - Breadcrumb: `Smoke Company HQ > Dashboard`.
   - Centered rounded search.
   - Notification icon and `AA` user avatar on the right.

3. **Greeting**
   - `Heute - Sonntag, 07. Juni`.
   - `Guten Morgen, Team.`
   - Copy: `Hier ist der Überblick über eure heutige Mobilität.`

4. **Fastbooking Hero**
   - Large porcelain hero surface.
   - Section title `Fastbooking`.
   - Dark circular plus action at top right.
   - Three saved route cards in a row:
     - `test 2`: `test 1` -> `test 2`
     - `Linkstraße 5`: `Werrastraße 36` -> `Linkstraße 5`
     - `Berlin Central Office`: `Leipziger Platz 1` -> `Berlin Central Office`
   - No persistent `Neue Route` form in the default hero view.
   - No orange `Buchen` buttons inside saved route cards.
   - Orange appears only on destination dots.

5. **Nächste Fahrten Table**
   - Dark header rail.
   - Separated rounded rows.
   - Data typography for times and booking IDs.
   - Route column shows `Von`/`Nach` rail and orange destination dot.
   - Status/action cell uses vehicle medallions, not large text CTAs.

6. **Live Feed**
   - Compact right rail.
   - Title `Live Feed` and dark `Live` badge.
   - `1 Ereignisse`.
   - Orange update pulse.
   - One item: `Company rides loaded`, `6 active bookings`, `Read model`.

## Repairs Applied In This Pass

- Replaced the static lab data with current main visible Smoke Company data.
- Rebuilt the dashboard component around the current main runtime structure.
- Restored sidebar `Neue Buchung`.
- Removed the default `Neue Route` form from the Fastbooking hero.
- Kept saved route card actions dark/neutral, not orange.
- Reworked table rows toward the current dark-header/vehicle-medallion layout.
- Reworked Live Feed toward the compact current main read-model feed.
- Updated `README_START_HERE.md` so v0 treats current main as truth, not older Storybook screenshots.

## Remaining Known Limitations

- The lab is still a static clone. It does not import production CSS bundles, Convex, Clerk, or runtime layout state.
- Current main depends on authenticated runtime data. The lab freezes that visible data statically.
- True pixel identity requires one of:
  - copying the exact rendered DOM/CSS snapshot from an authenticated browser session, or
  - extracting the relevant production UI components into a dependency-free static harness.
- v0 must use `/compare` to reduce remaining visual mismatch, not redesign.
