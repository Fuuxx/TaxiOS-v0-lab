import type React from "react";
import { CarFront, Gauge, Warehouse } from "lucide-react";

import type {
  ProviderFleetCopy,
  ProviderFleetPayload,
  ProviderFleetVehicleAction,
  ProviderFleetVehicleOperationalStatus,
  ProviderFleetVehicleRow,
} from "../../../contracts/provider-fleet";
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

export type ProviderFleetScreenProps = {
  activeContextSwitcher?: React.ReactNode;
  copy: ProviderFleetCopy;
  organizationName: string;
  payload: ProviderFleetPayload;
  registerVehicleForm?: React.ReactNode;
  sessionAction?: React.ReactNode;
  vehicleActionRenderer?: (args: {
    action: ProviderFleetVehicleAction;
    row: ProviderFleetVehicleRow;
  }) => React.ReactNode;
};

const statusToneByStatus: Record<
  ProviderFleetVehicleOperationalStatus,
  WorkspaceStatusTone
> = {
  available: "success",
  inactive: "neutral",
  occupied: "attention",
};

function ProviderFleetStatusBadge({
  copy,
  status,
}: {
  copy: ProviderFleetCopy;
  status: ProviderFleetVehicleOperationalStatus;
}) {
  return (
    <span
      className={workspaceChipClassForTone(statusToneByStatus[status])}
    >
      {copy.operationalStatusLabels[status]}
    </span>
  );
}

function ProviderFleetEmptyState({ copy }: { copy: ProviderFleetCopy }) {
  return (
    <WorkspaceInnerCard className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--taxis-workspace-accent-soft)] text-[var(--taxis-workspace-accent-strong)]">
        <CarFront aria-hidden="true" size={22} strokeWidth={1.8} />
      </span>
      <h3 className="mt-4 font-semibold text-[18px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
        {copy.emptyTitle}
      </h3>
      <p className="mt-2 max-w-md text-[13px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
        {copy.emptyDescription}
      </p>
    </WorkspaceInnerCard>
  );
}

