/**
 * Dashboard-local table components used by CompanyDashboardRidesClient.
 * Currently intended only inside that client island; not a global data table abstraction.
 */

import { Car, ChevronRight } from "lucide-react";
import type React from "react";

import type {
  BookingRow,
  BookingStatusColor,
  BookingTaxiStatus,
  BookingTaxiStatusPayload,
  CompanyDashboardCopy,
} from "../../../contracts/company-dashboard";
import {
  type CompanyWorkspaceStatusTone,
  companyWorkspaceStatusIconClassForTone,
  companyWorkspaceStatusRingForTone,
  companyWorkspaceStatusSurfaceForTone,
  companyWorkspaceStatusTintForTone,
  companyWorkspaceStatusToneForColor,
} from "../company-workspace/company-workspace-status";
import { CompanyWorkspaceStateChip } from "../company-workspace/company-workspace-status-chip";
import { CompanyDashboardAvatar } from "./dashboard-avatar";

export type DashboardTripStatusColor = BookingStatusColor;
export type DashboardTripTaxiStatus = BookingTaxiStatus;
export type DashboardTripTaxiStatusPayload = BookingTaxiStatusPayload;
export type DashboardTrip = BookingRow;

type RidesCopy = CompanyDashboardCopy["rides"];

const statusToneByTripStatus: Record<
  DashboardTripTaxiStatus,
  CompanyWorkspaceStatusTone
> = {
  assigned: "info",
  arrived: "attention",
  completed: "neutral",
  issue: "danger",
  inRide: "success",
  onWay: "accent",
  ordered: "muted",
};

const statusFromLegacy = (
  trip: DashboardTrip,
): readonly DashboardTripTaxiStatusPayload[] => {
  if (trip.taxiStatuses && trip.taxiStatuses.length > 0) {
    return trip.taxiStatuses;
  }

  const mappedByColor: Record<
    DashboardTripStatusColor,
    DashboardTripTaxiStatus
  > = {
    blue: "assigned",
    grey: "ordered",
    green: "inRide",
    orange: "onWay",
    red: "issue",
    violet: "arrived",
  };

  return [
    { status: mappedByColor[trip.statusColor], isPulsing: trip.isPulsing },
  ];
};

const routeLabelsFromCopy = (copy: RidesCopy) => ({
  from: copy.pickupLabel === "Pickup" ? "From" : "Von",
  to: copy.destinationLabel === "Destination" ? "To" : "Nach",
});

export type TaxiStatusIconProps = {
  isPulsing?: boolean;
  label: string;
  status: DashboardTripTaxiStatus;
};

export function TaxiStatusIcon({
  isPulsing,
  label,
  status,
}: TaxiStatusIconProps) {
  const tone = statusToneByTripStatus[status];

  return (
    <span
      aria-label={label}
      className="taxis-status-icon relative inline-flex shrink-0"
      role="img"
      title={label}
      style={{
        ["--taxis-status-icon-pulse" as never]:
          companyWorkspaceStatusTintForTone(tone),
        ["--taxis-status-icon-ring" as never]:
          companyWorkspaceStatusRingForTone(tone),
        ["--taxis-status-icon-surface" as never]:
          companyWorkspaceStatusSurfaceForTone(tone),
      }}
    >
      {isPulsing ? <span className="taxis-status-icon-pulse" /> : null}
      <span className="taxis-status-icon-disc">
        <Car
          className={`h-4 w-4 ${companyWorkspaceStatusIconClassForTone(tone)}`}
          aria-hidden="true"
          strokeWidth={1.9}
        />
      </span>
    </span>
  );
}

export type TaxiStatusStackProps = {
  copy: RidesCopy;
  statuses: readonly DashboardTripTaxiStatusPayload[];
};

export function TaxiStatusStack({ copy, statuses }: TaxiStatusStackProps) {
  const compact = statuses.slice(0, 4);
  const hidden = statuses.slice(compact.length);
  const overflow = Math.max(0, statuses.length - compact.length);
  const hiddenStatusLabel = hidden
    .map((entry) => copy.statusLabels[entry.status] ?? copy.unknownStatus)
    .join(", ");

  return (
    <span className="inline-flex items-center gap-1.5">
      {compact.map((entry) => (
        <TaxiStatusIcon
          isPulsing={entry.isPulsing}
          key={`${entry.status}-${entry.isPulsing ? "pulse" : "steady"}`}
          label={copy.statusLabels[entry.status]}
          status={entry.status}
        />
      ))}
      {overflow > 0 ? (
        <span
          className="ml-1 inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[var(--taxis-workspace-border-warm)] bg-[var(--taxis-workspace-card-soft)] font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)]"
          title={hiddenStatusLabel}
        >
          <span aria-hidden="true">+{overflow}</span>
          <span className="sr-only">{hiddenStatusLabel}</span>
        </span>
      ) : null}
    </span>
  );
}

export type TaxiosDashboardStatusPillProps = {
  color: DashboardTripStatusColor;
  label: string;
};

export function TaxiosDashboardStatusPill({
  color,
  label,
}: TaxiosDashboardStatusPillProps) {
  const tone = companyWorkspaceStatusToneForColor(color);

  return <CompanyWorkspaceStateChip tone={tone}>{label}</CompanyWorkspaceStateChip>;
}

