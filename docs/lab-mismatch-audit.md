# TaxiOS v0 Lab Mismatch Audit

Date: 2026-06-07

## Source Of Truth

- Visual source of truth: current authenticated TaxiOS.v2 main runtime at `http://localhost:3000/company-dashboard`.
- Structural source of truth: real TaxiOS.v2 Company Workspace and Dashboard source.
- Current lab target: `/` and `/actual`, both rendering `components/main-dashboard-harness.tsx`.

If the lab render differs from current main, the lab render is wrong.

## Current Harness

The lab now renders the real TaxiOS UI package instead of a hand-built dashboard clone:

- `CompanyWorkspaceShell` from `@taxios-v2/ui`
- `CompanyDashboardWorkspaceContent` from `@taxios-v2/ui`
- `@taxios-v2/ui/styles/globals.css`
- local static `CompanyDashboardCopy`
- local static `CompanyDashboardData`
- local no-op callbacks

This removes the main source of previous mismatch: manually interpreted v0-style markup.

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

- Replaced the hand-built dashboard clone with a real `@taxios-v2/ui` component harness.
- Added the local `@taxios-v2/ui` file dependency.
- Added a Tailwind v4 CSS entry that imports real TaxiOS UI CSS and scans the real UI source.
- Replaced `/` and `/actual` with the real harness.
- Preserved static Smoke Company data and no-op callbacks only.
- Updated `README_START_HERE.md` so v0 must not replace the real UI imports with invented components.

## Remaining Known Limitations

- The lab is static and does not authenticate.
- It cannot fetch the live Convex runtime state.
- Current main can only be visually compared in an authenticated browser session.
- Pixel identity now depends primarily on matching static data, viewport, browser zoom, and the local UI package version.
- v0 must use `/compare` to reduce remaining visible mismatch, not redesign.
