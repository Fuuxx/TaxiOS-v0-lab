"use client";

/**
 * Dashboard-local ride detail drawer presenter; not a global modal abstraction.
 * CSS comes from parent dashboard surfaces (`company-dashboard.css` on the shell).
 */

import { useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { CompanyDashboardAvatar } from "./dashboard-avatar";
import { WorkspaceCloseButton } from "../workspace/workspace-controls";
import type { CompanyDashboardCopy } from "../../../contracts/company-dashboard";
import type {
  DashboardTrip,
  DashboardTripStatusColor,
} from "./taxios-dashboard-rides-table";

type RidesCopy = CompanyDashboardCopy["rides"];

type RideDetailViewModel = {
  dateLabel: string;
  from: string;
  id: string;
  passengers: string[];
  status: string;
  statusColor: DashboardTripStatusColor;
  time: string;
  to: string;
};

export function createRideDetailViewModel(
  ride: DashboardTrip,
  copy: RidesCopy,
): RideDetailViewModel {
  return {
    dateLabel: copy.dateLabel,
    from: ride.from,
    id: ride.id,
    passengers: ride.passengers,
    status: ride.status,
    statusColor: ride.statusColor,
    time: ride.time,
    to: ride.to,
  };
}

type RideDetailDrawerProps = {
  copy: RidesCopy;
  detail: RideDetailViewModel | null;
  isOpen: boolean;
  onClose: () => void;
};

const RIDE_DETAIL_DRAWER_TITLE_ID_PREFIX = "taxios-ride-detail-drawer-title-";

const PANEL_FOCUSABLE_SELECTOR = [
  "a[href]",
  'button:not([disabled])',
  "textarea:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/** Focus order inside the floating panel; local to this presenter, no external deps. */
function tabOrderInsidePanel(panel: HTMLElement): HTMLElement[] {
  return Array.from(
    panel.querySelectorAll<HTMLElement>(PANEL_FOCUSABLE_SELECTOR),
  ).filter((el) => {
    const style = window.getComputedStyle(el);
    return style.visibility !== "hidden" && style.display !== "none";
  });
}

export function RideDetailDrawer({
  copy,
  detail,
  isOpen,
  onClose,
}: RideDetailDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!detail || !isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusables = tabOrderInsidePanel(panel);
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
  }, [detail, isOpen, onClose]);

  useEffect(() => {
    if (!detail || !isOpen) return;

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
  }, [detail, isOpen]);

  if (!detail) {
    return null;
  }

  const titleId = `${RIDE_DETAIL_DRAWER_TITLE_ID_PREFIX}${detail.id}`;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-end p-6 transition-all duration-200 md:p-8 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <button
        aria-label={copy.detailBackdropLabel}
        className={`absolute inset-0 bg-[var(--taxis-workspace-scrim)] backdrop-blur-md transition-opacity duration-200 ${
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
        className={`taxis-overlay-panel ride-detail-floating-panel taxios-dashboard-ease-standard relative flex h-[calc(100dvh-48px)] max-h-[calc(100dvh-48px)] w-[min(440px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[26px] border ${
          isOpen
            ? "ride-detail-floating-panel-open translate-x-0 scale-100 opacity-100"
            : "translate-x-[110%] scale-[0.985] opacity-0"
        }`}
        role="dialog"
      >
        <div className="pointer-events-none absolute inset-0 rounded-[26px] shadow-[inset_1px_0_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(15,23,42,0.04)]" />

        <div className="taxis-overlay-header relative z-10 flex items-start justify-between gap-4 border-[var(--taxis-workspace-divider)] border-b px-6 pt-6 pb-5">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex min-w-0 items-center gap-2.5">
              <span
                className="block min-w-0 truncate font-semibold text-[22px] text-[var(--taxis-workspace-text-strong)] tracking-tight"
                id={titleId}
                title={detail.id}
              >
                {detail.id}
              </span>
              <span
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 font-semibold text-[9px] uppercase tracking-[0.14em] ${
                  detail.statusColor === "green"
                    ? "bg-[var(--taxis-status-success-bg)] text-[var(--taxis-status-success-text)] ring-1 ring-[var(--taxis-status-success-ring)]"
                    : "bg-[var(--taxis-status-neutral-bg)] text-[var(--taxis-status-neutral-text)]"
                }`}
              >
                {detail.statusColor === "green" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--taxis-status-success)]" />
                ) : null}
                {detail.status}
              </span>
            </div>
          </div>
          <WorkspaceCloseButton
            label={copy.detailCloseButtonLabel}
            onClick={onClose}
            ref={closeButtonRef}
          />
        </div>

        <div className="taxios-dashboard-custom-scrollbar flex-1 space-y-6 overflow-y-auto px-6 pt-6 pb-7">
          <section>
            <h4 className="mb-5 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
              {detail.passengers.length} {copy.passengersLabel}
            </h4>
            <div className="space-y-2">
              {detail.passengers.map((passenger) => (
                <div
                  className="ride-detail-passenger-row taxios-dashboard-ease-standard flex items-center gap-4 rounded-[20px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)]/88 p-4 shadow-[0_14px_38px_-34px_rgba(15,23,42,0.45),inset_0_1px_0_rgba(255,255,255,0.9)] transition-colors duration-200 hover:border-[var(--taxis-workspace-border-strong)]"
                  key={`${detail.id}-${passenger}`}
                >
                  <CompanyDashboardAvatar
                    className="h-12 w-12"
                    initials={passenger}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)]">
                      {copy.employeePrefix} {passenger}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6">
            <div className="ride-detail-info-card space-y-5 rounded-[22px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)]/88 p-5 shadow-[0_16px_42px_-36px_rgba(15,23,42,0.48),inset_0_1px_0_rgba(255,255,255,0.92)]">
              <div>
                <span className="mb-1 block font-semibold text-[9px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                  {copy.pickupLabel}
                </span>
                <p className="font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)] leading-tight">
                  {detail.from}
                </p>
              </div>
              <div className="h-[1px] w-full bg-[var(--taxis-workspace-divider)]" />
              <div>
                <span className="mb-1 block font-semibold text-[9px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                  {copy.destinationLabel}
                </span>
                <p className="font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)] leading-tight">
                  {detail.to}
                </p>
              </div>
              <div className="pt-2">
                <span className="mb-1 block font-semibold text-[9px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                  {copy.timeLabel}
                </span>
                <div className="flex items-center gap-2">
                  <Clock
                    className="text-[var(--taxis-workspace-accent-strong)]"
                    size={16}
                  />
                  <p className="font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)]">
                    {detail.dateLabel}, {detail.time}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
