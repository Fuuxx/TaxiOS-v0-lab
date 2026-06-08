"use client";

import { useState, type CSSProperties } from "react";

import {
  TaxiosDashboardSectionHeader,
  TaxiosPorcelainSurface,
} from "./taxios-dashboard-primitives";
import {
  TaxiosDashboardRidesTable,
  TaxiosDashboardRidesTableRow,
  TaxiosDashboardStatusPill,
  type DashboardTrip,
} from "./taxios-dashboard-rides-table";
import {
  createRideDetailViewModel,
  RideDetailDrawer,
} from "./ride-detail-drawer";
import type {
  BookingHistoryRow,
  CompanyDashboardCopy,
  CompanyDashboardPayload,
} from "../../../contracts/company-dashboard";

export type {
  DashboardTripStatusColor,
  DashboardTrip,
} from "./taxios-dashboard-rides-table";

export type CompanyDashboardRidesClientProps = {
  actionSlots?: Record<string, React.ReactNode>;
  activeRowCapacity?: number;
  copy: CompanyDashboardCopy["rides"];
  recentBookingHistory?: CompanyDashboardPayload["recentBookingHistory"];
  recentBookingHistorySummary?: CompanyDashboardPayload["recentBookingHistorySummary"];
  showRecentHistory?: boolean;
  upcomingTrips: DashboardTrip[];
};

function CompanyDashboardHistoryEmptyState({
  copy,
}: {
  copy: CompanyDashboardCopy["rides"];
}) {
  return (
    <div className="taxios-dashboard-history-empty rounded-[18px] px-6 py-7 text-center">
      <p className="font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
        {copy.historyEmptyTitle}
      </p>
      <p className="mt-1.5 font-medium text-taxis-body-sm text-[var(--taxis-workspace-text-muted)] leading-relaxed">
        {copy.historyEmptyDescription}
      </p>
    </div>
  );
}

function CompanyDashboardActiveRidesEmptyState({
  copy,
}: {
  copy: CompanyDashboardCopy["rides"];
}) {
  return (
    <div className="taxios-dashboard-rides-empty rounded-[22px] px-7 py-12 text-center">
      <p className="font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
        {copy.activeEmptyTitle}
      </p>
      <p className="mx-auto mt-2 max-w-md font-medium text-taxis-body-sm text-[var(--taxis-workspace-text-muted)] leading-relaxed">
        {copy.activeEmptyDescription}
      </p>
    </div>
  );
}

function CompanyDashboardHistoryRow({
  copy,
  row,
}: {
  copy: CompanyDashboardCopy["rides"];
  row: BookingHistoryRow;
}) {
  const visiblePassengers = row.passengers.slice(0, 3);
  const overflowCount = Math.max(0, row.passengers.length - visiblePassengers.length);

  return (
    <li className="taxios-dashboard-history-row grid gap-3 rounded-[20px] px-5 py-4 md:grid-cols-[5.5rem_minmax(0,1fr)_auto] md:items-center">
      <div className="flex items-baseline gap-2">
        <span className="taxis-data-inline font-semibold text-[16px] text-[var(--taxis-workspace-text-strong)] leading-none tracking-tight">
          {row.time}
        </span>
        <span className="font-medium text-taxis-eyebrow text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
          {copy.todayLabel}
        </span>
        {row.publicId ? (
          <span className="taxis-data-id font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)]">
            {row.publicId}
          </span>
        ) : null}
      </div>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--taxis-workspace-border-strong)]" />
          <span className="min-w-0 truncate font-medium text-[13.5px] text-[var(--taxis-workspace-text-secondary)]">
            {row.from}
          </span>
          <span aria-hidden="true" className="text-[var(--taxis-workspace-text-muted)]">
            -&gt;
          </span>
          <span className="min-w-0 truncate font-semibold text-[13.5px] text-[var(--taxis-workspace-text-strong)]">
            {row.to}
          </span>
        </div>
        <p className="mt-1.5 truncate font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
          {copy.tablePassengers}: {visiblePassengers.join(", ")}
          {overflowCount > 0 ? (
            <span className="taxis-data-inline">{` +${overflowCount}`}</span>
          ) : null}
        </p>
      </div>

      <div className="flex justify-start md:justify-end">
        <TaxiosDashboardStatusPill color={row.statusColor} label={row.status} />
      </div>
    </li>
  );
}

