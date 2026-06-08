/**
 * TaxiOS Company Dashboard (canonical screen).
 *
 * Ported from TaxiOS.v1 (`@taxios-v1/ui`). Visual refinement and token
 * extraction happen here and in `company-dashboard.css`, not in reference
 * snapshots.
 */

import "./company-dashboard.css";

import type React from "react";
import { Languages } from "lucide-react";

import type {
  CompanyDashboardCopy,
  CompanyDashboardData,
  CompanyDashboardFastRouteBookingStartHandler,
  CompanyDashboardFastRouteMemberChangeHandler,
  CompanyDashboardMetricPayload,
  CompanyDashboardPayload,
  DashboardStatTrend,
} from "../../../contracts/company-dashboard";
import { CompanyWorkspaceShell } from "../company-workspace/company-workspace-shell";
import { CompanyDashboardFastbookingClient } from "./company-dashboard-fastbooking-client";
import { CompanyDashboardRidesClient } from "./company-dashboard-rides-client";
import { defaultCompanyDashboardCopy } from "./company-dashboard-copy";
import { TaxiosDashboardLiveFeedCard } from "./taxios-dashboard-live-feed";
export type {
  DashboardFeedItem,
  DashboardFeedTone,
} from "./taxios-dashboard-live-feed";
import {
  TaxiosDashboardSectionHeader,
} from "./taxios-dashboard-primitives";

export type {
  CompanyDashboardCopy,
  CompanyDashboardData,
  CompanyDashboardMetricPayload,
  CompanyDashboardPayload,
  DashboardStatTrend,
};
export type DashboardStatPayload = CompanyDashboardMetricPayload;

/** Serializable props from Server Routes; avoids date creation inside the Client bundle. */
export interface CompanyDashboardScreenProps {
  activeContextSwitcher?: React.ReactNode;
  bookingForm?: React.ReactNode;
  copy?: CompanyDashboardCopy;
  dashboardData: CompanyDashboardData;
  headerDateLabel: string;
  localeSwitcher?: CompanyDashboardLocaleSwitchConfig;
  onFastRouteBookingStart?: CompanyDashboardFastRouteBookingStartHandler;
  onFastRouteMembersChange?: CompanyDashboardFastRouteMemberChangeHandler;
  organizationName?: string;
  rideActionSlots?: Record<string, React.ReactNode>;
  sessionAction?: React.ReactNode;
}

export type CompanyDashboardWorkspaceContentProps = Omit<
  CompanyDashboardScreenProps,
  | "activeContextSwitcher"
  | "localeSwitcher"
  | "organizationName"
  | "sessionAction"
>;

export type CompanyDashboardRidesWorkspaceContentProps = {
  activeRowCapacity?: number;
  copy?: CompanyDashboardCopy["rides"];
  recentBookingHistory?: CompanyDashboardPayload["recentBookingHistory"];
  recentBookingHistorySummary?: CompanyDashboardPayload["recentBookingHistorySummary"];
  rideActionSlots?: Record<string, React.ReactNode>;
  showRecentHistory?: boolean;
  upcomingTrips: CompanyDashboardPayload["upcomingTrips"];
};

export type CompanyDashboardLocaleSwitchOption = {
  ariaLabel: string;
  isActive: boolean;
  label: string;
  value: string;
};

export type CompanyDashboardLocaleSwitchConfig = {
  action: NonNullable<React.ComponentProps<"form">["action"]>;
  ariaLabel: string;
  options: readonly CompanyDashboardLocaleSwitchOption[];
};

function initialsFromLabel(label: string) {
  const parts = label
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => /^[\p{L}]/u.test(part));

  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

function titleFromDestination(destination: string) {
  const candidate =
    destination
      .split(/[,-]/)
      .map((part) => part.trim())
      .find(Boolean) ?? destination.trim();

  return candidate.length > 32
    ? `${candidate.slice(0, 29)}...`
    : candidate || "Fast route";
}

