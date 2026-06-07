"use client";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Circle,
  Info,
  Loader2,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import type {
  WorkspaceNotificationFilter,
  WorkspaceNotificationItem,
  WorkspaceNotificationPriority,
  WorkspaceNotificationsState,
} from "../../../contracts/workspace-notifications";
import {
  type WorkspaceStatusTone,
  workspaceStatusChipClassForTone,
} from "../workspace/workspace-status";

export type WorkspaceNotificationsPopoverProps = {
  activeFilter: WorkspaceNotificationFilter;
  items: readonly WorkspaceNotificationItem[];
  label?: string;
  onFilterChange: (filter: WorkspaceNotificationFilter) => void;
  onItemSelect: (item: WorkspaceNotificationItem) => void;
  onMarkAllRead: () => void;
  onMarkRead: (itemId: string) => void;
  onOpenAll: () => void;
  state: WorkspaceNotificationsState;
  unreadBadgeCount: number;
};

const filters: Array<{
  id: WorkspaceNotificationFilter;
  label: string;
}> = [
  { id: "important", label: "Wichtig" },
  { id: "all", label: "Alle" },
  { id: "unread", label: "Ungelesen" },
];

function priorityClasses(priority: WorkspaceNotificationPriority): {
  icon: typeof AlertTriangle;
  tone: WorkspaceStatusTone;
} {
  switch (priority) {
    case "action_required":
      return {
        icon: AlertTriangle,
        tone: "accent",
      };
    case "critical":
      return { icon: XCircle, tone: "danger" };
    case "warning":
      return { icon: AlertTriangle, tone: "attention" };
    case "success":
      return { icon: CheckCircle2, tone: "success" };
    case "info":
      return {
        icon: Info,
        tone: "info",
      };
  }
}

function panelStateContent(state: WorkspaceNotificationsState) {
  if (state === "loading") {
    return (
      <div className="flex min-h-28 items-center gap-2 px-4 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
        <Loader2 className="animate-spin" size={15} />
        Benachrichtigungen laden...
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="min-h-28 px-4 py-5 text-[13px] text-[var(--taxis-status-danger-text)]">
        Benachrichtigungen gerade nicht verfugbar.
      </div>
    );
  }

  return (
    <div className="min-h-28 px-4 py-5 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
      Keine neuen Benachrichtigungen
    </div>
  );
}

export function WorkspaceNotificationsPopover({
  activeFilter,
  items,
  label = "Benachrichtigungen",
  onFilterChange,
  onItemSelect,
  onMarkAllRead,
  onMarkRead,
  onOpenAll,
  state,
  unreadBadgeCount,
}: WorkspaceNotificationsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleItems = useMemo(() => items.slice(0, 8), [items]);
  const badgeLabel = unreadBadgeCount > 99 ? "99+" : String(unreadBadgeCount);

  return (
    <div className="relative shrink-0">
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`${label}${unreadBadgeCount > 0 ? `, ${badgeLabel} ungelesen` : ""}`}
        className="taxis-workspace-topbar-pill group taxis-workspace-ease-standard relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <Bell
          className="text-[var(--taxis-workspace-text-secondary)] transition-colors group-hover:text-[var(--taxis-workspace-text-strong)]"
          size={19}
          strokeWidth={1.9}
        />
        {unreadBadgeCount > 0 ? (
          <span className="-top-1 -right-1 absolute inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--taxis-workspace-accent-strong)] px-1 font-bold text-[10px] text-white shadow-sm">
            {badgeLabel}
          </span>
        ) : (
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-white bg-[var(--taxis-workspace-text-muted)] shadow-sm" />
        )}
      </button>

      {isOpen ? (
        <div
          aria-label={label}
          className="taxis-overlay-panel absolute top-[calc(100%+0.75rem)] right-0 z-50 w-[24rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[22px] border p-2"
          role="dialog"
        >
          <div className="taxis-overlay-header flex items-center justify-between gap-3 border-[var(--taxis-workspace-border)] border-b px-3 py-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
                {label}
              </p>
              <p className="mt-0.5 font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
                Aktiver Workspace
              </p>
            </div>
            <button
              className="rounded-full px-2.5 py-1.5 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-primary)]"
              onClick={onMarkAllRead}
              type="button"
            >
              Alle als gelesen
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1 p-2" role="tablist">
            {filters.map((filter) => (
              <button
                aria-selected={activeFilter === filter.id}
                className={[
                  "rounded-[12px] px-3 py-2 font-semibold text-[12px] transition-colors",
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

          <div className="max-h-none">
            {state !== "ready" || visibleItems.length === 0 ? (
              panelStateContent(state === "ready" ? "empty" : state)
            ) : (
              <div className="space-y-1 px-1 pb-1">
                {visibleItems.map((item) => {
                  const priority = priorityClasses(item.priority);
                  const Icon = priority.icon;

                  return (
                    <article
                      aria-label={item.title}
                      className={[
                        "group relative rounded-[16px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-3 transition-colors hover:bg-[var(--taxis-workspace-surface-soft)]",
                        item.read ? "opacity-75" : "",
                      ].join(" ")}
                      key={item.itemId}
                    >
                      <div className="flex gap-3">
                        <span
                          className={[
                            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1",
                            workspaceStatusChipClassForTone(priority.tone),
                          ].join(" ")}
                        >
                          <Icon aria-hidden="true" size={16} strokeWidth={2} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <a
                            className="block min-w-0"
                            href={item.href ?? "#"}
                            onClick={(event) => {
                              event.preventDefault();
                              onItemSelect(item);
                            }}
                          >
                            <span className="block truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-primary)]">
                              {item.title}
                            </span>
                            <span className="mt-0.5 line-clamp-2 block text-[12px] leading-5 text-[var(--taxis-workspace-text-secondary)]">
                              {item.body}
                            </span>
                          </a>
                          <span className="mt-2 flex flex-wrap items-center gap-2 font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
                            <span>{item.createdAtLabel}</span>
                            {item.entityPublicId ? (
                              <>
                                <Circle size={4} fill="currentColor" />
                                <span className="taxis-data-id font-semibold">
                                  {item.entityPublicId}
                                </span>
                              </>
                            ) : null}
                          </span>
                        </div>
                        {!item.read ? (
                          <button
                            className="h-fit shrink-0 rounded-full bg-white px-2.5 py-1.5 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] shadow-[inset_0_0_0_1px_var(--taxis-workspace-surface-rim)] transition-colors hover:text-[var(--taxis-workspace-text-primary)]"
                            onClick={() => onMarkRead(item.itemId)}
                            type="button"
                          >
                            Als gelesen
                          </button>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-[var(--taxis-workspace-border)] border-t p-2">
            <button
              className="flex w-full items-center justify-center rounded-[14px] bg-[var(--taxis-workspace-text-primary)] px-3 py-2.5 font-semibold text-[12px] text-white transition-colors hover:bg-[var(--taxis-workspace-text-strong)]"
              onClick={onOpenAll}
              type="button"
            >
              Alle anzeigen
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
