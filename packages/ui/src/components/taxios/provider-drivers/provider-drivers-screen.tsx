import type React from "react";
import { ShieldCheck, UserRoundCog, UsersRound } from "lucide-react";

import type {
  DriverInvitationStatus,
  ProviderDriverRow,
  ProviderDriverRowAction,
  ProviderDriversCopy,
  ProviderDriversPayload,
} from "../../../contracts/provider-drivers";
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

export type ProviderDriversActionRenderArgs = {
  action: ProviderDriverRowAction;
  row: ProviderDriverRow;
};

export type ProviderDriversScreenProps = {
  activeContextSwitcher?: React.ReactNode;
  copy: ProviderDriversCopy;
  inviteForm?: React.ReactNode;
  onRenderAction?: (args: ProviderDriversActionRenderArgs) => React.ReactNode;
  organizationName: string;
  payload: ProviderDriversPayload;
  sessionAction?: React.ReactNode;
};

const statusToneByStatus: Record<DriverInvitationStatus, WorkspaceStatusTone> = {
  approved: "success",
  expired: "neutral",
  onboarding_started: "attention",
  onboarding_submitted: "accent",
  pending: "info",
  revoked: "danger",
};

function ProviderDriverStatusBadge({
  copy,
  status,
}: {
  copy: ProviderDriversCopy;
  status: DriverInvitationStatus;
}) {
  return (
    <span
      className={workspaceChipClassForTone(statusToneByStatus[status])}
    >
      {copy.statusLabels[status]}
    </span>
  );
}

function ProviderDriversSummary({
  copy,
  payload,
}: {
  copy: ProviderDriversCopy;
  payload: ProviderDriversPayload;
}) {
  return (
    <WorkspaceInnerCard className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.16em]">
            {copy.activeCountLabel}
          </p>
          <p className="mt-2 font-semibold text-3xl text-[var(--taxis-workspace-text-strong)] tracking-tight">
            {payload.activeDriverCount}
          </p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--taxis-workspace-accent-soft)] text-[var(--taxis-workspace-accent-strong)]">
          <ShieldCheck aria-hidden="true" size={21} strokeWidth={1.8} />
        </span>
      </div>
    </WorkspaceInnerCard>
  );
}

function ProviderDriversEmptyState({ copy }: { copy: ProviderDriversCopy }) {
  return (
    <WorkspaceInnerCard className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--taxis-workspace-accent-soft)] text-[var(--taxis-workspace-accent-strong)]">
        <UsersRound aria-hidden="true" size={22} strokeWidth={1.8} />
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

function ProviderDriverEmailBlock({
  email,
  secondary,
}: {
  email: string;
  secondary: string | null;
}) {
  return (
    <span className="min-w-0">
      <span
        className="block break-all font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)] leading-snug"
        title={email}
      >
        {email}
      </span>
      {secondary ? (
        <span className="mt-1 block text-[12px] text-[var(--taxis-workspace-text-muted)] leading-snug">
          {secondary}
        </span>
      ) : null}
    </span>
  );
}

function getAcceptedAccountDisplay(row: ProviderDriverRow) {
  if (row.acceptedDriverEmail !== null) {
    return {
      primary: row.acceptedDriverEmail,
      secondary:
        row.acceptedDriverName !== null &&
        row.acceptedDriverName !== row.acceptedDriverEmail
          ? row.acceptedDriverName
          : "Signed-in driver account",
      title: row.acceptedDriverEmail,
    };
  }

  if (row.acceptedDriverName !== null) {
    return {
      primary: row.acceptedDriverName,
      secondary: "Account email not mirrored yet",
      title: row.acceptedDriverName,
    };
  }

  if (
    row.status === "approved" ||
    row.status === "onboarding_started" ||
    row.status === "onboarding_submitted"
  ) {
    return {
      primary: "Account email pending",
      secondary: "Convex user mirror has no email yet",
      title: "Account email pending",
    };
  }

  return {
    primary: "No account yet",
    secondary: "Driver has not accepted the invite",
    title: "No accepted account yet",
  };
}

