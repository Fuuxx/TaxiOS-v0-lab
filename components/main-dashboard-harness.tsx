"use client";

import {
  CompanyDashboardWorkspaceContent,
  CompanyWorkspaceShell,
  type CompanyDashboardCopy,
  type CompanyDashboardData,
} from "@taxios-v2/ui";
import type React from "react";

const copy: CompanyDashboardCopy = {
  sidebar: {
    accountInitials: "SC",
    accountName: "Smoke Company HQ",
    accountType: "Geschäftskonto",
    billing: "Abrechnung",
    dashboard: "Dashboard",
    locations: "Standorte",
    mainSection: "Dashboard",
    members: "Mitglieder",
    newBooking: "Neue Buchung",
    organizationSection: "Organisation",
    reports: "Berichte",
    rides: "Fahrten",
    settings: "Einstellungen",
  },
  topbar: {
    company: "Unternehmen",
    dashboard: "Dashboard",
    notificationsLabel: "Benachrichtigungen öffnen",
    searchPlaceholder: "Suchen...",
  },
  hero: {
    datePrefix: "Heute",
    greetingName: "Team",
    greetingPrefix: "Guten Morgen",
    overview: "Hier ist der Überblick über eure heutige Mobilität.",
    ridesTodaySuffix: "Fahrten heute",
    systemStatus: "Alle Systeme nominal",
  },
  fastbooking: {
    activeSuffix: "aktiv",
    addMemberLabel: "Mitarbeiter hinzufügen",
    bookLabel: "Buchen",
    cardEyebrow: "Schnellbuchung",
    closeMemberPickerLabel: "Mitarbeiterauswahl schließen",
    deselectAvatarLabel: "abwählen",
    destinationLabel: "Zielort (NACH)",
    destinationPlaceholder: "Zieladresse",
    emptyDescription:
      "Erstelle eine Route oder nutze aktive Fahrten als Schnellbuchungsvorlage.",
    emptyTitle: "Noch keine Fastbooking-Routen",
    eyebrow: "Fastbooking",
    fromLabel: "Von",
    membersLabel: "Mitarbeiter",
    newRouteAriaLabel: "Neue Fastbooking-Route öffnen",
    newRouteHeading: "Neue Route",
    noMembersFound: "Keine Mitarbeiter gefunden",
    openMemberPickerLabel: "Mitarbeiterauswahl öffnen",
    pickupLabel: "Abholort (VON)",
    pickupPlaceholder: "Straße, Stadt",
    removeMemberLabel: "Mitarbeiter entfernen",
    routeTitleLabel: "Titel der Route",
    routeTitlePlaceholder: "z.B. Flughafen BER",
    saveLabel: "Route speichern",
    searchMembersLabel: "Mitarbeiter nach Namen suchen",
    searchPlaceholder: "Name suchen",
    selectAvatarLabel: "auswählen",
    title: "Fastbooking",
    toLabel: "Nach",
  },
  rides: {
    activeEmptyDescription:
      "Neue und bestätigte Provider-Fahrten erscheinen hier, sobald sie aktiv sind.",
    activeEmptyTitle: "Keine aktiven Fahrten",
    cancelAction: "Stornieren",
    closeDetailLabel: "Detailansicht schließen",
    costCenterLabel: "Kostenstelle",
    dateLabel: "Heute",
    destinationLabel: "Ziel",
    detailBackdropLabel: "Detailansicht schließen",
    detailCloseButtonLabel: "Drawer schließen",
    dispatcherLabel: "Vermittler",
    employeePrefix: "Mitarbeiter",
    fareLabel: "Betrag",
    historyEmptyDescription:
      "Abgeschlossene und stornierte Buchungen erscheinen hier, sobald der Provider-Status wechselt.",
    historyEmptyTitle: "Noch keine abgeschlossene Historie",
    historyTitle: "Letzte Buchungshistorie",
    noteAction: "Notiz",
    passengersLabel: "Fahrgäste",
    pickupLabel: "Abholung",
    routeLabel: "Route",
    statusLabel: "Status",
    statusLabels: {
      arrived: "angekommen",
      assigned: "zugewiesen",
      completed: "abgeschlossen",
      inRide: "in Fahrt",
      issue: "Problem",
      onWay: "unterwegs",
      ordered: "bestellt",
    },
    tableId: "ID",
    tablePassengers: "Passagiere",
    tableRoute: "Route",
    tableStatus: "Status",
    tableTime: "Zeit",
    taxiStatusPrefix: "Taxi-Status",
    taxiStatusTitle: "Taxi-Status",
    timeLabel: "Zeit",
    title: "Nächste Fahrten",
    todayLabel: "Heute",
    tripBookedByLabel: "Gebucht von",
    unknownStatus: "unbekannt",
    vehicleStatusTitle: "Taxi-Status",
    viewAll: "Alles ansehen",
  },
  liveFeed: {
    ariaLabel: "Live-Feed der Tagesereignisse",
    eventsLabel: "Ereignisse",
    liveBadge: "Live",
    title: "Live Feed",
    updatedNow: "Aktualisiert gerade",
  },
  dayStatus: {
    actionLabel: "Feedback melden",
    eyebrow: "Feedback",
    titleLine1: "Hilf uns, TaxiOS stetig zu verbessern.",
    titleLine2: "Melde Bugs oder sag uns, was dich unzufrieden macht.",
  },
};