export type TaxiosDashboardRidesTableProps = {
  children: React.ReactNode;
  copy: RidesCopy;
};

export function TaxiosDashboardRidesTable({
  children,
  copy,
}: TaxiosDashboardRidesTableProps) {
  return (
    <div className="taxios-rides-static-list flex-1">
      <table className="taxios-rides-table border-separate text-left">
        <colgroup>
          <col className="w-[12%]" />
          <col className="w-[17%]" />
          <col className="w-[39%]" />
          <col className="w-[15%]" />
          <col className="w-[17%]" />
        </colgroup>
        <thead>
          <tr className="font-semibold text-taxis-eyebrow text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
            <th className="taxis-metal-rail-cell taxios-rides-header-cell rounded-l-xl border-y border-l px-4 py-2.5">
              {copy.tableTime}
            </th>
            <th className="taxis-metal-rail-cell taxios-rides-header-cell border-y px-4 py-2.5">
              {copy.tablePassengers}
            </th>
            <th className="taxis-metal-rail-cell taxios-rides-header-cell border-y px-4 py-2.5">
              {copy.tableRoute}
            </th>
            <th className="taxis-metal-rail-cell taxios-rides-header-cell border-y px-4 py-2.5">
              {copy.tableId}
            </th>
            <th className="taxis-metal-rail-cell taxios-rides-header-cell rounded-r-xl border-y border-r px-4 py-2.5 text-right">
              {copy.tableStatus}
            </th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export type TaxiosDashboardRidesTableRowProps = {
  actionSlot?: React.ReactNode;
  copy: RidesCopy;
  onSelect: (trip: DashboardTrip) => void;
  trip: DashboardTrip;
};

export function TaxiosDashboardRidesTableRow({
  actionSlot,
  copy,
  onSelect,
  trip,
}: TaxiosDashboardRidesTableRowProps) {
  const visiblePassengers = trip.passengers.slice(0, 3);
  const overflowCount = Math.max(
    0,
    trip.passengers.length - visiblePassengers.length,
  );
  const tripStatuses = statusFromLegacy(trip);
  const rideStatus = tripStatuses
    .map((item) => copy.statusLabels[item.status] ?? copy.unknownStatus)
    .join(", ");
  const routeLabels = routeLabelsFromCopy(copy);

  return (
    <tr
      className="taxios-rides-row group cursor-pointer rounded-[16px]"
      onClick={() => onSelect(trip)}
    >
      <td className="taxios-rides-cell rounded-l-[16px] border-y border-l px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="taxis-data-value font-semibold text-[17px] text-[var(--taxis-workspace-text-strong)] leading-none tracking-tight transition-colors group-hover:text-[var(--taxis-workspace-text-strong)]">
            {trip.time}
          </span>
          <span className="font-medium text-taxis-eyebrow text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
            {copy.todayLabel}
          </span>
        </div>
      </td>
      <td className="taxios-rides-cell border-y px-4 py-3">
        <div className="taxios-avatar-stack -space-x-2 flex">
          {visiblePassengers.map((passenger) => (
            <CompanyDashboardAvatar
              className="h-9 w-9 ring-2 ring-[var(--taxis-workspace-control-dark)]"
              initials={passenger}
              name={passenger}
              key={`${trip.id}-${passenger}`}
            />
          ))}
          {overflowCount > 0 ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--taxis-workspace-card-soft)] font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] ring-2 ring-[var(--taxis-workspace-card)]">
              +{overflowCount}
            </span>
          ) : null}
        </div>
      </td>
      <td className="taxios-rides-cell border-y px-4 py-3">
        <div className="ride-route-line min-w-0">
          <div className="ride-route-entry ride-route-entry-origin">
            <span className="ride-route-label">{routeLabels.from}</span>
            <span
              aria-hidden="true"
              className="ride-route-dot ride-route-dot-start"
            />
            <span className="ride-route-place ride-route-place-origin">
              {trip.from}
            </span>
          </div>
          <div className="ride-route-entry ride-route-entry-destination">
            <span className="ride-route-label">{routeLabels.to}</span>
            <span
              aria-hidden="true"
              className="ride-route-dot ride-route-dot-end"
            />
            <span className="ride-route-place ride-route-place-destination">
              {trip.to}
            </span>
          </div>
        </div>
      </td>
      <td className="taxios-rides-cell border-y px-4 py-3">
        <span className="taxis-data-id taxios-rides-public-id block font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)]">
          {trip.publicId ?? "-"}
        </span>
      </td>
      <td className="taxios-rides-cell rounded-r-[16px] border-y border-r px-4 py-3 text-right">
        <div
          className="taxis-status-icons-cell taxios-dashboard-status-cell inline-flex items-center justify-end gap-2"
          title={`${copy.taxiStatusPrefix}: ${rideStatus}`}
        >
          <span className="sr-only">{`${copy.statusLabel}: ${rideStatus}`}</span>
          <TaxiStatusStack copy={copy} statuses={tripStatuses} />
          {actionSlot ? (
            actionSlot
          ) : (
            <ChevronRight
              className="taxis-rides-chevron shrink-0 text-[var(--taxis-workspace-text-muted)] opacity-80"
              size={16}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