function buildFastRoutesFromTrips(
  trips: CompanyDashboardPayload["upcomingTrips"],
) {
  const seenRoutes = new Set<string>();

  return trips.flatMap((trip) => {
    const routeKey = `${trip.from.trim().toLowerCase()}=>${trip.to.trim().toLowerCase()}`;

    if (seenRoutes.has(routeKey)) {
      return [];
    }

    seenRoutes.add(routeKey);

    return [
      {
        avatars: trip.passengers.slice(0, 3).map(initialsFromLabel),
        from: trip.from,
        memberIds: [],
        title: titleFromDestination(trip.to),
        to: trip.to,
      },
    ];
  });
}

function canCreateBooking(dashboardData: CompanyDashboardData) {
  return dashboardData.allowedActions?.some(
    (action) => action.id === "create_booking" && !action.disabled,
  ) ?? false;
}

function CompanyDashboardLocaleSwitch({
  action,
  ariaLabel,
  options,
}: CompanyDashboardLocaleSwitchConfig) {
  return (
    <form
      action={action}
      aria-label={ariaLabel}
      className="inline-flex h-11 items-center gap-1 rounded-2xl border border-[var(--taxis-workspace-border)] bg-white/88 px-1.5 shadow-[0_10px_30px_-28px_rgba(15,23,42,0.4)] backdrop-blur-md"
    >
      <Languages
        aria-hidden="true"
        className="ml-2 hidden text-[var(--taxis-workspace-text-muted)] sm:block"
        size={16}
        strokeWidth={1.9}
      />
      {options.map((option) => (
        <button
          aria-label={option.ariaLabel}
          aria-pressed={option.isActive}
          className={`inline-flex h-8 min-w-9 items-center justify-center rounded-xl px-2.5 font-semibold text-[11px] tracking-[0.08em] transition-colors duration-200 ${
            option.isActive
              ? "bg-[var(--taxis-workspace-control-dark)] text-white shadow-[0_8px_18px_-14px_rgba(15,23,42,0.5)]"
              : "text-[var(--taxis-workspace-text-muted)] hover:bg-[var(--taxis-workspace-surface-deep)] hover:text-[var(--taxis-workspace-text-primary)]"
          }`}
          key={option.value}
          name="locale"
          type="submit"
          value={option.value}
        >
          {option.label}
        </button>
      ))}
    </form>
  );
}

export const CompanyDashboardWorkspaceContent: React.FC<
  CompanyDashboardWorkspaceContentProps