/**
 * Lab-only avatar overflow cap (Slice 1).
 *
 * The vendored Fastbooking footer renders avatars from two channels: the static
 * `avatars` array and interactive members from `memberIds`. With both populated by
 * the same roster, each card double-rendered its people. This Lab adapter collapses
 * the roster into a single capped display channel: up to 4 ceramic chips followed by
 * a neutral "+N" overflow chip. The "+N" string is rendered by the real
 * `CompanyDashboardAvatar` primitive as its built-in neutral `taxios-avatar-extra`
 * plate (card-soft surface, muted text, no orange) — no component or CSS changes.
 *
 * `memberIds` is intentionally cleared so only the capped channel renders. This is a
 * Lab display compromise around vendored render logic; in TaxiOS.v2 the cap must live
 * inside the avatar-stack primitive so `memberIds` (and the true passenger count) stay
 * intact for interaction and the count badge.
 */
const MAX_VISIBLE_FASTBOOKING_AVATARS = 4;

function capFastbookingAvatars(roster: readonly string[]): string[] {
  if (roster.length <= MAX_VISIBLE_FASTBOOKING_AVATARS) {
    return [...roster];
  }

  const visible = roster.slice(0, MAX_VISIBLE_FASTBOOKING_AVATARS);
  const overflow = roster.length - MAX_VISIBLE_FASTBOOKING_AVATARS;

  return [...visible, `+${overflow}`];
}

const dashboardData: CompanyDashboardData = {
  allowedActions: [{ id: "create_booking", label: "Neue Buchung" }],
  availableMembers: [
    { id: "a", name: "A" },
    { id: "sc-1", name: "Smoke Company" },
    { id: "aa", name: "AA" },
    { id: "sc-2", name: "SC" },
    { id: "ab", name: "AB" },
    { id: "x", name: "X" },
    { id: "gg", name: "GG" },
    { id: "ay", name: "AY" },
    { id: "xy", name: "XY" },
    { id: "sp", name: "SP" },
    { id: "cc", name: "CC" },
    { id: "cs", name: "CS" },
  ],
  fastRoutes: [
    {
      avatars: capFastbookingAvatars(["A", "SC", "AA", "SC", "AB"]),
      from: "test 1",
      memberIds: [],
      title: "test 2",
      to: "test 2",
    },
    {
      avatars: capFastbookingAvatars(["X"]),
      from: "Werrastraße 36",
      memberIds: [],
      title: "Linkstraße 5",
      to: "Linkstraße 5",
    },
    {
      avatars: capFastbookingAvatars(["GG"]),
      from: "Leipziger Platz 1",
      memberIds: [],
      title: "Berlin Central Office",
      to: "Berlin Central Office",
    },
  ],
  feedItems: [
    {
      icon: "booking",
      sub: "6 active bookings",
      time: "Read model",
      title: "Company rides loaded",
      tone: "neutral",
    },
  ],
  recentBookingHistory: [],
  recentBookingHistorySummary: { label: "Letzte Buchungshistorie", visibleCount: 0 },
  stats: [],
  upcomingTrips: [
    {
      from: "test 1",
      id: "ride-1",
      passengers: ["AY"],
      publicId: "BKG-8HTXCR",
      status: "ordered",
      statusColor: "blue",
      taxiStatuses: [{ status: "assigned" }],
      time: "20:05",
      to: "test 2",
    },
    {
      from: "Werrastraße 36",
      id: "ride-2",
      passengers: ["XY"],
      publicId: "BKG-2VU66A",
      status: "ordered",
      statusColor: "grey",
      taxiStatuses: [{ status: "ordered" }],
      time: "08:40",
      to: "Linkstraße 5",
    },
    {
      from: "Leipziger Platz 1",
      id: "ride-3",
      passengers: ["GG"],
      publicId: "BKG-WBYD39",
      status: "assigned",
      statusColor: "blue",
      taxiStatuses: [{ status: "assigned" }],
      time: "13:00",
      to: "Berlin Central Office",
    },
    {
      from: "Slice 137 Company Pickup",
      id: "ride-4",
      passengers: ["SP"],
      publicId: "BKG-D2UAKC",
      status: "assigned",
      statusColor: "blue",
      taxiStatuses: [{ status: "assigned" }],
      time: "TBD",
      to: "Slice 137 Provider Destination",
    },
    {
      from: "Potsdamer Platz 1",
      id: "ride-5",
      passengers: ["CC"],
      publicId: "BKG-SR83JR",
      status: "assigned",
      statusColor: "blue",
      taxiStatuses: [{ status: "assigned" }],
      time: "10:00",
      to: "Berlin Hauptbahnhof",
    },
    {
      from: "Company Smoke Office",
      id: "ride-6",
      passengers: ["CS"],
      publicId: "BKG-3D4XGN",
      status: "assigned",
      statusColor: "blue",
      taxiStatuses: [{ status: "assigned" }],
      time: "TBD",
      to: "Provider Global Pool Destination",
    },
  ],
};

function NoopLink({
  children,
  href,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

export function MainDashboardHarness() {
  return (
    <CompanyWorkspaceShell
      activeItem="dashboard"
      linkComponent={NoopLink}
      newBookingLabel={copy.sidebar.newBooking}
      notificationsLabel={copy.topbar.notificationsLabel}
      onNewBookingClick={() => undefined}
      organizationName="Smoke Company HQ"
      routeLabels={{ dashboard: copy.topbar.dashboard }}
      searchPlaceholder={copy.topbar.searchPlaceholder}
      userInitials="AA"
      userLabel="AA"
      visibleNavigation={[
        "dashboard",
        "rides",
        "organization",
        "reports",
        "finance",
        "settings",
      ]}
    >
      <CompanyDashboardWorkspaceContent
        copy={copy}
        dashboardData={dashboardData}
        headerDateLabel="Sonntag, 07. Juni"
        onFastRouteBookingStart={() => undefined}
        onFastRouteMembersChange={() => undefined}
      />
    </CompanyWorkspaceShell>
  );
}
