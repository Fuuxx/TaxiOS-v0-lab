"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CompanyBookingsWorkspaceContent } from "@taxios-v2/ui/components/taxios/company-bookings/company-bookings-screen";
import { CompanyFinanceWorkspaceContent } from "@taxios-v2/ui/components/taxios/company-finance/company-finance-screen";
import { CompanyOrganizationWorkspaceContent } from "@taxios-v2/ui/components/taxios/company-organization/company-organization-screen";
import { CompanyReportsWorkspaceContent } from "@taxios-v2/ui/components/taxios/company-reports/company-reports-screen";
import { CompanySettingsWorkspaceContent } from "@taxios-v2/ui/components/taxios/company-settings/company-settings-screen";
import { CompanyWorkspaceShell } from "@taxios-v2/ui/components/taxios/company-workspace/company-workspace-shell";
import { CompanyDashboardWorkspaceContent } from "@taxios-v2/ui/components/taxios/dashboard/company-dashboard-screen";
import { ThemeToggle } from "@taxios-v2/ui/components/taxios/theme/theme-toggle";
import { NewBookingOverlay } from "@taxios-v2/ui/components/taxios/new-booking/new-booking-overlay";
import { WorkspaceNotificationsPopover } from "@taxios-v2/ui/components/taxios/workspace-notifications/workspace-notifications-popover";
import { WorkspaceSearchBox } from "@taxios-v2/ui/components/taxios/workspace-search/workspace-search-box";
import type {
  CompanyBookingRow,
  CompanyBookingsCopy,
} from "@taxios-v2/ui/contracts/company-bookings";
import type {
  CompanyFinanceCopy,
  CompanyFinancePayload,
} from "@taxios-v2/ui/contracts/company-finance";
import type {
  CompanyReportsCopy,
  CompanyReportsPayload,
} from "@taxios-v2/ui/contracts/company-reports";
import type {
  CompanySettingsCopy,
  CompanySettingsPayload,
  CompanySettingsSectionId,
} from "@taxios-v2/ui/contracts/company-settings";
import type {
  WorkspaceNotificationFilter,
  WorkspaceNotificationItem,
} from "@taxios-v2/ui/contracts/workspace-notifications";
import type {
  WorkspaceSearchGroup,
  WorkspaceSearchState,
} from "@taxios-v2/ui/contracts/workspace-search";
import {
  demoCompanyDashboardCopyDe,
  demoCompanyDashboardData,
} from "@taxios-v2/ui/storybook/fixtures/company-dashboard.fixtures";
import {
  demoCompanyOrganizationCopy,
  demoCompanyOrganizationPayload,
} from "@taxios-v2/ui/storybook/fixtures/company-organization.fixtures";

type LabSurface =
  | "dashboard"
  | "bookings"
  | "organization"
  | "new-booking"
  | "search"
  | "notifications"
  | "account-menu"
  | "settings-feedback"
  | "finance-empty"
  | "reports-empty";

const surfaces: Array<{ id: LabSurface; label: string }> = [
  { id: "dashboard", label: "Company Dashboard + Shell" },
  { id: "bookings", label: "Buchungen" },
  { id: "organization", label: "Organisation" },
  { id: "new-booking", label: "New Booking Overlay" },
  { id: "search", label: "Search" },
  { id: "notifications", label: "Notifications" },
  { id: "account-menu", label: "Account/Menu" },
  { id: "settings-feedback", label: "Settings feedback states" },
  { id: "finance-empty", label: "Finance empty/read-only" },
  { id: "reports-empty", label: "Reports empty/read-only" },
];

const shellUser = {
  organizationName: "Smoke Company HQ",
  sessionAction: <button type="button">Abmelden</button>,
  userEmail: "ayoub@example.test",
  userFirstName: "Ayoub",
  userInitials: "AA",
  userLabel: "Ayoub Amid",
  userLastName: "Amid",
  userPublicId: "USR-7K4Q2M",
  userRoleLabel: "Company Admin",
};

