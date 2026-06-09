import { CheckCircle2 } from "lucide-react";

import type {
  RiderAction,
  RiderAppCopy,
  RiderConfirmationPayload,
} from "../../../contracts/rider-app";
import {
  RiderActionButton,
  RiderRoute,
  RiderSection,
} from "./rider-primitives";

/* =====================================================================
 * Rider — Fahrt angefragt (Bestätigung)
 *
 * Confirmation screen after a ride request was submitted. Purely a
 * read-out of the created booking; all follow-up actions (tracking,
 * another ride, support) come from `payload.allowedActions`.
 *
 * How to wire with tRPC:
 *   const { data, isLoading, error } = trpc.rider.booking.confirmation.useQuery({ publicId })
 *   <RiderRequestedScreen payload={data} copy={copy} onAction={...} />
 * ===================================================================== */

export function RiderRequestedScreen({
  onAction,
  payload,
}: {
  copy?: RiderAppCopy;
  onAction?: (action: RiderAction) => void;
  payload: RiderConfirmationPayload;
}) {
  const trackAction = payload.allowedActions.find((action) => action.id === "track_ride");
  const secondaryActions = payload.allowedActions.filter(
    (action) => action.id !== "track_ride",
  );

  return (
    <div className="space-y-6 pb-4">
      <div className="flex flex-col items-center gap-3 pt-4 text-center">
        <span className="taxis-rider-success-badge" aria-hidden="true">
          <CheckCircle2 size={30} strokeWidth={2} />
        </span>
        <div>
          <h1 className="font-semibold text-[20px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
            Fahrt angefragt
          </h1>
          <p className="mt-1 text-[13px] text-[var(--taxis-workspace-text-muted)]">
            Wir suchen eine Fahrerin oder einen Fahrer für dich.
          </p>
          <p className="mt-2 font-semibold text-[12px] text-[var(--taxis-workspace-text-subtle)] tabular-nums">
            {payload.publicId}
          </p>
        </div>
      </div>

      <RiderSection title="Route">
        <div className="taxis-rider-card p-4">
          <RiderRoute
            destinationAddress={payload.destinationAddress}
            pickupAddress={payload.pickupAddress}
          />
        </div>
      </RiderSection>

      <RiderSection title="Details">
        <dl className="taxis-rider-card divide-y divide-[var(--taxis-workspace-divider)] px-4">
          {payload.detailRows.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-4 py-3">
              <dt className="font-medium text-[13px] text-[var(--taxis-workspace-text-muted)]">
                {row.label}
              </dt>
              <dd className="truncate text-right font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </RiderSection>

      <div className="taxis-rider-bottom-bar space-y-2">
        {trackAction ? (
          <RiderActionButton
            action={trackAction}
            fullWidth
            onAction={onAction}
            variant="primary"
          />
        ) : null}
        {secondaryActions.map((action) => (
          <RiderActionButton
            key={action.id}
            action={action}
            fullWidth
            onAction={onAction}
            variant={action.id === "book_another_ride" ? "secondary" : "ghost"}
          />
        ))}
      </div>
    </div>
  );
}
