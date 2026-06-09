/* =====================================================================
 * TaxiOS Rider App — Demo fixtures (German)
 *
 * Realistic mock payloads used by the registry lab block and previews.
 * These mirror the shape returned by backend tRPC view endpoints — the
 * UI never derives state or actions; everything (including locked
 * actions with reasons) is provided here.
 * ===================================================================== */

import type {
  RiderAccountPayload,
  RiderAppCopy,
  RiderBookingPayload,
  RiderConfirmationPayload,
  RiderHomePayload,
  RiderInboxPayload,
  RiderRidersPayload,
  RiderTrackingPayload,
  RiderTripDetail,
  RiderTripSummary,
  RiderTripsPayload,
} from "../../contracts/rider-app";

export const riderAppCopy: RiderAppCopy = {
  billedToPrefix: "Abgerechnet über",
  companyRideLabel: "Firmenfahrt",
  errorDescription:
    "Die Daten konnten nicht geladen werden. Bitte prüfe deine Verbindung und versuche es erneut.",
  errorTitle: "Etwas ist schiefgelaufen",
  loadingLabel: "Einen Moment, wir laden deine Daten …",
  personalRideLabel: "Privatfahrt",
  retryLabel: "Erneut versuchen",
  tabAccount: "Konto",
  tabHome: "Start",
  tabInbox: "Postfach",
  tabTrips: "Fahrten",
};

/* ---------------------------------------------------------------------
 * Trip summaries
 * ------------------------------------------------------------------- */

const tripNext: RiderTripSummary = {
  destinationAddress: "Messe Hamburg, Halle B6",
  kind: "company",
  passengerCountLabel: "2 Personen",
  pickupAddress: "Rödingsmarkt 14, 20459 Hamburg",
  pickupDateLabel: "Heute",
  pickupTimeLabel: "14:30",
  publicId: "FAHRT-8472",
  status: "driver_assigned",
  statusLabel: "Fahrer zugewiesen",
  tripId: "trip_8472",
  vehicleClassLabel: "Komfort",
  workspaceLabel: "HMSG GmbH",
};

const tripUpcomingAirport: RiderTripSummary = {
  destinationAddress: "Flughafen Hamburg, Terminal 2",
  kind: "company",
  passengerCountLabel: "1 Person",
  pickupAddress: "Alstertor 1, 20095 Hamburg",
  pickupDateLabel: "Morgen",
  pickupTimeLabel: "06:15",
  publicId: "FAHRT-8510",
  status: "confirmed",
  statusLabel: "Bestätigt",
  tripId: "trip_8510",
  vehicleClassLabel: "Van",
  workspaceLabel: "HMSG GmbH",
};

const tripUpcomingPrivate: RiderTripSummary = {
  destinationAddress: "Elbphilharmonie, Platz der Deutschen Einheit 1",
  kind: "personal",
  passengerCountLabel: "3 Personen",
  pickupAddress: "Mühlenkamp 8, 22303 Hamburg",
  pickupDateLabel: "Sa, 14. Juni",
  pickupTimeLabel: "19:00",
  publicId: "FAHRT-8533",
  status: "confirmed",
  statusLabel: "Bestätigt",
  tripId: "trip_8533",
  vehicleClassLabel: "Standard",
  workspaceLabel: null,
};

const tripPastOffice: RiderTripSummary = {
  destinationAddress: "Neuer Wall 50, 20354 Hamburg",
  kind: "company",
  passengerCountLabel: "1 Person",
  pickupAddress: "Bahnhof Dammtor, 20354 Hamburg",
  pickupDateLabel: "Mo, 9. Juni",
  pickupTimeLabel: "08:45",
  publicId: "FAHRT-8390",
  status: "completed",
  statusLabel: "Abgeschlossen",
  tripId: "trip_8390",
  vehicleClassLabel: "Komfort",
  workspaceLabel: "HMSG GmbH",
};

const tripPastDinner: RiderTripSummary = {
  destinationAddress: "Jungfernstieg 7, 20354 Hamburg",
  kind: "personal",
  passengerCountLabel: "2 Personen",
  pickupAddress: "Eppendorfer Baum 23, 20249 Hamburg",
  pickupDateLabel: "Fr, 6. Juni",
  pickupTimeLabel: "20:30",
  publicId: "FAHRT-8351",
  status: "completed",
  statusLabel: "Abgeschlossen",
  tripId: "trip_8351",
  vehicleClassLabel: "Standard",
  workspaceLabel: null,
};