const bookingsCopy: CompanyBookingsCopy = {
  allLoadedLabel: "Alle Buchungen geladen",
  detailBackdropLabel: "Buchungsdetails schließen",
  detailBookedAtLabel: "Wann gebucht",
  detailBookedByLabel: "Gebucht von",
  detailBookingIdLabel: "Fahrt ID",
  detailCancelErrorFallback: "Die Buchung konnte gerade nicht storniert werden.",
  detailCancelLabel: "Buchung stornieren",
  detailCancelWorkingLabel: "Wird storniert...",
  detailCloseButtonLabel: "Buchungsdetails schließen",
  detailDriverLabel: "Fahrer",
  detailDriverPendingLabel:
    "Fahrer und Fahrzeug werden sichtbar, sobald die Anfahrt startet.",
  detailDriverVehicleLabel: "Fahrer & Fahrzeug",
  detailHistoryEmptyLabel: "Noch keine Buchungshistorie",
  detailHistoryLabel: "Buchungshistorie",
  detailNoteEmptyLabel: "Keine Notiz hinterlegt.",
  detailNoteLabel: "Notiz",
  detailOpenRowLabel: "Details öffnen",
  detailPassengersLabel: "Fahrgäste",
  detailPickupAtLabel: "Für wann",
  detailRouteLabel: "Route",
  detailVehicleLabel: "Fahrzeug",
  emptyDescription:
    "Sobald Buchungen erstellt werden, erscheinen sie hier chronologisch.",
  emptyTitle: "Noch keine Buchungen",
  fromLabel: "Von",
  loadMoreLabel: "Mehr laden",
  loadingMoreLabel: "Wird geladen...",
  subtitle:
    "Alle jemals erstellten Buchungen bleiben chronologisch nach Abholzeit nachvollziehbar.",
  tableCreated: "Erstellt",
  tableId: "ID",
  tablePassengers: "Passagiere",
  tablePickup: "Abholung",
  tableRoute: "Route",
  tableStatus: "Status",
  title: "Buchungen",
  toLabel: "Nach",
  visibleLabel: "sichtbar",
};

function bookingRow(overrides: Partial<CompanyBookingRow>): CompanyBookingRow {
  return {
    allowedActions: [{ id: "cancel_booking", label: "Buchung stornieren" }],
    bookedByEmail: "ada@example.test",
    bookedByName: "Ada Lovelace",
    bookingId: "booking-1",
    createdDateLabel: "07.05.2026",
    createdTimeLabel: "09:10",
    driverName: null,
    driverVehicleVisible: false,
    from: "Werrastraße 36",
    history: [
      {
        actorName: "Ada Lovelace",
        dateLabel: "07.05.2026",
        id: "booking-1-history-0",
        label: "Buchung erstellt",
        timeLabel: "09:10",
        tone: "navy",
      },
    ],
    lifecycleStatus: "requested",
    note: "Bitte am Empfang melden.",
    passengers: ["Ada Lovelace"],
    pickupDateLabel: "07.05.2026",
    pickupTimeLabel: "10:00",
    publicId: "BKG-7K4Q2M",
    status: "requested",
    statusColor: "navy",
    statusIndicators: [
      { color: "navy", id: "primary", label: "Gebucht", status: "booked" },
    ],
    statusLabel: "Gebucht",
    to: "Linkstraße 5",
    vehicleDisplayName: null,
    vehicleLicensePlate: null,
    vehicleUnits: [],
    ...overrides,
  };
}

const bookingRows: CompanyBookingRow[] = [
  bookingRow({ bookingId: "booking-1" }),
  bookingRow({
    bookingId: "booking-2",
    driverName: "Mina Driver",
    driverVehicleVisible: true,
    from: "Potsdamer Platz 1",
    lifecycleStatus: "enroute",
    passengers: ["Mina Request"],
    pickupTimeLabel: "11:20",
    publicId: "BKG-2VU66A",
    status: "confirmed",
    statusColor: "blue",
    statusIndicators: [
      {
        color: "blue",
        id: "primary",
        isPulsing: true,
        label: "In Anfahrt",
        status: "enroute",
      },
    ],
    statusLabel: "In Anfahrt",
    to: "Berlin Hauptbahnhof",
    vehicleDisplayName: "TX 500",
    vehicleLicensePlate: "B TX 500",
  }),
];

