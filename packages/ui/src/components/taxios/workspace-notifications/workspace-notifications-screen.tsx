"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";

import type {
  WorkspaceNotificationFilter,
  WorkspaceNotificationItem,
  WorkspaceNotificationPriority,
  WorkspaceNotificationsState,
} from "../../../contracts/workspace-notifications";
import { WorkspaceSurface } from "../workspace/workspace-primitives";
import {
  type WorkspaceStatusTone,
  workspaceChipClassForTone,
  workspaceStatusChipClassForTone,
} from "../workspace/workspace-status";

export type WorkspaceNotificationsScreenProps = {
  activeFilter: WorkspaceNotificationFilter;
  items: readonly WorkspaceNotificationItem[];
  onFilterChange: (filter: WorkspaceNotificationFilter) => void;
  onItemSelect: (item: WorkspaceNotificationItem) => void;
  onMarkAllRead: () => void;
  onMarkRead: (itemId: string) => void;
  state: WorkspaceNotificationsState;
  unreadBadgeCount: number;
};

function priorityDetails(priority: WorkspaceNotificationPriority): {
  icon: typeof AlertTriangle;
  tone: WorkspaceStatusTone;
} {
  switch (priority) {
    case "action_required":
    case "warning":
      return { icon: AlertTriangle, tone: "attention" };
    case "critical":
      return { icon: XCircle, tone: "danger" };
    case "success":
      return { icon: CheckCircle2, tone: "success" };
    case "info":
      return { icon: Info, tone: "info" };
  }
}

const filters: Array<{
  id: WorkspaceNotificationFilter;
  label: string;
}> = [
  { id: "important", label: "Wichtig" },
  { id: "all", label: "Alle" },
  { id: "unread", label: "Ungelesen" },
];

export function WorkspaceNotificationsScreen({
  activeFilter,
  items,
  onFilterChange,
  onItemSelect,
  onMarkAllRead,
  onMarkRead,
  state,
  unreadBadgeCount,
}: WorkspaceNotificationsScreenProps) {
  return (
    <div className="taxis-company-workspace-frame space-y-8 px-6 pb-16 xl:px-10 2xl:px-11">
      <div className="min-w-0 pt-6">
        <p className="mb-3 font-semibold text-[12px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.28em]">
          Company Workspace
        </p>
        <h1 className="font-bold text-[clamp(2rem,3vw,3.4rem)] text-[var(--taxis-workspace-text-primary)] tracking-tight">
          Benachrichtigungen
        </h1>
        <p className="mt-2 max-w-3xl text-[15px] text-[var(--taxis-workspace-text-secondary)]">
          Relevante Ereignisse aus dem aktiven Workspace, gefiltert nach Rolle
          und Berechtigung.
        </p>
      </div>

      <WorkspaceSurface className="p-5 xl:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-[24px] text-[var(--taxis-workspace-text-primary)]">
                Inbox
              </h2>
              {unreadBadgeCount > 0 ? (
                <span className={workspaceChipClassForTone("accent")}>
                  {unreadBadgeCount} offen
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
              Audit bleibt die Vollhistorie; hier landet nur Aufmerksamkeit.
            </p>
          </div>
          <button
            className="rounded-[14px] bg-[var(--taxis-workspace-text-primary)] px-4 py-2.5 font-semibold text-[13px] text-white transition-colors hover:bg-[var(--taxis-workspace-text-strong)]"
            onClick={onMarkAllRead}
            type="button"
          >
            Alle als gelesen
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2" role="tablist">
          {filters.map((filter) => (
            <button
              aria-selected={activeFilter === filter.id}
              className={[
                "rounded-full px-4 py-2 font-semibold text-[13px] transition-colors",
                activeFilter === filter.id
                  ? "bg-[var(--taxis-workspace-text-primary)] text-white"
                  : "bg-[var(--taxis-workspace-surface-soft)] text-[var(--taxis-workspace-text-secondary)] hover:text-[var(--taxis-workspace-text-primary)]",
              ].join(" ")}
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              role="tab"
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>

        {state === "loading" ? (
          <div className="rounded-[18px] border border-[var(--taxis-workspace-surface-rim)] px-4 py-8 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
            Benachrichtigungen laden...
          </div>
        ) : null}

        {state === "error" ? (
          <div
            className={[
              "rounded-[18px] border px-4 py-8 text-[13px]",
              workspaceStatusChipClassForTone("danger"),
            ].join(" ")}
          >
            Benachrichtigungen gerade nicht verfugbar.
          </div>
        ) : null}

        {(state === "empty" || (state === "ready" && items.length === 0)) ? (
          <div className="rounded-[18px] border border-[var(--taxis-workspace-surface-rim)] px-4 py-8 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
            Keine neuen Benachrichtigungen
          </div>
        ) : null}

        {state === "ready" && items.length > 0 ? (
          <div className="grid gap-2">
            {items.map((item) => {
              const priority = priorityDetails(item.priority);
              const Icon = priority.icon;

              return (
                <article
                  className="grid gap-3 rounded-[18px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-4 md:grid-cols-[2.5rem_minmax(0,1fr)_auto] md:items-center"
                  key={item.itemId}
                >
                  <span
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-full ring-1",
                      workspaceStatusChipClassForTone(priority.tone),
                    ].join(" ")}
                  >
                    <Icon aria-hidden="true" size={17} strokeWidth={2} />
                  </span>
                  <button
                    className="min-w-0 text-left"
                    onClick={() => onItemSelect(item)}
                    type="button"
                  >
                    <span className="block font-semibold text-[14px] text-[var(--taxis-workspace-text-primary)]">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                      {item.body}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-2 font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
                      <span>{item.createdAtLabel}</span>
                      {item.entityPublicId ? (
                        <span className="font-mono font-semibold">
                          {item.entityPublicId}
                        </span>
                      ) : null}
                    </span>
                  </button>
                  {!item.read ? (
                    <button
                      className="rounded-full bg-[var(--taxis-workspace-surface-soft)] px-3 py-2 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:text-[var(--taxis-workspace-text-primary)]"
                      onClick={() => onMarkRead(item.itemId)}
                      type="button"
                    >
                      Als gelesen
                    </button>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}
      </WorkspaceSurface>
    </div>
  );
}