function ProviderFleetTable({
  actionRenderer,
  copy,
  payload,
}: {
  actionRenderer?: (args: {
    action: ProviderFleetVehicleAction;
    row: ProviderFleetVehicleRow;
  }) => React.ReactNode;
  copy: ProviderFleetCopy;
  payload: ProviderFleetPayload;
}) {
  return (
    <WorkspaceSurface className="taxis-company-surface-section taxis-workspace-table-shell overflow-hidden p-5">
      <div className="taxis-workspace-table-scroll taxis-company-table-scroll taxis-workspace-scrollbar overflow-x-auto">
        <table className="taxis-workspace-table taxis-company-table min-w-full border-separate text-left">
          <thead>
            <tr>
              <th className="taxis-workspace-table-header-cell taxis-company-table-header-cell rounded-l-xl border-y border-l px-4 py-2.5 font-semibold text-[10px] uppercase">
                {copy.vehicleColumn}
              </th>
              <th className="taxis-workspace-table-header-cell taxis-company-table-header-cell border-y px-4 py-2.5 font-semibold text-[10px] uppercase">
                {copy.licensePlateColumn}
              </th>
              <th className="taxis-workspace-table-header-cell taxis-company-table-header-cell border-y px-4 py-2.5 font-semibold text-[10px] uppercase">
                {copy.statusColumn}
              </th>
              <th className="taxis-workspace-table-header-cell taxis-company-table-header-cell border-y px-4 py-2.5 font-semibold text-[10px] uppercase">
                {copy.activeDriverColumn}
              </th>
              <th className="taxis-workspace-table-header-cell taxis-company-table-header-cell rounded-r-xl border-y border-r px-4 py-2.5 text-right font-semibold text-[10px] uppercase">
                {copy.sessionActionsColumn}
              </th>
            </tr>
          </thead>
          <tbody>
            {payload.vehicles.map((vehicle) => (
              <tr
                className="taxis-workspace-table-row taxis-company-table-row"
                key={vehicle.vehicleId}
              >
                <td className="taxis-workspace-table-cell taxis-company-table-cell rounded-l-[18px] border-y border-l px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--taxis-workspace-panel)] text-[var(--taxis-workspace-accent-strong)] ring-1 ring-[var(--taxis-workspace-border)]">
                      <CarFront
                        aria-hidden="true"
                        size={17}
                        strokeWidth={1.9}
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
                        {vehicle.displayName}
                      </span>
                      {vehicle.publicId ? (
                        <span className="mt-1 block font-mono font-semibold text-[10.5px] text-[var(--taxis-workspace-text-subtle)] tracking-[0.12em]">
                          {vehicle.publicId}
                        </span>
                      ) : null}
                    </span>
                  </div>
                </td>
                <td className="taxis-workspace-table-cell taxis-company-table-cell border-y px-4 py-3.5 font-medium text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                  {vehicle.licensePlate}
                </td>
                <td className="taxis-workspace-table-cell taxis-company-table-cell border-y px-4 py-3.5">
                  <ProviderFleetStatusBadge
                    copy={copy}
                    status={vehicle.operationalStatus}
                  />
                </td>
                <td className="taxis-workspace-table-cell taxis-company-table-cell border-y px-4 py-3.5">
                  <span className="block truncate font-medium text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                    {vehicle.activeDriverName ?? "-"}
                  </span>
                  {vehicle.activeSessionStartedAt ? (
                    <span className="mt-1 block font-semibold text-[10.5px] text-[var(--taxis-workspace-text-subtle)] uppercase tracking-[0.14em]">
                      seit{" "}
                      {new Intl.DateTimeFormat("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(vehicle.activeSessionStartedAt))}
                    </span>
                  ) : null}
                </td>
                <td className="taxis-workspace-table-cell taxis-company-table-cell rounded-r-[18px] border-y border-r px-4 py-3.5 text-right">
                  {vehicle.allowedActions.length > 0 ? (
                    <div className="flex justify-end gap-2">
                      {vehicle.allowedActions.map((action) => (
                        <span key={action.id}>
                          {actionRenderer ? (
                            actionRenderer({ action, row: vehicle })
                          ) : (
                            <span
                              className="inline-flex min-h-8 items-center rounded-lg border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-2.5 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] data-[disabled=true]:opacity-55"
                              data-disabled={action.disabled === true}
                              title={action.reason}
                            >
                              {action.label}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="font-medium text-[12px] text-[var(--taxis-workspace-text-subtle)]">
                      -
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

function ProviderFleetSummary({
  copy,
  payload,
}: {
  copy: ProviderFleetCopy;
  payload: ProviderFleetPayload;
}) {
  return (
    <WorkspaceInnerCard className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
            {copy.activeCountLabel}
          </p>
          <p className="mt-2 font-semibold text-3xl text-[var(--taxis-workspace-text-strong)] tracking-tight">
            {payload.activeVehicleCount}
          </p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--taxis-workspace-accent-soft)] text-[var(--taxis-workspace-accent-strong)]">
          <Gauge aria-hidden="true" size={21} strokeWidth={1.8} />
        </span>
      </div>
    </WorkspaceInnerCard>
  );
}

export function ProviderFleetScreen({
  activeContextSwitcher,
  copy,
  organizationName,
  payload,
  registerVehicleForm,
  sessionAction,
  vehicleActionRenderer,
}: ProviderFleetScreenProps) {
  const hasVehicles = payload.vehicles.length > 0;

  return (
    <ProviderWorkspaceShell
      activeItem="vehicles"
      organizationName={organizationName}
      sessionAction={sessionAction}
    >
      <div className="taxis-workspace-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden">
        <div className="taxis-workspace-content-area mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-6 pb-16 pt-10 xl:px-12">
          <header className="flex flex-col gap-4 rounded-[30px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-5 py-5 shadow-[var(--taxis-workspace-shadow-card)] md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                <Warehouse aria-hidden="true" size={14} strokeWidth={1.9} />
                {organizationName}
              </p>
              <h1 className="mt-2 font-semibold text-[28px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
                {copy.title}
              </h1>
              <p className="mt-2 max-w-2xl text-[13px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
                {copy.subtitle}
              </p>
            </div>
            {activeContextSwitcher ? (
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                {activeContextSwitcher}
              </div>
            ) : null}
          </header>

          <section className="grid gap-5 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]">
            <ProviderFleetSummary copy={copy} payload={payload} />
            {registerVehicleForm ? (
              <section aria-label={copy.formSlotLabel}>
                {registerVehicleForm}
              </section>
            ) : null}
          </section>

          <section className="grid gap-4">
            <WorkspaceSectionHeader title={copy.title} />
            {hasVehicles ? (
              <ProviderFleetTable
                actionRenderer={vehicleActionRenderer}
                copy={copy}
                payload={payload}
              />
            ) : (
              <ProviderFleetEmptyState copy={copy} />
            )}
          </section>
        </div>
      </div>
    </ProviderWorkspaceShell>
  );
}