const searchGroups: WorkspaceSearchGroup[] = [
  {
    label: "Buchung",
    results: [
      {
        href: "/company-rides/BKG-8HTXCR",
        meta: ["Heute", "20:05"],
        publicId: "BKG-8HTXCR",
        resultId: "booking_1",
        statusKey: "requested",
        statusLabel: "Gebucht",
        subtitle: "test 1 -> test 2",
        targetType: "booking",
        title: "BKG-8HTXCR",
        tone: "navy",
        typeLabel: "Buchung",
      },
    ],
    targetType: "booking",
    total: 1,
  },
  {
    label: "Mitglied",
    results: [
      {
        href: null,
        meta: ["Keine Detailrechte"],
        publicId: "MEM-HIDDEN",
        resultId: "member_hidden",
        statusKey: null,
        statusLabel: "Kein Zugriff",
        subtitle: "Mitgliederdetails sind ohne members.view gesperrt.",
        targetType: "member",
        title: "Member result hidden by permissions",
        tone: "grey",
        typeLabel: "Mitglied",
      },
    ],
    targetType: "member",
    total: 1,
  },
];

const notificationItems: WorkspaceNotificationItem[] = [
  {
    body: "BKG-8HTXCR wurde für den aktiven Workspace erstellt.",
    createdAtLabel: "gerade eben",
    entityPublicId: "BKG-8HTXCR",
    href: "/company-rides/BKG-8HTXCR",
    itemId: "notification_1",
    priority: "info",
    publicId: "NTF-1",
    read: false,
    title: "Company rides loaded",
    type: "booking_created",
  },
  {
    body: "Eine Einladung wartet auf Freigabe.",
    createdAtLabel: "vor 12 Min.",
    entityPublicId: "IVT-K7N4PC",
    href: "/company-organization?section=invitations",
    itemId: "notification_2",
    priority: "action_required",
    publicId: "NTF-2",
    read: false,
    title: "Invite approval required",
    type: "company_member_invitation_claimed",
  },
];

const settingsCopy: CompanySettingsCopy = {
  bookingSectionDescription: "Vorlauf, Storno und Passagier-Regeln.",
  bookingSectionTitle: "Buchungen",
  cancelLabel: "Abbrechen",
  dataSectionDescription: "Exports und Nachvollziehbarkeit.",
  dataSectionTitle: "Daten & Export",
  editLabel: "Bearbeiten",
  generalSectionDescription: "Basisdaten und Workspace-Defaults.",
  generalSectionTitle: "Allgemein",
  integrationsSectionDescription: "Kalender, Accounting und API.",
  integrationsSectionTitle: "Integrationen",
  notificationsSectionDescription: "Ruhige Workspace-Hinweise.",
  notificationsSectionTitle: "Benachrichtigungen",
  readOnlyLabel: "Nur Anzeige",
  saveLabel: "Speichern",
  savedLabel: "Gespeichert",
  securitySectionDescription: "Konto, Rollen und Zugriff.",
  securitySectionTitle: "Sicherheit",
  subtitle: "Selten geänderte Regeln für den aktiven Company-Workspace.",
  title: "Einstellungen",
};

const settingsPayload: CompanySettingsPayload = {
  allowedActions: [
    {
      id: "update_company_general_settings",
      label: "Allgemeine Einstellungen bearbeiten",
    },
    {
      id: "update_company_booking_settings",
      label: "Buchungsregeln bearbeiten",
    },
    {
      id: "update_company_notification_settings",
      label: "Benachrichtigungseinstellungen bearbeiten",
    },
    {
      disabled: true,
      id: "open_password_settings",
      label: "Passwort und Konto verwalten",
      reason: "Das sichere Account-Portal wird separat angebunden.",
    },
    {
      href: "/company-organization?section=members",
      id: "open_roles_settings",
      label: "Rollen in Organisation verwalten",
    },
    { href: "/company-finance", id: "open_billing", label: "Finanzen öffnen" },
    {
      href: "/company-reports",
      id: "open_audit_export",
      label: "Berichte und Exporte öffnen",
    },
    {
      disabled: true,
      id: "open_integrations",
      label: "Integrationen verwalten",
      reason: "Integrationen werden in einem späteren Slice angebunden.",
    },
  ],
  booking: {
    allowGuestPassengers: true,
    bookingMinimumLeadTimeMinutes: 30,
    cancellationWindowMinutes: 60,
    requireCostCenter: false,
    requirePassengerProfile: false,
  },
  general: {
    locale: "de-DE",
    organizationName: "Smoke Company HQ",
    organizationPublicId: "COM-SMOKE",
    supportEmail: "support@smoke.example",
    timezone: "Europe/Berlin",
  },
  notifications: {
    notificationBillingAlertsEnabled: true,
    notificationBookingUpdatesEnabled: true,
  },
  organizationId: "organization_1",
  organizationName: "Smoke Company HQ",
  settingsId: "settings_1",
  updatedAt: Date.UTC(2026, 4, 20, 9, 30),
};