const tripCancelled: RiderTripSummary = {
  destinationAddress: "Hauptbahnhof, Kirchenallee, 20099 Hamburg",
  kind: "company",
  passengerCountLabel: "1 Person",
  pickupAddress: "Speicherstadt, Am Sandtorkai 30",
  pickupDateLabel: "Mi, 4. Juni",
  pickupTimeLabel: "11:00",
  publicId: "FAHRT-8302",
  status: "cancelled",
  statusLabel: "Storniert",
  tripId: "trip_8302",
  vehicleClassLabel: "Komfort",
  workspaceLabel: "HMSG GmbH",
};

/* ---------------------------------------------------------------------
 * Home
 * ------------------------------------------------------------------- */

export const riderHomePayload: RiderHomePayload = {
  allowedActions: [{ id: "book_ride", label: "Fahrt buchen" }],
  greetingLabel: "Guten Tag, Lena",
  nextTrip: tripNext,
  quickActions: [
    {
      description: "Fahrer live verfolgen",
      id: "track_ride",
      label: "Live-Tracking",
    },
    { description: "Alle Fahrten ansehen", id: "trips", label: "Meine Fahrten" },
    { description: "Hilfe & Kontakt", id: "support", label: "Support" },
  ],
  upcomingTrips: [tripUpcomingAirport, tripUpcomingPrivate],
  workspace: {
    billedToLabel: "HMSG GmbH",
    workspaceLabel: "HMSG GmbH",
  },
};

export const riderHomeEmptyPayload: RiderHomePayload = {
  allowedActions: [{ id: "book_ride", label: "Fahrt buchen" }],
  greetingLabel: "Guten Tag, Lena",
  nextTrip: null,
  quickActions: riderHomePayload.quickActions,
  upcomingTrips: [],
  workspace: riderHomePayload.workspace,
};

/* ---------------------------------------------------------------------
 * Trips
 * ------------------------------------------------------------------- */

export const riderTripsPayload: RiderTripsPayload = {
  cancelledTrips: [tripCancelled],
  nextTrip: tripNext,
  pastTrips: [tripPastOffice, tripPastDinner],
  upcomingTrips: [tripUpcomingAirport, tripUpcomingPrivate],
};

export const riderTripsEmptyPayload: RiderTripsPayload = {
  cancelledTrips: [],
  nextTrip: null,
  pastTrips: [],
  upcomingTrips: [],
};

/* ---------------------------------------------------------------------
 * Trip detail — company ride where cancel is locked for non-bookers.
 * ------------------------------------------------------------------- */

export const riderTripDetailPayload: RiderTripDetail = {
  allowedActions: [
    { id: "remove_self_from_ride", label: "Mich aus Fahrt entfernen" },
    {
      disabled: true,
      id: "cancel_ride",
      label: "Fahrt stornieren",
      reason: "Nur der Besteller (M. Roth) kann diese Firmenfahrt stornieren.",
    },
    { id: "contact_support", label: "Support kontaktieren" },
  ],
  bookedByLabel: "Markus Roth (Office Management)",
  destinationAddress: "Messe Hamburg, Halle B6",
  history: [
    { id: "h1", label: "Fahrt gebucht", timestampLabel: "Heute, 09:12" },
    { id: "h2", label: "Bestätigt", timestampLabel: "Heute, 09:13" },
    { id: "h3", label: "Fahrer zugewiesen", timestampLabel: "Heute, 13:58" },
  ],
  isShared: true,
  kind: "company",
  noteLabel: "Bitte am Haupteingang Rödingsmarkt warten.",
  passengers: [
    { id: "p1", initials: "LK", isCurrentRider: true, name: "Lena Krüger" },
    { id: "p2", initials: "TS", name: "Tobias Schmidt" },
  ],
  pickupAddress: "Rödingsmarkt 14, 20459 Hamburg",
  pickupDateLabel: "Heute",
  pickupTimeLabel: "14:30",
  publicId: "FAHRT-8472",
  status: "driver_assigned",
  statusLabel: "Fahrer zugewiesen",
  tripId: "trip_8472",
  vehicleClassLabel: "Komfort (Mercedes E-Klasse)",
  viaAddress: "Ludwig-Erhard-Straße 20, 20459 Hamburg",
  workspace: {
    billedToLabel: "HMSG GmbH · Kostenstelle Vertrieb",
    workspaceLabel: "HMSG GmbH",
  },
};

/* ---------------------------------------------------------------------
 * Live tracking
 * ------------------------------------------------------------------- */

