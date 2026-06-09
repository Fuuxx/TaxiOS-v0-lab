import type {
  RiderAppCopy,
  RiderTripSummary,
  RiderTripsPayload,
  RiderTripsTab,
} from "../../../contracts/rider-app";
import { cn } from "../../../lib/utils";
import { RiderEmptyState } from "./rider-app-shell";
import {
  RiderSection,
  RiderTripCard,
} from "./rider-primitives";

/* =====================================================================
 * Rider Trips
 *
 * How to wire with tRPC (no implementation here):
 *   const { data, isLoading, error, refetch } = api.rider.trips.useQuery();
 *   const [tab, setTab] = useState<RiderTripsTab>("upcoming");
 *   <RiderTripsScreen activeTab={tab} onTabChange={setTab} payload={data} ... />
 *
 * The list is rendered from `payload`. The active tab is a presentation
 * concern owned by the screen host (or router query param).
 * ===================================================================== */

const tabs: Array<{ id: RiderTripsTab; label: string }> = [
  { id: "upcoming", label: "Anstehend" },
  { id: "past", label: "Vergangen" },
  { id: "cancelled", label: "Storniert" },
];

const emptyCopy: Record<RiderTripsTab, { title: string; description: string }> = {
  cancelled: {
    description: "Stornierte Fahrten der letzten 90 Tage erscheinen hier.",
    title: "Keine stornierten Fahrten",
  },
  past: {
    description: "Abgeschlossene Fahrten werden hier archiviert.",
    title: "Noch keine Fahrten",
  },
  upcoming: {
    description: "Buche eine Fahrt, um deine nächste Tour hier zu sehen.",
    title: "Nichts geplant",
  },
};

export type RiderTripsScreenProps = {
  activeTab: RiderTripsTab;
  payload: RiderTripsPayload;
  copy: RiderAppCopy;
  onTabChange?: (tab: RiderTripsTab) => void;
  onOpenTrip?: (trip: RiderTripSummary) => void;
};

export function RiderTripsScreen({
  activeTab,
  copy,
  onOpenTrip,
  onTabChange,
  payload,
}: RiderTripsScreenProps) {
  const rows: Record<RiderTripsTab, RiderTripSummary[]> = {
    cancelled: payload.cancelledTrips,
    past: payload.pastTrips,
    upcoming: payload.upcomingTrips,
  };
  const activeRows = rows[activeTab];

  return (
    <>
      <section>
        <h1 className="font-semibold text-[24px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
          Meine Fahrten
        </h1>
        <div className="taxis-rider-segment mt-4">
          {tabs.map((tab) => (
            <button
              aria-pressed={tab.id === activeTab}
              className={cn(
                "taxis-rider-segment-item",
                tab.id === activeTab && "taxis-rider-segment-item-active",
              )}
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "upcoming" && payload.nextTrip ? (
        <RiderSection title="Nächste Fahrt">
          <RiderTripCard
            billedToPrefix={copy.billedToPrefix}
            companyLabel={copy.companyRideLabel}
            featured
            onOpen={onOpenTrip}
            personalLabel={copy.personalRideLabel}
            trip={payload.nextTrip}
          />
        </RiderSection>
      ) : null}

      <RiderSection title={tabs.find((tab) => tab.id === activeTab)?.label ?? ""}>
        {activeRows.length === 0 ? (
          <RiderEmptyState
            description={emptyCopy[activeTab].description}
            title={emptyCopy[activeTab].title}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {activeRows.map((trip) => (
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