const financeCopy: CompanyFinanceCopy = {
  amountColumn: "Betrag",
  bookingColumn: "Buchung",
  completedColumn: "Abgeschlossen",
  costStatusColumn: "Kostenstatus",
  costsSectionTitle: "Buchungskosten",
  emptyDescription:
    "Sobald Buchungen abgeschlossen werden, erscheinen Rechnungssnapshots hier.",
  emptyTitle: "Noch keine Rechnungen",
  invoiceColumn: "Rechnung",
  invoicesSectionTitle: "Rechnungen",
  latestInvoiceLabel: "Letzte Rechnung",
  passengerColumn: "Passagiere",
  providerColumn: "Provider",
  routeColumn: "Route",
  snapshotCountLabel: "Rechnungssnapshots",
  subtitle: "Rechnungen und Buchungskosten bleiben für Admins nachvollziehbar.",
  summarySectionTitle: "Uebersicht",
  title: "Finanzen",
  totalKnownAmountLabel: "Bepreister Gesamtwert",
  unpricedCountLabel: "Nicht bepreist",
  vehicleColumn: "Fahrzeug",
};

const financeEmptyPayload: CompanyFinancePayload = {
  costRows: [],
  invoiceRows: [],
  organizationId: "organization_1",
  organizationName: "Smoke Company HQ",
  summary: {
    invoiceCount: 0,
    latestInvoiceLabel: "—",
    pricedCount: 0,
    totalKnownAmountLabel: "—",
    unpricedCount: 0,
  },
};

const reportsCopy: CompanyReportsCopy = {
  bookingStatusSectionTitle: "Buchungsstatus",
  emptyDescription:
    "Sobald Buchungen im Company Workspace entstehen, erscheinen sie hier als Reports-Auszug.",
  emptyTitle: "Noch keine Reports-Daten",
  financeSectionTitle: "Finance-Signale",
  passengerColumn: "Passagiere",
  pickupColumn: "Abholung",
  recentSectionTitle: "Aktuelle Buchungen",
  referenceColumn: "Referenz",
  routeColumn: "Route",
  statusColumn: "Status",
  subtitle:
    "Buchungen, Status und Finance-Signale bleiben für Admins als read-only MVP-Auswertung sichtbar.",
  summarySectionTitle: "Uebersicht",
  title: "Berichte",
};

const reportsEmptyPayload: CompanyReportsPayload = {
  allowedActions: [{ id: "view_company_reports", label: "View company reports" }],
  bookingStatusBreakdown: [
    {
      description: "Noch nicht bestätigte Company-Buchungen.",
      id: "requested",
      label: "Angefragt",
      tone: "orange",
      value: 0,
    },
    {
      description: "Bestaetigte oder laufende Buchungen.",
      id: "active",
      label: "Aktiv",
      tone: "blue",
      value: 0,
    },
    {
      description: "Abgeschlossene Buchungen mit operativem Abschluss.",
      id: "completed",
      label: "Abgeschlossen",
      tone: "green",
      value: 0,
    },
    {
      description: "Stornierte Buchungen im Auswertungsfenster.",
      id: "cancelled",
      label: "Storniert",
      tone: "red",
      value: 0,
    },
  ],
  coverageLabel: "Neueste 0 von maximal 100 Buchungen",
  financeMetrics: [
    {
      description: "Erzeugte Rechnungssnapshots im MVP-Finance-Layer.",
      label: "Rechnungssnapshots",
      tone: "neutral",
      value: "0",
    },
  ],
  organizationId: "organization_1",
  organizationName: "Smoke Company HQ",
  recentRows: [],
  summaryMetrics: [
    {
      description: "Neueste Buchungen im Reports-Auswertungsfenster.",
      label: "Ausgewertete Buchungen",
      tone: "neutral",
      value: "0",
    },
  ],
};

