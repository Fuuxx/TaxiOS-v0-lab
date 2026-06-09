import type React from "react";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Lock,
  MapPin,
  User,
  Users,
} from "lucide-react";

import type {
  RiderAction,
  RiderRideKind,
  RiderRideStatus,
  RiderTripSummary,
} from "../../../contracts/rider-app";
import { cn } from "../../../lib/utils";
import {
  type WorkspaceStatusTone,
  workspaceChipClassForTone,
} from "../workspace/workspace-status";

/* ---------------------------------------------------------------------
 * Status → tone mapping (single source for rider lifecycle colors)
 * ------------------------------------------------------------------- */

export const riderStatusToneByStatus: Record<RiderRideStatus, WorkspaceStatusTone> = {
  arrived: "attention",
  cancelled: "danger",
  completed: "success",
  confirmed: "info",
  driver_assigned: "info",
  enroute: "accent",
  in_progress: "accent",
  requested: "attention",
};

export function RiderStatusChip({
  label,
  status,
}: {
  label: string;
  status: RiderRideStatus;
}) {
  return (
    <span className={workspaceChipClassForTone(riderStatusToneByStatus[status])}>
      {label}
    </span>
  );
}

/** Lightweight company / personal ride badge. */
export function RiderKindChip({
  companyLabel,
  kind,
  personalLabel,
}: {
  companyLabel: string;
  kind: RiderRideKind;
  personalLabel: string;
}) {
  const isCompany = kind === "company";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold text-[11px] tracking-normal",
        isCompany
          ? "bg-[var(--taxis-workspace-accent-soft)] text-[var(--taxis-workspace-accent-strong)]"
          : "bg-[var(--taxis-workspace-surface-deep)] text-[var(--taxis-workspace-text-secondary)]",
      )}
    >
      {isCompany ? (
        <Building2 aria-hidden="true" size={12} strokeWidth={2} />
      ) : (
        <User aria-hidden="true" size={12} strokeWidth={2} />
      )}
      {isCompany ? companyLabel : personalLabel}
    </span>
  );
}

/* ---------------------------------------------------------------------
 * Action button — rendered strictly from backend allowedActions.
 * ------------------------------------------------------------------- */

export type RiderActionVariant = "primary" | "secondary" | "ghost";

export function RiderActionButton({
  action,
  onAction,
  variant = "secondary",
  fullWidth,
  icon,
  stacked,
}: {
  action: RiderAction;
  onAction?: (action: RiderAction) => void;
  variant?: RiderActionVariant;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  stacked?: boolean;
}) {
  const className = cn(
    variant === "primary" && "taxis-rider-btn-primary",
    variant === "secondary" && "taxis-rider-btn-secondary",
    variant === "ghost" && "taxis-rider-btn-ghost",
    stacked && "taxis-rider-btn-stacked",
    fullWidth && "w-full",
  );

  return (
    <button
      aria-disabled={action.disabled === true}
      className={className}
      data-disabled={action.disabled === true}
      disabled={action.disabled === true}
      onClick={() => {
        if (action.disabled !== true) {
          onAction?.(action);
        }
      }}
      title={action.reason}
      type="button"
    >
      {action.disabled ? (
        <Lock aria-hidden="true" size={15} strokeWidth={2} />
      ) : (
        icon ?? null
      )}
      <span className="truncate">{action.label}</span>
      {action.disabled && action.reason ? (
        <span className="sr-only">{action.reason}</span>
      ) : null}
    </button>
  );
}

/** Inline locked-reason hint shown under a disabled primary/secondary action. */
export function RiderActionReason({ reason }: { reason: string }) {
  return (
    <p className="mt-2 flex items-center justify-center gap-1.5 text-center font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
      <Lock aria-hidden="true" size={12} strokeWidth={2} />
      {reason}
    </p>
  );
}

/* ---------------------------------------------------------------------
 * Route visual — pickup → destination with optional via stop.
 * ------------------------------------------------------------------- */

