# TaxiOS v0 — Storybook Context Pack

> This document is a **design-brief bridge** between the TaxiOS Storybook (visual source of truth) and the v0 registry lab blocks. When prompting v0 to polish or extend a lab block, paste the relevant sections of this document into the v0 chat.

---

## 1. Storybook Quick-Reference

Build Storybook locally from `packages/ui`:

```bash
pnpm ui:build-storybook
```

Static output is written to `packages/ui/storybook-static/`.

### Story URL Map (local)

When Storybook is running locally (`pnpm ui:storybook`), stories are addressable at:

| Category | Story | URL Path (when served) |
|---|---|---|
| **UI Primitives** | Button | `/?path=/story/taxios-ui-button--default` |
| | Badge | `/?path=/story/taxios-ui-badge--default` |
| **Workspace** | WorkspaceSurface | `/?path=/story/taxios-taxios-workspace-primitives--workspace-surface-story` |
| | WorkspaceInnerCard | `/?path=/story/taxios-taxios-workspace-primitives--workspace-inner-card-story` |
| | WorkspaceSectionHeader | `/?path=/story/taxios-taxios-workspace-primitives--workspace-section-header-story` |
| | Workspace status chips | `/?path=/story/taxios-taxios-workspace-primitives--workspace-status-chips-story` |
| | Operational table | `/?path=/story/taxios-taxios-workspace-table--operational-table` |
| | Entity cards | `/?path=/story/taxios-taxios-workspace-entity-card--entity-cards` |
| | StateView (empty) | `/?path=/story/taxios-taxios-workspace-stateview--empty` |
| | StateView (error) | `/?path=/story/taxios-taxios-workspace-stateview--error` |
| | StateView (loading) | `/?path=/story/taxios-taxios-workspace-stateview--loading` |
| | CloseButton | `/?path=/story/taxios-taxios-workspace-controls--close-button` |
| | Segmented control | `/?path=/story/taxios-taxios-workspace-controls--segmented` |
| | Control height scale | `/?path=/story/taxios-taxios-workspace-controls--control-height-scale` |
| | Booking wizard | `/?path=/story/taxios-taxios-workspace-wizard--booking-wizard` |
| **Company Dashboard** | Ride Detail Drawer (open) | `/?path=/story/taxios-taxios-company-dashboard-ride-detail-drawer--open` |
| | Ride Detail Drawer (closed) | `/?path=/story/taxios-taxios-company-dashboard-ride-detail-drawer--closed` |
| | Ride Detail Drawer (no detail) | `/?path=/story/taxios-taxios-company-dashboard-ride-detail-drawer--no-detail` |

### Screenshot Capture

To generate visual references for v0, run:

```bash
pnpm ui:build-storybook
node scripts/capture-storybook-screenshots.mjs
```

Screenshots are written to `docs/storybook-screenshots/` and are **not committed** (gitignored). They are local visual artifacts for v0 polish work.

For responsive review, capture an additional 375x667 mobile-web viewport:

```bash
node scripts/capture-storybook-screenshots.mjs --mobile
```

The script validates every configured story id against
`packages/ui/storybook-static/index.json` before capture. If a Storybook story
is renamed or removed, the command fails before producing misleading visual
context.

Fullscreen, portal, or overlay stories may use an explicit `captureMode:
"preview"` in the capture script. This screenshots the Storybook preview iframe
instead of the iframe `body`, which avoids unstable element screenshots for
modal overlays without changing the Storybook story or production UI.

### Canonical Screenshot List