const newBookingCopy = {
  advanced: { summary: "Flug, Kontakt, Notizen und Serienfahrt", title: "Weitere Details" },
  addressAutocomplete: {
    errorLabel: "Adressvorschläge sind gerade nicht verfügbar.",
    loadingLabel: "Adressen werden geladen...",
    noResultsLabel: "Keine passende Adresse gefunden.",
    suggestionListLabel: "Adressvorschläge",
  },
  addressVerification: {
    googleSelectedLabel: "Google-Adresse ausgewählt",
    houseNumberDetectedLabel: "Hausnummer erkannt",
    missingGoogleSelectionLabel: "Bitte aus Google-Vorschlägen wählen",
    missingHouseNumberLabel: "Hausnummer fehlt",
    unavailableLabel: "Adressprüfung gerade nicht verfügbar",
  },
  cancelLabel: "Abbrechen",
  closeLabel: "Neue Buchung schließen",
  command: {
    livePlanSummary: "Route, Zeit, Gaeste und Fahrzeuge bleiben sichtbar.",
    livePlanTitle: "Live-Plan",
    passengersEmptyLabel: "0 Fahrgäste",
    routeOpenLabel: "Route offen",
    routeReadyLabel: "Route bereit",
    statusLabel: "Buchungsstatus",
    timeOpenLabel: "Zeit offen",
    timeReadyLabel: "Zeit bereit",
    vehiclePluralLabel: "Fahrzeuge",
    vehicleSingularLabel: "Fahrzeug",
  },
  contact: { label: "Ansprechpartner", placeholder: "Ansprechpartner wählen", title: "Kontakt" },
  dateTime: {
    pickupDateLabel: "Abholdatum",
    pickupTimeLabel: "Abholzeit",
    quickNowLabel: "Jetzt",
    quickOneHourLabel: "+1h",
    quickThirtyMinutesLabel: "+30 Min",
    quickTomorrowMorningLabel: "Morgen 08:00",
    returnDateLabel: "Rueckfahrtdatum",
    returnTimeLabel: "Rueckfahrzeit",
    title: "Datum und Uhrzeit",
  },
  favorites: {
    emptyLabel: "Noch keine gespeicherten Routen.",
    saveCurrentLabel: "Aktuelle Route speichern",
    saveDisabledLabel: "Favoriten-Persistenz wird in einem Backend-Slice verbunden.",
    title: "Schnellrouten",
  },
  flight: { label: "Flugnummer", placeholder: "z. B. LH 203", title: "Fluginformation" },
  notes: { label: "Interne Notiz", placeholder: "Hinweise für Disposition", title: "Notizen" },
  passenger: {
    addCustomLabel: "Fahrgast hinzufügen",
    assignedLabel: "Zugewiesen",
    customNameLabel: "Weiterer Fahrgast",
    customNamePlaceholder: "Name",
    emptyLabel: "Noch keine Fahrgäste ausgewählt.",
    externalSummary: "Nur nutzen, wenn die Person nicht als Mitglied verfügbar ist.",
    externalTitle: "Externen Fahrgast hinzufügen",
    memberSearchLabel: "Mitglied suchen",
    memberSearchPlaceholder: "Name oder Team suchen",
    membersEmptyLabel: "Keine berechtigten Mitglieder verfügbar.",
    selectLabel: "Fahrgäste",
    title: "Fahrgäste",
    totalLabel: "Fahrgäste gesamt",
  },
  recurring: {
    disabledLabel: "Backend-Unterstuetzung offen",
    summary: "Serienfahrten bleiben in diesem Slice draft-only und werden nicht gespeichert.",
    title: "Serienfahrt einstellen",
  },
  review: {
    backLabel: "Zurueck",
    changeContactLabel: "Kontakt ändern",
    changeDateTimeLabel: "Zeit ändern",
    changeNotesLabel: "Notizen ändern",
    changePassengerVehicleLabel: "Fahrzeuge ändern",
    changeRouteLabel: "Route ändern",
    nextLabel: "Weiter zur Uebersicht",
    summary: "Pruefe Route, Zeit, Fahrgäste und Fahrzeug.",
    title: "Uebersicht",
  },
  route: {
    destinationLabel: "Ziel",
    destinationPlaceholder: "Zieladresse",
    pickupLabel: "Abholung",
    pickupPlaceholder: "Abholadresse",
    returnPendingLabel: "Rueckfahrt wird automatisch aus Abholung und Ziel erstellt.",
    returnPreviewLabel: "Rueckfahrt",
    title: "Route",
  },
  submitLabel: "Buchung erstellen",
  submittingLabel: "Wird erstellt...",
  summary: {
    calculatedLaterLabel: "Wird berechnet",
    dateTimeLabel: "Datum/Zeit",
    destinationFallback: "Kein Ziel",
    pickupFallback: "Keine Abholung",
    title: "Zusammenfassung",
    totalAmountLabel: "Gesamtsumme",
    totalPassengersLabel: "Fahrgäste",
    tripTypeLabel: "Fahrttyp",
    vehicleTypeLabel: "Fahrzeug",
  },
  title: "Neue Buchung",
  tripType: { outbound: "Hinfahrt", roundTrip: "Hin- und Rueckfahrt", title: "Fahrttyp" },
  validation: {
    contactRequired: "Ansprechpartner ist erforderlich.",
    destinationRequired: "Ziel ist erforderlich.",
    googleAddressRequired: "Bitte eine Adresse aus den Google-Vorschlägen auswählen.",
    houseNumberRequired: "Bitte eine Google-Adresse mit Hausnummer auswählen.",
    overCapacity: "Ausgewähltes Fahrzeug hat nur {capacity} Plaetze. Bitte weniger Fahrgäste auswählen.",
    passengerRequired: "Mindestens ein Fahrgast ist erforderlich.",
    pickupDateRequired: "Abholdatum ist erforderlich.",
    pickupRequired: "Abholung ist erforderlich.",
    pickupTimeRequired: "Abholzeit ist erforderlich.",
    returnDateRequired: "Rueckfahrtdatum ist erforderlich.",
    returnTimeRequired: "Rueckfahrzeit ist erforderlich.",
  },
  vehicle: {
    addVehicleLabel: "Weiteres Fahrzeug hinzufügen",
    assignedLabel: "Im Fahrzeug",
    assignSeatsModeLabel: "Mitglieder/Gaeste zuweisen",
    capacityLabel: "Kapazitaet",
    cardDescriptionFallback: "Fahrzeugkategorie",
    emptySlotLabel: "Frei",
    externalPassengerLabel: "Gast",
    guestCountLabel: "Anzahl Gaeste",
    guestCountModeLabel: "Nur Anzahl Gaeste",
    inputModeLabel: "Fahrgastmodus",
    memberPassengerLabel: "Mitglied",
    overflowLabel: "Nicht zugewiesen",
    passengersPerVehicleLabel: "Personen pro Fahrzeug",
    remainingLabel: "{remaining} frei",
    removeVehicleLabel: "Fahrzeug löschen",
    slotClearLabel: "leeren",
    slotInputPlaceholder: "Name oder Mitglied suchen",
    slotLabel: "Platz {index}",
    slotSearchEmptyLabel: "Kein Mitglied gefunden. Waehle + Gast, um diese Person mitzunehmen.",
    slotSuggestionLabel: "Berechtigte Mitglieder",
    standardLabel: "Taxi (E-Klasse)",
    title: "Fahrzeug",
    typeLabel: "Fahrzeugtyp",
    typeSeatsLabel: "Plaetze",
    vehicleCardLabel: "Fahrzeug {index}",
    vehiclesCalculatedLabel: "{count} Fahrzeuge geplant",
  },
};

