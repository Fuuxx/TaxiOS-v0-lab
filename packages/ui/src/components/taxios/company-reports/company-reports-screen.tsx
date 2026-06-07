import "../workspace/workspace.css";

import { BarChart3, ClipboardList, PieChart } from "lucide-react";

import type {
  CompanyReportsCopy,
  CompanyReportsMetric,
  CompanyReportsPayload,
  CompanyReportsRecentRow,
  CompanyReportsStatusBreakdown,
  CompanyReportsTone,
} from "../../../contracts/company-reports";
import type { WorkspaceStatusTone } from "../workspace/workspace-status";
import { workspaceChipClassForTone } from "../workspace/workspace-status";
import {
  WorkspaceSectionHeader,
  WorkspaceSurface,
} from "../workspace/workspace-primitives";
import { WorkspaceStateView } from "../workspace/workspace-state-view";

export type CompanyReportsWorkspaceContentProps = {
  copy: CompanyReportsCopy;
  payload: CompanyReportsPayload;
};

const reportToneToWorkspaceTone: Record<CompanyReportsTone, WorkspaceStatusTone> =
  {
    blue: "info",
    green: "success",
    neutral: "neutral",
    orange: "accent",
    red: "danger",
  };

function toneClassName(tone: CompanyReportsTone) {
  return workspaceChipClassForTone(reportToneToWorkspaceTone[tone], "sm");
}

function SummaryMetricTile({ metric }: { metric: CompanyReportsMetric }) {
  return (
    <WorkspaceSurface className="taxis-company-surface-section taxis-company-summary-tile p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="block font-semibold text-taxis-eyebrow text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
          {metric.label}
        </span>
        <span className={toneClassName(metric.tone)}>{metric.value}</span>
      </div>
      <p className="mt-3 font-semibold text-taxis-value text-[var(--taxis-workspace-text-strong)] leading-none">
        {metric.value}
      </p>
      <p className="mt-2 text-taxis-body-sm text-[var(--taxis-workspace-text-muted)] leading-relaxed">
        {metric.description}
      </p>
    </WorkspaceSurface>
  );
}

function InlineMetricPanel({ metric }: { metric: CompanyReportsMetric }) {
  return (
    <div className="rounded-[18px] border border-[var(--taxis-workspace-border-subtle)] bg-[var(--taxis-workspace-surface-soft)] p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="block font-semibold text-taxis-eyebrow text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
          {metric.label}
        </span>
        <span className={toneClassName(metric.tone)}>{metric.value}</span>
      </div>
      <p className="mt-3 text-taxis-body-sm text-[var(--taxis-workspace-text-muted)] leading-relaxed">
        {metric.description}
      </p>
    </div>
  );
}

function BreakdownCard({
  item,
}: {
  item: CompanyReportsStatusBreakdown;
}) {
  return (
    <div className="taxis-company-surface-section rounded-[18px] border border-[var(--taxis-workspace-border-subtle)] bg-[var(--taxis-workspace-surface-soft)] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-taxis-body-sm text-[var(--taxis-workspace-text-strong)]">
          {item.label}
        </span>
        <span className={toneClassName(item.tone)}>{item.value}</span>
      </div>
      <p className="mt-2 text-taxis-body-sm text-[var(--taxis-workspace-text-muted)] leading-relaxed">
        {item.description}
      </p>
    </div>
  );
}

function EmptyState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <WorkspaceStateView
      className="taxis-company-surface-empty"
      description={description}
      icon={<ClipboardList aria-hidden="true" />}
      title={title}
      variant="empty"
    />
  );
}

const reportsHeaderCellClassName =
  "taxis-workspace-table-header-cell taxis-company-table-header-cell border-y px-4 py-3";
const reportsBodyCellClassName =
  "taxis-workspace-table-cell taxis-company-table-cell border-y px-4 py-4";

