"use client";

import "../workspace/workspace.css";

import {
  Car,
  Check,
  Clock,
  Inbox,
  Route,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type {
  CompanyBookingHistoryItem,
  CompanyBookingRow,
  CompanyBookingStatusIndicator,
  CompanyBookingsCopy,
  CompanyBookingVehicleUnit,
} from "../../../contracts/company-bookings";
import {
  companyWorkspaceStatusIconClassForTone,
  companyWorkspaceStatusTintForTone,
  companyWorkspaceStatusToneForColor,
} from "../workspace/workspace-status";
import { CompanyDashboardAvatar } from "../dashboard/dashboard-avatar";
import {
  WorkspaceSectionHeader,
  WorkspaceSurface,
} from "../workspace/workspace-primitives";
import { WorkspaceStateView } from "../workspace/workspace-state-view";

export type CompanyBookingsWorkspaceContentProps = {
  canLoadMore?: boolean;
  copy: CompanyBookingsCopy;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  onCancelBooking?: (row: CompanyBookingRow) => void | Promise<void>;
  onSelectedBookingClear?: () => void;
  rows: readonly CompanyBookingRow[];
  selectedBookingPublicId?: string | null;
  selectedBookingRow?: CompanyBookingRow | null;
};

function initialsFromLabel(label: string) {
  const parts = label
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

function displayBookingId(row: CompanyBookingRow) {
  return row.publicId ?? row.bookingId;
}

function CompanyBookingTaxiStatusIcon({
  indicator,
}: {
  indicator: CompanyBookingStatusIndicator;
}) {
  const tone = companyWorkspaceStatusToneForColor(indicator.color);
  const isTerminalStatus =
    indicator.status === "cancelled" || indicator.status === "completed";
  const label = `${isTerminalStatus ? "Status" : "Taxi-Status"}: ${
    indicator.label
  }`;
  const Icon =
    indicator.status === "completed"
      ? Check
      : indicator.status === "cancelled"
        ? X
        : Car;

  return (
    <span
      aria-label={label}
      className="taxis-status-icon relative inline-flex shrink-0"
      role="img"
      style={{
        ["--taxis-status-tint" as never]:
          companyWorkspaceStatusTintForTone(tone),
      }}
      title={label}
    >
      {indicator.isPulsing ? (
        <span className="taxis-status-icon-pulse" />
      ) : null}
      <span className="taxis-status-icon-disc">
        <Icon
          aria-hidden="true"
          className={`h-4 w-4 ${companyWorkspaceStatusIconClassForTone(tone)}`}
          strokeWidth={indicator.status === "completed" ? 2.4 : 1.9}
        />
      </span>
    </span>
  );
}

function CompanyBookingTaxiStatusStack({
  indicators,
}: {
  indicators: readonly CompanyBookingStatusIndicator[];
}) {
  const compact = indicators.slice(0, 4);
  const hidden = indicators.slice(compact.length);
  const overflow = Math.max(0, indicators.length - compact.length);
  const hiddenStatusLabel = hidden
    .map((indicator) => indicator.label)
    .join(", ");

  return (
    <span className="inline-flex items-center justify-end gap-1.5">
      {compact.map((indicator) => (
        <CompanyBookingTaxiStatusIcon
          indicator={indicator}
          key={indicator.id}
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

function fallbackIndicatorForRow(
  row: CompanyBookingRow,
): CompanyBookingStatusIndicator {
  switch (row.lifecycleStatus) {
    case "arrived":
      return {
        color: "orange",
        id: `${row.bookingId}-fallback`,
        isPulsing: true,
        label: "Angekommen",
        status: "arrived",
      };
    case "cancelled":
      return {
        color: "red",
        id: `${row.bookingId}-fallback`,
        label: "Storniert",
        status: "cancelled",
      };
    case "completed":
      return {
        color: "green",
        id: `${row.bookingId}-fallback`,
        label: "Abgeschlossen",
        status: "completed",
      };
    case "driver_accepted":
    case "provider_accepted":
    case "requested":
      return {
        color: "navy",
        id: `${row.bookingId}-fallback`,
        label: "Gebucht",
        status: "booked",
      };
    case "enroute":
      return {
        color: "blue",
        id: `${row.bookingId}-fallback`,
        isPulsing: true,
        label: "In Anfahrt",
        status: "enroute",
      };
    case "picked_up":
      return {
        color: "green",
        id: `${row.bookingId}-fallback`,
        isPulsing: true,
        label: "Unterwegs",
        status: "underway",
      };
  }
}

function statusIndicatorsForRow(row: CompanyBookingRow) {
  return row.statusIndicators?.length > 0
    ? row.statusIndicators
    : [fallbackIndicatorForRow(row)];
}

function vehicleUnitsForRow(
  row: CompanyBookingRow,
): CompanyBookingVehicleUnit[] {
  if (row.vehicleUnits?.length > 0) {
    return row.vehicleUnits;
  }

  return [
    {
      driverName: row.driverName ?? null,
      driverVehicleVisible: row.driverVehicleVisible ?? false,
      label: "Fahrzeug 1",
      ordinal: 1,
      passengers: row.passengers ?? [],
      publicId: null,
      statusColor: row.statusColor,
      statusIndicators: statusIndicatorsForRow(row),
      statusLabel: row.statusLabel,
      unitId: `${row.bookingId}-unit-1`,
      vehicleDisplayName: row.vehicleDisplayName ?? null,
      vehicleLicensePlate: row.vehicleLicensePlate ?? null,
    },
  ];
}

function statusIndicatorsForVehicleUnit(unit: CompanyBookingVehicleUnit) {
  return unit.statusIndicators?.length > 0 ? unit.statusIndicators : [];
}

function CompanyBookingsStatusCell({ row }: { row: CompanyBookingRow }) {
  const indicators = statusIndicatorsForRow(row);
  const statusLabel = indicators.map((indicator) => indicator.label).join(", ");

  return (
    <div className="taxis-status-icons-cell taxios-dashboard-status-cell inline-flex items-center justify-end gap-2">
      <span className="sr-only">Status: {statusLabel}</span>
      <CompanyBookingTaxiStatusStack indicators={indicators} />
    </div>
  );
}

function CompanyBookingHistoryDot({
  item,
}: {
  item: CompanyBookingHistoryItem;
}) {
  const tone = companyWorkspaceStatusToneForColor(item.tone);

  return (
    <span
      aria-hidden="true"
      className="mt-1.5 inline-flex h-3 w-3 shrink-0 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(15,23,42,0.08)]"
      style={{ backgroundColor: companyWorkspaceStatusTintForTone(tone) }}
    />
  );
}

function CompanyBookingsDetailMetric({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string;
  secondary?: string | null;
}) {
  return (
    <div className="min-w-0 rounded-[18px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
      <span className="block font-semibold text-[9.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
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

function CompanyBookingDetailDrawer({
  copy,
  isOpen,
  onCancelBooking,
  onClose,
  row,
}: {
  copy: CompanyBookingsCopy;
  isOpen: boolean;
  onCancelBooking?: (row: CompanyBookingRow) => void | Promise<void>;
  onClose: () => void;
  row: CompanyBookingRow | null;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!row || !isOpen) return;

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
      const tabForward = !event.shiftKey;

      if (tabForward) {
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
  }, [isOpen, onClose, row]);

  useEffect(() => {
    if (!row || !isOpen) return;

    let previousFocused: HTMLElement | null = null;
    if (document.activeElement instanceof HTMLElement) {
      previousFocused = document.activeElement;
    }

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      previousFocused?.focus();
    };
  }, [isOpen, row]);

  useEffect(() => {
    if (!row) return;

    setCancelError(null);
    setIsCancelling(false);
  }, [row]);

  if (!row) {
    return null;
  }

  const bookingId = displayBookingId(row);
  const bookedByName = row.bookedByName ?? "Unbekannt";
  const bookedByEmail = row.bookedByEmail ?? null;
  const history = row.history ?? [];
  const passengers = row.passengers ?? [];
  const vehicleUnits = vehicleUnitsForRow(row);
  const titleId = `taxios-company-booking-detail-title-${row.bookingId}`;
  const cancelAction = row.allowedActions.find(
    (action) => action.id === "cancel_booking",
  );
  const cancelDisabled =
    isCancelling ||
    onCancelBooking === undefined ||
    cancelAction === undefined ||
    cancelAction.disabled === true;
  const cancelDisabledReason =
    cancelAction?.reason ??
    (onCancelBooking === undefined ? copy.detailCancelErrorFallback : null);

  async function handleCancel() {
    if (row === null || cancelDisabled || onCancelBooking === undefined) {
      return;
    }

    const cancellableRow = row;

    setCancelError(null);
    setIsCancelling(true);

    try {
      await onCancelBooking(cancellableRow);
    } catch (error) {
      setCancelError(
        error instanceof Error ? error.message : copy.detailCancelErrorFallback,
      );
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-end p-6 transition-all duration-200 md:p-8 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <button
        aria-label={copy.detailBackdropLabel}
        className={`absolute inset-0 bg-slate-950/14 backdrop-blur-md transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <div
        ref={panelRef}
        aria-labelledby={titleId}
        aria-modal="true"
        className={`taxis-overlay-panel ride-detail-floating-panel taxis-workspace-ease-standard relative flex h-[calc(100dvh-48px)] max-h-[calc(100dvh-48px)] w-[min(500px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[26px] border ${
          isOpen
            ? "ride-detail-floating-panel-open translate-x-0 scale-100 opacity-100"
            : "translate-x-[110%] scale-[0.985] opacity-0"
        }`}
        role="dialog"
      >
        <div className="pointer-events-none absolute inset-0 rounded-[26px] shadow-[inset_1px_0_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(15,23,42,0.04)]" />

        <div className="taxis-overlay-header relative z-10 flex items-start justify-between gap-4 border-[var(--taxis-workspace-border-subtle)] border-b px-6 pt-6 pb-5">
          <div className="min-w-0 flex-1">
            <span className="block font-semibold text-[9.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
              {copy.detailBookingIdLabel}
            </span>
            <div className="mt-2 flex min-w-0 items-center gap-2.5">
              <span
                className="taxis-data-id block min-w-0 truncate font-semibold text-[22px] text-[var(--taxis-workspace-text-strong)] tracking-tight"
                id={titleId}
                title={bookingId}
              >
                {bookingId}
              </span>
              <CompanyBookingTaxiStatusStack
                indicators={statusIndicatorsForRow(row)}
              />
            </div>
          </div>
          <button
            ref={closeButtonRef}
            aria-label={copy.detailCloseButtonLabel}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] text-[var(--taxis-workspace-text-muted)] shadow-sm transition-all hover:border-[var(--taxis-workspace-border-strong)] hover:text-[var(--taxis-workspace-text-strong)] active:scale-[0.99]"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="taxis-workspace-scrollbar flex-1 space-y-6 overflow-y-auto px-6 pt-6 pb-7">
          <section className="grid gap-3 sm:grid-cols-2">
            <CompanyBookingsDetailMetric
              label={copy.detailBookedByLabel}
              primary={bookedByName}
              secondary={bookedByEmail}
            />
            <CompanyBookingsDetailMetric
              label={copy.detailBookedAtLabel}
              primary={`${row.createdDateLabel}, ${row.createdTimeLabel}`}
            />
            <div className="sm:col-span-2">
              <CompanyBookingsDetailMetric
                label={copy.detailPickupAtLabel}
                primary={`${row.pickupDateLabel}, ${row.pickupTimeLabel}`}
              />
            </div>
          </section>

          <section>
            <h4 className="mb-4 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.16em]">
              {passengers.length} {copy.detailPassengersLabel}
            </h4>
            <div className="space-y-2">
              {passengers.map((passenger) => (
                <div
                  className="ride-detail-passenger-row taxis-workspace-ease-standard flex items-center gap-4 rounded-[20px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] p-4 shadow-[0_14px_38px_-34px_rgba(15,23,42,0.45),inset_0_1px_0_rgba(255,255,255,0.9)]"
                  key={`${row.bookingId}-${passenger}`}
                >
                  <CompanyDashboardAvatar
                    className="h-12 w-12"
                    initials={initialsFromLabel(passenger)}
                    name={passenger}
                  />
                  <p className="min-w-0 flex-1 truncate font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)]">
                    {passenger}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="ride-detail-info-card space-y-5 rounded-[22px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] p-5 shadow-[0_16px_42px_-36px_rgba(15,23,42,0.48),inset_0_1px_0_rgba(255,255,255,0.92)]">
            <div className="flex items-center gap-2 text-[var(--taxis-workspace-text-muted)]">
              <Route size={16} />
              <h4 className="font-semibold text-[11px] uppercase tracking-[0.16em]">
                {copy.detailRouteLabel}
              </h4>
            </div>
            <CompanyBookingsRoute copy={copy} row={row} />
            <div className="h-[1px] w-full bg-[var(--taxis-workspace-border-subtle)]" />
            <div className="flex items-center gap-2">
              <Clock
                className="text-[var(--taxis-workspace-accent-strong)]"
                size={16}
              />
              <p className="font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)]">
                {row.pickupDateLabel}, {row.pickupTimeLabel}
              </p>
            </div>
          </section>

          <section className="rounded-[22px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] p-5 shadow-[0_16px_42px_-36px_rgba(15,23,42,0.48),inset_0_1px_0_rgba(255,255,255,0.92)]">
            <h4 className="mb-2 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.16em]">
              {copy.detailNoteLabel}
            </h4>
            <p className="whitespace-pre-wrap text-[13px] text-[var(--taxis-workspace-text-secondary)] leading-relaxed">
              {row.note ?? copy.detailNoteEmptyLabel}
            </p>
          </section>

          <section className="rounded-[22px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] p-5 shadow-[0_16px_42px_-36px_rgba(15,23,42,0.48),inset_0_1px_0_rgba(255,255,255,0.92)]">
            <h4 className="mb-4 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.16em]">
              {copy.detailDriverVehicleLabel}
            </h4>
            <div className="space-y-3">
              {vehicleUnits.map((unit) => {
                const vehicleText = [
                  unit.vehicleDisplayName,
                  unit.vehicleLicensePlate,
                ]
                  .filter(Boolean)
                  .join(" · ");
                const passengerText = unit.passengers.join(", ");
                const shouldShowAssignment =
                  unit.driverVehicleVisible &&
                  (unit.driverName !== null || vehicleText.length > 0);

                return (
                  <div
                    className="rounded-[20px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                    key={unit.unitId}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
                          {unit.label}
                        </p>
                        {unit.publicId ? (
                          <p className="taxis-data-id mt-1 truncate font-semibold text-[10.5px] text-[var(--taxis-workspace-text-muted)]">
                            {unit.publicId}
                          </p>
                        ) : null}
                      </div>
                      <CompanyBookingTaxiStatusStack
                        indicators={statusIndicatorsForVehicleUnit(unit)}
                      />
                    </div>

                    {shouldShowAssignment ? (
                      <div className="flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--taxis-workspace-control-dark)] text-white shadow-[0_10px_22px_-16px_rgba(15,23,42,0.45)]">
                          <Car size={18} />
                        </span>
                        <div className="min-w-0 flex-1 space-y-2">
                          {unit.driverName ? (
                            <p className="flex min-w-0 items-center gap-2 font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
                              <UserRound
                                className="shrink-0 text-[var(--taxis-workspace-text-muted)]"
                                size={15}
                              />
                              <span className="truncate">
                                {copy.detailDriverLabel}: {unit.driverName}
                              </span>
                            </p>
                          ) : null}
                          {vehicleText ? (
                            <p className="min-w-0 font-medium text-[12.5px] text-[var(--taxis-workspace-text-secondary)]">
                              {copy.detailVehicleLabel}:{" "}
                              <span className="font-semibold text-[var(--taxis-workspace-text-strong)]">
                                {vehicleText}
                              </span>
                            </p>
                          ) : null}
                          {passengerText ? (
                            <p className="truncate font-medium text-[11.5px] text-[var(--taxis-workspace-text-muted)]">
                              {passengerText}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 rounded-[18px] border border-dashed border-[var(--taxis-workspace-surface-rim-strong)] bg-[var(--taxis-workspace-surface-soft)] px-4 py-3">
                        <Car
                          className="mt-0.5 shrink-0 text-[var(--taxis-workspace-text-muted)]"
                          size={16}
                        />
                        <p className="font-medium text-[12.5px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
                          {copy.detailDriverPendingLabel}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h4 className="mb-4 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.16em]">
              {copy.detailHistoryLabel}
            </h4>
            {history.length === 0 ? (
              <div className="taxios-dashboard-history-empty rounded-[18px] px-4 py-5 text-center font-medium text-[12.5px] text-[var(--taxis-workspace-text-muted)]">
                {copy.detailHistoryEmptyLabel}
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    className="taxios-dashboard-history-row flex gap-3 rounded-[18px] px-4 py-3"
                    key={item.id}
                  >
                    <CompanyBookingHistoryDot item={item} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                        {item.label}
                      </p>
                      <p className="mt-1 truncate font-medium text-[11.5px] text-[var(--taxis-workspace-text-muted)]">
                        {item.dateLabel}, {item.timeLabel}
                        {item.actorName ? ` · ${item.actorName}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="relative z-10 border-[var(--taxis-workspace-border-subtle)] border-t bg-[var(--taxis-workspace-surface)] px-6 py-5">
          <button
            className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-[18px] bg-[var(--taxis-workspace-control-dark)] px-4 font-semibold text-[13px] text-white shadow-[0_16px_30px_-24px_rgba(15,23,42,0.55)] transition-all hover:bg-[var(--taxis-workspace-control-dark-hover)] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={cancelDisabled}
            onClick={() => {
              void handleCancel();
            }}
            title={cancelDisabledReason ?? undefined}
            type="button"
          >
            <Trash2
              aria-hidden="true"
              className="text-[var(--taxis-workspace-accent-strong)]"
              size={17}
              strokeWidth={2}
            />
            {isCancelling
              ? copy.detailCancelWorkingLabel
              : (cancelAction?.label ?? copy.detailCancelLabel)}
          </button>
          {cancelError ? (
            <p className="mt-3 text-center font-medium text-[12px] text-[var(--taxis-status-danger-text)]">
              {cancelError}
            </p>
          ) : cancelDisabledReason ? (
            <p className="mt-3 text-center font-medium text-[11.5px] text-[var(--taxis-workspace-text-muted)]">
              {cancelDisabledReason}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CompanyBookingsEmptyState({ copy }: { copy: CompanyBookingsCopy }) {
  return (
    <WorkspaceStateView
      description={copy.emptyDescription}
      icon={<Inbox aria-hidden="true" />}
      title={copy.emptyTitle}
      variant="empty"
    />
  );
}

function CompanyBookingsPassengers({ row }: { row: CompanyBookingRow }) {
  const visiblePassengers = row.passengers.slice(0, 3);
  const overflowCount = Math.max(
    0,
    row.passengers.length - visiblePassengers.length,
  );

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="taxios-avatar-stack -space-x-2 flex shrink-0">
        {visiblePassengers.map((passenger) => (
          <CompanyDashboardAvatar
            className="h-9 w-9 ring-2 ring-[var(--taxis-workspace-control-dark)]"
            initials={initialsFromLabel(passenger)}
            key={`${row.bookingId}-${passenger}`}
            name={passenger}
          />
        ))}
        {overflowCount > 0 ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--taxis-workspace-card-soft)] font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] ring-2 ring-[var(--taxis-workspace-card)]">
            +{overflowCount}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function CompanyBookingsRoute({
  copy,
  row,
}: {
  copy: CompanyBookingsCopy;
  row: CompanyBookingRow;
}) {
  return (
    <div className="ride-route-line min-w-0">
      <div className="ride-route-entry ride-route-entry-origin">
        <span className="ride-route-label">{copy.fromLabel}</span>
        <span
          aria-hidden="true"
          className="ride-route-dot ride-route-dot-start"
        />
        <span className="ride-route-place ride-route-place-origin">
          {row.from}
        </span>
      </div>
      <div className="ride-route-entry ride-route-entry-destination">
        <span className="ride-route-label">{copy.toLabel}</span>
        <span
          aria-hidden="true"
          className="ride-route-dot ride-route-dot-end"
        />
        <span className="ride-route-place ride-route-place-destination">
          {row.to}
        </span>
      </div>
    </div>
  );
}

function CompanyBookingsTable({
  copy,
  onSelectRow,
  rows,
}: {
  copy: CompanyBookingsCopy;
  onSelectRow: (row: CompanyBookingRow) => void;
  rows: readonly CompanyBookingRow[];
}) {
  return (
    <div className="taxis-workspace-table-scroll taxis-company-table-scroll taxios-bookings-table-scroll taxis-workspace-scrollbar">
      <table className="taxis-workspace-table taxis-company-table taxios-bookings-table border-separate text-left">
        <colgroup>
          <col className="w-[13%]" />
          <col className="w-[13%]" />
          <col className="w-[16%]" />
          <col className="w-[31%]" />
          <col className="w-[13%]" />
          <col className="w-[14%]" />
        </colgroup>
        <thead>
          <tr className="font-semibold text-[10.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
            <th className="taxis-workspace-table-header-cell taxios-bookings-header-cell rounded-l-xl border-y border-l px-4 py-2.5">
              {copy.tablePickup}
            </th>
            <th className="taxis-workspace-table-header-cell taxios-bookings-header-cell border-y px-4 py-2.5">
              {copy.tableCreated}
            </th>
            <th className="taxis-workspace-table-header-cell taxios-bookings-header-cell border-y px-4 py-2.5">
              {copy.tablePassengers}
            </th>
            <th className="taxis-workspace-table-header-cell taxios-bookings-header-cell border-y px-4 py-2.5">
              {copy.tableRoute}
            </th>
            <th className="taxis-workspace-table-header-cell taxios-bookings-header-cell border-y px-4 py-2.5">
              {copy.tableId}
            </th>
            <th className="taxis-workspace-table-header-cell taxios-bookings-header-cell rounded-r-xl border-y border-r px-4 py-2.5 text-right">
              {copy.tableStatus}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className="taxis-workspace-table-row taxis-workspace-table-row-interactive taxios-bookings-row group"
              key={row.bookingId}
              onClick={() => onSelectRow(row)}
            >
              <td className="taxis-workspace-table-cell taxios-bookings-cell rounded-l-[16px] border-y border-l px-4 py-3.5">
                <span className="taxis-data-value block font-semibold text-[17px] text-[var(--taxis-workspace-text-strong)] leading-none tracking-tight">
                  {row.pickupTimeLabel}
                </span>
                <span className="mt-1.5 block font-medium text-[10.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                  {row.pickupDateLabel}
                </span>
              </td>
              <td className="taxis-workspace-table-cell taxios-bookings-cell border-y px-4 py-3.5">
                <span className="taxis-data-value block font-semibold text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                  {row.createdTimeLabel}
                </span>
                <span className="mt-1.5 block font-medium text-[10.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                  {row.createdDateLabel}
                </span>
              </td>
              <td className="taxis-workspace-table-cell taxios-bookings-cell border-y px-4 py-3.5">
                <CompanyBookingsPassengers row={row} />
              </td>
              <td className="taxis-workspace-table-cell taxios-bookings-cell border-y px-4 py-3.5">
                <CompanyBookingsRoute copy={copy} row={row} />
              </td>
              <td className="taxis-workspace-table-cell taxios-bookings-cell border-y px-4 py-3.5">
                <span className="taxis-data-id taxios-bookings-public-id block font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)]">
                  {row.publicId ?? "-"}
                </span>
              </td>
              <td className="taxis-workspace-table-cell taxios-bookings-cell rounded-r-[16px] border-y border-r px-4 py-3.5 text-right">
                <div className="flex min-w-0 items-center justify-end gap-2">
                  <CompanyBookingsStatusCell row={row} />
                  <button
                    aria-label={`${displayBookingId(row)} ${copy.detailOpenRowLabel}`}
                    className="sr-only focus:not-sr-only focus:absolute focus:top-1/2 focus:right-4 focus:z-10 focus:-translate-y-1/2 focus:rounded-xl focus:border focus:border-[var(--taxis-workspace-surface-rim)] focus:bg-[var(--taxis-workspace-surface)] focus:px-3 focus:py-2 focus:font-semibold focus:text-[12px] focus:text-[var(--taxis-workspace-text-secondary)] focus:shadow-[0_10px_24px_-18px_rgba(15,23,42,0.28)]"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectRow(row);
                    }}
                    type="button"
                  >
                    {copy.detailOpenRowLabel}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CompanyBookingsWorkspaceContent({
  canLoadMore = false,
  copy,
  isLoadingMore = false,
  onCancelBooking,
  onLoadMore,
  onSelectedBookingClear,
  rows,
  selectedBookingPublicId = null,
  selectedBookingRow = null,
}: CompanyBookingsWorkspaceContentProps) {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const selectedRow =
    rows.find((row) => row.bookingId === selectedBookingId) ??
    (selectedBookingRow?.bookingId === selectedBookingId
      ? selectedBookingRow
      : null);
  const loadMoreDisabled =
    isLoadingMore || !canLoadMore || onLoadMore === undefined;

  useEffect(() => {
    if (selectedBookingPublicId === null) {
      return;
    }

    const matchingRow =
      rows.find(
        (row) =>
          row.publicId === selectedBookingPublicId ||
          row.bookingId === selectedBookingPublicId,
      ) ??
      (selectedBookingRow?.publicId === selectedBookingPublicId ||
      selectedBookingRow?.bookingId === selectedBookingPublicId
        ? selectedBookingRow
        : null);

    if (matchingRow !== null) {
      setSelectedBookingId(matchingRow.bookingId);
    }
  }, [rows, selectedBookingPublicId, selectedBookingRow]);

  return (
    <div className="taxis-company-workspace-content taxis-workspace-content-area">
      <div className="taxis-company-workspace-frame taxis-company-workspace-stack">
        <section className="taxis-company-page-header">
          <span className="taxis-company-page-eyebrow">Company workspace</span>
          <h1 className="taxis-company-page-title">{copy.title}</h1>
          <p className="taxis-company-page-description">{copy.subtitle}</p>
        </section>

        <WorkspaceSurface className="taxis-company-surface-primary taxis-workspace-animate-fade-up flex min-w-0 flex-col p-5 md:p-6">
          <WorkspaceSectionHeader
            badge={
              <span className="taxis-count-chip inline-flex items-center rounded-full border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-2.5 py-1 font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                {rows.length} {copy.visibleLabel}
              </span>
            }
            className="mb-6"
            title={copy.title}
          />

          {rows.length === 0 ? (
            <CompanyBookingsEmptyState copy={copy} />
          ) : (
            <CompanyBookingsTable
              copy={copy}
              onSelectRow={(row) => setSelectedBookingId(row.bookingId)}
              rows={rows}
            />
          )}

          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
              {canLoadMore ? "" : copy.allLoadedLabel}
            </span>
            {canLoadMore ? (
              <button
                className="rounded-xl border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-4 py-2 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:border-[var(--taxis-workspace-surface-rim-strong)] hover:text-[var(--taxis-workspace-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loadMoreDisabled}
                onClick={onLoadMore}
                type="button"
              >
                {isLoadingMore ? copy.loadingMoreLabel : copy.loadMoreLabel}
              </button>
            ) : null}
          </div>
        </WorkspaceSurface>
      </div>
      <CompanyBookingDetailDrawer
        copy={copy}
        isOpen={selectedRow !== null}
        onCancelBooking={onCancelBooking}
        onClose={() => {
          setSelectedBookingId(null);
          onSelectedBookingClear?.();
        }}
        row={selectedRow}
      />
    </div>
  );
}