function WorkspaceFrame({
  activeItem,
  children,
}: {
  activeItem: "dashboard" | "finance" | "organization" | "reports" | "rides" | "settings";
  children: ReactNode;
}) {
  return (
    <div className="h-[760px] overflow-hidden">
      <CompanyWorkspaceShell
        {...shellUser}
        activeItem={activeItem}
        onNewBookingClick={() => undefined}
      >
        {children}
      </CompanyWorkspaceShell>
    </div>
  );
}

function SearchPreview({ state = "ready" }: { state?: WorkspaceSearchState }) {
  const [query, setQuery] = useState("ay");
  const containerRef = useRef<HTMLDivElement>(null);

  // Lab-only: the search dropdown opens on focus (no controlled prop exists),
  // so we focus the input on mount to present the active results state.
  useEffect(() => {
    const input = containerRef.current?.querySelector("input");
    input?.focus();
  }, []);

  return (
    <div className="mx-auto h-[32rem] max-w-2xl pt-10" ref={containerRef}>
      <WorkspaceSearchBox
        groups={state === "ready" ? searchGroups : []}
        onAllResultsSelect={() => undefined}
        onQueryChange={setQuery}
        onResultSelect={() => undefined}
        query={query}
        state={state}
      />
    </div>
  );
}

function NotificationsPreview() {
  const [activeFilter, setActiveFilter] =
    useState<WorkspaceNotificationFilter>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const openedRef = useRef(false);

  // Lab-only: the popover opens via its trigger button (no controlled prop
  // exists), so we click the trigger once on mount to present the open list
  // state. The ref guard keeps this to a single click under React StrictMode's
  // double-invoked effects, since the trigger only toggles.
  useEffect(() => {
    if (openedRef.current) {
      return;
    }
    openedRef.current = true;
    const trigger = containerRef.current?.querySelector("button");
    trigger?.click();
  }, []);

  return (
    <div
      className="flex min-h-[32rem] justify-end p-12"
      ref={containerRef}
    >
      <WorkspaceNotificationsPopover
        activeFilter={activeFilter}
        items={notificationItems}
        onFilterChange={setActiveFilter}
        onItemSelect={() => undefined}
        onMarkAllRead={() => undefined}
        onMarkRead={() => undefined}
        onOpenAll={() => undefined}
        state="ready"
        unreadBadgeCount={2}
      />
    </div>
  );
}

function AccountMenuPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Lab-only: the account menu is a native <details> in the shell header
  // (no controlled prop exists), so we open it on mount to present the
  // expanded menu state instead of a closed avatar trigger.
  useEffect(() => {
    const trigger = containerRef.current?.querySelector<HTMLElement>(
      "#company-workspace-user-trigger",
    );
    const menu = trigger?.closest("details");
    if (menu instanceof HTMLDetailsElement) {
      menu.open = true;
    }
  }, []);

  return (
    <div ref={containerRef}>
      <WorkspaceFrame activeItem="dashboard">
        <CompanyDashboardWorkspaceContent
          copy={demoCompanyDashboardCopyDe}
          dashboardData={demoCompanyDashboardData}
          headerDateLabel="Samstag, 02. Mai"
        />
      </WorkspaceFrame>
    </div>
  );
}

function SurfacePreview({ surface }: { surface: LabSurface }) {
  const settingsReadOnlyPayload = useMemo(
    () => ({
      ...settingsPayload,
      allowedActions: settingsPayload.allowedActions.map((action) =>
        action.id.startsWith("update_company_")
          ? {
              ...action,
              disabled: true,
              reason: "Nur Admins koennen Company-Einstellungen bearbeiten.",
            }
          : action,
      ),
    }),
    [],
  );

  if (surface === "dashboard") {
    return (
      <WorkspaceFrame activeItem="dashboard">
        <CompanyDashboardWorkspaceContent
          copy={demoCompanyDashboardCopyDe}
          dashboardData={demoCompanyDashboardData}
          headerDateLabel="Samstag, 02. Mai"
        />
      </WorkspaceFrame>
    );
  }

  if (surface === "bookings") {
    return (
      <WorkspaceFrame activeItem="rides">
        <CompanyBookingsWorkspaceContent
          canLoadMore
          copy={bookingsCopy}
          rows={bookingRows}
        />
      </WorkspaceFrame>
    );
  }

  if (surface === "organization") {
    return (
      <WorkspaceFrame activeItem="organization">
        <CompanyOrganizationWorkspaceContent
          activeSection="overview"
          copy={demoCompanyOrganizationCopy}
          inviteForm={<div />}
          payload={demoCompanyOrganizationPayload}
          unitForm={<div />}
        />
      </WorkspaceFrame>
    );
  }

  if (surface === "new-booking") {
    return (
      <div className="relative h-[760px] overflow-hidden [transform:translateZ(0)]">
        <NewBookingOverlay
          availablePassengers={[
            { id: "ada", name: "Ada Lovelace" },
            { id: "grace", name: "Grace Hopper" },
            { id: "katherine", name: "Katherine Johnson" },
            { id: "mary", name: "Mary Jackson" },
          ]}
          copy={newBookingCopy}
          favoriteRoutes={[
            {
              destinationAddress: "Flughafen BER",
              id: "route-airport",
              pickupAddress: "Chausseestraße 1",
              title: "Office -> BER",
            },
          ]}
          initialDraft={{
            destinationAddress: "Flughafen BER",
            passengerIds: ["ada", "grace", "katherine", "mary"],
            pickupAddress: "Chausseestraße 1",
          }}
          isOpen
          onClose={() => undefined}
          onSubmit={() => undefined}
        />
      </div>
    );
  }

  if (surface === "search") {
    return <SearchPreview />;
  }

  if (surface === "notifications") {
    return <NotificationsPreview />;
  }

  if (surface === "account-menu") {
    return <AccountMenuPreview />;
  }

  if (surface === "settings-feedback") {
    return (
      <WorkspaceFrame activeItem="settings">
        <div className="grid gap-6">
          {(["general", "notifications"] as CompanySettingsSectionId[]).map(
            (section, index) => (
              <CompanySettingsWorkspaceContent
                activeSection={section}
                copy={settingsCopy}
                errorMessage={index === 0 ? "Speichern fehlgeschlagen." : undefined}
                key={section}
                payload={index === 0 ? settingsPayload : settingsReadOnlyPayload}
                savingSection={null}
                successMessage={index === 1 ? "Gespeichert." : undefined}
              />
            ),
          )}
        </div>
      </WorkspaceFrame>
    );
  }

  if (surface === "finance-empty") {
    return (
      <WorkspaceFrame activeItem="finance">
        <CompanyFinanceWorkspaceContent
          copy={financeCopy}
          payload={financeEmptyPayload}
        />
      </WorkspaceFrame>
    );
  }

  return (
    <WorkspaceFrame activeItem="reports">
      <CompanyReportsWorkspaceContent
        copy={reportsCopy}
        payload={reportsEmptyPayload}
      />
    </WorkspaceFrame>
  );
}

