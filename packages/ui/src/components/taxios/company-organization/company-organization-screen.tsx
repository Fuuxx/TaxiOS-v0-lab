"use client";

import "../workspace/workspace.css";
import "./company-organization.css";

import {
  Archive,
  Building2,
  Check,
  History,
  Mail,
  Pencil,
  Plus,
  UsersRound,
  X,
} from "lucide-react";
import { WorkspaceStateView } from "../workspace/workspace-state-view";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  CompanyMemberAccessDetail,
  CompanyMemberInvitationRow,
  CompanyMemberInvitationStatus,
  CompanyMemberInviteEmailDeliveryStatus,
  CompanyMemberInviteRole,
  CompanyMemberRow,
  CompanyOrganizationAction,
  CompanyOrganizationCopy,
  CompanyOrganizationPayload,
  CompanyOrganizationSectionId,
  CompanyPermissionDefinition,
  CompanyPermissionKey,
  CompanyRoleRow,
  CompanyUnitRow,
} from "../../../contracts/company-organization";
import { cn } from "../../../lib/utils";
import {
  type CompanyWorkspaceNavItemId,
  CompanyWorkspaceShell,
} from "../company-workspace/company-workspace-shell";
import {
  type CompanyWorkspaceStatusTone,
  companyWorkspaceChipClassForTone,
} from "../workspace/workspace-status";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";
import {
  WorkspaceInnerCard,
  WorkspaceSectionHeader,
  WorkspaceSurface,
} from "../workspace/workspace-primitives";
import {
  WorkspaceEntityCard,
  WorkspaceEntityCardAction,
  WorkspaceEntityCardDetails,
  WorkspaceEntityCardIcon,
  WorkspaceEntityCardLabel,
  WorkspaceEntityCardMetric,
  WorkspaceEntityCardMetrics,
  WorkspaceEntityGrid,
} from "../workspace/workspace-entity-card";

export type CompanyOrganizationInvitationActionRenderArgs = {
  action: CompanyMemberInvitationRow["allowedActions"][number];
  row: CompanyMemberInvitationRow;
};

export type CompanyOrganizationScreenProps = {
  activeSection: CompanyOrganizationSectionId;
  activeContextSwitcher?: React.ReactNode;
  copy: CompanyOrganizationCopy;
  initialAddDialogMode?: CompanyOrganizationAddMode;
  initialAddDialogOpen?: boolean;
  inviteForm?: React.ReactNode;
  memberAccessFeedback?: string | null;
  memberAccessSaving?: boolean;
  memberDetailError?: string | null;
  memberDetailLoading?: boolean;
  onRenderInvitationAction?: (
    args: CompanyOrganizationInvitationActionRenderArgs,
  ) => React.ReactNode;
  onArchiveCompanyRole?: (roleKey: string) => void | Promise<void>;
  onCloseMemberDetail?: () => void;
  onCreateCompanyRole?: (args: {
    description: string;
    name: string;
    permissions: CompanyPermissionKey[];
  }) => void | Promise<void>;
  onSelectMember?: (membershipId: string) => void;
  onUpdateCompanyRole?: (args: {
    description: string;
    name: string;
    permissions: CompanyPermissionKey[];
    roleKey: string;
  }) => void | Promise<void>;
  onUpdateMemberAccess?: (args: {
    extraPermissions: CompanyPermissionKey[];
    membershipId: string;
    roleKey: string;
  }) => void | Promise<void>;
  payload: CompanyOrganizationPayload;
  roleMutationFeedback?: string | null;
  roleMutationSaving?: boolean;
  selectedMemberDetail?: CompanyMemberAccessDetail | null;
  selectedMemberId?: string | null;
  sessionAction?: React.ReactNode;
  unitForm?: React.ReactNode;
};

export type CompanyOrganizationWorkspaceContentProps = Omit<
  CompanyOrganizationScreenProps,
  "activeContextSwitcher" | "sessionAction"
>;

type CompanyOrganizationAddMode = "member" | "unit";

const statusToneByInvitationStatus: Record<
  CompanyMemberInvitationStatus,
  CompanyWorkspaceStatusTone
> = {
  accepted: "success",
  claimed: "attention",
  expired: "muted",
  pending: "info",
  rejected: "danger",
  revoked: "danger",
};

const statusToneByDeliveryStatus: Record<
  CompanyMemberInviteEmailDeliveryStatus,
  CompanyWorkspaceStatusTone
> = {
  failed: "danger",
  not_requested: "muted",
  sent: "success",
};

function StatusBadge({
  copy,
  status,
}: {
  copy: CompanyOrganizationCopy;
  status: CompanyMemberInvitationStatus;
}) {
  return (
    <span
      className={companyWorkspaceChipClassForTone(
        statusToneByInvitationStatus[status],
      )}
    >
      {copy.statusLabels[status]}
    </span>
  );
}

function DeliveryBadge({
  copy,
  status,
}: {
  copy: CompanyOrganizationCopy;
  status: CompanyMemberInviteEmailDeliveryStatus;
}) {
  return (
    <span
      className={companyWorkspaceChipClassForTone(
        statusToneByDeliveryStatus[status],
      )}
    >
      {copy.deliveryStatusLabels[status]}
    </span>
  );
}

function SectionCountBadge({ label, value }: { label: string; value: number }) {
  return (
    <span className={companyWorkspaceChipClassForTone("neutral", "md")}>
      <span className="mr-1.5 font-bold text-[var(--taxis-workspace-text-strong)] tabular-nums">
        {value}
      </span>
      {label}
    </span>
  );
}

function RoleLabel({
  copy,
  role,
}: {
  copy: CompanyOrganizationCopy;
  role: CompanyMemberInviteRole | string;
}) {
  if (
    role === "company_admin" ||
    role === "company_booker" ||
    role === "company_user"
  ) {
    return copy.roleLabels[role];
  }

  return role;
}

function PublicIdLine({ value }: { value: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <span
      className="mt-1 block font-mono font-semibold text-[10.5px] text-[var(--taxis-workspace-text-subtle)] tracking-[0.12em]"
      title="Support reference"
    >
      {value}
    </span>
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
      description={description}
      icon={<UsersRound aria-hidden="true" />}
      title={title}
      variant="empty"
    />
  );
}

function formatDateTimeLabel(timestamp: number | null | undefined) {
  if (!timestamp) {
    return "-";
  }

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(timestamp));
}

function permissionLabelMap(payload: CompanyOrganizationPayload) {
  return new Map(
    payload.access.permissionCatalog.permissions.map((permission) => [
      permission.key,
      permission,
    ]),
  );
}

function PermissionPill({
  label,
  sensitive,
  sensitiveLabel,
}: {
  label: string;
  sensitive?: boolean;
  sensitiveLabel: string;
}) {
  return (
    <span
      className={companyWorkspaceChipClassForTone(
        sensitive ? "attention" : "neutral",
      )}
      title={sensitive ? sensitiveLabel : undefined}
    >
      {label}
    </span>
  );
}

function PermissionPillList({
  copy,
  emptyLabel = "-",
  keys,
  permissionByKey,
}: {
  copy: CompanyOrganizationCopy;
  emptyLabel?: string;
  keys: readonly CompanyPermissionKey[];
  permissionByKey: Map<CompanyPermissionKey, CompanyPermissionDefinition>;
}) {
  if (keys.length === 0) {
    return (
      <span className="text-[12px] text-[var(--taxis-workspace-text-muted)]">
        {emptyLabel}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keys.map((key) => {
        const permission = permissionByKey.get(key);

        return (
          <PermissionPill
            key={key}
            label={permission?.label ?? key}
            sensitive={permission?.sensitive}
            sensitiveLabel={copy.permissionSensitiveLabel}
          />
        );
      })}
    </div>
  );
}

function DetailMetric({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string;
  secondary?: string | null;
}) {
  return (
    <div className="min-w-0 rounded-[18px] border border-[var(--taxis-workspace-border)] bg-white/82 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
      <span className="block font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
        {label}
      </span>
      <p className="mt-1 truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
        {primary}
      </p>
      {secondary ? (
        <p className="mt-0.5 truncate font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
          {secondary}
        </p>
      ) : null}
    </div>
  );
}

