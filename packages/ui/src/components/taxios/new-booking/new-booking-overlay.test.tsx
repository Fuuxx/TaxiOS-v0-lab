import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";

import type {
  NewBookingAddressAutocompleteController,
  NewBookingOverlayCopy,
} from "../../../contracts/new-booking";
import { NewBookingOverlay } from "./new-booking-overlay";
import { deriveNewBookingSubmitPayload } from "./new-booking-validation";

const copy = {
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
    title: "Favoriten",
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
      "Serienfahrten werden in einem späteren Backend-Slice verdrahtet.",
    title: "Serienfahrt einstellen",
  },
  review: {
    backLabel: "Zurueck",
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
    assignedLabel: "Im Fahrzeug",
    capacityLabel: "Kapazitaet",
    cardDescriptionFallback: "Fahrzeugkategorie",
    externalPassengerLabel: "Gast",
    emptySlotLabel: "Frei",
    memberPassengerLabel: "Mitglied",
    overflowLabel: "Nicht zugewiesen",
    remainingLabel: "{remaining} frei",
    slotClearLabel: "leeren",
    slotInputPlaceholder: "Name oder Mitglied suchen",
    slotLabel: "Platz {index}",
    slotSearchEmptyLabel:
      "Kein Mitglied gefunden. Waehle + Gast, um diese Person mitzunehmen.",
    slotSuggestionLabel: "Berechtigte Mitglieder",
    standardLabel: "Taxi (E-Klasse)",
    title: "Fahrzeug",
    typeLabel: "Fahrzeugtyp",
    typeSeatsLabel: "Plätze",
    addVehicleLabel: "Weiteres Fahrzeug hinzufügen",
    assignSeatsModeLabel: "Mitglieder/Gäste zuweisen",
    guestCountLabel: "Anzahl Gäste",
    guestCountModeLabel: "Nur Anzahl Gäste",
    inputModeLabel: "Fahrgastmodus",
    passengersPerVehicleLabel: "Personen pro Fahrzeug",
    removeVehicleLabel: "Fahrzeug löschen",
    vehicleCardLabel: "Fahrzeug {index}",
    vehiclesCalculatedLabel: "{count} Fahrzeuge geplant",
  },
} satisfies NewBookingOverlayCopy;

const passengers = [
  { id: "ada", name: "Ada Lovelace" },
  { id: "grace", name: "Grace Hopper" },
  { id: "katherine", name: "Katherine Johnson" },
  { id: "mary", name: "Mary Jackson" },
  { id: "dorothy", name: "Dorothy Vaughan" },
];

afterEach(() => {
  vi.useRealTimers();
});

