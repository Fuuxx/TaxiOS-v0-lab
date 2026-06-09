import {
  Building2,
  CalendarClock,
  CarFront,
  LifeBuoy,
  Receipt,
  UserCircle2,
  Users,
} from "lucide-react";

import type {
  RiderAction,
  RiderAppCopy,
  RiderTripDetail,
} from "../../../contracts/rider-app";
import {
  RiderActionButton,
  RiderActionReason,
  RiderKindChip,
  RiderMetaRow,
  RiderRoute,
  RiderSection,
  RiderStatusChip,
} from "./rider-primitives";

/* =====================================================================
 * Rider Trip Detail
 *
 * How to wire with tRPC (no implementation here):
 *   const { data } = api.rider.tripDetail.useQuery({ tripId });
 *   <RiderTripDetailScreen payload={data} copy={copy} onAction={...} />
 *
 * Passenger-level actions are rendered strictly from `payload.allowedActions`:
 *   - "remove_self_from_ride" → primary "Mich aus Fahrt entfernen"
 *   - "cancel_ride"           → secondary; if the backend marks it disabled
 *                               with a reason ("Nur der Besteller kann …"),
 *                               the button renders locked with that hint.
 * The UI never decides which actions exist or whether they are enabled.
 * ===================================================================== */

export type RiderTripDetailScreenProps = {
  payload: RiderTripDetail;
  copy: RiderAppCopy;
  onAction?: (action: RiderAction) => void;
};

export function RiderTripDetailScreen({
  copy,
  onAction,
  payload,
}: RiderTripDetailScreenProps) {
  const removeAction = payload.allowedActions.find(
    (action) => action.id === "remove_self_from_ride",
  );
  const cancelAction = payload.allowedActions.find(
    (action) => action.id === "cancel_ride",
  );
  const supportAction = payload.allowedActions.find(
    (action) => action.id === "contact_support",
  );

  return (
    <>
      <section>
        <div className="flex flex-wrap items-center gap-2">
          <RiderKindChip
            companyLabel={copy.companyRideLabel}
            kind={payload.kind}
            personalLabel={copy.personalRideLabel}
          />
          <RiderStatusChip label={payload.statusLabel} status={payload.status} />
        </div>
        <p className="mt-3 font-mono font-semibold text-[11px] text-[var(--taxis-workspace-text-subtle)] tracking-[0.12em]">
          {payload.publicId}
        </p>
        <p className="mt-1 font-semibold text-[15px] text-[var(--taxis-workspace-text-secondary)] tabular-nums">
          {payload.pickupDateLabel} · {payload.pickupTimeLabel}
        </p>
      </section>

      <div className="taxis-rider-card p-4">
        <RiderRoute
          destinationAddress={payload.destinationAddress}
          pickupAddress={payload.pickupAddress}
          viaAddress={payload.viaAddress}
        />
      </div>

      <RiderSection title="Fahrgäste">
        <div className="taxis-rider-card divide-y divide-[var(--taxis-workspace-divider)] px-4">
          {payload.isShared ? (
            <div className="flex items-center gap-2 py-3 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
              <Users aria-hidden="true" size={14} strokeWidth={2} />
              Geteilte Fahrt
            </div>
          ) : null}
          {payload.passengers.map((passenger) => (
            <div className="flex items-center gap-3 py-3" key={passenger.id}>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--taxis-workspace-surface-deep)] font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)]">
                {passenger.initials}
              </span>
              <span className="flex-1 truncate font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
                {passenger.name}
              </span>
              {passenger.isCurrentRider ? (
                <span className="rounded-full bg-[var(--taxis-workspace-accent-soft)] px-2.5 py-1 font-semibold text-[11px] text-[var(--taxis-workspace-accent-strong)]">
                  Du
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </RiderSection>

      <RiderSection title="Details">
        <div className="taxis-rider-card divide-y divide-[var(--taxis-workspace-divider)] px-4">
          <RiderMetaRow
            icon={<CarFront aria-hidden="true" size={15} strokeWidth={2} />}
            label="Fahrzeug"
            value={payload.vehicleClassLabel}
          />
          {payload.workspace ? (
            <>
              <RiderMetaRow
                icon={<Building2 aria-hidden="true" size={15} strokeWidth={2} />}
                label="Workspace"
                value={payload.workspace.workspaceLabel}
              />
              <RiderMetaRow
                icon={<Receipt aria-hidden="true" size={15} strokeWidth={2} />}
                label="Abrechnung"
                value={payload.workspace.billedToLabel}
              />
            </>
          ) : null}
          <RiderMetaRow
            icon={<UserCircle2 aria-hidden="true" size={15} strokeWidth={2} />}
            label="Gebucht von"
            value={payload.bookedByLabel}
          />
          {payload.noteLabel ? (
            <RiderMetaRow
              icon={<CalendarClock aria-hidden="true" size={15} strokeWidth={2} />}
              label="Notiz"
              value={payload.noteLabel}
            />
          ) : null}
        </div>
      </RiderSection>

      {payload.history.length > 0 ? (
        <RiderSection title="Verlauf">
          <ol className="taxis-rider-card flex flex-col gap-3 p-4">
            {payload.history.map((entry) => (
              <li className="flex items-start gap-3" key={entry.id}>
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--taxis-workspace-text-subtle)]" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                    {entry.label}
                  </p>
                  <p className="font-medium text-[12px] text-[var(--taxis-workspace-text-muted)] tabular-nums">
                    {entry.timestampLabel}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </RiderSection>
      ) : null}

      {supportAction ? (
        <RiderActionButton
          action={supportAction}
          fullWidth
          icon={<LifeBuoy aria-hidden="true" size={16} strokeWidth={2} />}
          onAction={onAction}
          variant="ghost"
        />
      ) : null}

      {/* Bottom action bar candidates — passed to the shell by the host. */}
      <div className="flex flex-col gap-3">
        {removeAction ? (
          <RiderActionButton
            action={removeAction}
            fullWidth
            onAction={onAction}
            variant="primary"
          />
        ) : null}
        {cancelAction ? (
          <div>
            <RiderActionButton
              action={cancelAction}
              fullWidth
              onAction={onAction}
              variant="secondary"
            />
            {cancelAction.disabled && cancelAction.reason ? (
              <RiderActionReason reason={cancelAction.reason} />
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