| File | Story | Purpose |
|---|---|---|
| `button-default.png` | Button → Default | Primary button style |
| `button-secondary.png` | Button → Secondary | Brand/secondary button |
| `badge-default.png` | Badge → Default | Badge primitive |
| `workspace-surface.png` | Primitives → WorkspaceSurface | Porcelain surface material |
| `workspace-inner-card.png` | Primitives → WorkspaceInnerCard | Nested card material |
| `workspace-section-header.png` | Primitives → WorkspaceSectionHeader | Section header pattern |
| `workspace-status-chips.png` | Primitives → Workspace status chips | Status tone chips |
| `workspace-table.png` | Table → Operational table | Full data table |
| `workspace-entity-cards.png` | Entity Card → Entity cards | Grid of entity cards |
| `workspace-close-button.png` | Controls → CloseButton | Close button pattern |
| `workspace-segmented.png` | Controls → Segmented | Segmented control |
| `workspace-control-heights.png` | Controls → Control height scale | sm/md/lg control-height tokens |
| `stateview-empty.png` | StateView → Empty | Empty state |
| `stateview-error.png` | StateView → Error | Error state |
| `stateview-loading.png` | StateView → Loading | Loading state |
| `stateview-narrow.png` | StateView → Narrow | Narrow viewport state |
| `stateview-with-action.png` | StateView → WithAction | Error state with action |
| `workspace-wizard.png` | Wizard → Booking wizard | Full wizard overlay |
| `ride-detail-drawer-open.png` | Ride Detail Drawer → Open | Open drawer |
| `ride-detail-drawer-closed.png` | Ride Detail Drawer → Closed | Hidden drawer |
| `company-dashboard-screen.png` | Company Dashboard → Default | Full dashboard screen |
| `company-dashboard-primitives.png` | Dashboard Primitives → Surface | Dashboard porcelain surface |
| `company-dashboard-fastbooking-card.png` | Fastbooking Card → Default | Fastbooking card |
| `company-dashboard-live-feed.png` | Live Feed → Card | Live feed item |
| `company-dashboard-rides-table.png` | Rides Table → Table | Dashboard rides table |
| `new-booking-overlay.png` | New Booking → Open | Booking overlay |
| `company-workspace-shell.png` | Workspace Shell → Dashboard | Full workspace shell |
| `company-workspace-primitives.png` | Workspace Primitives → Surface | Company workspace surface |
| `company-workspace-access-states.png` | Access States → Empty | Empty access state |
| `tokens-workspace-surfaces.png` | Tokens → Workspace surfaces | Token swatches (surfaces) |
| `tokens-workspace-text.png` | Tokens → Workspace text | Token swatches (text) |
| `tokens-workspace-accent.png` | Tokens → Workspace accent | Token swatches (accent) |
| `tokens-type-scale.png` | Tokens → Type Scale | Semantic type scale tokens |

---

## 2. Registry Lab ↔ Storybook Mapping

| Registry Lab Block | Storybook Truth | Notes |
|---|---|---|
| `button-lab` | TaxiOS/UI/Button | Renders all 5 button variants |
| `workspace-table-lab` | Taxios/TaxiOS/Workspace/Table → Operational table | Full table with header, rows, scroll |
| `ride-detail-drawer-lab` | Taxios/TaxiOS/Company Dashboard/Ride Detail Drawer → Open | Self-contained drawer with inline mock data |

Planned labs (not yet built):

| Planned Lab | Storybook Truth | Why needed |
|---|---|---|
| `workspace-primitives-lab` | Taxios/TaxiOS/Workspace/Primitives | Surface, inner card, section header, chips |
| `workspace-entity-card-lab` | Taxios/TaxiOS/Workspace/Entity Card | Grid of entity cards with icons + metrics |
| `workspace-state-view-lab` | Taxios/TaxiOS/Workspace/StateView | Empty, error, loading states |
| `workspace-controls-lab` | Taxios/TaxiOS/Workspace/Controls | Close button, segmented control |
| `workspace-wizard-lab` | Taxios/TaxiOS/Workspace/Wizard | Full booking wizard overlay |

---

## 3. Visual DNA — The "Porcelain" System

TaxiOS workspaces use a **unified material language** called **porcelain**. It is not generic white cards. It has three physical properties:

### 3.1 Surface Material

All primary containers use `.taxis-workspace-surface` (or `.taxios-dashboard-porcelain-surface`):

```css
background: linear-gradient(
  145deg,
  var(--taxis-workspace-surface) 0%,      /* #ffffff */
  var(--taxis-workspace-surface-soft) 58%, /* #fcfcfd */
  var(--taxis-workspace-surface-deep) 100% /* #f5f6f8 */
);
border: 1px solid var(--taxis-workspace-surface-rim);   /* rgba(15,23,42,0.09) */
box-shadow: var(--taxis-workspace-shadow-executive);     /* deep, soft, neutral */
```

**Critical pseudo-elements** (v0 must preserve these):
- `::before` — barely-perceptible **graphite reflection** at bottom-right + soft **white glaze** at top-left
- `::after` — inset 1px white edge + bottom graphite micro-shadow
- Content must be `position: relative; z-index: 2` to sit above the glaze

### 3.2 Inner Card Material

Nested content uses `.taxis-workspace-inner-card`:

```css
background: linear-gradient(
  180deg,
  var(--taxis-workspace-surface) 0%,
  var(--taxis-workspace-surface-soft) 50%,
  var(--taxis-workspace-surface-deep) 100%
);
border: 1px solid var(--taxis-workspace-surface-rim);
box-shadow: var(--taxis-workspace-shadow-raised), inset 0 1px 0 var(--taxis-workspace-surface-sheen-strong);
```

- Hover: `translate3d(0, -1px, 0)` + stronger rim + deeper shadow
- `::before` glaze: linear white top + radial graphite bottom-right

### 3.3 Page Background

The ambient page is **ice-blue white**, not pure gray:

```css
background-color: var(--taxis-workspace-page-bg); /* #f8fafc */
```

