import type React from "react";
import { Clock } from "lucide-react";

import type {
  RiderAction,
  RiderAppCopy,
  RiderBookingPayload,
} from "../../../contracts/rider-app";
import { RiderActionButton, RiderActionReason, RiderSection } from "./rider-primitives";

/* =====================================================================
 * Rider — Fahrt buchen (Jetzt)
 *
 * Visual preview only. This screen owns NO form state, runs NO validation,
 * and imports NO form library. It exposes integration seams so the real
 * TaxiOS app can wire its own form system later:
 *
 *   - formSlot          : wraps the whole form body (e.g. <form> + provider)
 *   - routeSlot         : route fields (pickup / destination)
 *   - vehicleSlot       : vehicle-class selection
 *   - detailsSlot       : passenger count + note fields
 *   - submitSlot        : overrides the rendered primary submit control
 *   - renderFormControls: full override of the field area, receives payload
 *   - onAction          : fires backend-provided allowedActions
 *
 * The lab block passes static demo nodes into these slots. The primary
 * submit control still comes from `payload.allowedActions`.
 *
 * How to wire with tRPC (in the real app, not here):
 *   const { data } = trpc.rider.booking.now.useQuery()
 *   <RiderBookScreen payload={data} copy={copy}
 *     formSlot={(body) => <MyForm>{body}</MyForm>}
 *     routeSlot={<MyRouteFields />}
 *     onAction={(action) => ...} />
 * ===================================================================== */

export type RiderBookScreenProps = {
  copy: RiderAppCopy;
  payload: RiderBookingPayload;
  onAction?: (action: RiderAction) => void;
  /** Wraps the entire form body. Defaults to a plain container. */
  formSlot?: (body: React.ReactNode) => React.ReactNode;
  /** Route fields (pickup / destination). */
  routeSlot?: React.ReactNode;
  /** Vehicle-class selection. */
  vehicleSlot?: React.ReactNode;
  /** Passenger count + note fields. */
  detailsSlot?: React.ReactNode;
  /** Overrides the rendered primary submit control. */
  submitSlot?: React.ReactNode;
  /** Full override of the field area; receives the payload. */
  renderFormControls?: (payload: RiderBookingPayload) => React.ReactNode;
};

export function RiderBookScreen({
  copy,
  onAction,
  payload,
  formSlot,
  routeSlot,
  vehicleSlot,
  detailsSlot,
  submitSlot,
  renderFormControls,
}: RiderBookScreenProps) {
  const primaryAction = payload.allowedActions.find(
    (action) => action.id === "continue_to_riders" || action.id === "book_ride",
  );

  const modeToggle = (
    <div className="taxis-rider-card p-2">
      {/* biome-ignore lint/a11y/useSemanticElements: segmented toggle, not a form fieldset */}
      <div className="taxis-rider-segmented" role="group" aria-label="Buchungsart">
        <span className="taxis-rider-segmented-item" data-active={payload.mode === "now"}>
          Jetzt
        </span>
        <button
          className="taxis-rider-segmented-item"
          data-active={payload.mode === "schedule"}
          onClick={() => {
            const scheduleAction = payload.allowedActions.find(
              (action) => action.id === "schedule_ride",
            );
            if (scheduleAction) onAction?.(scheduleAction);
          }}
          type="button"
        >
          Später
        </button>
      </div>
    </div>
  );

  const fields = renderFormControls ? (
    renderFormControls(payload)
  ) : (
    <>
      {routeSlot ? <RiderSection title="Route">{routeSlot}</RiderSection> : null}
      {vehicleSlot ? (
        <RiderSection title="Fahrzeugklasse">{vehicleSlot}</RiderSection>
      ) : null}
      {detailsSlot ? <RiderSection title="Details">{detailsSlot}</RiderSection> : null}
    </>
  );

  const body = (
    <div className="space-y-6">
      {modeToggle}
      {fields}
      <div className="taxis-rider-card flex items-center gap-2 p-3 text-[12px] text-[var(--taxis-workspace-text-muted)]">
        <Clock aria-hidden="true" size={14} strokeWidth={2} />
        {payload.riderSummaryLabel}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {formSlot ? formSlot(body) : body}

      <div className="taxis-rider-bottom-bar">
        {submitSlot ??
          (primaryAction ? (
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
          ) : null)}
        <p className="mt-2 text-center text-[12px] text-[var(--taxis-workspace-text-muted)]">
          {copy.billedToPrefix} {payload.workspace.billedToLabel}
        </p>
        {payload.allowedActions
          .filter((action) => action.id === "contact_support")
          .map((action) => (
            <div key={action.id} className="mt-2">
              <RiderActionButton
                action={action}
                fullWidth
                onAction={onAction}
                variant="ghost"
              />
            </div>
          ))}
      </div>
    </div>
  );
}
