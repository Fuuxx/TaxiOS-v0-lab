import "../workspace/workspace.css";
import "../provider-inbox/provider-inbox.css";

import type React from "react";
import {
  Building2,
  CarFront,
  CheckCircle2,
  Clock3,
  MapPin,
  Route,
  Users,
} from "lucide-react";

import type {
  DriverJobAction,
  DriverJobsCopy,
  DriverJobsPayload,
  DriverJobRow,
  DriverJobStatus,
} from "../../../contracts/driver-jobs";
import { cn } from "../../../lib/utils";
import {
  WorkspaceSectionHeader,
  WorkspaceInnerCard,
  WorkspaceSurface,
} from "../workspace/workspace-primitives";
import { DriverWorkspaceShell } from "../driver-workspace/driver-workspace-shell";
import {
  type WorkspaceStatusTone,
  workspaceChipClassForTone,
} from "../workspace/workspace-status";

export type DriverJobActionRenderArgs = {
  action: DriverJobAction;
  row: DriverJobRow;
};

export type DriverJobsScreenProps = {
  actionRenderer?: (args: DriverJobActionRenderArgs) => React.ReactNode;
  activeContextSwitcher?: React.ReactNode;
  copy: DriverJobsCopy;
  organizationName: string;
  payload: DriverJobsPayload;
  sessionAction?: React.ReactNode;
  vehicleSessionControl?: React.ReactNode;
};

const statusToneByStatus: Record<DriverJobStatus, WorkspaceStatusTone> = {
  arrived: "attention",
  cancelled: "danger",
  completed: "success",
  driver_accepted: "info",
  enroute: "info",
  picked_up: "accent",
  provider_accepted: "neutral",
  requested: "attention",
};

function DriverJobStatusBadge({
  copy,
  status,
}: {
  copy: DriverJobsCopy;
  status: DriverJobStatus;
}) {
  return (
    <span
      className={workspaceChipClassForTone(statusToneByStatus[status])}
    >
      {copy.statusLabels[status]}
    </span>
  );
}

function DefaultDriverJobAction({ action }: { action: DriverJobAction }) {
  return (
    <span
      className="inline-flex min-h-8 items-center rounded-xl border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-2.5 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] data-[disabled=true]:text-[var(--taxis-workspace-text-subtle)]"
      data-disabled={action.disabled === true}
      title={action.reason}
    >
      {action.label}
    </span>
  );
}

function DriverJobActionList({
  actionRenderer,
  actions,
  copy,
  row,
}: {
  actionRenderer?: (args: DriverJobActionRenderArgs) => React.ReactNode;
  actions: DriverJobAction[];
  copy: DriverJobsCopy;
  row: DriverJobRow;
}) {
  if (actions.length === 0) {
    return (
      <span className="font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
        {copy.noActionsLabel}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {actions.map((action) => (
        <span key={action.id}>
          {actionRenderer ? (
            actionRenderer({ action, row })
          ) : (
            <DefaultDriverJobAction action={action} />
          )}
        </span>
      ))}
    </div>
  );
}

function DriverJobsEmptyState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <WorkspaceInnerCard className="flex min-h-32 flex-col items-start justify-center rounded-[20px] border-dashed p-5 text-left sm:min-h-28 sm:flex-row sm:items-center sm:justify-start sm:gap-4 sm:p-6">
      <span className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--taxis-workspace-surface-deep)] text-[var(--taxis-workspace-text-muted)] ring-1 ring-[var(--taxis-workspace-surface-rim)] sm:mb-0">
        <Route aria-hidden="true" size={18} strokeWidth={1.9} />
      </span>
      <div className="min-w-0">
        <h3 className="font-semibold text-[17px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
          {title}
        </h3>
        <p className="mt-1 max-w-2xl font-medium text-[13px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
          {description}
        </p>
      </div>
    </WorkspaceInnerCard>
  );
}

function DriverJobsSummaryTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <WorkspaceInnerCard className="taxios-provider-summary-tile flex min-h-24 items-center justify-between gap-4 rounded-[18px] p-4 sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="taxios-provider-summary-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          {icon}
        </span>
        <span className="truncate font-semibold text-[10px] text-[var(--taxis-workspace-text-subtle)] uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>
      <p className="font-semibold text-[28px] text-[var(--taxis-workspace-text-strong)] leading-none tabular-nums tracking-tight">
        {value}
      </p>
    </WorkspaceInnerCard>
  );
}