Optional ambient gradient (used by dashboard):
```css
background:
  linear-gradient(90deg, rgba(255,255,255,0.68), transparent 22%, transparent 78%, rgba(255,255,255,0.52)),
  radial-gradient(92% 58% at 50% -14%, rgba(255,255,255,0.92), transparent 64%),
  radial-gradient(58% 44% at 54% 34%, var(--taxis-workspace-blue-wash), transparent 76%),
  radial-gradient(62% 46% at 70% 18%, var(--taxis-workspace-graphite-wash-soft), transparent 74%),
  linear-gradient(180deg, var(--taxis-workspace-page-bg-soft) 0%, var(--taxis-workspace-page-bg-deep) 100%);
```

### 3.4 Typography Rules

| Role | Size | Weight | Letter-spacing | Color |
|---|---|---|---|---|
| Page eyebrow | 11px | 700 | 0 (uppercase) | `--taxis-workspace-text-muted` (#64748b) |
| Page title | 36px | 600 | 0 | `--taxis-workspace-text-strong` (#0f172a) |
| Section title | 22px | 650 | 0 | `--taxis-workspace-text-strong` |
| Body / value | 13px | 500 | 0 | `--taxis-workspace-text-secondary` (#334155) |
| Data ID | 11px | 600 | 0.075em | `--taxis-workspace-text-secondary` |
| Table header | 10px | 600 | 0.15em (uppercase) | `--taxis-workspace-text-muted` |

Font stack:
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Aptos, Inter, "Segoe UI", system-ui, sans-serif;
font-feature-settings: "cv02", "cv03", "cv04", "ss01", "tnum";
text-rendering: geometricPrecision;
letter-spacing: -0.005em;
```

### 3.5 Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| Primary surface | 26–28px | Main workspace panels |
| Section surface | 22px | Nested sections |
| Inner card | 18–22px | Cards inside panels |
| Control / input | 14px | Inputs, buttons, chips |
| Pill | 999px | Avatars, status badges |

### 3.6 Shadow Hierarchy

| Name | Depth | Usage |
|---|---|---|
| `--taxis-workspace-shadow-soft` | Float | Section surfaces |
| `--taxis-workspace-shadow-raised` | Lift | Inner cards, hover |
| `--taxis-workspace-shadow-executive` | Deep | Primary containers |
| `--taxis-workspace-shadow-overlay` | Modal | Drawers, dialogs |
| `--taxis-workspace-shadow-command` | Command | Dark buttons, topbar |

**All shadows are neutral** (`rgba(15,23,42,…)`) — never brown, never orange.

---

## 4. Color System

### 4.1 Semantic Tokens (always use these, never raw hex)

| Token | Light value | Role |
|---|---|---|
| `--taxis-workspace-text-strong` | #0f172a | Headings, primary text |
| `--taxis-workspace-text-primary` | #111827 | Body text |
| `--taxis-workspace-text-secondary` | #334155 | Secondary content |
| `--taxis-workspace-text-subtle` | #475569 | Labels, captions |
| `--taxis-workspace-text-muted` | #64748b | Eyebrows, metadata |
| `--taxis-workspace-surface` | #ffffff | Pure white porcelain |
| `--taxis-workspace-surface-soft` | #fcfcfd | Slightly off-white |
| `--taxis-workspace-surface-deep` | #f5f6f8 | Deep porcelain |
| `--taxis-workspace-surface-rim` | rgba(15,23,42,0.09) | Default border |
| `--taxis-workspace-surface-rim-strong` | rgba(15,23,42,0.16) | Hover/active border |
| `--taxis-workspace-accent` | #ff6a00 | **Orange — reserved for** |
| `--taxis-workspace-accent-strong` | #ff5f00 | active, selected, focus, status |
| `--taxis-workspace-accent-soft` | rgba(255,106,0,0.12) | Accent backgrounds |
| `--taxis-workspace-accent-ring` | rgba(255,106,0,0.58) | Focus rings |

### 4.2 Status Chip Colors

| Tone | Text | Background | Border |
|---|---|---|---|
| neutral | `--taxis-status-neutral-text` | `--taxis-status-neutral-bg` | `--taxis-status-neutral-ring` |
| info | `--taxis-status-info-text` | `--taxis-status-info-bg` | `--taxis-status-info-ring` |
| success | `--taxis-status-success-text` | `--taxis-status-success-bg` | `--taxis-status-success-ring` |
| attention | `--taxis-status-attention-text` | `--taxis-status-attention-bg` | `--taxis-status-attention-ring` |
| danger | `--taxis-status-danger-text` | `--taxis-status-danger-bg` | `--taxis-status-danger-ring` |

---

## 5. Button Variants

| Variant | Background | Text | Border | Shadow |
|---|---|---|---|---|
| `default` | `#111827` | white | none | subtle lift |
| `brand` | `#ff6a00` | white | none | orange glow |
| `outline` | transparent | `#0f172a` | `rgba(15,23,42,0.09)` | none |
| `ghost` | transparent | `#334155` | none | none |
| `destructive` | `#ef4444` | white | none | none |

All buttons: `border-radius: 14px`, `font-weight: 600`, `letter-spacing: -0.01em`.

---

## 6. Component-Specific Notes for v0

### 6.1 WorkspaceTable

- **Header row**: dark rail background (`--taxis-workspace-rail-bg`), white text, `border-radius: 12px` on outer cells
- **Data rows**: transparent background, `border-y` on each cell, `rounded-[18px]` on outer cells of each row
- **Hover**: row gets subtle background shift
- **Borders**: use `border-[var(--taxis-workspace-border)]` or `border-y border-l border-r` on cells — NOT `divide-y` on the table

### 6.2 RideDetailDrawer

- **Drawer panel**: `.taxis-overlay-panel` — `backdrop-filter: blur(20px) saturate(1.04)` + `rgba(255,255,255,0.96)` background
- **Close button**: 44×44px, `border-radius: 14px`, rim border, porcelain surface
- **Avatar**: 40×40px circular, dark gradient background with white initials
- **Status chips**: use `workspaceChipClassForTone()` helper classes

### 6.3 WorkspaceWizard

- **Overlay**: full-screen `position: fixed`, scrim `rgba(2,6,23,0.14)`
- **Panel**: `max-width: 980px`, `border-radius: 28px`, porcelain surface
- **Status grid**: 4-column grid of small chips with icon + label
- **Rail** (right side): `border-radius: 20px`, soft surface background
- **Footer**: flex row, action buttons right-aligned

### 6.4 Entity Cards

- **Grid**: 2-column on desktop, 1-column on mobile
- **Card**: porcelain surface, `border-radius: 22px`, hover lift
- **Icon**: 32×32 ceramic chip (gradient surface + rim shadow)
- **Metrics**: 2-column mini-stats with label (muted) + value (strong)
- **Selected state**: orange accent ring + halo shadow

---

## 7. v0 Prompting Tips

When asking v0 to polish a lab block, include these constraints:

1. **"Use the porcelain material system"** — gradients (white → soft → deep), not flat white. Pseudo-elements for glaze and reflection.
2. **"All shadows must be neutral `rgba(15,23,42,…)`"** — no brown, no colored shadows.
3. **"Orange (#ff6a00) is reserved for active/selected/focus/status only"** — never use orange for borders, shadows, or backgrounds except accent states.
4. **"Border radius: 26–28px for primary surfaces, 22px for sections, 18px for cards, 14px for controls"**
5. **"Text hierarchy: strong (#0f172a) → secondary (#334155) → subtle (#475569) → muted (#64748b)"**
6. **"Always include the `taxios-premium` class on `<body>` and import `@/styles/globals.css` in layout"**
7. **"Use CSS custom properties from the tokens system, never hard-code hex values except in the token definitions"**

### Example v0 prompt template

```
Polish the [COMPONENT] lab block to match the TaxiOS Storybook visual system.

Context from Storybook:
- Story: [STORY_URL_OR_NAME]
- Key visual: [DESCRIPTION]

Design rules:
1. Porcelain surface: white → #fcfcfd → #f5f6f8 gradient
2. Shadows: neutral rgba(15,23,42,…) only
3. Orange (#ff6a00) reserved for accent/active states only
4. Border radius: 28px primary, 22px section, 18px card, 14px control
5. Text: strong #0f172a, secondary #334155, subtle #475569, muted #64748b
6. Include ::before glaze and ::after inset edge on primary surfaces
7. Body class: taxios-premium, layout imports @/styles/globals.css

Current file: [FILE_PATH]
```

---

## 8. Files That Define the Visual System

| File | Purpose |
|---|---|
| `packages/ui/src/styles/tokens.css` | All CSS custom properties |
| `packages/ui/src/styles/globals.css` | Tailwind theme, `taxios-premium` base styles |
| `packages/ui/src/components/taxios/workspace/workspace.css` | Workspace layer entrypoint (imports all sub-files) |
| `packages/ui/src/components/taxios/company-workspace/company-workspace-material.css` | Porcelain primitives (surface, inner card) |
| `packages/ui/src/components/taxios/workspace/workspace-foundation.css` | Ambient background, typography utilities |
| `packages/ui/src/components/taxios/workspace/workspace-chrome.css` | Sidebar, topbar, nav, chips |
| `packages/ui/src/components/taxios/dashboard/company-dashboard.css` | Dashboard-specific layouts, fastbooking, stats |
| `packages/ui/src/storybook/story-canvas.tsx` | Storybook canvas wrapper (dashboard tone background) |

---

*Last updated: 2026-06-05*