> = ({
  copy = defaultCompanyDashboardCopy,
  dashboardData,
  headerDateLabel,
  onFastRouteBookingStart,
  onFastRouteMembersChange,
}) => {
  const {
    availableMembers,
    fastRoutes,
    feedItems,
    recentBookingHistory,
    recentBookingHistorySummary,
    upcomingTrips,
  } = dashboardData;
  const resolvedFastRoutes =
    fastRoutes.length > 0
      ? fastRoutes
      : buildFastRoutesFromTrips(upcomingTrips).slice(0, 3);
  const showFastbooking = canCreateBooking(dashboardData);

  return (
    <div className="taxis-company-workspace-content taxios-dashboard-content-area">
      <div className="taxis-company-workspace-frame taxis-company-workspace-stack">
        <section className="taxios-dashboard-animate-fade-up taxis-company-page-header">
          <div className="min-w-0">
            <span className="taxis-company-page-eyebrow">
              {copy.hero.datePrefix} - {headerDateLabel}
            </span>
            <h1 className="taxis-company-page-title mt-2">
              {copy.hero.greetingPrefix},{" "}
              <span className="text-slate-500">
                {copy.hero.greetingName}
              </span>
              .
            </h1>
            <p className="taxis-company-page-description mt-2">
              {copy.hero.overview}
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-7">
          {showFastbooking ? (
            <div className="taxis-dashboard-fastbooking-column flex min-w-0">
              <div className="taxios-dashboard-animate-fade-up taxios-dashboard-fastbooking-shell taxios-dashboard-porcelain-surface flex min-w-0 flex-1 flex-col">
                <CompanyDashboardFastbookingClient
                  availableMembers={availableMembers}
                  copy={copy.fastbooking}
                  fastRoutes={resolvedFastRoutes}
                  onFastRouteBookingStart={onFastRouteBookingStart}
                  onFastRouteMembersChange={onFastRouteMembersChange}
                />
              </div>
            </div>
          ) : null}

          <div className="taxis-dashboard-command-grid min-w-0">
            <CompanyDashboardRidesClient
              copy={copy.rides}
              recentBookingHistory={recentBookingHistory}
              recentBookingHistorySummary={recentBookingHistorySummary}
              showRecentHistory={false}
              upcomingTrips={upcomingTrips}
            />

            <div className="taxis-dashboard-live-rail flex min-w-0 flex-col gap-4">
              <TaxiosDashboardLiveFeedCard
                copy={copy.liveFeed}
                feedItems={feedItems}
                header={
                  <TaxiosDashboardSectionHeader
                    badge={
                      <span className="flex items-center gap-1.5 rounded-md bg-[var(--taxis-workspace-control-dark)] px-2.5 py-1 font-semibold text-[9px] text-[var(--taxis-workspace-surface)] uppercase tracking-taxis-eyebrow">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--taxis-workspace-surface)]" />
                        {copy.liveFeed.liveBadge}
                      </span>
                    }
                    className="mb-6"
                    title={copy.liveFeed.title}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CompanyDashboardRidesWorkspaceContent({
  activeRowCapacity,
  copy = defaultCompanyDashboardCopy.rides,
  recentBookingHistory,
  recentBookingHistorySummary,
  rideActionSlots,
  showRecentHistory = true,
  upcomingTrips,
}: CompanyDashboardRidesWorkspaceContentProps) {
  return (
    <div className="taxis-company-workspace-content taxios-dashboard-content-area">
      <div className="taxis-company-workspace-frame taxis-company-workspace-stack">
        <section className="taxis-company-page-header">
          <span className="taxis-company-page-eyebrow">
            Company workspace
          </span>
          <h1 className="taxis-company-page-title">{copy.title}</h1>
          <p className="taxis-company-page-description">
            Aktive Fahrten bleiben in dieser Ansicht schnell erreichbar.
          </p>
        </section>

        <div className="min-w-0">
          <CompanyDashboardRidesClient
            actionSlots={rideActionSlots}
            activeRowCapacity={activeRowCapacity}
            copy={copy}
            recentBookingHistory={recentBookingHistory}
            recentBookingHistorySummary={recentBookingHistorySummary}
            showRecentHistory={showRecentHistory}
            upcomingTrips={upcomingTrips}
          />
        </div>
      </div>
    </div>
  );
}

export const CompanyDashboardScreen: React.FC<CompanyDashboardScreenProps> = ({
  activeContextSwitcher,
  bookingForm,
  copy = defaultCompanyDashboardCopy,
  dashboardData,
  headerDateLabel,
  localeSwitcher,
  onFastRouteBookingStart,
  onFastRouteMembersChange,
  organizationName,
  rideActionSlots,
  sessionAction,
}) => (
  <CompanyWorkspaceShell
    activeContextSwitcher={activeContextSwitcher}
    activeItem="dashboard"
    notificationsLabel={copy.topbar.notificationsLabel}
    organizationName={organizationName ?? copy.sidebar.accountName}
    routeLabels={{ dashboard: copy.topbar.dashboard }}
    searchPlaceholder={copy.topbar.searchPlaceholder}
    sessionAction={sessionAction}
    topbarExtra={
      localeSwitcher ? <CompanyDashboardLocaleSwitch {...localeSwitcher} /> : null
    }
  >
    <CompanyDashboardWorkspaceContent
      bookingForm={bookingForm}
      copy={copy}
      dashboardData={dashboardData}
      headerDateLabel={headerDateLabel}
      onFastRouteBookingStart={onFastRouteBookingStart}
      onFastRouteMembersChange={onFastRouteMembersChange}
      rideActionSlots={rideActionSlots}
    />
  </CompanyWorkspaceShell>
);

export default CompanyDashboardScreen;
