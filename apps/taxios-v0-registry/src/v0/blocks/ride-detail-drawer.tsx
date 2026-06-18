"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, X } from "lucide-react";
import { Button } from "@taxios-v2/ui/components/ui/button";
import {
  WorkspaceInnerCard,
  WorkspaceSectionHeader,
  WorkspaceSurface
} from "@taxios-v2/ui/components/taxios/workspace/workspace-primitives";

// ─── Local types (self-contained for v0) ───

type RideDetailCopy = {
  dateLabel: string;
  destinationLabel: string;
  detailBackdropLabel: string;
  detailCloseButtonLabel: string;
  employeePrefix: string;
  passengersLabel: string;
  pickupLabel: string;
  timeLabel: string;
};

type DashboardTripStatusColor = "green" | "neutral";

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

// ─── Local mock data ───

const copy: RideDetailCopy = {
  dateLabel: "Today",
  destinationLabel: "Destination",
  detailBackdropLabel: "Close ride detail drawer",
  detailCloseButtonLabel: "Close details",
  employeePrefix: "Passenger",
  passengersLabel: "passengers",
  pickupLabel: "Pickup",
  timeLabel: "Time"
};

const ride: RideDetailViewModel = {
  dateLabel: "Today",
  from: "TaxiOS HQ",
  id: "TX-2408",
  passengers: ["MW", "AK", "LC"],
  status: "Assigned",
  statusColor: "green",
  time: "14:30",
  to: "Airport BER"
};

// ─── Inline avatar (no external dashboard-avatar dependency) ───

function InlineAvatar({ className, initials }: { className?: string; initials: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-[var(--taxis-workspace-surface-soft)] font-semibold text-[var(--taxis-workspace-text-strong)] ring-1 ring-[var(--taxis-workspace-border)] ${className ?? ""}`}
    >
      <span className="text-[11px] uppercase tracking-wider">{initials.slice(0, 2)}</span>
    </div>
  );
}

// ─── Inline close button (no external workspace-controls dependency) ───

function InlineCloseButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--taxis-workspace-text-muted)] transition hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-strong)]"
      onClick={onClick}
      type="button"
    >
      <X size={16} />
    </button>
  );
}

// ─── Inline status chip styling ───

function statusChipClasses(color: DashboardTripStatusColor) {
  if (color === "green") {
    return "bg-[var(--taxis-status-success-bg)] text-[var(--taxis-status-success-text)] ring-1 ring-[var(--taxis-status-success-ring)]";
  }
  return "bg-[var(--taxis-status-neutral-bg)] text-[var(--taxis-status-neutral-text)] ring-1 ring-[var(--taxis-status-neutral-ring)]";
}

// ─── Self-contained Ride Detail Drawer ───

const PANEL_FOCUSABLE_SELECTOR = [
  "a[href]",
  'button:not([disabled])',
  "textarea:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function tabOrderInsidePanel(panel: HTMLElement): HTMLElement[] {
  return Array.from(
    panel.querySelectorAll<HTMLElement>(PANEL_FOCUSABLE_SELECTOR),
  ).filter((el) => {
    const style = window.getComputedStyle(el);
    return style.visibility !== "hidden" && style.display !== "none";
  });
}

function RideDetailDrawer({
  detail,
  isOpen,
  onClose
}: {
  detail: RideDetailViewModel;
  isOpen: boolean;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = `ride-detail-title-${detail.id}`;

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
      const focusables = tabOrderInsidePanel(panel);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const currentIndex = active instanceof HTMLElement ? focusables.indexOf(active) : -1;
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
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

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
        className={`relative flex h-[calc(100dvh-48px)] max-h-[calc(100dvh-48px)] w-[min(440px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[26px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] shadow-[0_24px_44px_-22px_rgba(15,23,42,0.20),0_10px_22px_-14px_rgba(15,23,42,0.14)] transition-all duration-200 ${
          isOpen ? "translate-x-0 scale-100 opacity-100" : "translate-x-[110%] scale-[0.985] opacity-0"
        }`}
        role="dialog"
      >
        <div className="pointer-events-none absolute inset-0 rounded-[26px] shadow-[inset_1px_0_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(15,23,42,0.04)]" />

        <div className="relative z-10 flex items-start justify-between gap-4 border-b border-[var(--taxis-workspace-divider)] px-6 pt-6 pb-5">
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
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 font-semibold text-[9px] uppercase tracking-[0.12em] ${statusChipClasses(detail.statusColor)}`}
              >
                {detail.statusColor === "green" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--taxis-status-success)]" />
                ) : null}
                {detail.status}
              </span>
            </div>
          </div>
          <InlineCloseButton label={copy.detailCloseButtonLabel} onClick={onClose} />
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 pt-6 pb-7">
          <section>
            <h4 className="mb-5 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.16em]">
              {detail.passengers.length} {copy.passengersLabel}
            </h4>
            <div className="space-y-2">
              {detail.passengers.map((passenger) => (
                <div
                  className="flex items-center gap-4 rounded-[20px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)]/88 p-4 shadow-[0_14px_38px_-34px_rgba(15,23,42,0.45),inset_0_1px_0_rgba(255,255,255,0.9)] transition-colors duration-200 hover:border-[var(--taxis-workspace-border-strong)]"
                  key={`${detail.id}-${passenger}`}
                >
                  <InlineAvatar className="h-12 w-12" initials={passenger} />
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
            <div className="space-y-5 rounded-[22px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)]/88 p-5 shadow-[0_16px_42px_-36px_rgba(15,23,42,0.48),inset_0_1px_0_rgba(255,255,255,0.92)]">
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
                  <Clock className="text-[var(--taxis-workspace-accent-strong)]" size={16} />
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

// ─── Block export for registry preview ───

export function RideDetailDrawerBlock() {
  const [isOpen, setIsOpen] = useState(true);
  const detail = useMemo(() => ride, []);

  return (
    <WorkspaceSurface className="relative min-h-[520px] overflow-hidden p-6">
      <WorkspaceSectionHeader
        action={<Button onClick={() => setIsOpen(true)}>Open drawer</Button>}
        subtitle="Demo-only shell for v0 context. Self-contained drawer with mocked ride payload data."
        title="Ride detail drawer"
      />
      <WorkspaceInnerCard className="mt-5 p-5">
        <p className="text-sm font-semibold text-[var(--taxis-workspace-text-strong)]">
          {ride.id} - {ride.from} to {ride.to}
        </p>
        <p className="mt-1 text-sm text-[var(--taxis-workspace-text-muted)]">
          Drawer opens over this demo surface with mocked ride payload data.
        </p>
      </WorkspaceInnerCard>
      <RideDetailDrawer
        detail={detail}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </WorkspaceSurface>
  );
}

export default function Component() {
  return <RideDetailDrawerBlock />;
}
