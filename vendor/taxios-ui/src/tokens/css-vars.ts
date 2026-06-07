/**
 * Typed `var(...)` mirrors for the TaxiOS design tokens defined in
 * `packages/ui/src/styles/tokens.css`.
 *
 * Rules:
 *  - This file MUST NOT duplicate hex values. Every entry resolves to a CSS
 *    custom property declared in `tokens.css`.
 *  - Foundation tokens are exposed as well for unusual cases, but components
 *    should prefer the semantic component tokens (e.g. `dashboard.porcelainTop`
 *    instead of `taxisCharcoal900`).
 *  - Add a token here only after declaring it in `tokens.css`.
 */

const v = (name: string): string => `var(--${name})`;

export const taxisFoundation = {
  fontSans: v("taxis-font-sans"),
  fontHeading: v("taxis-font-heading"),

  charcoal950: v("taxis-color-charcoal-950"),
  charcoal900: v("taxis-color-charcoal-900"),
  charcoal800: v("taxis-color-charcoal-800"),
  muted: v("taxis-color-muted"),
  surface: v("taxis-color-surface"),
  surfaceMuted: v("taxis-color-surface-muted"),
  surfaceWash: v("taxis-color-surface-wash"),
  surfaceElevated: v("taxis-color-surface-elevated"),
  action: v("taxis-color-action"),
  actionWeak: v("taxis-color-action-weak"),
  actionForeground: v("taxis-color-action-foreground"),
  borderSoft: v("taxis-color-border-soft"),

  radiusCard: v("taxis-radius-card"),
  radiusPill: v("taxis-radius-pill"),
  radiusControl: v("taxis-radius-control"),
  radiusTile: v("taxis-radius-tile"),

  controlHeightSm: v("taxis-control-h-sm"),
  controlHeightMd: v("taxis-control-h-md"),
  controlHeightLg: v("taxis-control-h-lg"),

  shadowSoft: v("taxis-shadow-soft"),
  shadowLift: v("taxis-shadow-lift"),
  shadowFocus: v("taxis-shadow-focus"),

  motionSoft: v("taxis-motion-soft"),
  motionStandard: v("taxis-motion-standard"),
  motionDurationShort: v("taxis-motion-duration-short"),
} as const;

export const taxisDashboard = {
  /** Surfaces */
  pageBg: v("taxis-dashboard-page-bg"),
  pageBgSoft: v("taxis-dashboard-page-bg-soft"),
  pageBgDeep: v("taxis-dashboard-page-bg-deep"),

  porcelainTop: v("taxis-dashboard-porcelain-top"),
  porcelainMid: v("taxis-dashboard-porcelain-mid"),
  porcelainDeep: v("taxis-dashboard-porcelain-deep"),
  porcelainGlaze: v("taxis-dashboard-porcelain-glaze"),

  card: v("taxis-dashboard-card"),
  cardSoft: v("taxis-dashboard-card-soft"),
  cardDeep: v("taxis-dashboard-card-deep"),
  panel: v("taxis-dashboard-panel"),
  surface: v("taxis-dashboard-surface"),
  surfaceSoft: v("taxis-dashboard-surface-soft"),
  surfaceDeep: v("taxis-dashboard-surface-deep"),
  surfaceRim: v("taxis-dashboard-surface-rim"),
  surfaceRimStrong: v("taxis-dashboard-surface-rim-strong"),
  surfaceSheen: v("taxis-dashboard-surface-sheen"),
  surfaceSheenStrong: v("taxis-dashboard-surface-sheen-strong"),
  surfaceHover: v("taxis-dashboard-surface-hover"),
  blueWash: v("taxis-dashboard-blue-wash"),
  blueWashStrong: v("taxis-dashboard-blue-wash-strong"),
  graphiteWash: v("taxis-dashboard-graphite-wash"),
  graphiteWashSoft: v("taxis-dashboard-graphite-wash-soft"),

  ceramicShell: v("taxis-dashboard-ceramic-shell"),
  ceramicShellDeep: v("taxis-dashboard-ceramic-shell-deep"),

  dock: v("taxis-dashboard-dock"),
  dockDeep: v("taxis-dashboard-dock-deep"),

  glass: v("taxis-dashboard-glass"),
  glassFallback: v("taxis-dashboard-glass-fallback"),
  glassBlur: v("taxis-dashboard-glass-blur"),
  glassEdge: v("taxis-dashboard-glass-edge"),
  commandBg: v("taxis-dashboard-command-bg"),

  /** Text */
  textPrimary: v("taxis-dashboard-text-primary"),
  textStrong: v("taxis-dashboard-text-strong"),
  textSecondary: v("taxis-dashboard-text-secondary"),
  textSubtle: v("taxis-dashboard-text-subtle"),
  textMuted: v("taxis-dashboard-text-muted"),

  /** Borders */
  border: v("taxis-dashboard-border"),
  borderStrong: v("taxis-dashboard-border-strong"),
  divider: v("taxis-dashboard-divider"),
  borderWarm: v("taxis-dashboard-border-warm"),
  borderWarmStrong: v("taxis-dashboard-border-warm-strong"),
  borderCool: v("taxis-dashboard-border-cool"),
  dividerWarm: v("taxis-dashboard-divider-warm"),

  /** Accent (orange — only for active/selected/focus/status/halo) */
  accent: v("taxis-dashboard-accent"),
  accentSoft: v("taxis-dashboard-accent-soft"),
  accentRing: v("taxis-dashboard-accent-ring"),
  accentHalo: v("taxis-dashboard-accent-halo"),
  controlDarkTop: v("taxis-dashboard-control-dark-top"),
  controlDark: v("taxis-dashboard-control-dark"),
  controlDarkHoverTop: v("taxis-dashboard-control-dark-hover-top"),
  controlDarkHover: v("taxis-dashboard-control-dark-hover"),
  dataFont: v("taxis-data-font"),
  dataFontFeatureSettings: v("taxis-data-font-feature-settings"),
  dataLetterSpacing: v("taxis-data-letter-spacing"),
  railBg: v("taxis-dashboard-rail-bg"),
  railBorder: v("taxis-dashboard-rail-border"),
  railText: v("taxis-dashboard-rail-text"),
  railShadow: v("taxis-dashboard-rail-shadow"),
  overlayBg: v("taxis-dashboard-overlay-bg"),
  overlayHeaderBg: v("taxis-dashboard-overlay-header-bg"),
  overlayBorder: v("taxis-dashboard-overlay-border"),
  overlayShadow: v("taxis-dashboard-overlay-shadow"),
  neutralReflection: v("taxis-dashboard-neutral-reflection"),
  neutralReflectionSoft: v("taxis-dashboard-neutral-reflection-soft"),
  sparklineFill: v("taxis-dashboard-sparkline-fill"),
  sparklineUp: v("taxis-dashboard-sparkline-up"),
  sparklineDown: v("taxis-dashboard-sparkline-down"),
  sparklineFlat: v("taxis-dashboard-sparkline-flat"),

  /** Shadows */
  shadowCard: v("taxis-dashboard-shadow-card"),
  shadowRaised: v("taxis-dashboard-shadow-raised"),
  shadowSoft: v("taxis-dashboard-shadow-soft"),
  shadowExecutive: v("taxis-dashboard-shadow-executive"),
  shadowCommand: v("taxis-dashboard-shadow-command"),
  shadowPorcelain: v("taxis-dashboard-shadow-porcelain"),
  shadowOverlay: v("taxis-dashboard-shadow-overlay"),
  shadowColor: v("taxis-dashboard-shadow-color"),
  shadowColorStrong: v("taxis-dashboard-shadow-color-strong"),

  /** Avatar */
  avatarSize: v("taxis-avatar-size"),
  avatarGapDefault: v("taxis-avatar-gap-default"),
  avatarGapExpanded: v("taxis-avatar-gap-expanded"),

  /** Motion */
  motionFast: v("taxis-motion-fast"),
  motionMedium: v("taxis-motion-medium"),
  easeStandard: v("taxis-motion-ease-standard"),
} as const;