function RecentReportsTable({
  copy,
  rows,
}: {
  copy: CompanyReportsCopy;
  rows: readonly CompanyReportsRecentRow[];
}) {
  if (rows.length === 0) {
    return (
      <EmptyState description={copy.emptyDescription} title={copy.emptyTitle} />
    );
  }

  return (
    <div className="taxis-workspace-table-scroll taxis-company-table-scroll">
      <table className="taxis-workspace-table taxis-company-table min-w-[900px] text-left">
        <thead>
          <tr className="font-semibold text-taxis-eyebrow uppercase tracking-taxis-eyebrow">
            <th
              className={`${reportsHeaderCellClassName} rounded-l-[16px] border-l`}
            >
              {copy.referenceColumn}
            </th>
            <th className={reportsHeaderCellClassName}>{copy.pickupColumn}</th>
            <th className={reportsHeaderCellClassName}>{copy.routeColumn}</th>
            <th className={reportsHeaderCellClassName}>
              {copy.passengerColumn}
            </th>
            <th
              className={`${reportsHeaderCellClassName} rounded-r-[16px] border-r text-right`}
            >
              {copy.statusColumn}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className="taxis-workspace-table-row taxis-company-table-row"
              key={row.bookingId}
            >
              <td
                className={`${reportsBodyCellClassName} rounded-l-[18px] border-l`}
              >
                <span className="font-mono font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] tracking-[0.12em]">
                  {row.publicId ?? "-"}
                </span>
              </td>
              <td
                className={`${reportsBodyCellClassName} font-medium text-taxis-body-sm text-[var(--taxis-workspace-text-secondary)]`}
              >
                {row.pickupLabel}
              </td>
              <td
                className={`${reportsBodyCellClassName} font-semibold text-taxis-body-sm text-[var(--taxis-workspace-text-strong)]`}
              >
                {row.routeLabel}
              </td>
              <td
                className={`${reportsBodyCellClassName} font-medium text-taxis-body-sm text-[var(--taxis-workspace-text-secondary)]`}
              >
                {row.passengerSummary}
              </td>
              <td
                className={`${reportsBodyCellClassName} rounded-r-[18px] border-r text-right`}
              >
                <span className={toneClassName(row.tone)}>
                  {row.statusLabel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CompanyReportsWorkspaceContent({
  copy,
  payload,
}: CompanyReportsWorkspaceContentProps) {
  return (
    <div className="taxis-company-workspace-content taxis-workspace-content-area">
      <div className="taxis-company-workspace-frame taxis-company-workspace-stack">
        <section className="taxis-company-page-header">
          <span className="taxis-company-page-eyebrow">
            <BarChart3 aria-hidden="true" size={14} strokeWidth={1.9} />
            {payload.organizationName}
          </span>
          <h1 className="taxis-company-page-title">{copy.title}</h1>
          <p className="taxis-company-page-description">{copy.subtitle}</p>
          <span className="mt-3 inline-flex w-fit rounded-full border border-[var(--taxis-workspace-border-subtle)] bg-[var(--taxis-workspace-surface-soft)] px-3 py-1 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.12em]">
            {payload.coverageLabel}
          </span>
        </section>

        <section aria-label={copy.summarySectionTitle}>
          <div className="taxis-company-summary-grid grid md:grid-cols-2 xl:grid-cols-4">
            {payload.summaryMetrics.map((metric) => (
              <SummaryMetricTile key={metric.label} metric={metric} />
            ))}
          </div>
        </section>

        <WorkspaceSurface className="taxis-company-surface-primary grid gap-4 p-5">
          <WorkspaceSectionHeader
            action={<PieChart aria-hidden="true" size={16} strokeWidth={1.9} />}
            title={copy.bookingStatusSectionTitle}
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {payload.bookingStatusBreakdown.map((item) => (
              <BreakdownCard item={item} key={item.id} />
            ))}
          </div>
        </WorkspaceSurface>

        <WorkspaceSurface className="taxis-company-surface-primary grid gap-4 p-5">
          <WorkspaceSectionHeader
            action={
              <ClipboardList aria-hidden="true" size={16} strokeWidth={1.9} />
            }
            title={copy.financeSectionTitle}
          />
          <div className="grid gap-3 md:grid-cols-3">
            {payload.financeMetrics.map((metric) => (
              <InlineMetricPanel key={metric.label} metric={metric} />
            ))}
          </div>
        </WorkspaceSurface>

        <WorkspaceSurface className="taxis-company-surface-primary grid gap-4 p-5">
          <WorkspaceSectionHeader
            action={
              <span className="font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.12em]">
                {payload.recentRows.length}
              </span>
            }
            title={copy.recentSectionTitle}
          />
          <RecentReportsTable copy={copy} rows={payload.recentRows} />
        </WorkspaceSurface>
      </div>
    </div>
  );
}