function ProviderDriversTable({
  copy,
  onRenderAction,
  payload,
}: {
  copy: ProviderDriversCopy;
  onRenderAction?: (args: ProviderDriversActionRenderArgs) => React.ReactNode;
  payload: ProviderDriversPayload;
}) {
  return (
    <WorkspaceSurface className="taxis-company-surface-section taxis-workspace-table-shell overflow-hidden p-5">
      <div className="taxis-workspace-table-scroll taxis-company-table-scroll taxis-workspace-scrollbar overflow-x-auto">
        <table className="taxis-workspace-table taxis-company-table min-w-full border-separate text-left">
          <thead>
            <tr>
              <th className="taxis-workspace-table-header-cell taxis-company-table-header-cell min-w-[280px] rounded-l-xl border-y border-l px-4 py-2.5 font-semibold text-[10px] uppercase">
                {copy.invitedDriverColumn}
              </th>
              <th className="taxis-workspace-table-header-cell taxis-company-table-header-cell min-w-[280px] border-y px-4 py-2.5 font-semibold text-[10px] uppercase">
                {copy.acceptedDriverColumn}
              </th>
              <th className="taxis-workspace-table-header-cell taxis-company-table-header-cell min-w-[150px] border-y px-4 py-2.5 font-semibold text-[10px] uppercase">
                {copy.statusColumn}
              </th>
              <th className="taxis-workspace-table-header-cell taxis-company-table-header-cell rounded-r-xl border-y border-r px-4 py-2.5 text-right font-semibold text-[10px] uppercase">
                {copy.actionsColumn}
              </th>
            </tr>
          </thead>
          <tbody>
            {payload.rows.map((row) => {
              const acceptedAccount = getAcceptedAccountDisplay(row);

              return (
                <tr
                  className="taxis-workspace-table-row taxis-company-table-row"
                  key={row.invitationId}
                >
                  <td className="taxis-workspace-table-cell taxis-company-table-cell rounded-l-[18px] border-y border-l px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--taxis-workspace-panel)] text-[var(--taxis-workspace-accent-strong)] ring-1 ring-[var(--taxis-workspace-border)]">
                        <UserRoundCog
                          aria-hidden="true"
                          size={17}
                          strokeWidth={1.9}
                        />
                      </span>
                      <span className="min-w-0">
                        <ProviderDriverEmailBlock
                          email={row.invitedEmail}
                          secondary={
                            row.invitedName === null
                              ? "Invite email"
                              : `Invited as ${row.invitedName}`
                          }
                        />
                        {row.publicId ? (
                          <span className="mt-1 block font-mono font-semibold text-[10.5px] text-[var(--taxis-workspace-text-subtle)] tracking-[0.12em]">
                            {row.publicId}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </td>
                  <td className="taxis-workspace-table-cell taxis-company-table-cell border-y px-4 py-3.5">
                    <span
                      className="block break-all font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)] leading-snug"
                      title={acceptedAccount.title}
                    >
                      {acceptedAccount.primary}
                    </span>
                    <span className="mt-1 block text-[12px] text-[var(--taxis-workspace-text-muted)] leading-snug">
                      {acceptedAccount.secondary}
                    </span>
                  </td>
                  <td className="taxis-workspace-table-cell taxis-company-table-cell border-y px-4 py-3.5">
                    <ProviderDriverStatusBadge copy={copy} status={row.status} />
                  </td>
                  <td className="taxis-workspace-table-cell taxis-company-table-cell rounded-r-[18px] border-y border-r px-4 py-3.5">
                    <div className="flex justify-end gap-2">
                      {row.allowedActions.map((action) =>
                        onRenderAction ? (
                          <span key={action.id}>
                            {onRenderAction({ action, row })}
                          </span>
                        ) : null,
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </WorkspaceSurface>
  );
}

export function ProviderDriversScreen({
  activeContextSwitcher,
  copy,
  inviteForm,
  onRenderAction,
  organizationName,
  payload,
  sessionAction,
}: ProviderDriversScreenProps) {
  const hasRows = payload.rows.length > 0;

  return (
    <ProviderWorkspaceShell
      activeItem="drivers"
      organizationName={organizationName}
      sessionAction={sessionAction}
    >
      <div className="taxis-workspace-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden">
        <div className="taxis-workspace-content-area mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-6 pb-16 pt-10 xl:px-12">
          <header className="flex flex-col gap-4 rounded-[30px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-5 py-5 shadow-[var(--taxis-workspace-shadow-card)] md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.18em]">
                <UsersRound aria-hidden="true" size={14} strokeWidth={1.9} />
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

          <section className="grid gap-5 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)]">
            <ProviderDriversSummary copy={copy} payload={payload} />
            {inviteForm ? (
              <section aria-label={copy.formSlotLabel}>{inviteForm}</section>
            ) : null}
          </section>

          <section className="grid gap-4">
            <WorkspaceSectionHeader title={copy.title} />
            {hasRows ? (
              <ProviderDriversTable
                copy={copy}
                onRenderAction={onRenderAction}
                payload={payload}
              />
            ) : (
              <ProviderDriversEmptyState copy={copy} />
            )}
          </section>
        </div>
      </div>
    </ProviderWorkspaceShell>
  );
}