export function CompanyWorkspacePr46LabBlock() {
  const [activeSurface, setActiveSurface] = useState<LabSurface>("dashboard");

  return (
    <div className="min-h-[860px] bg-[var(--taxis-ui-page-bg)]">
      <div className="border-b border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="taxis-company-page-eyebrow">TaxiOS v0 Lab sync</p>
            <h2 className="text-xl font-semibold text-[var(--taxis-workspace-text-strong)]">
              PR #46 visual source snapshot
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-[var(--taxis-workspace-text-muted)]">
              Mirrors TaxiOS.v2 main at 2698991c214595e17e0b3228dc84935b0b27fa76.
            </p>
          </div>
          <ThemeToggle variant="segmented" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {surfaces.map((surface) => (
            <button
              className={[
                "rounded-md border px-3 py-2 text-sm font-semibold transition",
                activeSurface === surface.id
                  ? "border-[var(--taxis-workspace-border-strong)] bg-[var(--taxis-workspace-ink)] text-[var(--taxis-workspace-surface)]"
                  : "border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] text-[var(--taxis-workspace-text-strong)] hover:border-[var(--taxis-workspace-border-strong)]",
              ].join(" ")}
              key={surface.id}
              onClick={() => setActiveSurface(surface.id)}
              type="button"
            >
              {surface.label}
            </button>
          ))}
        </div>
      </div>
      <SurfacePreview surface={activeSurface} />
    </div>
  );
}