export const riderTrackingPayload: RiderTrackingPayload = {
  allowedActions: [
    { id: "call_driver", label: "Anrufen" },
    { id: "message_driver", label: "Chat" },
    { id: "share_trip", label: "Teilen" },
  ],
  destinationAddress: "Messe Hamburg, Halle B6",
  driver: {
    initials: "AY",
    licensePlate: "HH-TX 482",
    name: "Ali Yıldız",
    ratingLabel: "4,9",
    tripsLabel: "2.140 Fahrten",
    vehicleColorLabel: "Schwarzer",
    vehicleLabel: "Mercedes E-Klasse",
  },
  etaLabel: "Fahrer ist unterwegs",
  etaMinutes: 4,
  pickupAddress: "Rödingsmarkt 14, 20459 Hamburg",
  publicId: "FAHRT-8472",
  safetyHint:
    "Steig nur ein, wenn Kennzeichen und Name übereinstimmen: HH-TX 482, Ali Yıldız.",
  status: "enroute",
  statusLabel: "Unterwegs zu dir",
  steps: [
    { id: "s1", label: "Fahrt bestätigt", state: "done", timeLabel: "13:58" },
    { id: "s2", label: "Fahrer unterwegs", state: "active", timeLabel: "14:26" },
    { id: "s3", label: "Abholung", state: "upcoming", timeLabel: "14:30" },
    { id: "s4", label: "Ankunft am Ziel", state: "upcoming", timeLabel: "14:52" },
  ],
  tripId: "trip_8472",
};

/* ---------------------------------------------------------------------
 * Booking — now / schedule
 * ------------------------------------------------------------------- */

const vehicleOptions = [
  {
    capacityLabel: "bis 4",
    description: "Zuverlässig & günstig",
    id: "standard",
    label: "Standard",
  },
  {
    capacityLabel: "bis 4",
    description: "Mehr Komfort, neuere Fahrzeuge",
    id: "komfort",
    label: "Komfort",
  },
  {
    capacityLabel: "bis 6",
    description: "Mehr Platz für Gruppen & Gepäck",
    id: "van",
    label: "Van",
  },
  {
    capacityLabel: "bis 3",
    description: "Derzeit keine Fahrzeuge verfügbar",
    disabled: true,
    id: "electric",
    label: "Elektro",
    reason: "Aktuell nicht verfügbar",
  },
];

export const riderBookingNowPayload: RiderBookingPayload = {
  allowedActions: [
    { id: "continue_to_riders", label: "Weiter zu Fahrgästen" },
    { id: "contact_support", label: "Hilfe bei der Buchung" },
  ],
  mode: "now",
  riderSummaryLabel: "Geschätzte Wartezeit aktuell ca. 5 Min.",
  vehicleOptions,
  workspace: {
    billedToLabel: "HMSG GmbH",
    workspaceLabel: "HMSG GmbH",
  },
};

export const riderBookingSchedulePayload: RiderBookingPayload = {
  allowedActions: [{ id: "continue_to_riders", label: "Weiter zu Fahrgästen" }],
  mode: "schedule",
  riderSummaryLabel: "Geplante Fahrten sind bis 30 Min. vorher kostenlos stornierbar.",
  vehicleOptions,
  workspace: {
    billedToLabel: "HMSG GmbH",
    workspaceLabel: "HMSG GmbH",
  },
};

/* ---------------------------------------------------------------------
 * Riders / guests
 * ------------------------------------------------------------------- */

export const riderRidersPayload: RiderRidersPayload = {
  allowedActions: [
    { id: "request_ride", label: "Fahrt anfragen" },
    { id: "continue_to_riders", label: "Gast hinzufügen" },
  ],
  companyBookingAllowed: true,
  companyBookingHint:
    "Diese Fahrt wird über HMSG GmbH abgerechnet. Gäste reisen kostenfrei mit.",
  currentRider: { id: "p1", initials: "LK", name: "Lena Krüger" },
  guests: [
    { id: "g1", name: "Tobias Schmidt", phoneLabel: "+49 151 23456789" },
    { id: "g2", name: "Sara Bauer", phoneLabel: null },
  ],
};

export const riderRidersEmptyPayload: RiderRidersPayload = {
  allowedActions: [
    { id: "request_ride", label: "Fahrt anfragen" },
    { id: "continue_to_riders", label: "Gast hinzufügen" },
  ],
  companyBookingAllowed: false,
  companyBookingHint:
    "Für diese Fahrt ist keine Firmenabrechnung hinterlegt. Sie wird privat abgerechnet.",
  currentRider: { id: "p1", initials: "LK", name: "Lena Krüger" },
  guests: [],
};

/* ---------------------------------------------------------------------
 * Confirmation
 * ------------------------------------------------------------------- */

