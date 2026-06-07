export type CompanyWorkspaceStatusTone =
  | "accent"
  | "attention"
  | "danger"
  | "info"
  | "muted"
  | "neutral"
  | "strong"
  | "success";

export type CompanyWorkspaceChipSize = "sm" | "md" | "lg";

export type CompanyWorkspaceLegacyStatusColor =
  | "blue"
  | "green"
  | "grey"
  | "navy"
  | "orange"
  | "red"
  | "violet";

export const companyWorkspaceStatusToneByColor: Record<
  CompanyWorkspaceLegacyStatusColor,
  CompanyWorkspaceStatusTone
> = {
  blue: "info",
  green: "success",
  grey: "neutral",
  navy: "strong",
  orange: "accent",
  red: "danger",
  violet: "attention",
};

const statusTintByTone: Record<CompanyWorkspaceStatusTone, string> = {
  accent: "var(--taxis-status-accent)",
  attention: "var(--taxis-status-attention)",
  danger: "var(--taxis-status-danger)",
  info: "var(--taxis-status-info)",
  muted: "var(--taxis-status-muted)",
  neutral: "var(--taxis-status-neutral)",
  strong: "var(--taxis-status-strong)",
  success: "var(--taxis-status-success)",
};

const statusSurfaceByTone: Record<CompanyWorkspaceStatusTone, string> = {
  accent: "var(--taxis-status-accent-bg)",
  attention: "var(--taxis-status-attention-bg)",
  danger: "var(--taxis-status-danger-bg)",
  info: "var(--taxis-status-info-bg)",
  muted: "var(--taxis-status-muted-bg)",
  neutral: "var(--taxis-status-neutral-bg)",
  strong: "var(--taxis-status-strong-bg)",
  success: "var(--taxis-status-success-bg)",
};

const statusRingByTone: Record<CompanyWorkspaceStatusTone, string> = {
  accent: "var(--taxis-status-accent-ring)",
  attention: "var(--taxis-status-attention-ring)",
  danger: "var(--taxis-status-danger-ring)",
  info: "var(--taxis-status-info-ring)",
  muted: "var(--taxis-status-muted-ring)",
  neutral: "var(--taxis-status-neutral-ring)",
  strong: "var(--taxis-status-strong-ring)",
  success: "var(--taxis-status-success-ring)",
};

const statusIconClassNameByTone: Record<CompanyWorkspaceStatusTone, string> = {
  accent: "text-[var(--taxis-status-accent-text)]",
  attention: "text-[var(--taxis-status-attention)]",
  danger: "text-[var(--taxis-status-danger)]",
  info: "text-[var(--taxis-status-info)]",
  muted: "text-[var(--taxis-status-muted)]",
  neutral: "text-[var(--taxis-status-neutral)]",
  strong: "text-[var(--taxis-status-strong)]",
  success: "text-[var(--taxis-status-success)]",
};

const statusChipClassNameByTone: Record<CompanyWorkspaceStatusTone, string> = {
  accent: "taxis-status-chip-tone-accent",
  attention: "taxis-status-chip-tone-attention",
  danger: "taxis-status-chip-tone-danger",
  info: "taxis-status-chip-tone-info",
  muted: "taxis-status-chip-tone-muted",
  neutral: "taxis-status-chip-tone-neutral",
  strong: "taxis-status-chip-tone-strong",
  success: "taxis-status-chip-tone-success",
};

const chipBaseClassNameBySize: Record<CompanyWorkspaceChipSize, string> = {
  lg: "taxis-quiet-chip inline-flex min-h-[var(--taxis-control-h-lg)] items-center rounded-full px-4 font-semibold text-[12px] tracking-tight ring-1",
  md: "taxis-quiet-chip inline-flex min-h-[var(--taxis-control-h-md)] items-center rounded-full px-3 font-semibold text-[11px] tracking-tight ring-1",
  sm: "taxis-quiet-chip inline-flex min-h-[var(--taxis-control-h-sm)] items-center rounded-full px-2.5 font-semibold text-[11px] tracking-tight ring-1",
};

export function companyWorkspaceStatusToneForColor(
  color: CompanyWorkspaceLegacyStatusColor,
) {
  return companyWorkspaceStatusToneByColor[color];
}

export function companyWorkspaceStatusTintForTone(
  tone: CompanyWorkspaceStatusTone,
) {
  return statusTintByTone[tone];
}

export function companyWorkspaceStatusSurfaceForTone(
  tone: CompanyWorkspaceStatusTone,
) {
  return statusSurfaceByTone[tone];
}

export function companyWorkspaceStatusRingForTone(
  tone: CompanyWorkspaceStatusTone,
) {
  return statusRingByTone[tone];
}

export function companyWorkspaceStatusIconClassForTone(
  tone: CompanyWorkspaceStatusTone,
) {
  return statusIconClassNameByTone[tone];
}

export function companyWorkspaceStatusChipClassForTone(
  tone: CompanyWorkspaceStatusTone,
) {
  return statusChipClassNameByTone[tone];
}

export function companyWorkspaceChipClassForTone(
  tone: CompanyWorkspaceStatusTone,
  size: CompanyWorkspaceChipSize = "sm",
) {
  return `${chipBaseClassNameBySize[size]} ${companyWorkspaceStatusChipClassForTone(tone)}`;
}