type RidesCapacityStyle = CSSProperties & {
  "--taxios-rides-row-capacity"?: string;
};

export function CompanyDashboardRidesClient({
  actionSlots = {},
  activeRowCapacity,
  copy,
  recentBookingHistory = [],
  recentBookingHistorySummary,
  showRecentHistory = true,
  upcomingTrips,
}: CompanyDashboardRidesClientProps) {
  const [selectedRide, setSelectedRide] = useState<DashboardTrip | null>(null);
  const capacityStyle: RidesCapacityStyle | undefined =
    activeRowCapacity === undefined
      ? undefined
      : {
          "--taxios-rides-row-capacity": String(activeRowCapacity),
        };

  return (
    <div className="taxis-dashboard-rides-column flex min-w-0 flex-col gap-7">
      <TaxiosPorcelainSurface
        className={`taxis-company-surface-primary taxios-dashboard-animate-fade-up flex min-w-0 flex-1 flex-col p-5 md:p-6 ${
          activeRowCapacity === undefined ? "" : "taxios-rides-capacity-surface"
        }`}
        style={capacityStyle}
      >
        <TaxiosDashboardSectionHeader
          action={
            <button
              className="taxis-section-action rounded-md px-3 py-1.5 font-semibold text-taxis-eyebrow text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow transition-all duration-200 hover:bg-[var(--taxis-workspace-card)] hover:text-[var(--taxis-workspace-text-primary)] hover:shadow-[0_1px_2px_rgba(15,23,42,0.08)] active:scale-[0.99]"
              type="button"
            >
              {copy.viewAll}
            </button>
          }
          className="mb-6"
          title={copy.title}
        />

        {upcomingTrips.length === 0 ? (
          <CompanyDashboardActiveRidesEmptyState copy={copy} />
        ) : (
          <TaxiosDashboardRidesTable copy={copy}>
            {upcomingTrips.map((trip) => (
              <TaxiosDashboardRidesTableRow
                actionSlot={actionSlots[trip.id]}
                copy={copy}
                key={trip.id}
                onSelect={setSelectedRide}
                trip={trip}
              />
            ))}
          </TaxiosDashboardRidesTable>
        )}
      </TaxiosPorcelainSurface>

      {showRecentHistory ? (
        <TaxiosPorcelainSurface className="taxis-company-surface-primary taxios-dashboard-animate-fade-up flex min-w-0 flex-col p-6 md:p-7">
          <TaxiosDashboardSectionHeader
            badge={
              recentBookingHistorySummary ? (
                <span className="rounded-md bg-[var(--taxis-workspace-card-soft)] px-2.5 py-1 font-semibold text-[9px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
                  {recentBookingHistorySummary.visibleCount}
                </span>
              ) : undefined
            }
            className="mb-6"
            subtitle={recentBookingHistorySummary?.label}
            title={copy.historyTitle}
          />

          {recentBookingHistory.length === 0 ? (
            <CompanyDashboardHistoryEmptyState copy={copy} />
          ) : (
            <ul className="grid gap-3">
              {recentBookingHistory.map((row) => (
                <CompanyDashboardHistoryRow copy={copy} key={row.id} row={row} />
              ))}
            </ul>
          )}
        </TaxiosPorcelainSurface>
      ) : null}

      <RideDetailDrawer
        copy={copy}
        detail={
          selectedRide === null
            ? null
            : createRideDetailViewModel(selectedRide, copy)
        }
        isOpen={selectedRide !== null}
        onClose={() => setSelectedRide(null)}
      />
    </div>
  );
}
