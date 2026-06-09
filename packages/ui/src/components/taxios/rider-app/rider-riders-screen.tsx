import { useMemo } from "react";
import { Phone, Plus, UserRound } from "lucide-react";

import type {
  RiderAction,
  RiderAppCopy,
  RiderRidersPayload,
} from "../../../contracts/rider-app";
import {
  RiderActionButton,
  RiderActionReason,
  RiderSection,
} from "./rider-primitives";

/* =====================================================================
 * Rider — Fahrgäste
 *
 * Shows who travels on the booking: the current rider plus optional
 * guests. Whether company billing is permitted is decided by the
 * backend (`companyBookingAllowed` + the locked action's reason) — the
 * UI never infers it from role or status.
 *
 * How to wire with tRPC:
 *   const { data, isLoading, error } = trpc.rider.booking.riders.useQuery()
 *   const addGuest = trpc.rider.booking.addGuest.useMutation()
 *   <RiderRidersScreen payload={data} copy={copy} onAction={...} />
 * ===================================================================== */

export function RiderRidersScreen({
  onAction,
  payload,
}: {
  copy?: RiderAppCopy;
  onAction?: (action: RiderAction) => void;
  payload: RiderRidersPayload;
}) {
  const primaryAction = useMemo(
    () =>
      payload.allowedActions.find(
        (action) => action.id === "request_ride" || action.id === "continue_to_riders",
      ),
    [payload.allowedActions],
  );

  const addGuestAction = payload.allowedActions.find(
    (action) => action.id === "continue_to_riders" && action !== primaryAction,
  );

  return (
    <div className="space-y-6 pb-4">
      <RiderSection title="Hauptfahrgast">
        <div className="taxis-rider-card flex items-center gap-3 p-4">
          <span className="taxis-rider-avatar" aria-hidden="true">
            {payload.currentRider.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)]">
              {payload.currentRider.name}
            </p>
            <p className="text-[12px] text-[var(--taxis-workspace-text-muted)]">Das bin ich</p>
          </div>
        </div>
      </RiderSection>

      <RiderSection
        title="Weitere Gäste"
        action={
          addGuestAction ? (
            <RiderActionButton
              action={addGuestAction}
              icon={<Plus size={15} strokeWidth={2.2} />}
              onAction={onAction}
              variant="ghost"
            />
          ) : null
        }
      >
        {payload.guests.length === 0 ? (
          <div className="taxis-rider-card flex flex-col items-center gap-2 p-6 text-center">
            <UserRound
              aria-hidden="true"
              className="text-[var(--taxis-workspace-text-subtle)]"
              size={24}
            />
            <p className="text-[13px] text-[var(--taxis-workspace-text-muted)]">
              Noch keine weiteren Gäste hinzugefügt.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {payload.guests.map((guest) => (
              <li
                key={guest.id}
                className="taxis-rider-card flex items-center gap-3 p-3.5"
              >
                <span
                  className="taxis-rider-avatar taxis-rider-avatar-muted"
                  aria-hidden="true"
                >
                  {guest.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
                    {guest.name}
                  </p>
                  {guest.phoneLabel ? (
                    <p className="flex items-center gap-1.5 text-[12px] text-[var(--taxis-workspace-text-muted)]">
                      <Phone aria-hidden="true" size={12} strokeWidth={2} />
                      {guest.phoneLabel}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </RiderSection>

      <div
        className="taxis-rider-callout"
        data-tone={payload.companyBookingAllowed ? "info" : "muted"}
      >
        {payload.companyBookingHint}
      </div>

      <div className="taxis-rider-bottom-bar">
        {primaryAction ? (
          <>
            <RiderActionButton
              action={primaryAction}
              fullWidth
              onAction={onAction}
              variant="primary"
            />
            {primaryAction.disabled && primaryAction.reason ? (
              <RiderActionReason reason={primaryAction.reason} />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
