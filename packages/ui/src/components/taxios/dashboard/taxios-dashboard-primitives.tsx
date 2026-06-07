import type React from "react";

import { cn } from "../../../lib/utils";
import {
  type WorkspaceInnerCardProps,
  WorkspaceInnerCard,
  WorkspaceSectionHeader,
  type WorkspaceSectionHeaderProps,
  type WorkspaceSurfaceProps,
  WorkspaceSurface,
} from "../workspace/workspace-primitives";

export type TaxiosPorcelainSurfaceProps<E extends React.ElementType = "div"> =
  WorkspaceSurfaceProps<E>;

export function TaxiosPorcelainSurface<E extends React.ElementType = "div">(
  props: TaxiosPorcelainSurfaceProps<E>,
) {
  return (
    <WorkspaceSurface
      {...props}
      className={cn("taxios-dashboard-porcelain-surface", props.className)}
    />
  );
}

export type TaxiosPorcelainInnerCardProps<E extends React.ElementType = "div"> =
  WorkspaceInnerCardProps<E>;

export function TaxiosPorcelainInnerCard<E extends React.ElementType = "div">(
  props: TaxiosPorcelainInnerCardProps<E>,
) {
  return (
    <WorkspaceInnerCard
      {...props}
      className={cn("taxios-dashboard-porcelain-inner-card", props.className)}
    />
  );
}

export type TaxiosDashboardSectionHeaderProps = WorkspaceSectionHeaderProps;

export function TaxiosDashboardSectionHeader(
  props: TaxiosDashboardSectionHeaderProps,
) {
  return <WorkspaceSectionHeader {...props} />;
}

export type TaxiosDashboardMetricTrend = "down" | "flat" | "up";

// Presentation tones only (up = positive, down = negative, flat = neutral),
// mapped to the shared semantic status tokens. Not RBAC or permission state.
const metricTrendStyles: Record<TaxiosDashboardMetricTrend, string> = {
  down: "bg-[var(--taxis-status-danger-bg)] text-[var(--taxis-status-danger-text)]",
  flat: "bg-[var(--taxis-status-neutral-bg)] text-[var(--taxis-status-neutral-text)]",
  up: "bg-[var(--taxis-status-success-bg)] text-[var(--taxis-status-success-text)]",
};

const metricSparkColor: Record<
  TaxiosDashboardMetricTrend,
  { stroke: string; fill: string }
> = {
  up: {
    stroke: "var(--taxis-workspace-sparkline-up)",
    fill: "var(--taxis-workspace-sparkline-fill)",
  },
  down: {
    stroke: "var(--taxis-workspace-sparkline-down)",
    fill: "var(--taxis-workspace-sparkline-fill)",
  },
  flat: {
    stroke: "var(--taxis-workspace-sparkline-flat)",
    fill: "var(--taxis-workspace-sparkline-fill)",
  },
};

const metricSparkPoints: Record<
  TaxiosDashboardMetricTrend,
  readonly [number, number][]
> = {
  // 8-point line in [0..100] x [0..40] viewport — shape only, no fake data.
  up: [
    [0, 30],
    [14, 28],
    [28, 24],
    [42, 22],
    [56, 18],
    [70, 14],
    [84, 8],
    [100, 4],
  ],
  down: [
    [0, 6],
    [14, 10],
    [28, 14],
    [42, 18],
    [56, 22],
    [70, 26],
    [84, 32],
    [100, 36],
  ],
  flat: [
    [0, 22],
    [14, 20],
    [28, 22],
    [42, 19],
    [56, 21],
    [70, 20],
    [84, 22],
    [100, 21],
  ],
};

function MetricSparkline({ trend }: { trend: TaxiosDashboardMetricTrend }) {
  const points = metricSparkPoints[trend];
  const color = metricSparkColor[trend];
  const lineCommand = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");
  const fillCommand = `${lineCommand} L 100 40 L 0 40 Z`;

  return (
    <svg
      aria-hidden="true"
      className="taxios-stat-sparkline h-9 w-[72px]"
      preserveAspectRatio="none"
      viewBox="0 0 100 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={fillCommand} fill={color.fill} />
      <path
        d={lineCommand}
        fill="none"
        stroke={color.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}

export type TaxiosDashboardMetricTileProps = {
  label: string;
  value: string;
  sub: string;
  delta?: string;
  trend?: TaxiosDashboardMetricTrend;
  icon: React.ReactNode;
};

export function TaxiosDashboardMetricTile({
  delta,
  icon,
  label,
  sub,
  trend = "flat",
  value,
}: TaxiosDashboardMetricTileProps) {
  return (
    <TaxiosPorcelainInnerCard className="taxios-stat-card-static group/tile relative flex h-full min-h-[142px] flex-col gap-5 overflow-hidden rounded-taxis-tile border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] p-5 shadow-taxis-soft transition-shadow duration-200 hover:shadow-taxis-lift">
      <div className="flex items-center justify-between gap-3">
        <div className="taxios-stat-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--taxis-workspace-surface-deep)] ring-1 ring-[var(--taxis-workspace-border)]">
          {icon}
        </div>
        <span className="taxios-stat-label font-semibold text-taxis-eyebrow text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
          {label}
        </span>
      </div>
      <div className="flex flex-1 items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="taxios-stat-value font-semibold text-taxis-value text-[var(--taxis-workspace-text-strong)] leading-none tabular-nums tracking-tight">
            {value}
          </p>
          <p className="taxios-stat-sub mt-2 truncate font-medium text-taxis-body-sm text-[var(--taxis-workspace-text-muted)]">
            {sub}
          </p>
        </div>
        <MetricSparkline trend={trend} />
      </div>
      {delta ? (
        <div className="taxios-stat-footer -mx-5 -mb-5 flex items-center justify-between gap-3 border-[var(--taxis-workspace-divider)] border-t bg-[var(--taxis-workspace-surface-deep)]/60 px-5 py-2.5">
          <span className="font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
            vs. Vorwoche
          </span>
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 font-semibold text-[10px] tracking-tight ${metricTrendStyles[trend]}`}
          >
            {delta}
          </span>
        </div>
      ) : null}
    </TaxiosPorcelainInnerCard>
  );
}
