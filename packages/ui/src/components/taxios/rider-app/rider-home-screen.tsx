import type React from "react";
import { LifeBuoy, MapPin, Plus, Route } from "lucide-react";

import type {
  RiderAction,
  RiderAppCopy,
  RiderHomePayload,
  RiderQuickAction,
  RiderTripSummary,
} from "../../../contracts/rider-app";
import {
  RiderActionButton,
  RiderEmptyState,
  RiderSection,
  RiderTripCard,
} from "./rider-primitives";

/* =====================================================================
 * Rider Home
 *
 * How to wire with tRPC (no implementation here):
 *   const { data, isLoading, error, refetch } = api.rider.home.useQuery();
 *   if (isLoading) return <RiderLoadingState />; (rendered by the shell host)
 *   if (error)     return <RiderErrorState onRetry={refetch} />;
 *   <RiderHomeScreen payload={data} copy={copy} ... />
 *
 * Actions come from `payload.allowedActions` only. The primary "Fahrt buchen"
 * button is rendered when the backend returns a `book_ride` action; never
 * inferred from state in the UI.
 * ===================================================================== */

const quickActionIcon: Record<RiderQuickAction["id"], React.ReactNode> = {
  track_ride: <MapPin aria-hidden="true" size={18} strokeWidth={2} />,
  trips: <Route aria-hidden="true" size={18} strokeWidth={2} />,
  support: <LifeBuoy aria-hidden="true" size={18} strokeWidth={2} />,
};

export type RiderHomeScreenProps = {
  payload: RiderHomePayload;
  copy: RiderAppCopy;
  onAction?: (action: RiderAction) => void;
  onOpenTrip?: (trip: RiderTripSummary) => void;
  onQuickAction?: (action: RiderQuickAction) => void;
};

export function RiderHomeScreen({
  copy,
  onAction,
  onOpenTrip,
  onQuickAction,
  payload,
}: RiderHomeScreenProps) {
  const bookAction = payload.allowedActions.find(
    (action) => action.id === "book_ride",
  );

  return (
    <>
      <section>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--taxis-workspace-accent-soft)] px-3 py-1.5 font-semibold text-[12px] text-[var(--taxis-workspace-accent-strong)]">
            {payload.workspace.workspaceLabel}
          </span>
        </div>
        <h1 className="mt-4 text-balance font-semibold text-[26px] text-[var(--taxis-workspace-text-strong)] leading-tight tracking-tight">
          {payload.greetingLabel}
        </h1>
      </section>

      <RiderSection title="Nächste Fahrt">
        {payload.nextTrip ? (
          <RiderTripCard
            billedToPrefix={copy.billedToPrefix}
            companyLabel={copy.companyRideLabel}
            featured
            onOpen={onOpenTrip}
            personalLabel={copy.personalRideLabel}
            trip={payload.nextTrip}
          />
        ) : (
          <RiderEmptyState
            description="Sobald du eine Fahrt buchst, erscheint sie hier mit Live-Status."
            title="Keine anstehende Fahrt"
          />
        )}

        {bookAction ? (
          <RiderActionButton
            action={bookAction}
            fullWidth
            icon={<Plus aria-hidden="true" size={18} strokeWidth={2.2} />}
            onAction={onAction}
            variant="primary"
          />
        ) : null}
      </RiderSection>

      <RiderSection title="Schnellzugriff">
        <div className="grid grid-cols-3 gap-3">
          {payload.quickActions.map((action) => (
            <button
              className="taxis-rider-card flex flex-col items-start gap-3 p-4 text-left"
              key={action.id}
              onClick={() => onQuickAction?.(action)}
              type="button"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--taxis-workspace-surface-deep)] text-[var(--taxis-workspace-text-secondary)]">
                {quickActionIcon[action.id]}
              </span>
              <span className="font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)] leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </RiderSection>

      <RiderSection title="Anstehende Fahrten">
        {payload.upcomingTrips.length === 0 ? (
          <RiderEmptyState
            description="Geplante Fahrten der nächsten Tage werden hier gesammelt."
            title="Nichts geplant"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {payload.upcomingTrips.map((trip) => (
              <RiderTripCard
                billedToPrefix={copy.billedToPrefix}
                companyLabel={copy.companyRideLabel}
                key={trip.tripId}
                onOpen={onOpenTrip}
                personalLabel={copy.personalRideLabel}
                trip={trip}
              />
            ))}
          </div>
        )}
      </RiderSection>
    </>
  );
}
