import "../workspace/workspace.css";
import "./rider-app.css";

import type React from "react";
import {
  AlertTriangle,
  Home,
  Inbox,
  Loader2,
  Route,
  User,
} from "lucide-react";

import type { RiderAppCopy } from "../../../contracts/rider-app";
import { cn } from "../../../lib/utils";

export type RiderTabId = "home" | "trips" | "inbox" | "account";

type RiderTabDef = {
  id: RiderTabId;
  icon: typeof Home;
  labelKey: "tabHome" | "tabTrips" | "tabInbox" | "tabAccount";
};

const riderTabs: readonly RiderTabDef[] = [
  { id: "home", icon: Home, labelKey: "tabHome" },
  { id: "trips", icon: Route, labelKey: "tabTrips" },
  { id: "inbox", icon: Inbox, labelKey: "tabInbox" },
  { id: "account", icon: User, labelKey: "tabAccount" },
];

export type RiderAppShellProps = {
  activeTab: RiderTabId;
  copy: RiderAppCopy;
  children: React.ReactNode;
  /** Optional sticky header rendered above the scroll area. */
  header?: React.ReactNode;
  /** Optional bottom action bar pinned above the tab bar (Fitts's Law). */
  bottomBar?: React.ReactNode;
  /** Unread count rendered on the Inbox tab. */
  inboxBadgeCount?: number;
  /** Lab-only: navigate between tabs. Production wires this to the router. */
  onTabSelect?: (tab: RiderTabId) => void;
};

/**
 * Phone-frame shell shared by every Rider screen. Provides the sticky header
 * slot, a scrollable content area, an optional bottom action bar, and the
 * persistent bottom tab bar. Mobile-first with large tap targets.
 */
export function RiderAppShell({
  activeTab,
  bottomBar,
  children,
  copy,
  header,
  inboxBadgeCount = 0,
  onTabSelect,
}: RiderAppShellProps) {
  return (
    <div className="taxis-rider-frame">
      <div className="taxis-rider-screen">
        {header ? (
          <header className="taxis-rider-header">{header}</header>
        ) : null}

        <div className="taxis-rider-scroll taxis-workspace-scrollbar">
          {children}
        </div>

        {bottomBar ? (
          <div className="taxis-rider-actionbar">{bottomBar}</div>
        ) : null}

        <nav aria-label="Rider Navigation" className="taxis-rider-tabbar">
          {riderTabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.id === activeTab;
            const showBadge = tab.id === "inbox" && inboxBadgeCount > 0;

            return (
              <button
                aria-current={active ? "page" : undefined}
                className={cn("taxis-rider-tab", active && "taxis-rider-tab-active")}
                key={tab.id}
                onClick={() => onTabSelect?.(tab.id)}
                type="button"
              >
                <span className="relative">
                  <Icon aria-hidden="true" size={22} strokeWidth={active ? 2.2 : 1.9} />
                  {showBadge ? (
                    <span className="taxis-rider-tab-badge">
                      {inboxBadgeCount > 9 ? "9+" : inboxBadgeCount}
                    </span>
                  ) : null}
                </span>
                <span className="taxis-rider-tab-label">{copy[tab.labelKey]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/** Centered loading state for any Rider screen. */
export function RiderLoadingState({ label }: { label: string }) {
  return (
    <div className="taxis-rider-state" role="status">
      <Loader2
        aria-hidden="true"
        className="animate-spin text-[var(--taxis-workspace-accent)]"
        size={26}
        strokeWidth={2}
      />
      <p className="taxis-rider-state-text">{label}</p>
    </div>
  );
}

/** Error state with an optional retry action. */
export function RiderErrorState({
  description,
  onRetry,
  retryLabel,
  title,
}: {
  description: string;
  onRetry?: () => void;
  retryLabel: string;
  title: string;
}) {
  return (
    <div className="taxis-rider-state" role="alert">
      <span className="taxis-rider-state-icon taxis-rider-state-icon-danger">
        <AlertTriangle aria-hidden="true" size={22} strokeWidth={2} />
      </span>
      <div>
        <h2 className="taxis-rider-state-title">{title}</h2>
        <p className="taxis-rider-state-text mt-1">{description}</p>
      </div>
      {onRetry ? (
        <button className="taxis-rider-btn-secondary" onClick={onRetry} type="button">
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}

/** Empty state used by lists (trips, notifications, guests). */
export function RiderEmptyState({
  description,
  icon,
  title,
}: {
  description: string;
  icon?: React.ReactNode;
  title: string;
}) {
  return (
    <div className="taxis-rider-empty">
      <span className="taxis-rider-empty-icon">
        {icon ?? <Route aria-hidden="true" size={20} strokeWidth={1.9} />}
      </span>
      <h3 className="taxis-rider-empty-title">{title}</h3>
      <p className="taxis-rider-empty-text">{description}</p>
    </div>
  );
}