function DriverJobMobileCard({
  actionRenderer,
  copy,
  row,
}: {
  actionRenderer?: (args: DriverJobActionRenderArgs) => React.ReactNode;
  copy: DriverJobsCopy;
  row: DriverJobRow;
}) {
  return (
    <WorkspaceInnerCard className="rounded-[20px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
            {row.companyName}
          </p>
          {row.publicId ? (
            <p className="mt-0.5 font-mono font-semibold text-[10.5px] text-[var(--taxis-workspace-text-subtle)] tracking-[0.12em]">
              {row.publicId}
            </p>
          ) : null}
          <p className="mt-1 truncate font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
            {row.passengerSummary}
          </p>
        </div>
        <DriverJobStatusBadge copy={copy} status={row.lifecycleStatus} />
      </div>

      <div className="mt-4 grid gap-3 text-[13px]">
        <div className="flex min-w-0 items-start gap-2.5">
          <MapPin
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[var(--taxis-workspace-text-muted)]"
            size={15}
            strokeWidth={1.9}
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--taxis-workspace-text-secondary)]">
              {row.pickupAddress}
            </p>
            <p className="mt-0.5 truncate font-semibold text-[var(--taxis-workspace-text-strong)]">
              {row.destinationAddress}
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface-deep)] px-3 py-2">
            <Clock3
              aria-hidden="true"
              className="shrink-0 text-[var(--taxis-workspace-text-muted)]"
              size={14}
              strokeWidth={1.9}
            />
            <span className="truncate font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] tabular-nums">
              {row.requestedPickupAt ?? copy.openPickupTimeLabel}
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface-deep)] px-3 py-2">
            <CarFront
              aria-hidden="true"
              className="shrink-0 text-[var(--taxis-workspace-text-muted)]"
              size={14}
              strokeWidth={1.9}
            />
            <span className="truncate font-medium text-[12px] text-[var(--taxis-workspace-text-secondary)]">
              {row.assignedVehicleDisplayName
                ? `${row.assignedVehicleDisplayName}${
                    row.assignedVehicleLicensePlate
                      ? ` (${row.assignedVehicleLicensePlate})`
                      : ""
                  }`
                : copy.missingVehicleLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-[var(--taxis-workspace-divider)] border-t pt-3">
        <DriverJobActionList
          actionRenderer={actionRenderer}
          actions={row.allowedActions}
          copy={copy}
          row={row}
        />
      </div>
    </WorkspaceInnerCard>
  );
}

function DriverJobsTable({
  actionRenderer,
  copy,
  description,
  rows,
  title,
}: {
  actionRenderer?: (args: DriverJobActionRenderArgs) => React.ReactNode;
  copy: DriverJobsCopy;
  description: string;
  rows: DriverJobRow[];
  title: string;
}) {
  return (
    <WorkspaceSurface className="taxis-company-surface-section taxis-workspace-table-shell p-5">
      <WorkspaceSectionHeader
        badge={
          <span
            className={cn(
              workspaceChipClassForTone("neutral"),
              "taxis-count-chip uppercase tracking-normal",
            )}
          >
            {rows.length} {copy.visibleLabel}
          </span>
        }
        className="mb-5"
        subtitle={description}
        title={title}
      />
      <div className="grid gap-3 md:hidden">
        {rows.map((row) => (
          <DriverJobMobileCard
            actionRenderer={actionRenderer}
            copy={copy}
            key={row.bookingId}
            row={row}
          />
        ))}
      </div>
      <div className="taxis-workspace-table-scroll taxis-workspace-scrollbar hidden overflow-x-auto md:block">
        <table className="taxis-company-table taxis-workspace-table w-full min-w-[1120px] border-separate text-left">
          <thead>
            <tr className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
              <th className="taxis-workspace-table-header-cell rounded-l-xl border-y border-l px-4 py-2.5">
                {copy.companyColumn}
              </th>
              <th className="taxis-workspace-table-header-cell border-y px-4 py-2.5">
                {copy.passengerColumn}
              </th>
              <th className="taxis-workspace-table-header-cell border-y px-4 py-2.5">
                {copy.pickupColumn}
              </th>
              <th className="taxis-workspace-table-header-cell border-y px-4 py-2.5">
                {copy.destinationColumn}
              </th>
              <th className="taxis-workspace-table-header-cell border-y px-4 py-2.5">
                {copy.pickupTimeColumn}
              </th>
              <th className="taxis-workspace-table-header-cell border-y px-4 py-2.5">
                {copy.vehicleColumn}
              </th>
              <th className="taxis-workspace-table-header-cell border-y px-4 py-2.5">
                {copy.lifecycleColumn}
              </th>
              <th className="taxis-workspace-table-header-cell rounded-r-xl border-y border-r px-4 py-2.5 text-right">
                {copy.actionsColumn}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="taxis-workspace-table-row group" key={row.bookingId}>
                <td className="taxis-workspace-table-cell rounded-l-[18px] border-y border-l px-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Building2
                      aria-hidden="true"
                      className="shrink-0 text-[var(--taxis-workspace-text-muted)]"
                      size={15}
                      strokeWidth={1.9}
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
                        {row.companyName}
                      </span>
                      {row.publicId ? (
                        <span className="mt-0.5 block font-mono font-semibold text-[10.5px] text-[var(--taxis-workspace-text-subtle)] tracking-[0.12em]">
                          {row.publicId}
                        </span>
                      ) : null}
                    </span>
                  </div>
                </td>
                <td className="taxis-workspace-table-cell border-y px-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <Users
                      aria-hidden="true"
                      className="shrink-0 text-[var(--taxis-workspace-text-muted)]"
                      size={14}
                      strokeWidth={1.9}
                    />
                    <span className="truncate font-medium text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                      {row.passengerSummary}
                    </span>
                  </div>
                </td>
                <td className="taxis-workspace-table-cell border-y px-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <MapPin
                      aria-hidden="true"
                      className="shrink-0 text-[var(--taxis-workspace-text-muted)]"
                      size={14}
                      strokeWidth={1.9}
                    />
                    <span className="truncate font-medium text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                      {row.pickupAddress}
                    </span>
                  </div>
                </td>
                <td className="taxis-workspace-table-cell border-y px-4 py-3.5">
                  <span className="truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                    {row.destinationAddress}
                  </span>
                </td>
                <td className="taxis-workspace-table-cell border-y px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <Clock3
                      aria-hidden="true"
                      className="text-[var(--taxis-workspace-text-muted)]"
                      size={14}
                      strokeWidth={1.9}
                    />
                    <span className="font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] tabular-nums">
                      {row.requestedPickupAt ?? copy.openPickupTimeLabel}
                    </span>
                  </div>
                </td>
                <td className="taxis-workspace-table-cell border-y px-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <CarFront
                      aria-hidden="true"
                      className="shrink-0 text-[var(--taxis-workspace-text-muted)]"
                      size={14}
                      strokeWidth={1.9}
                    />
                    <span className="truncate font-medium text-[12px] text-[var(--taxis-workspace-text-secondary)]">
                      {row.assignedVehicleDisplayName
                        ? `${row.assignedVehicleDisplayName}${
                            row.assignedVehicleLicensePlate
                              ? ` (${row.assignedVehicleLicensePlate})`
                              : ""
                          }`
                        : copy.missingVehicleLabel}
                    </span>
                  </div>
                </td>
                <td className="taxis-workspace-table-cell border-y px-4 py-3.5">
                  <DriverJobStatusBadge
                    copy={copy}
                    status={row.lifecycleStatus}
                  />
                </td>
                <td className="taxis-workspace-table-cell rounded-r-[18px] border-y border-r px-4 py-3.5 text-right">
                  <DriverJobActionList
                    actionRenderer={actionRenderer}
                    actions={row.allowedActions}
                    copy={copy}
                    row={row}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WorkspaceSurface>
  );
}

