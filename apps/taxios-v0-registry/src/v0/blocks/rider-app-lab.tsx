"use client";

import { useState } from "react";

import { RiderAccountScreen } from "@taxios-v2/ui/components/taxios/rider-app/rider-account-screen";
import {
  RiderAppShell,
  RiderErrorState,
  RiderLoadingState,
} from "@taxios-v2/ui/components/taxios/rider-app/rider-app-shell";
import type { RiderTabId } from "@taxios-v2/ui/components/taxios/rider-app/rider-app-shell";
import { RiderBookScreen } from "@taxios-v2/ui/components/taxios/rider-app/rider-book-screen";
import { RiderHomeScreen } from "@taxios-v2/ui/components/taxios/rider-app/rider-home-screen";
import { RiderInboxScreen } from "@taxios-v2/ui/components/taxios/rider-app/rider-inbox-screen";
import { RiderRequestedScreen } from "@taxios-v2/ui/components/taxios/rider-app/rider-requested-screen";
import { RiderRidersScreen } from "@taxios-v2/ui/components/taxios/rider-app/rider-riders-screen";
import { RiderScheduleScreen } from "@taxios-v2/ui/components/taxios/rider-app/rider-schedule-screen";
import { RiderTrackingScreen } from "@taxios-v2/ui/components/taxios/rider-app/rider-tracking-screen";
import { RiderTripDetailScreen } from "@taxios-v2/ui/components/taxios/rider-app/rider-trip-detail-screen";
import { RiderTripsScreen } from "@taxios-v2/ui/components/taxios/rider-app/rider-trips-screen";
import { ThemeToggle } from "@taxios-v2/ui/components/taxios/theme/theme-toggle";
import type {
  RiderAccountTab,
  RiderTripsTab,
} from "@taxios-v2/ui/contracts/rider-app";
import {
  riderAccountPayload,
  riderAppCopy,
  riderBookingNowPayload,
  riderBookingSchedulePayload,
  riderConfirmationPayload,
  riderHomeEmptyPayload,
  riderHomePayload,
  riderInboxEmptyPayload,
  riderInboxPayload,
  riderRidersEmptyPayload,
  riderRidersPayload,
  riderTrackingPayload,
  riderTripDetailPayload,
  riderTripsEmptyPayload,
  riderTripsPayload,
} from "@taxios-v2/ui/storybook/fixtures/rider-app.fixtures";

/* =====================================================================
 * Rider App — v0 Lab block
 *
 * Interactive preview of all 10 passenger screens plus their key states
 * (loading / empty / error), each rendered inside the shared phone-frame
 * shell. Mock data comes from rider-app.fixtures (German). This is a
 * preview harness only — no business logic, no data fetching.
 * ===================================================================== */

type LabScreen =
  | "home"
  | "home-empty"
  | "trips"
  | "trips-empty"
  | "trip-detail"
  | "tracking"
  | "book"
  | "schedule"
  | "riders"
  | "riders-no-company"
  | "requested"
  | "inbox"
  | "inbox-empty"
  | "account"
  | "loading"
  | "error";

const screens: Array<{ id: LabScreen; label: string }> = [
  { id: "home", label: "Start" },
  { id: "home-empty", label: "Start (leer)" },
  { id: "trips", label: "Fahrten" },
  { id: "trips-empty", label: "Fahrten (leer)" },
  { id: "trip-detail", label: "Fahrtdetails" },
  { id: "tracking", label: "Live-Tracking" },
  { id: "book", label: "Fahrt buchen" },
  { id: "schedule", label: "Fahrt planen" },
  { id: "riders", label: "Fahrgäste" },
  { id: "riders-no-company", label: "Fahrgäste (privat)" },
  { id: "requested", label: "Fahrt angefragt" },
  { id: "inbox", label: "Postfach" },
  { id: "inbox-empty", label: "Postfach (leer)" },
  { id: "account", label: "Konto" },
  { id: "loading", label: "Ladezustand" },
  { id: "error", label: "Fehlerzustand" },
];

/** Maps each lab screen to the bottom tab it belongs to. */
const tabForScreen: Record<LabScreen, RiderTabId> = {
  account: "account",
  book: "home",
  error: "home",
  home: "home",
  "home-empty": "home",
  inbox: "inbox",
  "inbox-empty": "inbox",
  loading: "home",
  requested: "home",
  riders: "home",
  "riders-no-company": "home",
  schedule: "home",
  tracking: "trips",
  "trip-detail": "trips",
  trips: "trips",
  "trips-empty": "trips",
};

function ScreenHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)]">
        {title}
      </p>
      <span className="font-medium text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
        TaxiOS Rider
      </span>
    </div>
  );
}

