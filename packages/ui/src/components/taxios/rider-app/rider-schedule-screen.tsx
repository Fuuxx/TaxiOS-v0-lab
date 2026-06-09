import type React from "react";

import type {
  RiderAction,
  RiderAppCopy,
  RiderBookingPayload,
} from "../../../contracts/rider-app";
import { RiderActionButton, RiderActionReason, RiderSection } from "./rider-primitives";

/* =====================================================================
 * Rider — Fahrt planen (Später)
 *
 * Visual preview only. No form state, no validation, no form library.
 * Exposes integration seams for the real TaxiOS app to wire its own
 * form system later:
 *
 *   - formSlot          : wraps the whole form body
 *   - scheduleSlot      : date / time fields
 *   - routeSlot         : pickup / destination fields
 *   - vehicleSlot       : vehicle-class selection
 *   - submitSlot        : overrides the rendered primary submit control
 *   - renderFormControls: full override of the field area, receives payload
 *   - onAction          : fires backend-provided allowedActions
 *
 * How to wire with tRPC (in the real app, not here):
 *   const { data } = trpc.rider.booking.schedule.useQuery()
 *   <RiderScheduleScreen payload={data} copy={copy}
 *     scheduleSlot={<MyDateTimeFields />} onAction={(action) => ...} />
 * ===================================================================== */

export type RiderScheduleScreenProps = {
  copy: RiderAppCopy;
  payload: RiderBookingPayload;
  onAction?: (action: RiderAction) => void;
  /** Wraps the entire form body. Defaults to a plain container. */
  formSlot?: (body: React.ReactNode) => React.ReactNode;
  /** Date / time fields. */
  scheduleSlot?: React.ReactNode;
  /** Route fields (pickup / destination). */
  routeSlot?: React.ReactNode;
  /** Vehicle-class selection. */
  vehicleSlot?: React.ReactNode;
  /** Overrides the rendered primary submit control. */
  submitSlot?: React.ReactNode;
  /** Full override of the field area; receives the payload. */
  renderFormControls?: (payload: RiderBookingPayload) => React.ReactNode;
};

export function RiderScheduleScreen({
  copy,
  onAction,
  payload,
  formSlot,
  scheduleSlot,
  routeSlot,
  vehicleSlot,
  submitSlot,
  renderFormControls,
}: RiderScheduleScreenProps) {
  const primaryAction = payload.allowedActions.find(
    (action) => action.id === "continue_to_riders" || action.id === "schedule_ride",
  );

  const modeToggle = (
    <div className="taxis-rider-card p-2">
      {/* biome-ignore lint/a11y/useSemanticElements: segmented toggle, not a form fieldset */}
      <div className="taxis-rider-segmented" role="group" aria-label="Buchungsart">
        <button
          className="taxis-rider-segmented-item"
          data-active={payload.mode === "now"}
          onClick={() => {
            const nowAction = payload.allowedActions.find(
              (action) => action.id === "book_ride",
            );
            if (nowAction) onAction?.(nowAction);
          }}
          type="button"
        >
          Jetzt
        </button>
        <span className="taxis-rider-segmented-item" data-active={payload.mode === "schedule"}>
          Später
        </span>
      </div>
    </div>
  );

  const fields = renderFormControls ? (
    renderFormControls(payload)
  ) : (
    <>
      {scheduleSlot ? <RiderSection title="Zeitpunkt">{scheduleSlot}</RiderSection> : null}
      {routeSlot ? <RiderSection title="Route">{routeSlot}</RiderSection> : null}
      {vehicleSlot ? (
        <RiderSection title="Fahrzeugklasse">{vehicleSlot}</RiderSection>
      ) : null}
    </>
  );

  const body = (
    <div className="space-y-6">
      {modeToggle}
      {fields}
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
      </div>
    </div>
  );
}
