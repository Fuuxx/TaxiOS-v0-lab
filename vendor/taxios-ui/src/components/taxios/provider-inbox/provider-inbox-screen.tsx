import "../workspace/workspace.css";
import "./provider-inbox.css";

import type React from "react";
import {
  ArrowRight,
  Bell,
  Building2,
  ChevronRight,
  Clock3,
  Inbox,
  MapPin,
  Route,
  ShieldCheck,
  SquareCheckBig,
  Users,
} from "lucide-react";

import type {
  ProviderInboxAction,
  ProviderInboxActionContext,
  ProviderInboxCopy,
  ProviderInboxRow,
  ProviderInboxStatus,
} from "../../../contracts/provider-inbox";
import { cn } from "../../../lib/utils";
import {
  WorkspaceSectionHeader,
  WorkspaceInnerCard,
  WorkspaceSurface,
} from "../workspace/workspace-primitives";
import { ProviderWorkspaceShell } from "../provider-workspace/provider-workspace-shell";
import {
  type WorkspaceStatusTone,
  workspaceChipClassForTone,
} from "../workspace/workspace-status";

export type ProviderInboxActionRenderArgs = {
  action: ProviderInboxAction;
  context: ProviderInboxActionContext;
  row: ProviderInboxRow;
};

export type ProviderInboxScreenProps = {
  actionRenderer?: (args: ProviderInboxActionRenderArgs) => React.ReactNode;
  activeContextSwitcher?: React.ReactNode;
  activeRows: ProviderInboxRow[];
  activeVisibleCount: number;
  acceptedJobsRows?: ProviderInboxRow[];
  acceptedJobsVisibleCount?: number;
  assignedJobsRows?: ProviderInboxRow[];
  assignedJobsVisibleCount?: number;
  availableJobsRows?: ProviderInboxRow[];
  availableJobsVisibleCount?: number;
  closedJobsRows?: ProviderInboxRow[];
  closedJobsVisibleCount?: number;
  copy: ProviderInboxCopy;
  driverOptions?: ProviderInboxActionContext["driverOptions"];
  globalPoolRows?: ProviderInboxRow[];
  globalPoolVisibleCount?: number;
  organizationName: string;
  providerJobForm?: React.ReactNode;
  providerRequestsRows?: ProviderInboxRow[];
  providerRequestsVisibleCount?: number;
  sessionAction?: React.ReactNode;
  terminalHistoryRows: ProviderInboxRow[];
  terminalHistoryVisibleCount: number;
  vehicleOptions?: ProviderInboxActionContext["vehicleOptions"];
};

const statusToneByStatus: Record<ProviderInboxStatus, WorkspaceStatusTone> = {
  cancelled: "danger",
  completed: "success",
  confirmed: "info",
  requested: "accent",
};

function ProviderInboxStatusBadge({
  copy,
  status,
}: {
  copy: ProviderInboxCopy;
  status: ProviderInboxStatus;
}) {
  return (
    <span
      className={workspaceChipClassForTone(statusToneByStatus[status])}
    >
      {copy.statusLabels[status]}
    </span>
  );
}

function DefaultProviderInboxAction({
  action,
}: {
  action: ProviderInboxAction;
}) {
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

function ProviderInboxActionList({
  actionRenderer,
  actions,
  context,
  copy,
  row,
}: {
  actionRenderer?: (args: ProviderInboxActionRenderArgs) => React.ReactNode;
  actions?: ProviderInboxAction[];
  context: ProviderInboxActionContext;
  copy: ProviderInboxCopy;
  row: ProviderInboxRow;
}) {
  const visibleActions = actions ?? [];

  if (visibleActions.length === 0) {
    return (
      <span className="text-[11px] text-[var(--taxis-workspace-text-muted)]">
        {copy.actionsLabel}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {visibleActions.map((action) => (
        <span key={action.id}>
          {actionRenderer ? (
            actionRenderer({ action, context, row })
          ) : (
            <DefaultProviderInboxAction action={action} />
          )}
        </span>
      ))}
    </div>
  );
}

function ProviderInboxEmptyState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <WorkspaceInnerCard className="flex min-h-44 flex-col items-center justify-center rounded-[22px] border-dashed p-8 text-center">
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--taxis-workspace-surface-deep)] text-[var(--taxis-workspace-text-muted)] ring-1 ring-[var(--taxis-workspace-surface-rim)]">
        <Inbox aria-hidden="true" size={18} strokeWidth={1.9} />
      </span>
      <h3 className="font-semibold text-[18px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
        {title}
      </h3>
      <p className="mt-2 max-w-xl font-medium text-[13px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
        {description}
      </p>
    </WorkspaceInnerCard>
  );
}

function ProviderInboxSummaryTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <WorkspaceInnerCard className="taxios-provider-summary-tile flex min-h-28 flex-col justify-between rounded-[20px] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="taxios-provider-summary-icon flex h-9 w-9 items-center justify-center rounded-xl">
          {icon}
        </span>
        <span className="font-semibold text-[10px] text-[var(--taxis-workspace-text-subtle)] uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>
      <p className="font-semibold text-[28px] text-[var(--taxis-workspace-text-strong)] leading-none tabular-nums tracking-tight">
        {value}
      </p>
    </WorkspaceInnerCard>
  );
}

function ProviderInboxTopbar({
  activeContextSwitcher,
  activeVisibleCount,
  copy,
  organizationName,
  terminalHistoryVisibleCount,
}: {
  activeContextSwitcher?: React.ReactNode;
  activeVisibleCount: number;
  copy: ProviderInboxCopy;
  organizationName: string;
  terminalHistoryVisibleCount: number;
}) {
  return (
    <header className="taxis-workspace-topbar taxios-provider-topbar z-30 flex min-h-20 shrink-0 flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between xl:h-20 xl:px-10 xl:py-0">
      <div className="flex min-w-0 items-center gap-2 font-semibold text-[13.5px] text-[var(--taxis-workspace-text-muted)] tracking-normal">
        <span className="text-[var(--taxis-workspace-text-muted)]">TaxiOS</span>
        <ChevronRight aria-hidden="true" className="opacity-40" size={14} />
        <span className="min-w-0 truncate text-[var(--taxis-workspace-text-muted)]">
          {organizationName}
        </span>
        <ChevronRight aria-hidden="true" className="opacity-40" size={14} />
        <span className="font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)]">
          {copy.title}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3 lg:gap-5">
        {activeContextSwitcher ? (
          <div className="w-full sm:w-auto">{activeContextSwitcher}</div>
        ) : null}
        <span
          className={cn(
            workspaceChipClassForTone("success", "md"),
            "taxis-system-chip h-10 gap-2 px-4 uppercase tracking-normal",
          )}
        >
          <ShieldCheck aria-hidden="true" size={14} strokeWidth={1.9} />
          Provider context
        </span>
        <span
          className={cn(
            workspaceChipClassForTone("neutral", "md"),
            "taxis-count-chip h-10 px-4 uppercase tracking-normal",
          )}
        >
          {activeVisibleCount} active
        </span>
        <span
          className={cn(
            workspaceChipClassForTone("neutral", "md"),
            "taxis-count-chip h-10 px-4 uppercase tracking-normal",
          )}
        >
          {terminalHistoryVisibleCount} history
        </span>
        <span
          aria-label={copy.historyTitle}
          className="taxis-workspace-topbar-pill relative flex h-11 w-11 items-center justify-center rounded-2xl"
          role="img"
        >
          <Bell
            aria-hidden="true"
            className="text-[var(--taxis-workspace-text-secondary)]"
            size={18}
            strokeWidth={1.9}
          />
          {activeVisibleCount > 0 ? (
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-white bg-[var(--taxis-workspace-accent-strong)] shadow-sm" />
          ) : null}
        </span>
      </div>
    </header>
  );
}