function PermissionChecklist({
  disabled,
  draftExtraPermissions,
  onToggleExtraPermission,
  payload,
  rolePermissions,
}: {
  disabled?: boolean;
  draftExtraPermissions: readonly CompanyPermissionKey[];
  onToggleExtraPermission: (
    key: CompanyPermissionKey,
    checked: boolean,
  ) => void;
  payload: CompanyOrganizationPayload;
  rolePermissions?: readonly CompanyPermissionKey[];
}) {
  const rolePermissionSet = new Set(rolePermissions ?? []);
  const draftExtraPermissionSet = new Set(draftExtraPermissions);

  return (
    <div className="grid gap-4">
      {payload.access.permissionCatalog.groups.map((group) => (
        <section
          className="rounded-[18px] border border-[var(--taxis-workspace-border)] bg-white/72 p-4"
          key={group.key}
        >
          <div className="mb-3">
            <h5 className="font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
              {group.label}
            </h5>
            <p className="mt-0.5 text-[11px] text-[var(--taxis-workspace-text-muted)]">
              {group.description}
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {group.permissions.map((permission) => {
              const lockedByRole = rolePermissionSet.has(permission.key);
              const checked =
                lockedByRole || draftExtraPermissionSet.has(permission.key);

              return (
                <label
                  className={cn(
                    "flex min-h-12 items-start gap-3 rounded-[14px] border border-[var(--taxis-workspace-border)] bg-white/78 px-3 py-2.5 text-left",
                    disabled && "opacity-70",
                  )}
                  key={permission.key}
                >
                  <input
                    checked={checked}
                    className="mt-1 h-4 w-4 rounded border-[var(--taxis-workspace-border-strong)] text-[var(--taxis-workspace-accent)]"
                    disabled={disabled || lockedByRole}
                    onChange={(event) =>
                      onToggleExtraPermission(
                        permission.key,
                        event.currentTarget.checked,
                      )
                    }
                    type="checkbox"
                  />
                  <span className="min-w-0">
                    <span className="block font-semibold text-[12px] text-[var(--taxis-workspace-text-strong)]">
                      {permission.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[var(--taxis-workspace-text-muted)] leading-snug">
                      {permission.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

const tableShellClassName =
  "taxis-company-surface-section taxis-workspace-table-shell taxios-company-organization-table-shell overflow-hidden p-3";

const headerCellClassName =
  "taxis-workspace-table-header-cell taxios-company-organization-header-cell border-y px-4 py-3 font-semibold text-[10px] uppercase tracking-[0.14em] first:rounded-l-[16px] first:border-l last:rounded-r-[16px] last:border-r";

const bodyCellClassName =
  "taxis-workspace-table-cell taxios-company-organization-cell border-y px-4 py-4 first:rounded-l-[18px] first:border-l last:rounded-r-[18px] last:border-r";

const companyOrganizationSectionOrder: readonly CompanyOrganizationSectionId[] =
  ["overview", "standorte", "members", "roles", "invites"];

const addModeLabels: Record<CompanyOrganizationAddMode, string> = {
  member: "Mitglied",
  unit: "Standort",
};

function findEnabledOrganizationAction(
  actions: readonly CompanyOrganizationAction[],
  id: CompanyOrganizationAction["id"],
) {
  const action = actions.find((candidate) => candidate.id === id);

  return action && !action.disabled ? action : null;
}

function preferredAddModeForSection({
  activeSection,
  fallback,
  modes,
}: {
  activeSection: CompanyOrganizationSectionId;
  fallback?: CompanyOrganizationAddMode;
  modes: readonly CompanyOrganizationAddMode[];
}) {
  if (fallback && modes.includes(fallback)) {
    return fallback;
  }

  if (activeSection === "members" && modes.includes("member")) {
    return "member";
  }

  if (activeSection === "standorte" && modes.includes("unit")) {
    return "unit";
  }

  return modes[0] ?? "member";
}

function sectionHref(section: CompanyOrganizationSectionId) {
  return section === "overview"
    ? "/company-organization"
    : `/company-organization?section=${section}`;
}

function normalizeCompanyOrganizationSection(
  section: string | null | undefined,
): CompanyOrganizationSectionId {
  return companyOrganizationSectionOrder.includes(
    section as CompanyOrganizationSectionId,
  )
    ? (section as CompanyOrganizationSectionId)
    : "overview";
}

function readSectionFromLocation(): CompanyOrganizationSectionId {
  if (typeof window === "undefined") {
    return "overview";
  }

  return normalizeCompanyOrganizationSection(
    new URLSearchParams(window.location.search).get("section"),
  );
}

function pushSectionUrl(section: CompanyOrganizationSectionId) {
  if (typeof window === "undefined") {
    return;
  }

  const nextPath = sectionHref(section);
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (nextPath !== currentPath) {
    window.history.pushState(null, "", nextPath);
  }
}

function workspaceActiveItemForSection(
  _section: CompanyOrganizationSectionId,
): CompanyWorkspaceNavItemId {
  return "organization";
}

function CompanyOrganizationSectionNavigation({
  activeSection,
  copy,
  onSectionChange,
  visibleSections,
}: {
  activeSection: CompanyOrganizationSectionId;
  copy: CompanyOrganizationCopy;
  onSectionChange: (section: CompanyOrganizationSectionId) => void;
  visibleSections: readonly CompanyOrganizationSectionId[];
}) {
  const tabs = companyOrganizationSectionOrder.filter((section) =>
    visibleSections.includes(section),
  );

  function handleKeyDown(event: React.KeyboardEvent) {
    const currentIndex = tabs.indexOf(activeSection);

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prevIndex = currentIndex <= 0 ? tabs.length - 1 : currentIndex - 1;
      onSectionChange(tabs[prevIndex]);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = currentIndex >= tabs.length - 1 ? 0 : currentIndex + 1;
      onSectionChange(tabs[nextIndex]);
    }
  }

  return (
    <div
      aria-label="Company organization sections"
      className="taxios-company-organization-section-nav"
      onKeyDown={handleKeyDown}
      role="tablist"
    >
      {tabs.map((section) => {
        const active = section === activeSection;
        const tabId = `taxios-org-tab-${section}`;
        const panelId =
          section === "overview"
            ? undefined
            : `taxios-org-panel-${section}`;

        return (
          <button
            aria-controls={panelId}
            aria-selected={active}
            className={cn(
              "taxios-company-organization-section-link",
              active && "taxios-company-organization-section-link-active",
            )}
            data-company-organization-section-link={section}
            id={tabId}
            key={section}
            onClick={() => onSectionChange(section)}
            role="tab"
            tabIndex={active ? 0 : -1}
            type="button"
          >
            <span>{copy.sectionLabels[section]}</span>
          </button>
        );
      })}
    </div>
  );
}

function CompanyMemberAccessDrawer({
  copy,
  detail,
  error,
  isOpen,
  loading,
  onClose,
  onUpdateMemberAccess,
  payload,
  saving,
  feedback,
}: {
  copy: CompanyOrganizationCopy;
  detail: CompanyMemberAccessDetail | null;
  error?: string | null;
  feedback?: string | null;
  isOpen: boolean;
  loading?: boolean;
  onClose?: () => void;
  onUpdateMemberAccess?: (args: {
    extraPermissions: CompanyPermissionKey[];
    membershipId: string;
    roleKey: string;
  }) => void | Promise<void>;
  payload: CompanyOrganizationPayload;
  saving?: boolean;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const permissionByKey = useMemo(() => permissionLabelMap(payload), [payload]);
  const canManage =
    payload.access.allowedActions.some(
      (action) =>
        action.id === "manage_company_member_access" && !action.disabled,
    ) && Boolean(onUpdateMemberAccess);
  const [editing, setEditing] = useState(false);
  const [draftRoleKey, setDraftRoleKey] = useState("");
  const [draftExtraPermissions, setDraftExtraPermissions] = useState<
    CompanyPermissionKey[]
  >([]);
  const selectedRole =
    payload.access.roles.find((role) => role.roleKey === draftRoleKey) ??
    payload.access.roles[0] ??
    null;

  useEffect(() => {
    if (!detail) {
      setEditing(false);
      setDraftRoleKey("");
      setDraftExtraPermissions([]);
      return;
    }

    setEditing(false);
    setDraftRoleKey(detail.access.roleKey);
    setDraftExtraPermissions(detail.access.extraPermissions);
  }, [detail]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          [
            "a[href]",
            "button:not([disabled])",
            "textarea:not([disabled])",
            'input:not([disabled]):not([type="hidden"])',
            "select:not([disabled])",
            '[tabindex]:not([tabindex="-1"])',
          ].join(","),
        ),
      ).filter((element) => {
        const style = window.getComputedStyle(element);
        return style.visibility !== "hidden" && style.display !== "none";
      });

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const currentIndex =
        active instanceof HTMLElement ? focusables.indexOf(active) : -1;

      if (!event.shiftKey) {
        if (currentIndex === -1 || currentIndex >= focusables.length - 1) {
          event.preventDefault();
          first.focus();
        }
      } else if (currentIndex <= 0) {
        event.preventDefault();
        last.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      previousFocused?.focus();
    };
  }, [isOpen]);

  const titleId = detail
    ? `taxios-company-member-detail-title-${detail.membershipId}`
    : "taxios-company-member-detail-title";
  const displayName =
    detail?.displayName ??
    detail?.companyContactEmail ??
    detail?.email ??
    copy.memberDetailTitle;
  const rolePermissions = editing
    ? (selectedRole?.permissions ?? [])
    : (detail?.access.rolePermissions ?? []);

  function toggleExtraPermission(key: CompanyPermissionKey, checked: boolean) {
    setDraftExtraPermissions((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }

      return Array.from(next);
    });
  }

  async function handleSave() {
    if (!detail || !onUpdateMemberAccess) return;

    await onUpdateMemberAccess({
      extraPermissions: draftExtraPermissions,
      membershipId: detail.membershipId,
      roleKey: draftRoleKey,
    });
    setEditing(false);
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[210] flex items-center justify-end p-6 transition-all duration-200 md:p-8",
        isOpen ? "visible" : "invisible",
      )}
    >
      <button
        aria-label={copy.memberDetailCloseLabel}
        className={cn(
          "absolute inset-0 bg-slate-950/14 backdrop-blur-md transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <div
        ref={panelRef}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          "taxis-overlay-panel ride-detail-floating-panel taxis-workspace-ease-standard relative flex h-[calc(100dvh-48px)] max-h-[calc(100dvh-48px)] w-[min(540px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[26px] border",
          isOpen
            ? "ride-detail-floating-panel-open translate-x-0 scale-100 opacity-100"
            : "translate-x-[110%] scale-[0.985] opacity-0",
        )}
        role="dialog"
      >
        <div className="taxis-overlay-header relative z-10 flex items-start justify-between gap-4 border-zinc-100/70 border-b px-6 pt-6 pb-5">
          <div className="min-w-0 flex-1">
            <span className="block font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
              {copy.memberDetailTitle}
            </span>
            <div className="mt-3 flex min-w-0 items-center gap-3">
              <WorkspaceAvatar
                className="h-12 w-12"
                initials={(displayName || "M")
                  .split(/\s+/)
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
                name={displayName}
              />
              <div className="min-w-0">
                <h3
                  className="truncate font-semibold text-[22px] text-[var(--taxis-workspace-text-strong)] tracking-tight"
                  id={titleId}
                >
                  {displayName}
                </h3>
                <PublicIdLine value={detail?.memberPublicId ?? null} />
              </div>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            aria-label={copy.memberDetailCloseLabel}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--taxis-workspace-border)] bg-white/88 text-[var(--taxis-workspace-text-muted)] shadow-sm transition-all hover:border-[var(--taxis-workspace-border-strong)] hover:text-[var(--taxis-workspace-text-strong)]"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="taxis-workspace-scrollbar flex-1 space-y-6 overflow-y-auto px-6 pt-6 pb-7">
          {loading ? (
            <WorkspaceInnerCard className="p-5 text-[13px] text-[var(--taxis-workspace-text-muted)]">
              Wird geladen...
            </WorkspaceInnerCard>
          ) : null}

          {error ? (
            <WorkspaceInnerCard className="p-5 text-[13px] text-[var(--taxis-status-danger-text)]">
              {error}
            </WorkspaceInnerCard>
          ) : null}

          {detail ? (
            <>
              <section className="grid gap-3 sm:grid-cols-2">
                <DetailMetric
                  label="E-Mail"
                  primary={detail.email ?? "-"}
                  secondary={detail.companyContactEmail}
                />
                <DetailMetric
                  label={copy.memberDetailUnitLabel}
                  primary={detail.unitName ?? "-"}
                />
                <DetailMetric
                  label={copy.memberDetailSinceLabel}
                  primary={formatDateTimeLabel(detail.membershipCreatedAt)}
                />
                <DetailMetric
                  label={copy.memberDetailUpdatedLabel}
                  primary={formatDateTimeLabel(detail.membershipUpdatedAt)}
                />
              </section>

              <section className="rounded-[22px] border border-[var(--taxis-workspace-border)] bg-white/82 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                      {copy.memberDetailPermissionsTitle}
                    </h4>
                    <p className="mt-1 text-[12px] text-[var(--taxis-workspace-text-muted)]">
                      {canManage
                        ? detail.access.roleName
                        : copy.memberDetailReadOnlyReason}
                    </p>
                  </div>
                  {canManage && !editing ? (
                    <button
                      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--taxis-workspace-border)] bg-white px-3 font-semibold text-[12px] text-[var(--taxis-workspace-text-strong)] shadow-sm"
                      onClick={() => setEditing(true)}
                      type="button"
                    >
                      <Pencil size={14} />
                      {copy.memberDetailEditLabel}
                    </button>
                  ) : null}
                </div>

                {editing ? (
                  <div className="grid gap-4">
                    <label className="grid gap-1.5">
                      <span className="font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                        {copy.memberRoleColumn}
                      </span>
                      <select
                        className="min-h-11 rounded-[14px] border border-[var(--taxis-workspace-border)] bg-white px-3 font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)] shadow-sm"
                        disabled={saving}
                        onChange={(event) => {
                          setDraftRoleKey(event.currentTarget.value);
                          setDraftExtraPermissions((current) =>
                            current.filter(
                              (permission) =>
                                !(
                                  payload.access.roles
                                    .find(
                                      (role) =>
                                        role.roleKey ===
                                        event.currentTarget.value,
                                    )
                                    ?.permissions.includes(permission) ?? false
                                ),
                            ),
                          );
                        }}
                        value={draftRoleKey}
                      >
                        {payload.access.roles.map((role) => (
                          <option key={role.roleKey} value={role.roleKey}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <PermissionChecklist
                      disabled={saving}
                      draftExtraPermissions={draftExtraPermissions}
                      onToggleExtraPermission={toggleExtraPermission}
                      payload={payload}
                      rolePermissions={rolePermissions}
                    />
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {feedback ? (
                        <span className="mr-auto text-[12px] text-[var(--taxis-workspace-text-muted)]">
                          {feedback}
                        </span>
                      ) : null}
                      <button
                        className="inline-flex min-h-10 items-center rounded-full border border-[var(--taxis-workspace-border)] bg-white px-4 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)]"
                        disabled={saving}
                        onClick={() => {
                          setEditing(false);
                          setDraftRoleKey(detail.access.roleKey);
                          setDraftExtraPermissions(
                            detail.access.extraPermissions,
                          );
                        }}
                        type="button"
                      >
                        {copy.memberDetailCancelLabel}
                      </button>
                      <button
                        className="inline-flex min-h-10 items-center rounded-full bg-[var(--taxis-workspace-text-strong)] px-4 font-semibold text-[12px] text-white shadow-sm"
                        disabled={saving}
                        onClick={handleSave}
                        type="button"
                      >
                        {saving
                          ? copy.memberDetailSavingLabel
                          : copy.memberDetailSaveLabel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <div>
                      <span className="mb-2 block font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                        {copy.memberDetailRolePermissionsLabel}
                      </span>
                      <PermissionPillList
                        copy={copy}
                        keys={detail.access.rolePermissions}
                        permissionByKey={permissionByKey}
                      />
                    </div>
                    <div>
                      <span className="mb-2 block font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                        {copy.memberDetailExtraPermissionsLabel}
                      </span>
                      <PermissionPillList
                        copy={copy}
                        keys={detail.access.extraPermissions}
                        permissionByKey={permissionByKey}
                      />
                    </div>
                    <div>
                      <span className="mb-2 block font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                        {copy.memberDetailEffectivePermissionsLabel}
                      </span>
                      <PermissionPillList
                        copy={copy}
                        keys={detail.access.effectivePermissions}
                        permissionByKey={permissionByKey}
                      />
                    </div>
                  </div>
                )}
              </section>

              <section>
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                  <History size={14} />
                  {copy.memberDetailAuditTitle}
                </h4>
                {detail.auditHistory.length === 0 ? (
                  <WorkspaceInnerCard className="p-4 text-[12px] text-[var(--taxis-workspace-text-muted)]">
                    {copy.memberDetailNoAuditLabel}
                  </WorkspaceInnerCard>
                ) : (
                  <div className="space-y-2">
                    {detail.auditHistory.map((event) => (
                      <div
                        className="rounded-[18px] border border-[var(--taxis-workspace-border)] bg-white/82 p-4"
                        key={`${event.decision}-${event.createdAt}-${event.publicId}`}
                      >
                        <p className="font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                          {event.decision}
                        </p>
                        <p className="mt-1 text-[11px] text-[var(--taxis-workspace-text-muted)]">
                          {formatDateTimeLabel(event.createdAt)}
                          {event.publicId ? ` · ${event.publicId}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function RoleManagementPanel({
  copy,
  payload,
  onArchiveCompanyRole,
  onCreateCompanyRole,
  onUpdateCompanyRole,
  saving,
  feedback,
}: {
  copy: CompanyOrganizationCopy;
  feedback?: string | null;
  onArchiveCompanyRole?: (roleKey: string) => void | Promise<void>;
  onCreateCompanyRole?: (args: {
    description: string;
    name: string;
    permissions: CompanyPermissionKey[];
  }) => void | Promise<void>;
  onUpdateCompanyRole?: (args: {
    description: string;
    name: string;
    permissions: CompanyPermissionKey[];
    roleKey: string;
  }) => void | Promise<void>;
  payload: CompanyOrganizationPayload;
  saving?: boolean;
}) {
  const permissionByKey = useMemo(() => permissionLabelMap(payload), [payload]);
  const canCreate =
    payload.access.allowedActions.some(
      (action) => action.id === "create_company_role" && !action.disabled,
    ) && Boolean(onCreateCompanyRole);
  const canManage =
    payload.access.allowedActions.some(
      (action) =>
        action.id === "manage_company_member_access" && !action.disabled,
    ) && Boolean(onUpdateCompanyRole);
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftPermissions, setDraftPermissions] = useState<
    CompanyPermissionKey[]
  >([]);
  const [editingRoleKey, setEditingRoleKey] = useState<string | null>(null);
  const editingRole =
    editingRoleKey === null
      ? null
      : (payload.access.roles.find((role) => role.roleKey === editingRoleKey) ??
        null);

  function toggleDraftPermission(key: CompanyPermissionKey, checked: boolean) {
    setDraftPermissions((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }

      return Array.from(next);
    });
  }

  async function handleCreate() {
    if (!onCreateCompanyRole || draftName.trim().length === 0) return;

    await onCreateCompanyRole({
      description: draftDescription,
      name: draftName,
      permissions: draftPermissions,
    });
    setDraftName("");
    setDraftDescription("");
    setDraftPermissions([]);
  }

  async function handleUpdate() {
    if (!editingRole || !onUpdateCompanyRole || draftName.trim().length === 0) {
      return;
    }

    await onUpdateCompanyRole({
      description: draftDescription,
      name: draftName,
      permissions: draftPermissions,
      roleKey: editingRole.roleKey,
    });
    setEditingRoleKey(null);
    setDraftName("");
    setDraftDescription("");
    setDraftPermissions([]);
  }

  function beginEdit(role: CompanyRoleRow) {
    setEditingRoleKey(role.roleKey);
    setDraftName(role.name);
    setDraftDescription(role.description);
    setDraftPermissions(role.permissions);
  }

  function cancelEdit() {
    setEditingRoleKey(null);
    setDraftName("");
    setDraftDescription("");
    setDraftPermissions([]);
  }

  return (
    <div className="grid gap-5">
      <WorkspaceSurface className="taxis-company-surface-section p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-semibold text-[22px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
              {copy.roleManagementSectionTitle}
            </h2>
            <p className="mt-1 max-w-2xl text-[13px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
              {copy.roleManagementDescription}
            </p>
          </div>
          {feedback ? (
            <span className="rounded-full bg-[var(--taxis-workspace-accent-soft)] px-3 py-1.5 font-semibold text-[11px] text-[var(--taxis-workspace-accent-strong)]">
              {feedback}
            </span>
          ) : null}
        </div>
      </WorkspaceSurface>

      <div className="grid gap-4 lg:grid-cols-2">
        {payload.access.roles.map((role) => (
          <WorkspaceSurface
            className="taxis-company-surface-section p-5"
            key={role.roleKey}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[17px] text-[var(--taxis-workspace-text-strong)]">
                    {role.name}
                  </h3>
                  <span className={companyWorkspaceChipClassForTone("neutral")}>
                    {role.systemRole
                      ? copy.roleManagementSystemRoleLabel
                      : copy.roleManagementCustomRoleLabel}
                  </span>
                </div>
                <PublicIdLine value={role.publicId} />
                <p className="mt-2 text-[12px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
                  {role.description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!role.systemRole && canManage ? (
                  <button
                    aria-label={`${role.name} bearbeiten`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--taxis-workspace-border)] bg-white text-[var(--taxis-workspace-text-muted)] shadow-sm"
                    disabled={saving}
                    onClick={() => beginEdit(role)}
                    type="button"
                  >
                    <Pencil size={15} />
                  </button>
                ) : null}
                {!role.systemRole && canManage && onArchiveCompanyRole ? (
                  <button
                    aria-label={`${role.name} archivieren`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--taxis-workspace-border)] bg-white text-[var(--taxis-workspace-text-muted)] shadow-sm disabled:opacity-45"
                    disabled={saving || role.assignedMemberCount > 0}
                    onClick={() => onArchiveCompanyRole(role.roleKey)}
                    title={
                      role.assignedMemberCount > 0
                        ? "Rolle ist noch Mitgliedern zugewiesen."
                        : undefined
                    }
                    type="button"
                  >
                    <Archive size={15} />
                  </button>
                ) : null}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-[var(--taxis-workspace-text-muted)]">
              <UsersRound size={14} />
              {role.assignedMemberCount} {copy.roleManagementMembersLabel}
            </div>
            <div className="mt-4">
              <PermissionPillList
                copy={copy}
                keys={role.permissions}
                permissionByKey={permissionByKey}
              />
            </div>
          </WorkspaceSurface>
        ))}
      </div>

      {canCreate || editingRole ? (
        <WorkspaceSurface className="taxis-company-surface-section p-5">
          <div className="mb-4 flex items-center gap-2">
            {editingRole ? <Pencil size={17} /> : <Plus size={17} />}
            <h3 className="font-semibold text-[17px] text-[var(--taxis-workspace-text-strong)]">
              {editingRole
                ? `${editingRole.name} bearbeiten`
                : copy.roleManagementCreateLabel}
            </h3>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                  Name
                </span>
                <input
                  className="min-h-11 rounded-[14px] border border-[var(--taxis-workspace-border)] bg-white px-3 font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)] shadow-sm"
                  disabled={saving}
                  onChange={(event) => setDraftName(event.currentTarget.value)}
                  value={draftName}
                />
              </label>
              <label className="grid gap-1.5">
                <span className="font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                  Beschreibung
                </span>
                <input
                  className="min-h-11 rounded-[14px] border border-[var(--taxis-workspace-border)] bg-white px-3 font-medium text-[13px] text-[var(--taxis-workspace-text-strong)] shadow-sm"
                  disabled={saving}
                  onChange={(event) =>
                    setDraftDescription(event.currentTarget.value)
                  }
                  value={draftDescription}
                />
              </label>
            </div>
            <PermissionChecklist
              disabled={saving}
              draftExtraPermissions={draftPermissions}
              onToggleExtraPermission={toggleDraftPermission}
              payload={payload}
            />
            <div className="flex justify-end gap-2">
              {editingRole ? (
                <button
                  className="inline-flex min-h-10 items-center rounded-full border border-[var(--taxis-workspace-border)] bg-white px-4 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)]"
                  disabled={saving}
                  onClick={cancelEdit}
                  type="button"
                >
                  {copy.memberDetailCancelLabel}
                </button>
              ) : null}
              <button
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--taxis-workspace-text-strong)] px-4 font-semibold text-[12px] text-white shadow-sm disabled:opacity-55"
                disabled={saving || draftName.trim().length === 0}
                onClick={editingRole ? handleUpdate : handleCreate}
                type="button"
              >
                <Check size={15} />
                {saving
                  ? copy.memberDetailSavingLabel
                  : copy.memberDetailSaveLabel}
              </button>
            </div>
          </div>
        </WorkspaceSurface>
      ) : null}
    </div>
  );
}

function CompanyOrganizationAddDialog({
  activeMode,
  availableModes,
  inviteForm,
  isOpen,
  onClose,
  onModeChange,
  unitForm,
}: {
  activeMode: CompanyOrganizationAddMode;
  availableModes: readonly CompanyOrganizationAddMode[];
  inviteForm?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onModeChange: (mode: CompanyOrganizationAddMode) => void;
  unitForm?: React.ReactNode;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = "taxios-company-organization-add-dialog-title";
  const activeForm = activeMode === "member" ? inviteForm : unitForm;
  const title =
    activeMode === "member" ? "Mitglied hinzufügen" : "Standort hinzufügen";
  const description =
    activeMode === "member"
      ? "Lade ein Benutzerkonto in den aktiven Company-Workspace ein."
      : "Lege einen neuen Standort für diesen Company-Workspace an.";

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          [
            "a[href]",
            "button:not([disabled])",
            "textarea:not([disabled])",
            'input:not([disabled]):not([type="hidden"])',
            "select:not([disabled])",
            '[tabindex]:not([tabindex="-1"])',
          ].join(","),
        ),
      ).filter((element) => {
        const style = window.getComputedStyle(element);
        return style.visibility !== "hidden" && style.display !== "none";
      });

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const currentIndex =
        active instanceof HTMLElement ? focusables.indexOf(active) : -1;

      if (!event.shiftKey) {
        if (currentIndex === -1 || currentIndex >= focusables.length - 1) {
          event.preventDefault();
          first.focus();
        }
      } else if (currentIndex <= 0) {
        event.preventDefault();
        last.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      previousFocused?.focus();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="taxios-company-organization-add-overlay fixed inset-0 z-[220] flex items-center justify-center p-4 md:p-8"
      data-company-organization-add-dialog
    >
      <button
        aria-label="Hinzufügen schließen"
        className="taxios-company-organization-add-backdrop absolute inset-0"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <div
        ref={panelRef}
        aria-labelledby={titleId}
        aria-modal="true"
        className="taxios-company-organization-add-panel taxis-workspace-ease-standard relative flex h-[min(760px,calc(100dvh-2rem))] w-[min(760px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[28px] border"
        role="dialog"
      >
        <div className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_1px_0_0_rgba(255,255,255,0.82),inset_0_-1px_0_rgba(15,23,42,0.04)]" />
        <div className="relative z-10 flex shrink-0 items-start justify-between gap-4 border-zinc-100/70 border-b bg-white/74 px-5 pt-5 pb-4 md:px-6">
          <div className="min-w-0">
            <p className="font-semibold text-[10.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
              Organisation
            </p>
            <h2
              className="mt-2 font-semibold text-[24px] text-[var(--taxis-workspace-text-strong)] tracking-tight"
              id={titleId}
            >
              {title}
            </h2>
            <p className="mt-1 max-w-xl text-[13px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
              {description}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            aria-label="Hinzufügen schließen"
            className="taxios-company-organization-add-close inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[var(--taxis-workspace-accent)] focus-visible:outline-offset-2"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} strokeWidth={1.9} />
          </button>
        </div>

        <div
          aria-label="Hinzufügen Typ"
          className="taxios-company-organization-add-tabs relative z-10 mx-5 mt-5 flex w-fit max-w-[calc(100%-2.5rem)] shrink-0 gap-1 overflow-x-auto rounded-[16px] p-1 md:mx-6 md:max-w-[calc(100%-3rem)]"
          role="tablist"
        >
          {availableModes.map((mode) => {
            const active = mode === activeMode;
            const tabId = `taxios-org-add-tab-${mode}`;
            const panelId = `taxios-org-add-panel-${mode}`;

            return (
              <button
                aria-controls={panelId}
                aria-selected={active}
                className={cn(
                  "taxios-company-organization-add-tab inline-flex min-h-10 min-w-max items-center justify-center rounded-[12px] px-4 font-semibold text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--taxis-workspace-surface)] focus-visible:outline-offset-2",
                  active && "taxios-company-organization-add-tab-active",
                )}
                id={tabId}
                key={mode}
                onClick={() => onModeChange(mode)}
                role="tab"
                type="button"
              >
                {addModeLabels[mode]}
              </button>
            );
          })}
        </div>

        <div
          aria-labelledby={`taxios-org-add-tab-${activeMode}`}
          className="relative z-10 mt-5 min-h-0 flex-1 overflow-y-auto px-5 pb-5 md:px-6 md:pb-6"
          id={`taxios-org-add-panel-${activeMode}`}
          role="tabpanel"
        >
          {activeForm ?? null}
        </div>
      </div>
    </div>
  );
}

function CompanyOrganizationAddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="taxis-section-action taxios-new-booking taxios-company-organization-add-button group relative inline-flex min-h-11 shrink-0 items-center rounded-full py-3 pr-5 pl-4 text-left text-white focus-visible:outline-2 focus-visible:outline-[var(--taxis-workspace-accent)] focus-visible:outline-offset-2"
      onClick={onClick}
      type="button"
    >
      <span
        aria-hidden="true"
        className="taxios-new-booking-iconwrap relative z-10"
      >
        <Plus className="taxios-new-booking-icon" size={16} strokeWidth={2.3} />
      </span>
      <span className="relative z-10 ml-3 font-semibold text-[14px] tracking-tight">
        {label}
      </span>
    </button>
  );
}

function formatUnitAddress(row: CompanyUnitRow) {
  const cityLine = [row.postalCode, row.city].filter(Boolean).join(" ");

  return [row.street, cityLine].filter(Boolean).join(", ") || "-";
}

function formatUnitContact(row: CompanyUnitRow) {
  return [row.contactEmail, row.contactPhone].filter(Boolean).join(" / ");
}

type UnitCardStats = {
  activeMemberCount: number;
  openInvitationCount: number;
};

function isOpenUnitInvitation(invitation: CompanyMemberInvitationRow) {
  return invitation.status === "pending" || invitation.status === "claimed";
}

function createEmptyUnitCardStats(): UnitCardStats {
  return {
    activeMemberCount: 0,
    openInvitationCount: 0,
  };
}

function buildUnitCardStatsByUnitId({
  invitations,
  members,
}: {
  invitations: CompanyMemberInvitationRow[];
  members: CompanyMemberRow[];
}) {
  const statsByUnitId = new Map<string, UnitCardStats>();

  function ensureStats(unitId: string) {
    const existingStats = statsByUnitId.get(unitId);

    if (existingStats) {
      return existingStats;
    }

    const createdStats = createEmptyUnitCardStats();
    statsByUnitId.set(unitId, createdStats);

    return createdStats;
  }

  for (const member of members) {
    if (!member.unitId || member.status !== "active") {
      continue;
    }

    ensureStats(member.unitId).activeMemberCount += 1;
  }

  for (const invitation of invitations) {
    if (!invitation.unitId || !isOpenUnitInvitation(invitation)) {
      continue;
    }

    ensureStats(invitation.unitId).openInvitationCount += 1;
  }

  return statsByUnitId;
}

function UnitsCardGrid({
  copy,
  onSelectUnit,
  rows,
  selectedUnitId,
  statsByUnitId,
}: {
  copy: CompanyOrganizationCopy;
  onSelectUnit: (unitId: string) => void;
  rows: CompanyUnitRow[];
  selectedUnitId?: string | null;
  statsByUnitId: Map<string, UnitCardStats>;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        description={copy.unitsEmptyDescription}
        title={copy.unitsEmptyTitle}
      />
    );
  }

  return (
    <WorkspaceEntityGrid
      className="taxios-company-units-grid"
      data-company-organization-units-layout="cards"
    >
      {rows.map((row, index) => {
        const titleId = `company-unit-card-${index}-title`;
        const contactLine = formatUnitContact(row);
        const stats =
          statsByUnitId.get(row.unitId) ?? createEmptyUnitCardStats();

        return (
          <WorkspaceEntityCard
            aria-labelledby={titleId}
            className="taxios-company-unit-card"
            key={row.unitId}
            selected={row.unitId === selectedUnitId}
          >
            <WorkspaceEntityCardAction
              aria-haspopup="dialog"
              aria-label={`${copy.unitNameColumn}: ${row.name}`}
              className="taxios-company-unit-card-action"
              onClick={() => onSelectUnit(row.unitId)}
              title={row.name}
              type="button"
            />
            <div className="flex min-w-0 items-start gap-3">
              <WorkspaceEntityCardIcon
                aria-hidden="true"
                className="taxios-company-unit-card-icon"
              >
                <Building2 size={18} strokeWidth={1.9} />
              </WorkspaceEntityCardIcon>
              <div className="min-w-0 flex-1">
                <h3
                  className="truncate font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)] tracking-tight"
                  id={titleId}
                >
                  {row.name}
                </h3>
                <span className="mt-1 block text-[12px] text-[var(--taxis-workspace-text-muted)] leading-snug">
                  {row.code ?? copy.unitCodeFallback}
                </span>
                <PublicIdLine value={row.publicId} />
              </div>
            </div>

            <WorkspaceEntityCardMetrics className="taxios-company-unit-card-metrics">
              <WorkspaceEntityCardMetric
                className="taxios-company-unit-card-metric"
                label={copy.activeMembersLabel}
                value={stats.activeMemberCount}
              />
              <WorkspaceEntityCardMetric
                className="taxios-company-unit-card-metric"
                label={copy.openInvitesLabel}
                value={stats.openInvitationCount}
              />
            </WorkspaceEntityCardMetrics>

            <WorkspaceEntityCardDetails className="taxios-company-unit-card-details">
              <div className="min-w-0">
                <WorkspaceEntityCardLabel className="taxios-company-unit-card-label">
                  {copy.unitLocationColumn}
                </WorkspaceEntityCardLabel>
                <p className="mt-1 text-[13px] text-[var(--taxis-workspace-text-secondary)] leading-snug">
                  {formatUnitAddress(row)}
                </p>
              </div>
              <div className="min-w-0">
                <WorkspaceEntityCardLabel className="taxios-company-unit-card-label">
                  {copy.unitContactColumn}
                </WorkspaceEntityCardLabel>
                <p className="mt-1 break-words font-medium text-[13px] text-[var(--taxis-workspace-text-secondary)] leading-snug">
                  {row.contactName ?? "-"}
                </p>
                {contactLine ? (
                  <p className="mt-1 break-words text-[12px] text-[var(--taxis-workspace-text-muted)] leading-snug">
                    {contactLine}
                  </p>
                ) : null}
              </div>
            </WorkspaceEntityCardDetails>
          </WorkspaceEntityCard>
        );
      })}
    </WorkspaceEntityGrid>
  );
}

function CompanyUnitDetailDrawer({
  copy,
  invitations,
  isOpen,
  members,
  onClose,
  stats,
  unit,
}: {
  copy: CompanyOrganizationCopy;
  invitations: CompanyMemberInvitationRow[];
  isOpen: boolean;
  members: CompanyMemberRow[];
  onClose: () => void;
  stats: UnitCardStats;
  unit: CompanyUnitRow | null;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          [
            "a[href]",
            "button:not([disabled])",
            "textarea:not([disabled])",
            'input:not([disabled]):not([type="hidden"])',
            "select:not([disabled])",
            '[tabindex]:not([tabindex="-1"])',
          ].join(","),
        ),
      ).filter((element) => {
        const style = window.getComputedStyle(element);
        return style.visibility !== "hidden" && style.display !== "none";
      });

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const currentIndex =
        active instanceof HTMLElement ? focusables.indexOf(active) : -1;

      if (!event.shiftKey) {
        if (currentIndex === -1 || currentIndex >= focusables.length - 1) {
          event.preventDefault();
          first.focus();
        }
      } else if (currentIndex <= 0) {
        event.preventDefault();
        last.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      previousFocused?.focus();
    };
  }, [isOpen]);

  if (!isOpen || !unit) {
    return null;
  }

  const titleId = `taxios-company-unit-detail-title-${unit.unitId}`;
  const contactLine = formatUnitContact(unit);

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-end p-6 md:p-8">
      <button
        aria-label={copy.memberDetailCloseLabel}
        className="absolute inset-0 bg-slate-950/14 backdrop-blur-md"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <div
        ref={panelRef}
        aria-labelledby={titleId}
        aria-modal="true"
        className="taxis-overlay-panel ride-detail-floating-panel ride-detail-floating-panel-open taxis-workspace-ease-standard relative flex h-[calc(100dvh-48px)] max-h-[calc(100dvh-48px)] w-[min(500px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[26px] border"
        role="dialog"
      >
        <div className="taxis-overlay-header relative z-10 flex items-start justify-between gap-4 border-zinc-100/70 border-b px-6 pt-6 pb-5">
          <div className="min-w-0 flex-1">
            <span className="block font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
              {copy.unitNameColumn}
            </span>
            <div className="mt-3 flex min-w-0 items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-[var(--taxis-workspace-border)] bg-white/88 text-[var(--taxis-workspace-text-secondary)] shadow-sm">
                <Building2 aria-hidden="true" size={21} strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <h3
                  className="truncate font-semibold text-[22px] text-[var(--taxis-workspace-text-strong)] tracking-tight"
                  id={titleId}
                >
                  {unit.name}
                </h3>
                <PublicIdLine value={unit.publicId} />
              </div>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            aria-label={copy.memberDetailCloseLabel}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--taxis-workspace-border)] bg-white/88 text-[var(--taxis-workspace-text-muted)] shadow-sm transition-all hover:border-[var(--taxis-workspace-border-strong)] hover:text-[var(--taxis-workspace-text-strong)]"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="taxis-workspace-scrollbar flex-1 space-y-6 overflow-y-auto px-6 pt-6 pb-7">
          <section className="grid gap-3 sm:grid-cols-2">
            <DetailMetric
              label={copy.unitLocationColumn}
              primary={formatUnitAddress(unit)}
            />
            <DetailMetric
              label={copy.unitContactColumn}
              primary={unit.contactName ?? "-"}
              secondary={contactLine}
            />
            <DetailMetric
              label={copy.activeMembersLabel}
              primary={String(stats.activeMemberCount)}
            />
            <DetailMetric
              label={copy.openInvitesLabel}
              primary={String(stats.openInvitationCount)}
            />
          </section>

          <section>
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
              <UsersRound size={14} />
              {copy.membersSectionTitle}
            </h4>
            {members.length === 0 ? (
              <WorkspaceInnerCard className="p-4 text-[12px] text-[var(--taxis-workspace-text-muted)]">
                {copy.membersEmptyTitle}
              </WorkspaceInnerCard>
            ) : (
              <div className="grid gap-2">
                {members.map((member) => {
                  const displayName =
                    member.displayName ?? member.companyContactEmail ?? "-";

                  return (
                    <div
                      className="rounded-[18px] border border-[var(--taxis-workspace-border)] bg-white/82 p-4"
                      key={member.membershipId}
                    >
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                            {displayName}
                          </p>
                          <PublicIdLine value={member.publicId} />
                        </div>
                        <span
                          className={cn(
                            "shrink-0",
                            companyWorkspaceChipClassForTone("neutral"),
                          )}
                        >
                          {member.access.roleName}
                        </span>
                      </div>
                      {member.companyContactEmail ? (
                        <p className="mt-2 truncate text-[12px] text-[var(--taxis-workspace-text-muted)]">
                          {member.companyContactEmail}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
              <Mail size={14} />
              {copy.invitationsSectionTitle}
            </h4>
            {invitations.length === 0 ? (
              <WorkspaceInnerCard className="p-4 text-[12px] text-[var(--taxis-workspace-text-muted)]">
                {copy.invitationsEmptyTitle}
              </WorkspaceInnerCard>
            ) : (
              <div className="grid gap-2">
                {invitations.map((invitation) => (
                  <div
                    className="rounded-[18px] border border-[var(--taxis-workspace-border)] bg-white/82 p-4"
                    key={invitation.invitationId}
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                          {invitation.invitedName ??
                            invitation.claimantName ??
                            invitation.invitedEmail}
                        </p>
                        <PublicIdLine value={invitation.publicId} />
                      </div>
                      <StatusBadge copy={copy} status={invitation.status} />
                    </div>
                    <p className="mt-2 truncate text-[12px] text-[var(--taxis-workspace-text-muted)]">
                      {invitation.invitedEmail}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function MembersTable({
  copy,
  onSelectMember,
  rows,
}: {
  copy: CompanyOrganizationCopy;
  onSelectMember?: (membershipId: string) => void;
  rows: CompanyMemberRow[];
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        description={copy.membersEmptyDescription}
        title={copy.membersEmptyTitle}
      />
    );
  }

  return (
    <WorkspaceSurface className={tableShellClassName}>
      <div className="taxis-workspace-table-scroll taxis-workspace-scrollbar taxios-company-organization-table-scroll overflow-x-auto">
        <table className="taxis-workspace-table taxis-company-table taxios-company-organization-table min-w-full border-separate text-left">
          <thead>
            <tr>
              <th className={`${headerCellClassName} min-w-[300px]`}>
                {copy.memberAccountColumn}
              </th>
              <th className={`${headerCellClassName} min-w-[170px]`}>
                {copy.memberRoleColumn}
              </th>
              <th className={`${headerCellClassName} min-w-[220px]`}>
                {copy.memberUnitColumn}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                className="taxis-workspace-table-row taxios-company-organization-row"
                key={row.membershipId}
              >
                <td className={bodyCellClassName}>
                  {onSelectMember ? (
                    <button
                      className="block max-w-full break-all text-left font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)] leading-snug hover:text-[var(--taxis-workspace-accent-strong)] focus-visible:outline-2 focus-visible:outline-[var(--taxis-workspace-accent)] focus-visible:outline-offset-2"
                      onClick={() => onSelectMember(row.membershipId)}
                      type="button"
                    >
                      {row.displayName ?? row.companyContactEmail ?? "-"}
                    </button>
                  ) : (
                    <span className="block max-w-full break-all font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)] leading-snug">
                      {row.displayName ?? row.companyContactEmail ?? "-"}
                    </span>
                  )}
                  {row.displayName &&
                  row.displayName !== row.companyContactEmail ? (
                    <span className="mt-1 block text-[12px] text-[var(--taxis-workspace-text-muted)] leading-snug">
                      {row.companyContactEmail ?? "-"}
                    </span>
                  ) : null}
                  <PublicIdLine value={row.publicId} />
                </td>
                <td className={bodyCellClassName}>
                  <span className="font-semibold text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                    {row.access.roleName || (
                      <RoleLabel copy={copy} role={row.role} />
                    )}
                  </span>
                  {row.access.extraPermissions.length > 0 ? (
                    <span className="mt-1 block text-[11px] text-[var(--taxis-workspace-text-muted)]">
                      +{row.access.extraPermissions.length} Zusatzrechte
                    </span>
                  ) : null}
                </td>
                <td
                  className={`${bodyCellClassName} text-[13px] text-[var(--taxis-workspace-text-secondary)]`}
                >
                  {row.unitName ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WorkspaceSurface>
  );
}

function InvitationsTable({
  copy,
  onRenderInvitationAction,
  rows,
}: {
  copy: CompanyOrganizationCopy;
  onRenderInvitationAction?: (
    args: CompanyOrganizationInvitationActionRenderArgs,
  ) => React.ReactNode;
  rows: CompanyMemberInvitationRow[];
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        description={copy.invitationsEmptyDescription}
        title={copy.invitationsEmptyTitle}
      />
    );
  }

  return (
    <WorkspaceSurface className={tableShellClassName}>
      <div className="taxis-workspace-table-scroll taxis-workspace-scrollbar taxios-company-organization-table-scroll overflow-x-auto">
        <table className="taxis-workspace-table taxis-company-table taxios-company-organization-table min-w-full border-separate text-left">
          <thead>
            <tr>
              <th className={`${headerCellClassName} min-w-[300px]`}>
                {copy.inviteEmailColumn}
              </th>
              <th className={`${headerCellClassName} min-w-[170px]`}>
                {copy.inviteRoleColumn}
              </th>
              <th className={`${headerCellClassName} min-w-[150px]`}>
                {copy.inviteStatusColumn}
              </th>
              <th className={`${headerCellClassName} min-w-[180px]`}>
                {copy.inviteDeliveryColumn}
              </th>
              <th className={`${headerCellClassName} px-4 text-right`}>
                {copy.actionsColumn}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                className="taxis-workspace-table-row taxios-company-organization-row"
                key={row.invitationId}
              >
                <td className={bodyCellClassName}>
                  <span className="block break-all font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)] leading-snug">
                    {row.invitedEmail}
                  </span>
                  <span className="mt-1 block text-[12px] text-[var(--taxis-workspace-text-muted)] leading-snug">
                    {row.status === "claimed"
                      ? (row.claimantName ?? copy.inviteNameFallback)
                      : (row.invitedName ?? copy.inviteNameFallback)}
                    {row.unitName ? ` - ${row.unitName}` : ""}
                  </span>
                  <PublicIdLine value={row.publicId} />
                </td>
                <td className={bodyCellClassName}>
                  <span className="font-semibold text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                    <RoleLabel copy={copy} role={row.role} />
                  </span>
                </td>
                <td className={bodyCellClassName}>
                  <StatusBadge copy={copy} status={row.status} />
                </td>
                <td className={bodyCellClassName}>
                  <DeliveryBadge copy={copy} status={row.emailDeliveryStatus} />
                  {row.emailDeliveryError ? (
                    <span className="mt-1 block max-w-xs text-[11px] text-[var(--taxis-status-danger-text)] leading-snug">
                      {row.emailDeliveryError}
                    </span>
                  ) : null}
                </td>
                <td className={bodyCellClassName}>
                  <div className="flex justify-end gap-2">
                    {row.allowedActions.map((action) =>
                      onRenderInvitationAction ? (
                        <span key={action.id}>
                          {onRenderInvitationAction({ action, row })}
                        </span>
                      ) : null,
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WorkspaceSurface>
  );
}

export function CompanyOrganizationWorkspaceContent({
  activeSection,
  copy,
  initialAddDialogMode,
  initialAddDialogOpen = false,
  inviteForm,
  memberAccessFeedback,
  memberAccessSaving,
  memberDetailError,
  memberDetailLoading,
  onArchiveCompanyRole,
  onCloseMemberDetail,
  onCreateCompanyRole,
  onRenderInvitationAction,
  onSelectMember,
  onUpdateCompanyRole,
  onUpdateMemberAccess,
  payload,
  roleMutationFeedback,
  roleMutationSaving,
  selectedMemberDetail,
  selectedMemberId,
  unitForm,
}: CompanyOrganizationWorkspaceContentProps) {
  const [requestedActiveSection, setRequestedActiveSection] =
    useState<CompanyOrganizationSectionId>(activeSection);
  const openInvitationCount = payload.invitations.filter(
    (invitation) =>
      invitation.status === "pending" || invitation.status === "claimed",
  ).length;
  const unitCardStatsByUnitId = useMemo(
    () =>
      buildUnitCardStatsByUnitId({
        invitations: payload.invitations,
        members: payload.members,
      }),
    [payload.invitations, payload.members],
  );
  const visibleSections =
    payload.visibleSections.length > 0
      ? payload.visibleSections
      : (["overview"] satisfies CompanyOrganizationSectionId[]);
  const effectiveActiveSection = visibleSections.includes(
    requestedActiveSection,
  )
    ? requestedActiveSection
    : (visibleSections[0] ?? "overview");
  const showOverview = visibleSections.includes("overview");
  const showUnits = visibleSections.includes("standorte");
  const showMembers = visibleSections.includes("members");
  const showRoles = visibleSections.includes("roles");
  const showInvites = visibleSections.includes("invites");
  const createUnitAction = findEnabledOrganizationAction(
    payload.allowedActions,
    "create_company_unit",
  );
  const createInviteAction = findEnabledOrganizationAction(
    payload.allowedActions,
    "create_company_member_invite",
  );
  const canAddUnit = Boolean(showUnits && unitForm && createUnitAction);
  const canAddMember = Boolean(showMembers && inviteForm && createInviteAction);
  const availableAddModes = [
    canAddMember ? "member" : null,
    canAddUnit ? "unit" : null,
  ].filter((mode): mode is CompanyOrganizationAddMode => mode !== null);
  const preferredAddMode = preferredAddModeForSection({
    activeSection: effectiveActiveSection,
    fallback: initialAddDialogMode,
    modes: availableAddModes,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(initialAddDialogOpen);
  const [addDialogMode, setAddDialogMode] =
    useState<CompanyOrganizationAddMode>(preferredAddMode);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const selectedUnit = useMemo(
    () => payload.units.find((unit) => unit.unitId === selectedUnitId) ?? null,
    [payload.units, selectedUnitId],
  );
  const selectedUnitMembers = useMemo(
    () =>
      selectedUnitId
        ? payload.members.filter(
            (member) =>
              member.unitId === selectedUnitId && member.status === "active",
          )
        : [],
    [payload.members, selectedUnitId],
  );
  const selectedUnitInvitations = useMemo(
    () =>
      selectedUnitId
        ? payload.invitations.filter(
            (invitation) =>
              invitation.unitId === selectedUnitId &&
              isOpenUnitInvitation(invitation),
          )
        : [],
    [payload.invitations, selectedUnitId],
  );
  const selectedUnitStats = selectedUnitId
    ? (unitCardStatsByUnitId.get(selectedUnitId) ?? createEmptyUnitCardStats())
    : createEmptyUnitCardStats();

  useEffect(() => {
    setRequestedActiveSection(activeSection);
  }, [activeSection]);

  useEffect(() => {
    const handlePopState = () => {
      setRequestedActiveSection(readSectionFromLocation());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (availableAddModes.length === 0) {
      setIsAddDialogOpen(false);
      return;
    }

    if (!availableAddModes.includes(addDialogMode)) {
      setAddDialogMode(preferredAddMode);
    }
  }, [addDialogMode, availableAddModes, preferredAddMode]);

  useEffect(() => {
    if (selectedUnitId && !selectedUnit) {
      setSelectedUnitId(null);
    }
  }, [selectedUnit, selectedUnitId]);

  function openAddDialog(mode: CompanyOrganizationAddMode) {
    setAddDialogMode(mode);
    setIsAddDialogOpen(true);
  }

  function handleSectionChange(section: CompanyOrganizationSectionId) {
    setRequestedActiveSection(section);
    pushSectionUrl(section);
  }

  return (
    <div
      className="taxis-company-workspace-content taxis-workspace-content-area"
      data-company-organization-active-section={effectiveActiveSection}
      data-company-organization-root
    >
      <div className="taxis-company-workspace-frame taxis-company-workspace-stack">
        <section className="taxis-company-page-header">
          <div className="min-w-0">
            <p className="taxis-company-page-eyebrow">
              <Building2 aria-hidden="true" size={14} strokeWidth={1.9} />
              {payload.organizationName}
            </p>
            <PublicIdLine value={payload.organizationPublicId} />
            <h1 className="taxis-company-page-title mt-2">{copy.title}</h1>
            <p className="taxis-company-page-description mt-2">
              {copy.subtitle}
            </p>
          </div>
        </section>

        <CompanyOrganizationSectionNavigation
          activeSection={effectiveActiveSection}
          copy={copy}
          onSectionChange={handleSectionChange}
          visibleSections={visibleSections}
        />

        {showOverview || showUnits ? (
          <section
            aria-labelledby="taxios-org-tab-standorte"
            className="grid gap-4"
            data-company-organization-section-panel="overview standorte"
            id="taxios-org-panel-standorte"
            role="tabpanel"
          >
            <WorkspaceSectionHeader
              badge={
                <SectionCountBadge
                  label={copy.unitsLabel}
                  value={payload.units.length}
                />
              }
              action={
                effectiveActiveSection === "standorte" && canAddUnit ? (
                  <CompanyOrganizationAddButton
                    label="Hinzufügen"
                    onClick={() => openAddDialog("unit")}
                  />
                ) : null
              }
              title={copy.unitsSectionTitle}
            />
            <UnitsCardGrid
              copy={copy}
              onSelectUnit={setSelectedUnitId}
              rows={payload.units}
              selectedUnitId={selectedUnitId}
              statsByUnitId={unitCardStatsByUnitId}
            />
          </section>
        ) : null}

        {showOverview || showMembers ? (
          <section
            aria-labelledby="taxios-org-tab-members"
            className="grid gap-4"
            data-company-organization-section-panel="overview members"
            id="taxios-org-panel-members"
            role="tabpanel"
          >
            <WorkspaceSectionHeader
              badge={
                <SectionCountBadge
                  label={copy.activeMembersLabel}
                  value={payload.members.length}
                />
              }
              action={
                effectiveActiveSection === "members" && canAddMember ? (
                  <CompanyOrganizationAddButton
                    label="Hinzufügen"
                    onClick={() => openAddDialog("member")}
                  />
                ) : null
              }
              title={copy.membersSectionTitle}
            />
            <MembersTable
              copy={copy}
              onSelectMember={onSelectMember}
              rows={payload.members}
            />
          </section>
        ) : null}

        {showRoles ? (
          <section
            aria-labelledby="taxios-org-tab-roles"
            className="grid gap-4"
            data-company-organization-section-panel="roles"
            id="taxios-org-panel-roles"
            role="tabpanel"
          >
            <RoleManagementPanel
              copy={copy}
              feedback={roleMutationFeedback}
              onArchiveCompanyRole={onArchiveCompanyRole}
              onCreateCompanyRole={onCreateCompanyRole}
              onUpdateCompanyRole={onUpdateCompanyRole}
              payload={payload}
              saving={roleMutationSaving}
            />
          </section>
        ) : null}

        {showOverview || showInvites ? (
          <section
            aria-labelledby="taxios-org-tab-invites"
            className="grid gap-4"
            data-company-organization-section-panel="overview invites"
            id="taxios-org-panel-invites"
            role="tabpanel"
          >
            <WorkspaceSectionHeader
              badge={
                <SectionCountBadge
                  label={copy.openInvitesLabel}
                  value={openInvitationCount}
                />
              }
              title={copy.invitationsSectionTitle}
            />
            <InvitationsTable
              copy={copy}
              onRenderInvitationAction={onRenderInvitationAction}
              rows={payload.invitations}
            />
          </section>
        ) : null}
      </div>
      <CompanyMemberAccessDrawer
        copy={copy}
        detail={selectedMemberDetail ?? null}
        error={memberDetailError}
        feedback={memberAccessFeedback}
        isOpen={Boolean(selectedMemberId)}
        loading={memberDetailLoading}
        onClose={onCloseMemberDetail}
        onUpdateMemberAccess={onUpdateMemberAccess}
        payload={payload}
        saving={memberAccessSaving}
      />
      <CompanyUnitDetailDrawer
        copy={copy}
        invitations={selectedUnitInvitations}
        isOpen={Boolean(selectedUnit)}
        members={selectedUnitMembers}
        onClose={() => setSelectedUnitId(null)}
        stats={selectedUnitStats}
        unit={selectedUnit}
      />
      <CompanyOrganizationAddDialog
        activeMode={addDialogMode}
        availableModes={availableAddModes}
        inviteForm={inviteForm}
        isOpen={isAddDialogOpen && availableAddModes.length > 0}
        onClose={() => setIsAddDialogOpen(false)}
        onModeChange={setAddDialogMode}
        unitForm={unitForm}
      />
    </div>
  );
}

export function CompanyOrganizationScreen({
  activeSection,
  activeContextSwitcher,
  copy,
  initialAddDialogMode,
  initialAddDialogOpen,
  inviteForm,
  memberAccessFeedback,
  memberAccessSaving,
  memberDetailError,
  memberDetailLoading,
  onArchiveCompanyRole,
  onCloseMemberDetail,
  onCreateCompanyRole,
  onRenderInvitationAction,
  onSelectMember,
  onUpdateCompanyRole,
  onUpdateMemberAccess,
  payload,
  roleMutationFeedback,
  roleMutationSaving,
  selectedMemberDetail,
  selectedMemberId,
  sessionAction,
  unitForm,
}: CompanyOrganizationScreenProps) {
  return (
    <CompanyWorkspaceShell
      activeContextSwitcher={activeContextSwitcher}
      activeItem={workspaceActiveItemForSection(activeSection)}
      notificationsLabel="Benachrichtigungen"
      organizationName={payload.organizationName}
      routeLabels={{
        organization: copy.title,
      }}
      searchPlaceholder="Suchen..."
      sessionAction={sessionAction}
    >
      <CompanyOrganizationWorkspaceContent
        activeSection={activeSection}
        copy={copy}
        initialAddDialogMode={initialAddDialogMode}
        initialAddDialogOpen={initialAddDialogOpen}
        inviteForm={inviteForm}
        memberAccessFeedback={memberAccessFeedback}
        memberAccessSaving={memberAccessSaving}
        memberDetailError={memberDetailError}
        memberDetailLoading={memberDetailLoading}
        onArchiveCompanyRole={onArchiveCompanyRole}
        onCloseMemberDetail={onCloseMemberDetail}
        onCreateCompanyRole={onCreateCompanyRole}
        onRenderInvitationAction={onRenderInvitationAction}
        onSelectMember={onSelectMember}
        onUpdateCompanyRole={onUpdateCompanyRole}
        onUpdateMemberAccess={onUpdateMemberAccess}
        payload={payload}
        roleMutationFeedback={roleMutationFeedback}
        roleMutationSaving={roleMutationSaving}
        selectedMemberDetail={selectedMemberDetail}
        selectedMemberId={selectedMemberId}
        unitForm={unitForm}
      />
    </CompanyWorkspaceShell>
  );
}