describe("NewBookingOverlay", () => {
  test("renders the booking cockpit status bar and live plan", () => {
    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getAllByText("Route offen").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Zeit offen").length).toBeGreaterThan(0);
    expect(screen.getAllByText("0 Fahrgäste").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1 Fahrzeug").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Live-Plan" })).not.toBeNull();

    const outboundTripType = screen.getByRole("radio", { name: "Hinfahrt" });
    const roundTripType = screen.getByRole("radio", {
      name: "Hin- und Rückfahrt",
    });
    expect(outboundTripType.closest("div")?.className).toContain(
      "taxis-segmented-track",
    );
    expect(outboundTripType.closest("label")?.className).toContain(
      "bg-[var(--taxis-workspace-control-dark)]",
    );
    expect(outboundTripType.closest("label")?.className).toContain(
      "taxis-segmented-active",
    );
    expect(roundTripType.closest("label")?.className).toContain(
      "text-[var(--taxis-workspace-text-secondary)]",
    );
    expect(roundTripType.closest("label")?.className).toContain(
      "taxis-segmented-item",
    );
  });

  test("applies quick pickup time actions", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-01T08:15:00"));
    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Morgen 08:00" }));

    // Pickup date renders in the German display format (TT.MM.JJJJ); the
    // form still stores the canonical "2026-06-02" behind the field.
    expect(
      (screen.getByLabelText("Abholdatum") as HTMLInputElement).value,
    ).toBe("02.06.2026");
    expect((screen.getByLabelText("Abholzeit") as HTMLInputElement).value).toBe(
      "08:00",
    );
  });

  test("selects vehicle categories from command cards", async () => {
    const user = userEvent.setup();

    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const estateRadio = screen.getByRole("radio", {
      name: /Kombi \/ Touran 4 Plätze Mehr Gepäck/i,
    });

    expect(
      screen.queryByText("Mindestens ein Fahrgast ist erforderlich."),
    ).toBeNull();

    await user.click(estateRadio);

    expect(screen.getAllByText("Kombi / Touran").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Mehr Gepäck").length).toBeGreaterThan(0);
    expect(
      screen.queryByText("Mindestens ein Fahrgast ist erforderlich."),
    ).toBeNull();
    expect(estateRadio.closest("label")?.className).not.toContain("outline");
    expect(estateRadio.closest("label")?.className).not.toContain(
      "control-dark",
    );
    const selectedVehicleCard = estateRadio.closest("label");
    expect(selectedVehicleCard?.className).toContain(
      "bg-[var(--taxis-workspace-accent-soft)]",
    );
    expect(selectedVehicleCard?.className).toContain(
      "shadow-[inset_0_0_0_1px_var(--taxis-workspace-accent-ring)]",
    );
    expect(selectedVehicleCard?.className).not.toContain("bg-white");

    const overlay = screen.getByTestId("new-booking-overlay");
    const overlayForm = overlay.querySelector("form");
    const overlayBackdrop = overlay.querySelector("button[tabindex='-1']");
    const dialog = screen.getByRole("dialog");
    const overlayHeader = dialog.querySelector("header");
    const overlayFooter = screen.getByRole("contentinfo");

    expect(overlayBackdrop?.className).not.toContain("backdrop-blur");
    expect(overlayBackdrop?.className).toContain(
      "taxis-workspace-wizard-backdrop",
    );
    expect(dialog.className).toContain("taxis-workspace-wizard-panel");
    expect(dialog.className).not.toContain("backdrop-blur");
    expect(dialog.className).not.toMatch(
      /bg-white\/|border-white|border-zinc|shadow-\[-|shadow-\[0_/,
    );
    expect(overlayHeader?.className).toContain(
      "taxis-workspace-wizard-header",
    );
    expect(overlayHeader?.className).not.toMatch(/bg-white\/|border-zinc/);
    expect(overlayForm?.className).toContain("taxis-workspace-wizard-form");
    expect(overlayFooter.className).toContain(
      "taxis-workspace-wizard-footer",
    );
    expect(overlayFooter.className).not.toContain("sticky");
    expect(overlayFooter.className).not.toContain("backdrop-blur");
    expect(overlayFooter.className).not.toMatch(/bg-white\/|border-zinc/);
  });

  test("review change actions return to the matching cockpit section", async () => {
    const user = userEvent.setup();

    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: "Platz 1" }), "Ada");
    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));
    await user.type(screen.getByPlaceholderText("Abholadresse"), "Office");
    await user.type(screen.getByPlaceholderText("Zieladresse"), "BER");
    await user.type(screen.getByLabelText("Abholdatum"), "01.06.2026");
    await user.type(screen.getByLabelText("Abholzeit"), "09:30");
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );

    expect(screen.getByRole("heading", { name: "Übersicht" })).not.toBeNull();

    await user.click(screen.getByRole("button", { name: "Route ändern" }));

    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByPlaceholderText("Abholadresse"),
      );
    });
  });

  test("assigns authorized members and explicit guests through vehicle seats", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.queryByText("Fahrgäste gesamt")).toBeNull();

    await user.type(screen.getByRole("textbox", { name: "Platz 1" }), "Ada");
    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));
    await user.type(
      screen.getByRole("textbox", { name: "Platz 2" }),
      "Guest One",
    );

    expect(screen.getByText("2 frei")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "+ Gast: Guest One" }));

    expect(screen.getByText("1 frei")).not.toBeNull();

    await user.type(screen.getByPlaceholderText("Abholadresse"), "Office");
    await user.type(screen.getByPlaceholderText("Zieladresse"), "BER");
    await user.type(screen.getByLabelText("Abholdatum"), "01.06.2026");
    await user.type(screen.getByLabelText("Abholzeit"), "09:30");
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );

    expect(screen.getByRole("heading", { name: "Übersicht" })).not.toBeNull();
    expect(screen.getAllByText("Ada Lovelace").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Guest One").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Buchung erstellen" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        passengers: [
          { kind: "member", memberId: "ada", name: "Ada Lovelace" },
          { kind: "guest", name: "Guest One" },
        ],
        passengerNames: ["Ada Lovelace", "Guest One"],
      }),
    );
  });

  test("keeps free text as search draft until the guest action is selected", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <NewBookingOverlay
        availablePassengers={passengers.slice(0, 1)}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Platz 1" }),
      "Guest One",
    );

    expect(screen.getByText("3 frei")).not.toBeNull();
    expect(
      screen.getByText(
        "Kein Mitglied gefunden. Waehle + Gast, um diese Person mitzunehmen.",
      ),
    ).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "+ Gast: Guest One" }),
    ).not.toBeNull();

    await user.type(screen.getByPlaceholderText("Abholadresse"), "Office");
    await user.type(screen.getByPlaceholderText("Zieladresse"), "BER");
    await user.type(screen.getByLabelText("Abholdatum"), "01.06.2026");
    await user.type(screen.getByLabelText("Abholzeit"), "09:30");
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );

    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText("Mindestens ein Fahrgast ist erforderlich."),
    ).not.toBeNull();

    await user.click(screen.getByRole("button", { name: "+ Gast: Guest One" }));
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );

    expect(screen.getByRole("heading", { name: "Übersicht" })).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Buchung erstellen" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        passengers: [{ kind: "guest", name: "Guest One" }],
        passengerNames: ["Guest One"],
      }),
    );
  });

  test("prefills fastbooking route and selected members into vehicle seats", () => {
    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        initialDraft={{
          destinationAddress: "BER Terminal 1",
          passengerIds: ["ada", "grace", "katherine", "mary"],
          pickupAddress: "Office",
        }}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      (screen.getByPlaceholderText("Abholadresse") as HTMLInputElement).value,
    ).toBe("Office");
    expect(
      (screen.getByPlaceholderText("Zieladresse") as HTMLInputElement).value,
    ).toBe("BER Terminal 1");
    expect(
      (screen.getByRole("textbox", { name: "Platz 1" }) as HTMLInputElement)
        .value,
    ).toBe("Ada Lovelace");
    expect(
      (screen.getByRole("textbox", { name: "Platz 2" }) as HTMLInputElement)
        .value,
    ).toBe("Grace Hopper");
    expect(
      (screen.getByRole("textbox", { name: "Platz 3" }) as HTMLInputElement)
        .value,
    ).toBe("Katherine Johnson");
    expect(screen.queryByRole("textbox", { name: "Platz 4" })).toBeNull();
    expect(
      (
        screen.getByRole("textbox", {
          name: "Fahrzeug 2 Platz 1",
        }) as HTMLInputElement
      ).value,
    ).toBe("Mary Jackson");
  });

  test("renders supported vehicle categories and their capacities", async () => {
    const user = userEvent.setup();

    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("option", { name: "Taxi (E-Klasse)" }),
    ).not.toBeNull();
    expect(
      screen.getByRole("option", { name: "Kombi / Touran" }),
    ).not.toBeNull();
    expect(
      screen.getByRole("option", { name: "VIP Shuttle (S-Klasse/A8 Lang)" }),
    ).not.toBeNull();
    expect(
      screen.getByRole("option", { name: "Vito Grossraumtaxi" }),
    ).not.toBeNull();
    expect(screen.getByRole("textbox", { name: "Platz 1" })).not.toBeNull();
    expect(screen.getByRole("textbox", { name: "Platz 3" })).not.toBeNull();
    expect(screen.queryByRole("textbox", { name: "Platz 4" })).toBeNull();
    expect(
      screen.queryByRole("textbox", { name: "Fahrzeug 2 Platz 1" }),
    ).toBeNull();

    await user.selectOptions(
      screen.getByLabelText("Fahrzeug 1 Fahrzeugtyp"),
      "vito",
    );

    expect(screen.getByRole("textbox", { name: "Platz 8" })).not.toBeNull();
  });

  test("adds and removes another vehicle for manual seat assignment", async () => {
    const user = userEvent.setup();

    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Weiteres Fahrzeug hinzufügen" }),
    );

    expect(screen.getByText("Fahrzeug 2")).not.toBeNull();
    expect(
      screen.getByRole("textbox", { name: "Fahrzeug 2 Platz 1" }),
    ).not.toBeNull();
    expect(screen.queryByText("Fahrzeug löschen")).toBeNull();

    await user.selectOptions(
      screen.getByLabelText("Fahrzeug 2 Fahrzeugtyp"),
      "vito",
    );

    expect(
      screen.getByRole("textbox", { name: "Fahrzeug 2 Platz 8" }),
    ).not.toBeNull();

    await user.click(
      screen.getByRole("button", { name: "Fahrzeug 2 Fahrzeug löschen" }),
    );

    expect(screen.queryByText("Fahrzeug 2")).toBeNull();
    expect(
      screen.queryByRole("textbox", { name: "Fahrzeug 2 Platz 1" }),
    ).toBeNull();
  });

  test("submits manual vehicle requests with the type selected on each card", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Weiteres Fahrzeug hinzufügen" }),
    );
    await user.click(
      screen.getByRole("radio", {
        name: /Fahrzeug 2 Fahrzeugkarten Vito Grossraumtaxi 8 Plätze Bis 8 Gäste/i,
      }),
    );
    await user.type(screen.getByRole("textbox", { name: "Platz 1" }), "Ada");
    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));
    const secondVehicleFirstSlot = screen.getByRole("textbox", {
      name: "Fahrzeug 2 Platz 1",
    });
    await user.click(secondVehicleFirstSlot);
    await user.type(secondVehicleFirstSlot, "Grace");
    const secondVehicleFirstSlotCard =
      secondVehicleFirstSlot.parentElement?.parentElement;
    if (!secondVehicleFirstSlotCard) {
      throw new Error("Expected the second vehicle seat card to render.");
    }
    const graceSuggestion = await within(secondVehicleFirstSlotCard).findByRole(
      "button",
      {
        name: /Grace Hopper/,
      },
    );
    fireEvent.click(graceSuggestion);
    await waitFor(() => {
      expect(
        (
          screen.getByRole("textbox", {
            name: "Fahrzeug 2 Platz 1",
          }) as HTMLInputElement
        ).value,
      ).toBe("Grace Hopper");
    });
    await user.type(screen.getByPlaceholderText("Abholadresse"), "Office");
    await user.type(screen.getByPlaceholderText("Zieladresse"), "BER");
    await user.type(screen.getByLabelText("Abholdatum"), "01.06.2026");
    await user.type(screen.getByLabelText("Abholzeit"), "09:30");
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );
    await user.click(screen.getByRole("button", { name: "Buchung erstellen" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        vehicleRequests: [
          expect.objectContaining({
            capacity: 3,
            passengers: [
              { kind: "member", memberId: "ada", name: "Ada Lovelace" },
            ],
            vehicleTypeId: "standard",
          }),
          expect.objectContaining({
            capacity: 8,
            passengers: [
              { kind: "member", memberId: "grace", name: "Grace Hopper" },
            ],
            vehicleTypeId: "vito",
          }),
        ],
        vehicleTypeId: "standard",
      }),
    );
  });

  test("splits fastbooking drafts with more than three members over multiple vehicles", () => {
    const sevenPassengers = [
      ...passengers,
      { id: "annie", name: "Annie Easley" },
      { id: "evelyn", name: "Evelyn Boyd Granville" },
    ];

    render(
      <NewBookingOverlay
        availablePassengers={sevenPassengers}
        copy={copy}
        favoriteRoutes={[]}
        initialDraft={{
          destinationAddress: "BER Terminal 1",
          passengerIds: [
            "ada",
            "grace",
            "katherine",
            "mary",
            "dorothy",
            "annie",
            "evelyn",
          ],
          pickupAddress: "Office",
        }}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      (screen.getByRole("textbox", { name: "Platz 3" }) as HTMLInputElement)
        .value,
    ).toBe("Katherine Johnson");
    expect(
      (
        screen.getByRole("textbox", {
          name: "Fahrzeug 2 Platz 1",
        }) as HTMLInputElement
      ).value,
    ).toBe("Mary Jackson");
    expect(
      (
        screen.getByRole("textbox", {
          name: "Fahrzeug 2 Platz 2",
        }) as HTMLInputElement
      ).value,
    ).toBe("Dorothy Vaughan");
    expect(
      (
        screen.getByRole("textbox", {
          name: "Fahrzeug 2 Platz 3",
        }) as HTMLInputElement
      ).value,
    ).toBe("Annie Easley");
    expect(
      (
        screen.getByRole("textbox", {
          name: "Fahrzeug 3 Platz 1",
        }) as HTMLInputElement
      ).value,
    ).toBe("Evelyn Boyd Granville");
  });

  test("keeps invalid required fields from reaching submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <NewBookingOverlay
        availablePassengers={passengers.slice(0, 1)}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: "Platz 1" }), "Ada");
    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Abholung ist erforderlich.")).not.toBeNull();
    expect(screen.getByText("Ziel ist erforderlich.")).not.toBeNull();
  });

  test("closes with Escape and restores the caller through onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={onClose}
        onSubmit={vi.fn()}
      />,
    );

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("offers only outbound or round trip and mirrors the return route preview", async () => {
    const user = userEvent.setup();

    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.queryByText("Einfache Rückfahrt")).toBeNull();

    await user.click(screen.getByLabelText("Hin- und Rückfahrt"));
    await user.type(screen.getByPlaceholderText("Abholadresse"), "Office");
    await user.type(screen.getByPlaceholderText("Zieladresse"), "BER");

    expect(screen.getByText("Rückfahrt")).not.toBeNull();
    expect(screen.getByText("BER -> Office")).not.toBeNull();
  });

  test("shows the detailed review step before submitting", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <NewBookingOverlay
        availablePassengers={passengers.slice(0, 1)}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByPlaceholderText("Abholadresse"), "Office");
    await user.type(screen.getByPlaceholderText("Zieladresse"), "BER");
    await user.type(screen.getByLabelText("Abholdatum"), "01.06.2026");
    await user.type(screen.getByLabelText("Abholzeit"), "09:30");
    await user.type(screen.getByRole("textbox", { name: "Platz 1" }), "Ada");
    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );

    expect(screen.getByRole("heading", { name: "Übersicht" })).not.toBeNull();
    expect(
      screen.getByText((content) => content.includes("Office")),
    ).not.toBeNull();
    expect(
      screen.getByText((content) => content.includes("BER")),
    ).not.toBeNull();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Buchung erstellen" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test("creates guest count vehicle requests with generated guest names", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByLabelText("Nur Anzahl Gäste"));
    await user.clear(screen.getByLabelText("Anzahl Gäste"));
    await user.type(screen.getByLabelText("Anzahl Gäste"), "8");
    await user.clear(screen.getByLabelText("Personen pro Fahrzeug"));
    await user.type(screen.getByLabelText("Personen pro Fahrzeug"), "3");
    await user.type(screen.getByPlaceholderText("Abholadresse"), "Office");
    await user.type(screen.getByPlaceholderText("Zieladresse"), "BER");
    await user.type(screen.getByLabelText("Abholdatum"), "01.06.2026");
    await user.type(screen.getByLabelText("Abholzeit"), "09:30");
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );

    expect(screen.getByText("3 Fahrzeuge geplant")).not.toBeNull();
    expect(screen.getAllByText("Fahrzeug 2").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Buchung erstellen" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        passengerInputMode: "guest_count",
        passengerNames: [
          "Gast 1",
          "Gast 2",
          "Gast 3",
          "Gast 4",
          "Gast 5",
          "Gast 6",
          "Gast 7",
          "Gast 8",
        ],
        vehicleRequests: [
          expect.objectContaining({
            capacity: 3,
            ordinal: 1,
            passengers: [
              { kind: "guest", name: "Gast 1" },
              { kind: "guest", name: "Gast 2" },
              { kind: "guest", name: "Gast 3" },
            ],
            vehicleTypeId: "standard",
          }),
          expect.objectContaining({
            capacity: 3,
            ordinal: 2,
            passengers: [
              { kind: "guest", name: "Gast 4" },
              { kind: "guest", name: "Gast 5" },
              { kind: "guest", name: "Gast 6" },
            ],
            vehicleTypeId: "standard",
          }),
          expect.objectContaining({
            capacity: 3,
            ordinal: 3,
            passengers: [
              { kind: "guest", name: "Gast 7" },
              { kind: "guest", name: "Gast 8" },
            ],
            vehicleTypeId: "standard",
          }),
        ],
      }),
    );
  });

  test("creates one Vito request for eight generated guests", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByLabelText("Nur Anzahl Gäste"));
    await user.selectOptions(screen.getByLabelText("Fahrzeugtyp"), "vito");
    await user.clear(screen.getByLabelText("Anzahl Gäste"));
    await user.type(screen.getByLabelText("Anzahl Gäste"), "8");
    await user.clear(screen.getByLabelText("Personen pro Fahrzeug"));
    await user.type(screen.getByLabelText("Personen pro Fahrzeug"), "8");
    await user.type(screen.getByPlaceholderText("Abholadresse"), "Office");
    await user.type(screen.getByPlaceholderText("Zieladresse"), "BER");
    await user.type(screen.getByLabelText("Abholdatum"), "01.06.2026");
    await user.type(screen.getByLabelText("Abholzeit"), "09:30");
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );
    await user.click(screen.getByRole("button", { name: "Buchung erstellen" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        passengerInputMode: "guest_count",
        vehicleRequests: [
          expect.objectContaining({
            capacity: 8,
            ordinal: 1,
            passengers: [
              { kind: "guest", name: "Gast 1" },
              { kind: "guest", name: "Gast 2" },
              { kind: "guest", name: "Gast 3" },
              { kind: "guest", name: "Gast 4" },
              { kind: "guest", name: "Gast 5" },
              { kind: "guest", name: "Gast 6" },
              { kind: "guest", name: "Gast 7" },
              { kind: "guest", name: "Gast 8" },
            ],
            vehicleTypeId: "vito",
          }),
        ],
        vehicleTypeId: "vito",
      }),
    );
  });

  test("applies saved route presets without rendering a fake save action", async () => {
    const user = userEvent.setup();

    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[
          {
            destinationAddress: "BER Terminal 1",
            id: "airport",
            pickupAddress: "Office",
            title: "Airport",
          },
        ]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.queryByText("Aktuelle Route speichern")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Airport" }));

    expect(
      (screen.getByPlaceholderText("Abholadresse") as HTMLInputElement).value,
    ).toBe("Office");
    expect(
      (screen.getByPlaceholderText("Zieladresse") as HTMLInputElement).value,
    ).toBe("BER Terminal 1");
  });

  test("keeps browser autofill disabled for route autocomplete inputs", () => {
    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByPlaceholderText("Abholadresse").getAttribute("autocomplete"),
    ).toBe("off");
    expect(
      screen.getByPlaceholderText("Zieladresse").getAttribute("autocomplete"),
    ).toBe("off");
  });

  test("requires Google address selections before opening the review", async () => {
    const user = userEvent.setup();
    const addressAutocomplete = {
      getSuggestions: vi.fn(async () => []),
      resolveSuggestion: vi.fn(),
    } satisfies NewBookingAddressAutocompleteController;

    render(
      <NewBookingOverlay
        addressAutocomplete={addressAutocomplete}
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    await user.type(screen.getByPlaceholderText("Abholadresse"), "Office 1");
    await user.type(screen.getByPlaceholderText("Zieladresse"), "Airport 1");
    await user.type(screen.getByRole("textbox", { name: "Platz 1" }), "Ada");
    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));
    await user.type(screen.getByLabelText("Abholdatum"), "01.06.2026");
    await user.type(screen.getByLabelText("Abholzeit"), "09:30");
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );

    expect(screen.getAllByText(copy.validation.googleAddressRequired)).toHaveLength(
      2,
    );
    expect(
      screen.queryByRole("button", { name: "Buchung erstellen" }),
    ).toBeNull();
  });

  test("requires a house number in selected Google address metadata", async () => {
    const user = userEvent.setup();
    const addressAutocomplete = {
      getSuggestions: vi.fn(async (_input, field) => [
        {
          id: `${field}-place`,
          mainText:
            field === "pickup"
              ? "Unter den Linden"
              : "Melli-Beese-Ring 1",
        },
      ]),
      resolveSuggestion: vi.fn(async (suggestion) =>
        suggestion.id.startsWith("pickup")
          ? {
              addressComponents: [
                {
                  longText: "Unter den Linden",
                  shortText: "Unter den Linden",
                  types: ["route"],
                },
              ],
              displayName: "Unter den Linden",
              formattedAddress: "Unter den Linden, Berlin",
              latitude: 52.5163,
              longitude: 13.3777,
              placeId: "pickup-route-only",
              provider: "google_maps" as const,
            }
          : {
              addressComponents: [
                { longText: "1", shortText: "1", types: ["street_number"] },
                {
                  longText: "Melli-Beese-Ring",
                  shortText: "Melli-Beese-Ring",
                  types: ["route"],
                },
              ],
              displayName: "Melli-Beese-Ring 1",
              formattedAddress: "Melli-Beese-Ring 1, Schonefeld",
              latitude: 52.3667,
              longitude: 13.5033,
              placeId: "destination-with-number",
              provider: "google_maps" as const,
            },
      ),
    } satisfies NewBookingAddressAutocompleteController;

    render(
      <NewBookingOverlay
        addressAutocomplete={addressAutocomplete}
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    await user.type(screen.getByPlaceholderText("Abholadresse"), "Unter");
    await user.click(await screen.findByRole("option", { name: /Unter/i }));
    await user.type(screen.getByPlaceholderText("Zieladresse"), "Melli");
    await user.click(await screen.findByRole("option", { name: /Melli/i }));
    await user.type(screen.getByRole("textbox", { name: "Platz 1" }), "Ada");
    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));
    await user.type(screen.getByLabelText("Abholdatum"), "01.06.2026");
    await user.type(screen.getByLabelText("Abholzeit"), "09:30");
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );

    expect(screen.getByText(copy.validation.houseNumberRequired)).not.toBeNull();
    expect(
      screen.queryByRole("button", { name: "Buchung erstellen" }),
    ).toBeNull();
  });

  test("shows verified address status and only marks route ready after both Google addresses are valid", async () => {
    const user = userEvent.setup();
    const addressAutocomplete = {
      getSuggestions: vi.fn(async (_input, field) => [
        {
          id: `${field}-place`,
          mainText:
            field === "pickup" ? "Invalidenstraße 1" : "Melli-Beese-Ring 1",
          secondaryText: field === "pickup" ? "Berlin" : "Schonefeld",
        },
      ]),
      resolveSuggestion: vi.fn(async (suggestion) =>
        suggestion.id.startsWith("pickup")
          ? {
              addressComponents: [
                { longText: "1", shortText: "1", types: ["street_number"] },
                {
                  longText: "Invalidenstraße",
                  shortText: "Invalidenstraße",
                  types: ["route"],
                },
              ],
              displayName: "Invalidenstraße 1",
              formattedAddress: "Invalidenstraße 1, Berlin",
              latitude: 52.531,
              longitude: 13.383,
              placeId: "pickup-valid",
              provider: "google_maps" as const,
            }
          : {
              addressComponents: [
                { longText: "1", shortText: "1", types: ["street_number"] },
                {
                  longText: "Melli-Beese-Ring",
                  shortText: "Melli-Beese-Ring",
                  types: ["route"],
                },
              ],
              displayName: "Melli-Beese-Ring 1",
              formattedAddress: "Melli-Beese-Ring 1, Schonefeld",
              latitude: 52.3667,
              longitude: 13.5033,
              placeId: "destination-valid",
              provider: "google_maps" as const,
            },
      ),
    } satisfies NewBookingAddressAutocompleteController;

    render(
      <NewBookingOverlay
        addressAutocomplete={addressAutocomplete}
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        requireVerifiedAddresses
      />,
    );

    await user.type(screen.getByPlaceholderText("Abholadresse"), "Invaliden");
    await user.click(
      await screen.findByRole("option", { name: /Invalidenstraße 1/i }),
    );
    await user.type(screen.getByPlaceholderText("Zieladresse"), "Melli");

    expect(screen.getAllByText(copy.addressVerification.googleSelectedLabel)).toHaveLength(
      1,
    );
    expect(
      screen.getAllByText(copy.addressVerification.houseNumberDetectedLabel),
    ).toHaveLength(1);
    expect(screen.getAllByText("Route offen").length).toBeGreaterThan(0);
    expect(screen.queryByText("Route bereit")).toBeNull();

    await user.click(
      await screen.findByRole("option", { name: /Melli-Beese-Ring 1/i }),
    );

    expect(screen.getAllByText(copy.addressVerification.googleSelectedLabel)).toHaveLength(
      2,
    );
    expect(
      screen.getAllByText(copy.addressVerification.houseNumberDetectedLabel),
    ).toHaveLength(2);
    expect(screen.getByText("Route bereit")).not.toBeNull();
  });

  test("shows missing house number status immediately after selecting a route-only Google result", async () => {
    const user = userEvent.setup();
    const addressAutocomplete = {
      getSuggestions: vi.fn(async () => [
        {
          id: "pickup-place",
          mainText: "Unter den Linden",
          secondaryText: "Berlin",
        },
      ]),
      resolveSuggestion: vi.fn(async () => ({
        addressComponents: [
          {
            longText: "Unter den Linden",
            shortText: "Unter den Linden",
            types: ["route"],
          },
        ],
        displayName: "Unter den Linden",
        formattedAddress: "Unter den Linden, Berlin",
        latitude: 52.5163,
        longitude: 13.3777,
        placeId: "pickup-route-only",
        provider: "google_maps" as const,
      })),
    } satisfies NewBookingAddressAutocompleteController;

    render(
      <NewBookingOverlay
        addressAutocomplete={addressAutocomplete}
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        requireVerifiedAddresses
      />,
    );

    await user.type(screen.getByPlaceholderText("Abholadresse"), "Unter");
    await user.click(await screen.findByRole("option", { name: /Unter/i }));

    expect(
      screen.getByText(copy.addressVerification.missingHouseNumberLabel),
    ).not.toBeNull();
  });

  test("shows address verification unavailable status when Google suggestions fail", async () => {
    const user = userEvent.setup();
    const addressAutocomplete = {
      getSuggestions: vi.fn(async () => {
        throw new Error("Google unavailable");
      }),
      resolveSuggestion: vi.fn(),
    } satisfies NewBookingAddressAutocompleteController;

    render(
      <NewBookingOverlay
        addressAutocomplete={addressAutocomplete}
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        requireVerifiedAddresses
      />,
    );

    await user.type(screen.getByPlaceholderText("Abholadresse"), "Invaliden");

    expect(
      await screen.findByText(copy.addressVerification.unavailableLabel),
    ).not.toBeNull();
  });

  test("selects address autocomplete suggestions with the keyboard and submits place metadata", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const addressAutocomplete = {
      getSuggestions: vi.fn(async (_input, field) =>
        field === "pickup"
          ? [
              {
                id: "pickup-1",
                mainText: "Berlin Central Office",
                secondaryText: "Invalidenstraße 1, Berlin",
              },
              {
                id: "pickup-2",
                mainText: "Berlin Hauptbahnhof",
                secondaryText: "Europaplatz 1, Berlin",
              },
            ]
          : [
              {
                id: "destination-1",
                mainText: "Melli-Beese-Ring 1",
                secondaryText: "Schonefeld",
              },
            ],
      ),
      resolveSuggestion: vi.fn(async (suggestion) =>
        suggestion.id === "destination-1"
          ? {
              addressComponents: [
                { longText: "1", shortText: "1", types: ["street_number"] },
                {
                  longText: "Melli-Beese-Ring",
                  shortText: "Melli-Beese-Ring",
                  types: ["route"],
                },
              ],
              displayName: "Melli-Beese-Ring 1",
              formattedAddress: "Melli-Beese-Ring 1, Schonefeld",
              latitude: 52.3667,
              longitude: 13.5033,
              placeId: "google-place-ber",
              provider: "google_maps" as const,
            }
          : {
              addressComponents: [
                { longText: "1", shortText: "1", types: ["street_number"] },
                {
                  longText: "Europaplatz",
                  shortText: "Europaplatz",
                  types: ["route"],
                },
              ],
              displayName: "Berlin Hauptbahnhof",
              formattedAddress: "Europaplatz 1, 10557 Berlin",
              latitude: 52.5251,
              longitude: 13.3694,
              placeId: "google-place-berlin-hbf",
              provider: "google_maps" as const,
            },
      ),
    } satisfies NewBookingAddressAutocompleteController;

    render(
      <NewBookingOverlay
        addressAutocomplete={addressAutocomplete}
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    const pickupInput = screen.getByPlaceholderText("Abholadresse");
    await user.type(pickupInput, "Berlin");
    await screen.findByRole("option", { name: /Berlin Central Office/i });
    await user.keyboard("{ArrowDown}{Enter}");

    expect((pickupInput as HTMLInputElement).value).toBe(
      "Europaplatz 1, 10557 Berlin",
    );

    const destinationInput = screen.getByPlaceholderText("Zieladresse");
    await user.type(destinationInput, "BER");
    await user.click(
      await screen.findByRole("option", { name: /Melli-Beese-Ring 1/i }),
    );
    await user.type(screen.getByRole("textbox", { name: "Platz 1" }), "Ada");
    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));
    await user.type(screen.getByLabelText("Abholdatum"), "01.06.2026");
    await user.type(screen.getByLabelText("Abholzeit"), "09:30");
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );
    await user.click(screen.getByRole("button", { name: "Buchung erstellen" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        destinationAddress: "Melli-Beese-Ring 1, Schonefeld",
        destinationPlace: {
          addressComponents: [
            { longText: "1", shortText: "1", types: ["street_number"] },
            {
              longText: "Melli-Beese-Ring",
              shortText: "Melli-Beese-Ring",
              types: ["route"],
            },
          ],
          displayName: "Melli-Beese-Ring 1",
          formattedAddress: "Melli-Beese-Ring 1, Schonefeld",
          latitude: 52.3667,
          longitude: 13.5033,
          placeId: "google-place-ber",
          provider: "google_maps",
        },
        pickupAddress: "Europaplatz 1, 10557 Berlin",
        pickupPlace: {
          addressComponents: [
            { longText: "1", shortText: "1", types: ["street_number"] },
            {
              longText: "Europaplatz",
              shortText: "Europaplatz",
              types: ["route"],
            },
          ],
          displayName: "Berlin Hauptbahnhof",
          formattedAddress: "Europaplatz 1, 10557 Berlin",
          latitude: 52.5251,
          longitude: 13.3694,
          placeId: "google-place-berlin-hbf",
          provider: "google_maps",
        },
      }),
    );
  });

  test("manual address edits after autocomplete selection require selecting Google again", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const addressAutocomplete = {
      getSuggestions: vi.fn(async (_input, field) =>
        field === "pickup"
          ? [
              {
                id: "pickup-1",
                mainText: "Berlin Central Office",
                secondaryText: "Invalidenstraße 1, Berlin",
              },
            ]
          : [
              {
                id: "destination-1",
                mainText: "Melli-Beese-Ring 1",
                secondaryText: "Schonefeld",
              },
            ],
      ),
      resolveSuggestion: vi.fn(async (suggestion) =>
        suggestion.id === "destination-1"
          ? {
              addressComponents: [
                { longText: "1", shortText: "1", types: ["street_number"] },
                {
                  longText: "Melli-Beese-Ring",
                  shortText: "Melli-Beese-Ring",
                  types: ["route"],
                },
              ],
              displayName: "Melli-Beese-Ring 1",
              formattedAddress: "Melli-Beese-Ring 1, Schonefeld",
              latitude: 52.3667,
              longitude: 13.5033,
              placeId: "google-place-ber",
              provider: "google_maps" as const,
            }
          : {
              addressComponents: [
                { longText: "1", shortText: "1", types: ["street_number"] },
                {
                  longText: "Invalidenstraße",
                  shortText: "Invalidenstraße",
                  types: ["route"],
                },
              ],
              displayName: "Berlin Central Office",
              formattedAddress: "Invalidenstraße 1, 10115 Berlin",
              latitude: 52.531,
              longitude: 13.383,
              placeId: "google-place-office",
              provider: "google_maps" as const,
            },
      ),
    } satisfies NewBookingAddressAutocompleteController;

    render(
      <NewBookingOverlay
        addressAutocomplete={addressAutocomplete}
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    const pickupInput = screen.getByPlaceholderText("Abholadresse");
    await user.type(pickupInput, "Invaliden");
    await user.click(
      await screen.findByRole("option", { name: /Berlin Central Office/i }),
    );
    await user.type(pickupInput, " Hinterhof");
    await user.type(screen.getByPlaceholderText("Zieladresse"), "BER");
    await user.click(
      await screen.findByRole("option", { name: /Melli-Beese-Ring 1/i }),
    );
    await user.type(screen.getByRole("textbox", { name: "Platz 1" }), "Ada");
    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));
    await user.type(screen.getByLabelText("Abholdatum"), "01.06.2026");
    await user.type(screen.getByLabelText("Abholzeit"), "09:30");
    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );

    expect(screen.getByText(copy.validation.googleAddressRequired)).not.toBeNull();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: "Buchung erstellen" }),
    ).toBeNull();
  });

  test("address autocomplete failures do not block manual address entry", async () => {
    const user = userEvent.setup();
    const addressAutocomplete = {
      getSuggestions: vi.fn(async () => {
        throw new Error("Google unavailable");
      }),
      resolveSuggestion: vi.fn(),
    } satisfies NewBookingAddressAutocompleteController;

    render(
      <NewBookingOverlay
        addressAutocomplete={addressAutocomplete}
        availablePassengers={passengers}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const pickupInput = screen.getByPlaceholderText("Abholadresse");
    await user.type(pickupInput, "Manual address");

    expect(
      await screen.findByText(copy.addressAutocomplete.errorLabel),
    ).not.toBeNull();
    expect((pickupInput as HTMLInputElement).value).toBe("Manual address");
  });

  test("renders the footer error status with the shared danger token, not raw red", () => {
    render(
      <NewBookingOverlay
        availablePassengers={passengers}
        copy={copy}
        errorMessage="Buchung konnte nicht erstellt werden."
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const status = screen.getByText("Buchung konnte nicht erstellt werden.");

    expect(status.getAttribute("role")).toBe("alert");
    expect(status.className).toContain(
      "text-[var(--taxis-status-danger-text)]",
    );
    expect(status.className).not.toContain("text-red-700");
  });

  test("renders field validation errors with the shared danger token, not raw red", async () => {
    const user = userEvent.setup();

    render(
      <NewBookingOverlay
        availablePassengers={passengers.slice(0, 1)}
        copy={copy}
        favoriteRoutes={[]}
        isOpen
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Weiter zur Übersicht" }),
    );

    const fieldError = screen.getByText("Abholung ist erforderlich.");

    expect(fieldError.className).toContain(
      "text-[var(--taxis-status-danger-text)]",
    );
    expect(fieldError.className).not.toContain("text-red-700");
  });
});

describe("deriveNewBookingSubmitPayload", () => {
  test("trims persisted fields and combines pickup date/time into a timestamp", () => {
    const payload = deriveNewBookingSubmitPayload(
      {
        contactPersonId: "ada",
        customPassengerName: "",
        destinationAddress: "  Flughafen BER  ",
        flightNumber: " LH 203 ",
        internalNote: "  Gate A  ",
        passengerIds: ["ada"],
        passengerInputMode: "assign_seats",
        guestCount: 1,
        passengersPerVehicle: 3,
        pickupAddress: "  Chausseestraße 1  ",
        pickupDate: "2026-06-01",
        pickupTime: "09:30",
        returnDate: "",
        returnTime: "",
        tripType: "one_way_outbound",
        vehicleTypeId: "standard",
      },
      passengers,
    );

    expect(payload).toMatchObject({
      destinationAddress: "Flughafen BER",
      internalNote: "Gate A",
      passengers: [{ kind: "member", memberId: "ada", name: "Ada Lovelace" }],
      passengerIds: ["ada"],
      pickupAddress: "Chausseestraße 1",
      requestedPickupAt: new Date("2026-06-01T09:30").getTime(),
    });
  });
});