export function DriverJobsScreen({
  actionRenderer,
  activeContextSwitcher,
  copy,
  organizationName,
  payload,
  sessionAction,
  vehicleSessionControl,
}: DriverJobsScreenProps) {
  return (
    <DriverWorkspaceShell
      activeContextSwitcher={activeContextSwitcher}
      activeItem="jobs"
      organizationName={organizationName}
      sessionAction={sessionAction}
      title={copy.title}
      vehicleSessionControl={vehicleSessionControl}
    >
      <div className="taxis-workspace-content-area mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8 xl:px-10">
        <section className="taxis-workspace-animate-fade-up grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] lg:items-end">
          <div className="min-w-0 max-w-3xl">
            <p className="font-semibold text-[10.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
              {copy.title}
            </p>
            <h1 className="mt-2 font-semibold text-[28px] text-[var(--taxis-workspace-text-strong)] leading-[1.08] tracking-normal sm:text-[30px]">
              {organizationName}
            </h1>
            <p className="mt-3 max-w-2xl font-medium text-[14px] text-[var(--taxis-workspace-text-muted)] leading-relaxed tracking-tight">
              {copy.subtitle}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <DriverJobsSummaryTile
              icon={<Route aria-hidden="true" size={18} strokeWidth={1.9} />}
              label={copy.activeCountLabel}
              value={String(payload.activeVisibleCount)}
            />
            <DriverJobsSummaryTile
              icon={
                <CheckCircle2 aria-hidden="true" size={18} strokeWidth={1.9} />
              }
              label={copy.historyCountLabel}
              value={String(payload.historyVisibleCount)}
            />
          </div>
        </section>

        <section className="flex flex-col gap-8">
          {payload.activeRows.length === 0 ? (
            <DriverJobsEmptyState
              description={copy.activeEmptyDescription}
              title={copy.activeEmptyTitle}
            />
          ) : (
            <DriverJobsTable
              actionRenderer={actionRenderer}
              copy={copy}
              description={copy.activeDescription}
              rows={payload.activeRows}
              title={copy.activeTitle}
            />
          )}

          {payload.historyRows.length === 0 ? (
            <DriverJobsEmptyState
              description={copy.historyEmptyDescription}
              title={copy.historyEmptyTitle}
            />
          ) : (
            <DriverJobsTable
              copy={copy}
              description={copy.historyDescription}
              rows={payload.historyRows}
              title={copy.historyTitle}
            />
          )}
        </section>
      </div>
    </DriverWorkspaceShell>
  );
}
