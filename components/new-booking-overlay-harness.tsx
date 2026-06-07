"use client";

import {
  NewBookingOverlay,
  type NewBookingOverlayCopy,
  type NewBookingOverlaySubmitData,
  type NewBookingPassengerOption,
} from "@taxios-v2/ui";

const newBookingCopy = {
  advanced: {
    summary: "Flug, Kontakt, Notizen und Serienfahrt",
    title: "Weitere Details",
  },
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
    livePlanSummary: "Route, Zeit, Gäste und Fahrzeuge bleiben sichtbar.",
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
  contact: {
    label: "Ansprechpartner",
    placeholder: "Ansprechpartner wählen",
    title: "Kontakt",
  },
  dateTime: {
    pickupDateLabel: "Abholdatum",
    pickupTimeLabel: "Abholzeit",
    quickNowLabel: "Jetzt",
    quickOneHourLabel: "+1h",
    quickThirtyMinutesLabel: "+30 Min",
    quickTomorrowMorningLabel: "Morgen 08:00",
    returnDateLabel: "Rückfahrtdatum",
    returnTimeLabel: "Rückfahrzeit",
    title: "Datum und Uhrzeit",
  },
  favorites: {
    emptyLabel: "Noch keine gespeicherten Routen.",
    saveCurrentLabel: "Aktuelle Route speichern",
    saveDisabledLabel:
      "Favoriten-Persistenz wird in einem Backend-Slice verbunden.",
    title: "Schnellrouten",
  },
  flight: {
    label: "Flugnummer",
    placeholder: "z. B. LH 203",
    title: "Fluginformation",
  },
  notes: {
    label: "Interne Notiz",
    placeholder: "Hinweise für Disposition",
    title: "Notizen",
  },
  passenger: {
    addCustomLabel: "Fahrgast hinzufügen",
    assignedLabel: "Zugewiesen",
    customNameLabel: "Weiterer Fahrgast",
    customNamePlaceholder: "Name",
    emptyLabel: "Noch keine Fahrgäste ausgewählt.",
    externalSummary:
      "Nur nutzen, wenn die Person nicht als Mitglied verfügbar ist.",
    externalTitle: "Externen Fahrgast hinzufügen",
    memberSearchLabel: "Mitglied suchen",
    memberSearchPlaceholder: "Name oder Team suchen",
    membersEmptyLabel: "Keine berechtigten Mitglieder verfügbar.",
    selectLabel: "Fahrgäste",
    title: "Fahrgäste",
    totalLabel: "Fahrgäste gesamt",
  },
  recurring: {
    disabledLabel: "Backend-Unterstützung offen",
    summary:
      "Serienfahrten bleiben in diesem Slice draft-only und werden nicht gespeichert.",
    title: "Serienfahrt einstellen",
  },
  review: {
    backLabel: "Zurück",
    changeContactLabel: "Kontakt ändern",
    changeDateTimeLabel: "Zeit ändern",
    changeNotesLabel: "Notizen ändern",
    changePassengerVehicleLabel: "Fahrzeuge ändern",
    changeRouteLabel: "Route ändern",
    nextLabel: "Weiter zur Übersicht",
    summary: "Prüfe Route, Zeit, Fahrgäste und Fahrzeug.",
    title: "Übersicht",
  },
  route: {
    destinationLabel: "Ziel",
    destinationPlaceholder: "Zieladresse",
    pickupLabel: "Abholung",
    pickupPlaceholder: "Abholadresse",
    returnPendingLabel:
      "Rückfahrt wird automatisch aus Abholung und Ziel erstellt.",
    returnPreviewLabel: "Rückfahrt",
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
  tripType: {
    outbound: "Hinfahrt",
    roundTrip: "Hin- und Rückfahrt",
    title: "Fahrttyp",
  },
  validation: {
    contactRequired: "Ansprechpartner ist erforderlich.",
    destinationRequired: "Ziel ist erforderlich.",
    googleAddressRequired:
      "Bitte eine Adresse aus den Google-Vorschlägen auswählen.",
    houseNumberRequired: "Bitte eine Google-Adresse mit Hausnummer auswählen.",
    overCapacity:
      "Ausgewähltes Fahrzeug hat nur {capacity} Plätze. Bitte weniger Fahrgäste auswählen.",
    passengerRequired: "Mindestens ein Fahrgast ist erforderlich.",
    pickupDateRequired: "Abholdatum ist erforderlich.",
    pickupRequired: "Abholung ist erforderlich.",
    pickupTimeRequired: "Abholzeit ist erforderlich.",
    returnDateRequired: "Rückfahrtdatum ist erforderlich.",
    returnTimeRequired: "Rückfahrzeit ist erforderlich.",
  },
  vehicle: {
    addVehicleLabel: "Weiteres Fahrzeug hinzufügen",
    assignedLabel: "Im Fahrzeug",
    assignSeatsModeLabel: "Mitglieder/Gäste zuweisen",
    capacityLabel: "Kapazität",
    cardDescriptionFallback: "Fahrzeugkategorie",
    emptySlotLabel: "Frei",
    externalPassengerLabel: "Gast",
    guestCountLabel: "Anzahl Gäste",
    guestCountModeLabel: "Nur Anzahl Gäste",
    inputModeLabel: "Fahrgastmodus",
    memberPassengerLabel: "Mitglied",
    overflowLabel: "Nicht zugewiesen",
    passengersPerVehicleLabel: "Personen pro Fahrzeug",
    remainingLabel: "{remaining} frei",
    removeVehicleLabel: "Fahrzeug löschen",
    slotClearLabel: "leeren",
    slotInputPlaceholder: "Name oder Mitglied suchen",
    slotLabel: "Platz {index}",
    slotSearchEmptyLabel:
      "Kein Mitglied gefunden. Wähle + Gast, um diese Person mitzunehmen.",
    slotSuggestionLabel: "Berechtigte Mitglieder",
    standardLabel: "Taxi (E-Klasse)",
    title: "Fahrzeug",
    typeLabel: "Fahrzeugtyp",
    typeSeatsLabel: "Plätze",
    vehicleCardLabel: "Fahrzeug {index}",
    vehiclesCalculatedLabel: "{count} Fahrzeuge geplant",
  },
} satisfies NewBookingOverlayCopy;

const passengers: NewBookingPassengerOption[] = [
  { id: "ada", name: "Ada Lovelace" },
  { id: "grace", name: "Grace Hopper" },
  { id: "katherine", name: "Katherine Johnson" },
  { id: "mary", name: "Mary Jackson" },
  { id: "dorothy", name: "Dorothy Vaughan" },
];

export function NewBookingOverlayHarness() {
  return (
    <NewBookingOverlay
      availablePassengers={passengers}
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
        passengerIds: ["ada", "grace"],
        pickupAddress: "Chausseestraße 1",
      }}
      isOpen
      isSubmitting={false}
      onClose={() => undefined}
      onSubmit={async (_data: NewBookingOverlaySubmitData) => undefined}
    />
  );
}