export function RiderRoute({
  destinationAddress,
  pickupAddress,
  viaAddress,
}: {
  destinationAddress: string;
  pickupAddress: string;
  viaAddress?: string | null;
}) {
  return (
    <div className="taxis-rider-route">
      <div className="taxis-rider-route-rail" aria-hidden="true">
        <span className="taxis-rider-route-dot taxis-rider-route-dot-start" />
        <span className="taxis-rider-route-line" />
        {viaAddress ? (
          <>
            <span className="taxis-rider-route-dot taxis-rider-route-dot-via" />
            <span className="taxis-rider-route-line" />
          </>
        ) : null}
        <span className="taxis-rider-route-dot taxis-rider-route-dot-end" />
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <p className="truncate font-medium text-[14px] text-[var(--taxis-workspace-text-secondary)]">
          {pickupAddress}
        </p>
        {viaAddress ? (
          <p className="truncate font-medium text-[13px] text-[var(--taxis-workspace-text-muted)]">
            {viaAddress}
          </p>
        ) : null}
        <p className="truncate font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)]">
          {destinationAddress}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
 * Section + meta row helpers.
 * ------------------------------------------------------------------- */

export function RiderSection({
  action,
  children,
  title,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="taxis-rider-section">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-[12px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
          {title}
        </h2>
        {action ?? null}
      </div>
      {children}
    </section>
  );
}

export function RiderMetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="flex items-center gap-2 font-medium text-[13px] text-[var(--taxis-workspace-text-muted)]">
        <span className="text-[var(--taxis-workspace-text-subtle)]">{icon}</span>
        {label}
      </span>
      <span className="truncate text-right font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
        {value}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------------
 * Trip summary card — reused on Home and Trips.
 * ------------------------------------------------------------------- */

export function RiderTripCard({
  billedToPrefix,
  companyLabel,
  featured,
  onOpen,
  personalLabel,
  trip,
}: {
  billedToPrefix: string;
  companyLabel: string;
  featured?: boolean;
  onOpen?: (trip: RiderTripSummary) => void;
  personalLabel: string;
  trip: RiderTripSummary;
}) {
  const interactive = typeof onOpen === "function";

  return (
    <article
      className={cn(
        featured ? "taxis-rider-card-feature p-4" : "taxis-rider-card p-4",
        interactive && "taxis-rider-card-interactive cursor-pointer",
      )}
      onClick={interactive ? () => onOpen?.(trip) : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen?.(trip);
              }
            }
          : undefined
      }
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <RiderKindChip
            companyLabel={companyLabel}
            kind={trip.kind}
            personalLabel={personalLabel}
          />
          <RiderStatusChip label={trip.statusLabel} status={trip.status} />
        </div>
        {interactive ? (
          <ChevronRight
            aria-hidden="true"
            className="shrink-0 text-[var(--taxis-workspace-text-subtle)]"
            size={18}
          />
        ) : null}
      </div>

      <p className="mt-3 font-semibold text-[13px] text-[var(--taxis-workspace-text-secondary)] tabular-nums">
        {trip.pickupDateLabel} · {trip.pickupTimeLabel}
      </p>

      <div className="mt-3">
        <RiderRoute
          destinationAddress={trip.destinationAddress}
          pickupAddress={trip.pickupAddress}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-[var(--taxis-workspace-divider)] border-t pt-3 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
        <span className="flex items-center gap-1.5">
          <ArrowRight aria-hidden="true" size={13} strokeWidth={2} />
          {trip.vehicleClassLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <Users aria-hidden="true" size={13} strokeWidth={2} />
          {trip.passengerCountLabel}
        </span>
        {trip.kind === "company" && trip.workspaceLabel ? (
          <span className="flex items-center gap-1.5">
            <Building2 aria-hidden="true" size={13} strokeWidth={2} />
            {billedToPrefix} {trip.workspaceLabel}
          </span>
        ) : null}
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------------
 * Static map placeholder (UI-only, no map dependency).
 * ------------------------------------------------------------------- */

export function RiderMapPlaceholder({
  etaLabel,
  pickupAddress,
  destinationAddress,
}: {
  etaLabel: string;
  pickupAddress: string;
  destinationAddress: string;
}) {
  return (
    <div className="taxis-rider-map" role="img" aria-label={`Karte: Route von ${pickupAddress} nach ${destinationAddress}`}>
      <div className="taxis-rider-map-grid" aria-hidden="true" />
      <svg
        aria-hidden="true"
        className="taxis-rider-map-route"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 320 200"
      >
        <path
          d="M40 168 C 90 150, 96 96, 150 92 S 250 70, 286 36"
          stroke="var(--taxis-workspace-accent)"
          strokeDasharray="2 10"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </svg>
      <span className="taxis-rider-map-pin taxis-rider-map-pin-start" aria-hidden="true">
        <MapPin size={14} strokeWidth={2.4} />
      </span>
      <span className="taxis-rider-map-pin taxis-rider-map-pin-end" aria-hidden="true">
        <MapPin size={14} strokeWidth={2.4} />
      </span>
      <div className="taxis-rider-map-eta">
        <span className="font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
          {etaLabel}
        </span>
      </div>
    </div>
  );
}