export const riderConfirmationPayload: RiderConfirmationPayload = {
  allowedActions: [
    { id: "track_ride", label: "Fahrt verfolgen" },
    { id: "book_another_ride", label: "Weitere Fahrt buchen" },
    { id: "contact_support", label: "Support kontaktieren" },
  ],
  destinationAddress: "Messe Hamburg, Halle B6",
  detailRows: [
    { id: "d1", label: "Abholzeit", value: "Heute, 14:30" },
    { id: "d2", label: "Fahrzeugklasse", value: "Komfort" },
    { id: "d3", label: "Fahrgäste", value: "2 Personen" },
    { id: "d4", label: "Abrechnung", value: "HMSG GmbH" },
  ],
  pickupAddress: "Rödingsmarkt 14, 20459 Hamburg",
  publicId: "FAHRT-8472",
};

/* ---------------------------------------------------------------------
 * Inbox
 * ------------------------------------------------------------------- */

export const riderInboxPayload: RiderInboxPayload = {
  liveChat: {
    allowedActions: [
      { id: "call_driver", label: "Anrufen" },
      { id: "message_driver", label: "Nachricht senden" },
    ],
    driver: riderTrackingPayload.driver,
    inputPlaceholder: "Nachricht an Ali schreiben …",
    isLive: true,
    messages: [
      {
        authorLabel: "Ali Yıldız",
        body: "Guten Tag, ich bin in 4 Minuten am Rödingsmarkt.",
        fromRider: false,
        id: "m1",
        timeLabel: "14:26",
      },
      {
        authorLabel: "Lena Krüger",
        body: "Perfekt, ich warte am Haupteingang.",
        fromRider: true,
        id: "m2",
        timeLabel: "14:27",
      },
      {
        authorLabel: "Ali Yıldız",
        body: "Alles klar, bis gleich!",
        fromRider: false,
        id: "m3",
        timeLabel: "14:27",
      },
    ],
    routeLabel: "Rödingsmarkt → Messe Hamburg",
    tripId: "trip_8472",
  },
  notifications: [
    {
      body: "Ali Yıldız ist dir zugewiesen und gleich am Abholort.",
      id: "n1",
      timeLabel: "14:26",
      title: "Fahrer zugewiesen",
      tone: "info",
      unread: true,
    },
    {
      body: "Bitte bestätige die Abholadresse für deine Fahrt morgen um 06:15.",
      id: "n2",
      timeLabel: "Gestern",
      title: "Aktion erforderlich",
      tone: "attention",
      unread: true,
    },
    {
      body: "Deine Fahrt FAHRT-8390 wurde erfolgreich abgeschlossen.",
      id: "n3",
      timeLabel: "Mo, 9. Juni",
      title: "Fahrt abgeschlossen",
      tone: "success",
      unread: false,
    },
  ],
};

export const riderInboxEmptyPayload: RiderInboxPayload = {
  liveChat: null,
  notifications: [],
};

/* ---------------------------------------------------------------------
 * Account
 * ------------------------------------------------------------------- */

export const riderAccountPayload: RiderAccountPayload = {
  allowedActions: [
    { id: "switch_workspace", label: "Wechseln" },
    { id: "open_notifications_settings", label: "Benachrichtigungen" },
    { id: "contact_support", label: "Support" },
    { id: "open_privacy", label: "Datenschutz" },
    { id: "sign_out", label: "Abmelden" },
  ],
  companyFields: [
    { id: "cf1", label: "Firma", value: "HMSG GmbH" },
    { id: "cf2", label: "Kostenstelle", value: "Vertrieb Nord" },
    { id: "cf3", label: "Reise-Richtlinie", value: "Komfort bis 50 km" },
  ],
  companyMemberLabel: "Mitarbeiterin",
  companyWorkspaceLabel: "HMSG GmbH",
  currentWorkspaceLabel: "HMSG GmbH",
  links: [
    {
      description: "Push, E-Mail & SMS verwalten",
      id: "open_notifications_settings",
      label: "Benachrichtigungen",
    },
    {
      description: "Hilfe-Center & Kontakt",
      id: "contact_support",
      label: "Support & Hilfe",
    },
    {
      description: "Daten & Einwilligungen",
      id: "open_privacy",
      label: "Datenschutz",
    },
  ],
  personalFields: [
    { id: "pf1", label: "Name", value: "Lena Krüger" },
    { id: "pf2", label: "E-Mail", value: "lena.krueger@hmsg.de" },
    { id: "pf3", label: "Telefon", value: "+49 151 98765432" },
    { id: "pf4", label: "Zahlungsart", value: "Firmenabrechnung" },
  ],
  profileInitials: "LK",
  profileName: "Lena Krüger",
  profileRoleLabel: "Fahrgast · HMSG GmbH",
};
