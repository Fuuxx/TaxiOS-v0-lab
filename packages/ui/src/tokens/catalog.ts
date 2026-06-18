import {
  taxisDashboard,
  taxisFoundation,
  taxisStatus,
  taxisType,
  taxisWorkspace,
} from "./css-vars";

export type TokenKind =
  | "accent"
  | "border"
  | "color"
  | "motion"
  | "radius"
  | "shadow"
  | "size"
  | "status"
  | "surface"
  | "text";

export type TokenMetadata = {
  description: string;
  kind: TokenKind;
  name: string;
  value: string;
  variable: `--${string}`;
};

const token = (
  name: string,
  variable: `--${string}`,
  value: string,
  kind: TokenKind,
  description: string,
): TokenMetadata => ({
  description,
  kind,
  name,
  value,
  variable,
});

export const tokenCatalog = {
  foundation: {
    colors: [
      token(
        "Charcoal 950",
        "--taxis-color-charcoal-950",
        taxisFoundation.charcoal950,
        "color",
        "Primary foreground for calm operational UI.",
      ),
      token(
        "Charcoal 900",
        "--taxis-color-charcoal-900",
        taxisFoundation.charcoal900,
        "color",
        "Default dark control surface and strong text anchor.",
      ),
      token(
        "Muted",
        "--taxis-color-muted",
        taxisFoundation.muted,
        "text",
        "Secondary text and subdued metadata.",
      ),
      token(
        "Surface",
        "--taxis-color-surface",
        taxisFoundation.surface,
        "surface",
        "Default neutral component surface.",
      ),
      token(
        "Surface Muted",
        "--taxis-color-surface-muted",
        taxisFoundation.surfaceMuted,
        "surface",
        "Page and low-emphasis background.",
      ),
      token(
        "Action",
        "--taxis-color-action",
        taxisFoundation.action,
        "accent",
        "Primary TaxiOS action orange.",
      ),
      token(
        "Action Weak",
        "--taxis-color-action-weak",
        taxisFoundation.actionWeak,
        "accent",
        "Hover and secondary action orange.",
      ),
      token(
        "Border Soft",
        "--taxis-color-border-soft",
        taxisFoundation.borderSoft,
        "border",
        "Neutral low-contrast border.",
      ),
    ],
    motion: [
      token(
        "Motion Soft",
        "--taxis-motion-soft",
        taxisFoundation.motionSoft,
        "motion",
        "Calm ease-out for subtle reveal transitions.",
      ),
      token(
        "Motion Standard",
        "--taxis-motion-standard",
        taxisFoundation.motionStandard,
        "motion",
        "Default control and surface transition curve.",
      ),
      token(
        "Duration Short",
        "--taxis-motion-duration-short",
        taxisFoundation.motionDurationShort,
        "motion",
        "Short enter and reveal duration.",
      ),
    ],
    radius: [
      token(
        "Card Radius",
        "--taxis-radius-card",
        taxisFoundation.radiusCard,
        "radius",
        "Default radius for framed component surfaces.",
      ),
      token(
        "Pill Radius",
        "--taxis-radius-pill",
        taxisFoundation.radiusPill,
        "radius",
        "Fully rounded chips and compact status pills.",
      ),
      token(
        "Control Radius",
        "--taxis-radius-control",
        taxisFoundation.radiusControl,
        "radius",
        "Default interactive control radius.",
      ),
      token(
        "Tile Radius",
        "--taxis-radius-tile",
        taxisFoundation.radiusTile,
        "radius",
        "Softer porcelain corner for stat / metric tiles; one step above the card radius scale.",
      ),
    ],
    size: [
      token(
        "Control Height Small",
        "--taxis-control-h-sm",
        taxisFoundation.controlHeightSm,
        "size",
        "Compact workspace control height for dense chips and segmented items.",
      ),
      token(
        "Control Height Medium",
        "--taxis-control-h-md",
        taxisFoundation.controlHeightMd,
        "size",
        "Default workspace control height and mobile tap target.",
      ),
      token(
        "Control Height Large",
        "--taxis-control-h-lg",
        taxisFoundation.controlHeightLg,
        "size",
        "Large workspace control height for high-emphasis actions.",
      ),
    ],
    shadow: [
      token(
        "Soft Shadow",
        "--taxis-shadow-soft",
        taxisFoundation.shadowSoft,
        "shadow",
        "Subtle elevation for small controls.",
      ),
      token(
        "Lift Shadow",
        "--taxis-shadow-lift",
        taxisFoundation.shadowLift,
        "shadow",
        "Raised action and overlay emphasis.",
      ),
      token(
        "Focus Shadow",
        "--taxis-shadow-focus",
        taxisFoundation.shadowFocus,
        "shadow",
        "Visible focus treatment where ring tokens are not enough.",
      ),
    ],
    type: [
      token(
        "Text Eyebrow",
        "--taxis-text-eyebrow",
        taxisType.eyebrow,
        "size",
        "Uppercase micro-label / overline size; pair with the tracking-taxis-eyebrow utility.",
      ),
      token(
        "Text Body Small",
        "--taxis-text-body-sm",
        taxisType.bodySm,
        "size",
        "Secondary and muted body copy across cards, feeds, and tables.",
      ),
      token(
        "Text Section Small",
        "--taxis-text-section-sm",
        taxisType.sectionSm,
        "size",
        "Compact section and card title size for workspace panels, feeds, and forms.",
      ),
      token(
        "Text Section Medium",
        "--taxis-text-section-md",
        taxisType.sectionMd,
        "size",
        "Medium panel title size for rails and compact card headers.",
      ),
      token(
        "Text Value",
        "--taxis-text-value",
        taxisType.value,
        "size",
        "Primary operational metric value rendered by stat tiles.",
      ),
    ],
  },
  workspace: {
    accent: [
      token(
        "Workspace Accent",
        "--taxis-workspace-accent",
        taxisWorkspace.accent,
        "accent",
        "Reserved for active, selected, focus, and live status cues in shared workspace UI.",
      ),
      token(
        "Workspace Accent Soft",
        "--taxis-workspace-accent-soft",
        taxisWorkspace.accentSoft,
        "accent",
        "Low-emphasis accent fill for selected workspace chips.",
      ),
      token(
        "Workspace Accent Ring",
        "--taxis-workspace-accent-ring",
        taxisWorkspace.accentRing,
        "accent",
        "Focused or selected workspace ring.",
      ),
      token(
        "Workspace Accent Halo",
        "--taxis-workspace-accent-halo",
        taxisWorkspace.accentHalo,
        "accent",
        "Soft ambient accent glow for workspace controls.",
      ),
    ],
    command: [
      token(
        "Workspace Rail Background",
        "--taxis-workspace-rail-bg",
        taxisWorkspace.railBg,
        "surface",
        "Dark premium command rail for workspace table headers and segmented controls.",
      ),
      token(
        "Workspace Rail Border",
        "--taxis-workspace-rail-border",
        taxisWorkspace.railBorder,
        "border",
        "Hairline boundary for shared dark command rails.",
      ),
      token(
        "Workspace Rail Shadow",
        "--taxis-workspace-rail-shadow",
        taxisWorkspace.railShadow,
        "shadow",
        "Inset sheen and compact depth for shared dark command rails.",
      ),
    ],
    border: [
      token(
        "Workspace Border",
        "--taxis-workspace-border",
        taxisWorkspace.border,
        "border",
        "Default workspace hairline.",
      ),
      token(
        "Workspace Border Strong",
        "--taxis-workspace-border-strong",
        taxisWorkspace.borderStrong,
        "border",
        "Interactive and hover border emphasis.",
      ),
      token(
        "Workspace Divider",
        "--taxis-workspace-divider",
        taxisWorkspace.divider,
        "border",
        "Internal dividers inside shared workspace surfaces.",
      ),
      token(
        "Workspace Glass Edge",
        "--taxis-workspace-glass-edge",
        taxisWorkspace.glassEdge,
        "border",
        "Frosted topbar edge.",
      ),
    ],
    shadow: [
      token(
        "Workspace Card Shadow",
        "--taxis-workspace-shadow-card",
        taxisWorkspace.shadowCard,
        "shadow",
        "Default card and section surface elevation.",
      ),
      token(
        "Workspace Soft Shadow",
        "--taxis-workspace-shadow-soft",
        taxisWorkspace.shadowSoft,
        "shadow",
        "Compatibility alias for the default workspace card elevation.",
      ),
      token(
        "Workspace Raised Shadow",
        "--taxis-workspace-shadow-raised",
        taxisWorkspace.shadowRaised,
        "shadow",
        "Raised workspace surfaces.",
      ),
      token(
        "Workspace Overlay Shadow",
        "--taxis-workspace-shadow-overlay",
        taxisWorkspace.shadowOverlay,
        "shadow",
        "Small floating workspace overlays.",
      ),
      token(
        "Workspace Shadow Color",
        "--taxis-workspace-shadow-color",
        taxisWorkspace.shadowColor,
        "shadow",
        "Legacy color alias for shared offset-shadow formulas.",
      ),
      token(
        "Workspace Strong Shadow Color",
        "--taxis-workspace-shadow-color-strong",
        taxisWorkspace.shadowColorStrong,
        "shadow",
        "Legacy strong color alias for shared offset-shadow formulas.",
      ),
      token(
        "Workspace Overlay Depth",
        "--taxis-workspace-overlay-shadow",
        taxisWorkspace.overlayShadow,
        "shadow",
        "Shared search, popover, and drawer overlay depth.",
      ),
      token(
        "Workspace Command Shadow",
        "--taxis-workspace-shadow-command",
        taxisWorkspace.shadowCommand,
        "shadow",
        "Command and dock emphasis.",
      ),
    ],
    surface: [
      token(
        "Workspace Page Background",
        "--taxis-workspace-page-bg",
        taxisWorkspace.pageBg,
        "surface",
        "Shared workspace page background.",
      ),
      token(
        "Workspace Surface",
        "--taxis-workspace-surface",
        taxisWorkspace.surface,
        "surface",
        "Canonical shared porcelain surface.",
      ),
      token(
        "Workspace Surface Soft",
        "--taxis-workspace-surface-soft",
        taxisWorkspace.surfaceSoft,
        "surface",
        "Soft porcelain variant.",
      ),
      token(
        "Workspace Surface Deep",
        "--taxis-workspace-surface-deep",
        taxisWorkspace.surfaceDeep,
        "surface",
        "Nested porcelain depth.",
      ),
      token(
        "Workspace Panel",
        "--taxis-workspace-panel",
        taxisWorkspace.panel,
        "surface",
        "Low-emphasis panel fill for compact workspace rows and icon cells.",
      ),
      token(
        "Workspace Glass",
        "--taxis-workspace-glass",
        taxisWorkspace.glass,
        "surface",
        "Frosted workspace topbar material.",
      ),
      token(
        "Workspace Overlay Background",
        "--taxis-workspace-overlay-bg",
        taxisWorkspace.overlayBg,
        "surface",
        "Shared elevated overlay material for drawers and popovers.",
      ),
    ],
    text: [
      token(
        "Workspace Text Primary",
        "--taxis-workspace-text-primary",
        taxisWorkspace.textPrimary,
        "text",
        "Default workspace text.",
      ),
      token(
        "Workspace Text Strong",
        "--taxis-workspace-text-strong",
        taxisWorkspace.textStrong,
        "text",
        "Strong titles and primary values.",
      ),
      token(
        "Data Font",
        "--taxis-data-font",
        taxisWorkspace.dataFont,
        "text",
        "Monospace stack for IDs, times, counters, and operational numbers.",
      ),
      token(
        "Workspace Text Secondary",
        "--taxis-workspace-text-secondary",
        taxisWorkspace.textSecondary,
        "text",
        "Secondary copy and route labels.",
      ),
      token(
        "Workspace Text Subtle",
        "--taxis-workspace-text-subtle",
        taxisWorkspace.textSubtle,
        "text",
        "Subtle labels.",
      ),
      token(
        "Workspace Text Muted",
        "--taxis-workspace-text-muted",
        taxisWorkspace.textMuted,
        "text",
        "Low-emphasis metadata.",
      ),
    ],
  },
  dashboard: {
    accent: [
      token(
        "Dashboard Accent",
        "--taxis-dashboard-accent",
        taxisDashboard.accent,
        "accent",
        "Reserved for active, selected, focus, and live status cues.",
      ),
      token(
        "Accent Soft",
        "--taxis-dashboard-accent-soft",
        taxisDashboard.accentSoft,
        "accent",
        "Low-emphasis accent fill for selected chips.",
      ),
      token(
        "Accent Ring",
        "--taxis-dashboard-accent-ring",
        taxisDashboard.accentRing,
        "accent",
        "Focused or selected ring.",
      ),
      token(
        "Accent Halo",
        "--taxis-dashboard-accent-halo",
        taxisDashboard.accentHalo,
        "accent",
        "Soft ambient accent glow.",
      ),
    ],
    command: [
      token(
        "Rail Background",
        "--taxis-dashboard-rail-bg",
        taxisDashboard.railBg,
        "surface",
        "Dark premium command rail for table headers and segmented controls.",
      ),
      token(
        "Rail Border",
        "--taxis-dashboard-rail-border",
        taxisDashboard.railBorder,
        "border",
        "Hairline boundary for dark command rails.",
      ),
      token(
        "Rail Shadow",
        "--taxis-dashboard-rail-shadow",
        taxisDashboard.railShadow,
        "shadow",
        "Inset sheen and compact depth for dark command rails.",
      ),
    ],
    avatar: [
      token(
        "Avatar Size",
        "--taxis-avatar-size",
        taxisDashboard.avatarSize,
        "size",
        "Default dashboard avatar diameter.",
      ),
      token(
        "Avatar Gap Default",
        "--taxis-avatar-gap-default",
        taxisDashboard.avatarGapDefault,
        "size",
        "Default overlap for compact avatar stacks.",
      ),
      token(
        "Avatar Gap Expanded",
        "--taxis-avatar-gap-expanded",
        taxisDashboard.avatarGapExpanded,
        "size",
        "Expanded avatar stack gap for selected states.",
      ),
    ],
    border: [
      token(
        "Dashboard Border",
        "--taxis-dashboard-border",
        taxisDashboard.border,
        "border",
        "Default dashboard hairline.",
      ),
      token(
        "Dashboard Border Strong",
        "--taxis-dashboard-border-strong",
        taxisDashboard.borderStrong,
        "border",
        "Interactive and hover border emphasis.",
      ),
      token(
        "Dashboard Divider",
        "--taxis-dashboard-divider",
        taxisDashboard.divider,
        "border",
        "Internal dividers inside dashboard surfaces.",
      ),
      token(
        "Glass Edge",
        "--taxis-dashboard-glass-edge",
        taxisDashboard.glassEdge,
        "border",
        "Frosted topbar edge.",
      ),
    ],
    shadow: [
      token(
        "Dashboard Card Shadow",
        "--taxis-dashboard-shadow-card",
        taxisDashboard.shadowCard,
        "shadow",
        "Default card and section surface elevation.",
      ),
      token(
        "Dashboard Soft Shadow",
        "--taxis-dashboard-shadow-soft",
        taxisDashboard.shadowSoft,
        "shadow",
        "Compatibility alias for the default dashboard card elevation.",
      ),
      token(
        "Raised Shadow",
        "--taxis-dashboard-shadow-raised",
        taxisDashboard.shadowRaised,
        "shadow",
        "Raised dashboard surfaces.",
      ),
      token(
        "Overlay Shadow",
        "--taxis-dashboard-shadow-overlay",
        taxisDashboard.shadowOverlay,
        "shadow",
        "Small floating overlays.",
      ),
      token(
        "Shadow Color",
        "--taxis-dashboard-shadow-color",
        taxisDashboard.shadowColor,
        "shadow",
        "Legacy color alias for offset-shadow formulas.",
      ),
      token(
        "Strong Shadow Color",
        "--taxis-dashboard-shadow-color-strong",
        taxisDashboard.shadowColorStrong,
        "shadow",
        "Legacy strong color alias for offset-shadow formulas.",
      ),
      token(
        "Workspace Overlay Shadow",
        "--taxis-dashboard-overlay-shadow",
        taxisDashboard.overlayShadow,
        "shadow",
        "Shared search, popover, and drawer overlay depth.",
      ),
      token(
        "Command Shadow",
        "--taxis-dashboard-shadow-command",
        taxisDashboard.shadowCommand,
        "shadow",
        "Command and dock emphasis.",
      ),
    ],
    surface: [
      token(
        "Page Background",
        "--taxis-dashboard-page-bg",
        taxisDashboard.pageBg,
        "surface",
        "Dashboard page background.",
      ),
      token(
        "Surface",
        "--taxis-dashboard-surface",
        taxisDashboard.surface,
        "surface",
        "Canonical porcelain surface.",
      ),
      token(
        "Surface Soft",
        "--taxis-dashboard-surface-soft",
        taxisDashboard.surfaceSoft,
        "surface",
        "Soft porcelain variant.",
      ),
      token(
        "Surface Deep",
        "--taxis-dashboard-surface-deep",
        taxisDashboard.surfaceDeep,
        "surface",
        "Nested porcelain depth.",
      ),
      token(
        "Glass",
        "--taxis-dashboard-glass",
        taxisDashboard.glass,
        "surface",
        "Frosted dashboard topbar material.",
      ),
      token(
        "Overlay Background",
        "--taxis-dashboard-overlay-bg",
        taxisDashboard.overlayBg,
        "surface",
        "Shared elevated overlay material for drawers and popovers.",
      ),
    ],
    text: [
      token(
        "Text Primary",
        "--taxis-dashboard-text-primary",
        taxisDashboard.textPrimary,
        "text",
        "Default dashboard text.",
      ),
      token(
        "Text Strong",
        "--taxis-dashboard-text-strong",
        taxisDashboard.textStrong,
        "text",
        "Strong titles and primary values.",
      ),
      token(
        "Data Font",
        "--taxis-data-font",
        taxisDashboard.dataFont,
        "text",
        "Monospace stack for IDs, times, counters, and operational numbers.",
      ),
      token(
        "Text Secondary",
        "--taxis-dashboard-text-secondary",
        taxisDashboard.textSecondary,
        "text",
        "Secondary copy and route labels.",
      ),
      token(
        "Text Subtle",
        "--taxis-dashboard-text-subtle",
        taxisDashboard.textSubtle,
        "text",
        "Subtle labels.",
      ),
      token(
        "Text Muted",
        "--taxis-dashboard-text-muted",
        taxisDashboard.textMuted,
        "text",
        "Low-emphasis metadata.",
      ),
    ],
  },
  status: {
    tones: [
      token(
        "Status Info",
        "--taxis-status-info",
        taxisStatus.info,
        "status",
        "Informational and assigned operational status tone.",
      ),
      token(
        "Status Success",
        "--taxis-status-success",
        taxisStatus.success,
        "status",
        "Successful, in-progress, and confirmed operational status tone.",
      ),
      token(
        "Status Neutral",
        "--taxis-status-neutral",
        taxisStatus.neutral,
        "status",
        "Terminal or low-emphasis neutral operational status tone.",
      ),
      token(
        "Status Muted",
        "--taxis-status-muted",
        taxisStatus.muted,
        "status",
        "Ordered, waiting, or subdued operational status tone.",
      ),
      token(
        "Status Strong",
        "--taxis-status-strong",
        taxisStatus.strong,
        "status",
        "Strong neutral status tone for company-local or route-owned states.",
      ),
      token(
        "Status Accent",
        "--taxis-status-accent",
        taxisStatus.accent,
        "status",
        "TaxiOS orange status tone for active movement and selected state.",
      ),
      token(
        "Status Danger",
        "--taxis-status-danger",
        taxisStatus.danger,
        "status",
        "Cancelled, issue, failed, or destructive operational status tone.",
      ),
      token(
        "Status Attention",
        "--taxis-status-attention",
        taxisStatus.attention,
        "status",
        "Attention or arrived operational status tone.",
      ),
    ],
  },
} as const;

export type TokenCatalog = typeof tokenCatalog;
export type FoundationTokenGroup = keyof TokenCatalog["foundation"];
export type WorkspaceTokenGroup = keyof TokenCatalog["workspace"];
export type DashboardTokenGroup = keyof TokenCatalog["dashboard"];
export type StatusTokenGroup = keyof TokenCatalog["status"];