function ScreenContent({
  screen,
  tripsTab,
  accountTab,
  onTripsTab,
  onAccountTab,
}: {
  screen: LabScreen;
  tripsTab: RiderTripsTab;
  accountTab: RiderAccountTab;
  onTripsTab: (tab: RiderTripsTab) => void;
  onAccountTab: (tab: RiderAccountTab) => void;
}) {
  switch (screen) {
    case "home":
      return <RiderHomeScreen copy={riderAppCopy} payload={riderHomePayload} />;
    case "home-empty":
      return <RiderHomeScreen copy={riderAppCopy} payload={riderHomeEmptyPayload} />;
    case "trips":
      return (
        <RiderTripsScreen
          activeTab={tripsTab}
          copy={riderAppCopy}
          onTabChange={onTripsTab}
          payload={riderTripsPayload}
        />
      );
    case "trips-empty":
      return (
        <RiderTripsScreen
          activeTab={tripsTab}
          copy={riderAppCopy}
          onTabChange={onTripsTab}
          payload={riderTripsEmptyPayload}
        />
      );
    case "trip-detail":
      return <RiderTripDetailScreen copy={riderAppCopy} payload={riderTripDetailPayload} />;
    case "tracking":
      return <RiderTrackingScreen copy={riderAppCopy} payload={riderTrackingPayload} />;
    case "book":
      return <RiderBookScreen copy={riderAppCopy} payload={riderBookingNowPayload} />;
    case "schedule":
      return <RiderScheduleScreen copy={riderAppCopy} payload={riderBookingSchedulePayload} />;
    case "riders":
      return <RiderRidersScreen payload={riderRidersPayload} />;
    case "riders-no-company":
      return <RiderRidersScreen payload={riderRidersEmptyPayload} />;
    case "requested":
      return <RiderRequestedScreen payload={riderConfirmationPayload} />;
    case "inbox":
      return <RiderInboxScreen payload={riderInboxPayload} />;
    case "inbox-empty":
      return <RiderInboxScreen payload={riderInboxEmptyPayload} />;
    case "account":
      return (
        <RiderAccountScreen
          activeTab={accountTab}
          onTabChange={onAccountTab}
          payload={riderAccountPayload}
        />
      );
    case "loading":
      return <RiderLoadingState label={riderAppCopy.loadingLabel} />;
    case "error":
      return (
        <RiderErrorState
          description={riderAppCopy.errorDescription}
          retryLabel={riderAppCopy.retryLabel}
          title={riderAppCopy.errorTitle}
        />
      );
    default:
      return null;
  }
}

export function RiderAppLabBlock() {
  const [activeScreen, setActiveScreen] = useState<LabScreen>("home");
  const [tripsTab, setTripsTab] = useState<RiderTripsTab>("upcoming");
  const [accountTab, setAccountTab] = useState<RiderAccountTab>("personal");

  return (
    <div className="min-h-[920px] bg-[var(--taxis-ui-page-bg)] px-5 py-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="taxis-company-page-eyebrow">TaxiOS Rider App</p>
          <h2 className="text-xl font-semibold text-[var(--taxis-workspace-text-strong)]">
            Fahrgast-App · 10 Screens
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--taxis-workspace-text-muted)]">
            Passenger-first Screens mit geteiltem Phone-Shell, Bottom-Tabs und
            backend-gesteuerten Aktionen. Mock-Daten aus den Fixtures.
          </p>
        </div>
        <ThemeToggle variant="segmented" />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {screens.map((screen) => (
          <button
            className={[
              "rounded-md border px-3 py-2 text-sm font-semibold transition",
              activeScreen === screen.id
                ? "border-[var(--taxis-workspace-accent)] bg-[var(--taxis-workspace-accent)] text-white"
                : "border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] text-[var(--taxis-workspace-text-strong)] hover:border-[var(--taxis-workspace-border-strong)]",
            ].join(" ")}
            key={screen.id}
            onClick={() => setActiveScreen(screen.id)}
            type="button"
          >
            {screen.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <RiderAppShell
          activeTab={tabForScreen[activeScreen]}
          copy={riderAppCopy}
          header={<ScreenHeader title={screens.find((s) => s.id === activeScreen)?.label ?? ""} />}
          inboxBadgeCount={2}
          onTabSelect={(tab) => {
            const entry = screens.find((s) => tabForScreen[s.id] === tab);
            if (entry) setActiveScreen(entry.id);
          }}
        >
          <ScreenContent
            accountTab={accountTab}
            onAccountTab={setAccountTab}
            onTripsTab={setTripsTab}
            screen={activeScreen}
            tripsTab={tripsTab}
          />
        </RiderAppShell>
      </div>
    </div>
  );
}