function ProviderInboxTable({
  actionRenderer,
  actionsEnabled = true,
  actionContext,
  description,
  copy,
  rows,
  title,
}: {
  actionRenderer?: (args: ProviderInboxActionRenderArgs) => React.ReactNode;
  actionsEnabled?: boolean;
  actionContext: ProviderInboxActionContext;
  description: string;
  copy: ProviderInboxCopy;
  rows: ProviderInboxRow[];
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
      <div className="taxis-workspace-table-scroll taxis-workspace-scrollbar overflow-x-auto">
        <table className="taxis-company-table taxis-workspace-table w-full min-w-[1040px] border-separate text-left">
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
                {copy.statusColumn}
              </th>
              <th className="taxis-workspace-table-header-cell rounded-r-xl border-y border-r px-4 py-2.5 text-right">
                {copy.actionsLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                className="taxis-workspace-table-row taxios-provider-row group"
                key={row.bookingId}
              >
                <td className="taxis-workspace-table-cell rounded-l-[18px] border-y border-l px-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="taxios-provider-row-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
                      <Building2
                        aria-hidden="true"
                        size={15}
                        strokeWidth={1.9}
                      />
                    </span>
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
                  <div className="flex min-w-0 items-center gap-2">
                    <ArrowRight
                      aria-hidden="true"
                      className="shrink-0 text-[var(--taxis-workspace-accent-strong)]"
                      size={14}
                      strokeWidth={2}
                    />
                    <span className="truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                      {row.destinationAddress}
                    </span>
                  </div>
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
                  <div className="flex flex-col items-start gap-1.5">
                    <ProviderInboxStatusBadge copy={copy} status={row.status} />
                    {row.assignedDriverName ? (
                      <span className="max-w-36 truncate font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
                        {copy.assignedDriverLabel}: {row.assignedDriverName}
                      </span>
                    ) : null}
                    {row.assignedVehicleDisplayName ? (
                      <span className="max-w-36 truncate font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
                        {copy.assignedVehicleLabel}:{" "}
                        {row.assignedVehicleDisplayName}
                        {row.assignedVehicleLicensePlate
                          ? ` (${row.assignedVehicleLicensePlate})`
                          : ""}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="taxis-workspace-table-cell rounded-r-[18px] border-y border-r px-4 py-3.5 text-right">
                  {actionsEnabled ? (
                    <ProviderInboxActionList
                      actionRenderer={actionRenderer}
                      actions={row.allowedActions}
                      context={actionContext}
                      copy={copy}
                      row={row}
                    />
                  ) : (
                    <span className="font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
                      {copy.historyTitle}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WorkspaceSurface>
  );
}

export function ProviderInboxScreen({
  actionRenderer,
  activeContextSwitcher,
  activeRows,
  activeVisibleCount,
  acceptedJobsRows,
  acceptedJobsVisibleCount,
  assignedJobsRows = [],
  assignedJobsVisibleCount,
  availableJobsRows = [],
  availableJobsVisibleCount,
  closedJobsRows,
  closedJobsVisibleCount,
  copy,
  driverOptions = [],
  globalPoolRows = [],
  globalPoolVisibleCount,
  organizationName,
  providerJobForm,
  providerRequestsRows,
  providerRequestsVisibleCount,
  sessionAction,
  terminalHistoryRows,
  terminalHistoryVisibleCount,
  vehicleOptions = [],
}: ProviderInboxScreenProps) {
  const providerRequestRows = providerRequestsRows ?? activeRows;
  const providerRequestVisibleCount =
    providerRequestsVisibleCount ?? activeVisibleCount;
  const acceptedRows = acceptedJobsRows ?? [];
  const acceptedVisibleCount = acceptedJobsVisibleCount ?? acceptedRows.length;
  const availableVisibleCount =
    availableJobsVisibleCount ?? availableJobsRows.length;
  const assignedVisibleCount =
    assignedJobsVisibleCount ?? assignedJobsRows.length;
  const closedRows = closedJobsRows ?? terminalHistoryRows;
  const closedVisibleCount =
    closedJobsVisibleCount ?? terminalHistoryVisibleCount;
  const globalVisibleCount = globalPoolVisibleCount ?? globalPoolRows.length;
  const actionContext = {
    assignDriverEmptyLabel: copy.assignDriverEmptyLabel,
    assignDriverLabel: copy.assignDriverLabel,
    assignVehicleEmptyLabel: copy.assignVehicleEmptyLabel,
    assignVehicleLabel: copy.assignVehicleLabel,
    driverOptions,
    vehicleOptions,
  };
  const totalVisibleCount =
    globalVisibleCount +
    providerRequestVisibleCount +
    acceptedVisibleCount +
    availableVisibleCount +
    assignedVisibleCount +
    closedVisibleCount;

  return (
    <ProviderWorkspaceShell
      activeItem="order_pool"
      orderPoolBadgeCount={providerRequestVisibleCount}
      organizationName={organizationName}
      sessionAction={sessionAction}
    >
      <ProviderInboxTopbar
        activeContextSwitcher={activeContextSwitcher}
        activeVisibleCount={providerRequestVisibleCount}
        copy={copy}
        organizationName={organizationName}
        terminalHistoryVisibleCount={closedVisibleCount}
      />

      <div className="taxis-workspace-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden">
        <div className="taxis-workspace-content-area mx-auto flex w-full max-w-[1800px] flex-col gap-8 px-6 pb-16 pt-10 xl:px-12">
          <section className="taxis-workspace-animate-fade-up flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-[10.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.18em]">
                  {copy.title}
                </p>
                <h1 className="mt-2 font-semibold text-[30px] text-[var(--taxis-workspace-text-strong)] leading-[1.08] tracking-normal">
                  {organizationName}
                </h1>
                <p className="mt-3 max-w-3xl font-medium text-[14px] text-[var(--taxis-workspace-text-muted)] leading-relaxed tracking-tight">
                  {copy.subtitle}
                </p>
              </div>
              <span
                className={cn(
                  workspaceChipClassForTone("neutral", "md"),
                  "taxis-count-chip h-10 w-fit px-4 uppercase tracking-normal",
                )}
              >
                {totalVisibleCount} {copy.visibleLabel}
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <ProviderInboxSummaryTile
                icon={<Inbox aria-hidden="true" size={18} strokeWidth={1.9} />}
                label={copy.globalPoolTitle}
                value={String(globalVisibleCount)}
              />
              <ProviderInboxSummaryTile
                icon={<Inbox aria-hidden="true" size={18} strokeWidth={1.9} />}
                label={copy.assignedBookingsTitle}
                value={String(providerRequestVisibleCount)}
              />
              <ProviderInboxSummaryTile
                icon={
                  <SquareCheckBig
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.9}
                  />
                }
                label={copy.acceptedJobsTitle}
                value={String(acceptedVisibleCount)}
              />
              <ProviderInboxSummaryTile
                icon={<Route aria-hidden="true" size={18} strokeWidth={1.9} />}
                label={copy.availableJobsTitle}
                value={String(availableVisibleCount)}
              />
            </div>
          </section>

          <section className="flex flex-col gap-8">
            {providerJobForm}

            {globalPoolRows.length === 0 ? (
              <ProviderInboxEmptyState
                description={copy.globalPoolEmptyDescription}
                title={copy.globalPoolEmptyTitle}
              />
            ) : (
              <ProviderInboxTable
                actionRenderer={actionRenderer}
                actionContext={actionContext}
                description={copy.globalPoolDescription}
                copy={copy}
                rows={globalPoolRows}
                title={copy.globalPoolTitle}
              />
            )}

            {providerRequestRows.length === 0 ? (
              <ProviderInboxEmptyState
                description={copy.emptyDescription}
                title={copy.emptyTitle}
              />
            ) : (
              <ProviderInboxTable
                actionRenderer={actionRenderer}
                actionContext={actionContext}
                description={copy.assignedBookingsDescription}
                copy={copy}
                rows={providerRequestRows}
                title={copy.assignedBookingsTitle}
              />
            )}

            {acceptedRows.length === 0 ? (
              <ProviderInboxEmptyState
                description={copy.acceptedJobsEmptyDescription}
                title={copy.acceptedJobsEmptyTitle}
              />
            ) : (
              <ProviderInboxTable
                actionRenderer={actionRenderer}
                actionContext={actionContext}
                description={copy.acceptedJobsDescription}
                copy={copy}
                rows={acceptedRows}
                title={copy.acceptedJobsTitle}
              />
            )}

            {availableJobsRows.length === 0 ? (
              <ProviderInboxEmptyState
                description={copy.availableJobsEmptyDescription}
                title={copy.availableJobsEmptyTitle}
              />
            ) : (
              <ProviderInboxTable
                actionRenderer={actionRenderer}
                actionContext={actionContext}
                description={copy.availableJobsDescription}
                copy={copy}
                rows={availableJobsRows}
                title={copy.availableJobsTitle}
              />
            )}

            {assignedJobsRows.length === 0 ? (
              <ProviderInboxEmptyState
                description={copy.assignedJobsEmptyDescription}
                title={copy.assignedJobsEmptyTitle}
              />
            ) : (
              <ProviderInboxTable
                actionRenderer={actionRenderer}
                actionContext={actionContext}
                description={copy.assignedJobsDescription}
                copy={copy}
                rows={assignedJobsRows}
                title={copy.assignedJobsTitle}
              />
            )}

            {closedRows.length === 0 ? (
              <ProviderInboxEmptyState
                description={copy.closedJobsEmptyDescription}
                title={copy.closedJobsEmptyTitle}
              />
            ) : (
              <ProviderInboxTable
                actionsEnabled={false}
                actionContext={actionContext}
                description={copy.closedJobsDescription}
                copy={copy}
                rows={closedRows}
                title={copy.closedJobsTitle}
              />
            )}
          </section>
        </div>
      </div>
    </ProviderWorkspaceShell>
  );
}