const workspaceTokenFromDashboard = (token: string): string =>
  token.replace("--taxis-dashboard-", "--taxis-workspace-");

/**
 * Neutral workspace material mirror for shared Company, Provider, Driver,
 * Search, Notifications, Invite, and future workspace UI.
 *
 * The shape intentionally matches `taxisDashboard` while the dashboard-prefixed
 * variables remain as compatibility aliases during migration.
 */
export const taxisWorkspace = Object.fromEntries(
  Object.entries(taxisDashboard).map(([key, value]) => [
    key,
    workspaceTokenFromDashboard(value),
  ]),
) as typeof taxisDashboard;

/**
 * Operational type scale. Semantic font sizes for repeated dashboard text
 * roles, declared in `tokens.css` and exposed as `text-taxis-*` /
 * `tracking-taxis-*` Tailwind utilities. Use these instead of arbitrary
 * `text-[Npx]` values.
 */
export const taxisType = {
  eyebrow: v("taxis-text-eyebrow"),
  eyebrowTracking: v("taxis-text-eyebrow-tracking"),
  bodySm: v("taxis-text-body-sm"),
  sectionSm: v("taxis-text-section-sm"),
  sectionMd: v("taxis-text-section-md"),
  value: v("taxis-text-value"),
} as const;

export const taxisStatus = {
  info: v("taxis-status-info"),
  infoBg: v("taxis-status-info-bg"),
  infoText: v("taxis-status-info-text"),
  infoRing: v("taxis-status-info-ring"),
  success: v("taxis-status-success"),
  successBg: v("taxis-status-success-bg"),
  successText: v("taxis-status-success-text"),
  successRing: v("taxis-status-success-ring"),
  neutral: v("taxis-status-neutral"),
  neutralBg: v("taxis-status-neutral-bg"),
  neutralText: v("taxis-status-neutral-text"),
  neutralRing: v("taxis-status-neutral-ring"),
  muted: v("taxis-status-muted"),
  mutedBg: v("taxis-status-muted-bg"),
  mutedText: v("taxis-status-muted-text"),
  mutedRing: v("taxis-status-muted-ring"),
  strong: v("taxis-status-strong"),
  strongBg: v("taxis-status-strong-bg"),
  strongText: v("taxis-status-strong-text"),
  strongRing: v("taxis-status-strong-ring"),
  accent: v("taxis-status-accent"),
  accentBg: v("taxis-status-accent-bg"),
  accentText: v("taxis-status-accent-text"),
  accentRing: v("taxis-status-accent-ring"),
  danger: v("taxis-status-danger"),
  dangerBg: v("taxis-status-danger-bg"),
  dangerText: v("taxis-status-danger-text"),
  dangerRing: v("taxis-status-danger-ring"),
  attention: v("taxis-status-attention"),
  attentionBg: v("taxis-status-attention-bg"),
  attentionText: v("taxis-status-attention-text"),
  attentionRing: v("taxis-status-attention-ring"),
} as const;

export type TaxisFoundationToken = keyof typeof taxisFoundation;
export type TaxisDashboardToken = keyof typeof taxisDashboard;
export type TaxisWorkspaceToken = keyof typeof taxisWorkspace;
export type TaxisTypeToken = keyof typeof taxisType;
export type TaxisStatusToken = keyof typeof taxisStatus;
