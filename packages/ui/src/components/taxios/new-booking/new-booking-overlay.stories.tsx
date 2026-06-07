import type { Meta, StoryObj } from "@storybook/react-vite";

import type {
  NewBookingAddressAutocompleteController,
  NewBookingAddressSelection,
  NewBookingOverlayCopy,
} from "../../../contracts/new-booking";
import { NewBookingOverlay } from "./new-booking-overlay";

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
    googleSelectedLabel: "Google-Adresse ausgewaehlt",
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
    placeholder: "Ansprechpartner waehlen",
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

function googleAddress(
  formattedAddress: string,
  placeId: string,
  options?: { hasHouseNumber?: boolean },
): NewBookingAddressSelection {
  return {
    addressComponents:
      options?.hasHouseNumber === false
        ? [
            {
              longText: formattedAddress,
              shortText: formattedAddress,
              types: ["route"],
            },
          ]
        : [
            { longText: "1", shortText: "1", types: ["street_number"] },
            {
              longText: formattedAddress,
              shortText: formattedAddress,
              types: ["route"],
            },
          ],
    displayName: formattedAddress,
    formattedAddress,
    latitude: 52.52,
    longitude: 13.405,
    placeId,
    provider: "google_maps",
  };
}

const verifiedAutocomplete: NewBookingAddressAutocompleteController = {
  getSuggestions: async (input) =>
    input.trim().length === 0
      ? []
      : [
          {
            id: `suggestion-${input}`,
            mainText: input,
            secondaryText: "Google Places",
          },
        ],
  resolveSuggestion: async (suggestion) =>
    googleAddress(suggestion.mainText, `place-${suggestion.id}`),
};

const missingHouseNumberAutocomplete: NewBookingAddressAutocompleteController = {
  getSuggestions: async (input) =>
    input.trim().length === 0
      ? []
      : [
          {
            id: `route-only-${input}`,
            mainText: input,
            secondaryText: "Google Places ohne Hausnummer",
          },
        ],
  resolveSuggestion: async (suggestion) =>
    googleAddress(suggestion.mainText, `place-${suggestion.id}`, {
      hasHouseNumber: false,
    }),
};

const unavailableAutocomplete: NewBookingAddressAutocompleteController = {
  getSuggestions: async () => {
    throw new Error("Google Places unavailable");
  },
  resolveSuggestion: async () => null,
};

const meta = {
  args: {
    availablePassengers: passengers,
    copy,
    favoriteRoutes: [
      {
        destinationAddress: "Flughafen BER",
        id: "route-airport",
        pickupAddress: "Chausseestrasse 1",
        title: "Office -> BER",
      },
    ],
    isOpen: true,
    isSubmitting: false,
    onClose: () => undefined,
    onSubmit: () => undefined,
  },
  component: NewBookingOverlay,
  parameters: {
    layout: "fullscreen",
  },
  title: "Taxios/TaxiOS/New Booking Overlay",
} satisfies Meta<typeof NewBookingOverlay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const FastBookingDraftMultiVehicle: Story = {
  args: {
    initialDraft: {
      destinationAddress: "Flughafen BER",
      passengerIds: ["ada", "grace", "katherine", "mary", "dorothy"],
      pickupAddress: "Chausseestrasse 1",
    },
  },
};

export const GuestCountEightGuests: Story = {
  args: {
    favoriteRoutes: [
      {
        destinationAddress: "Flughafen BER",
        id: "route-airport",
        pickupAddress: "Chausseestrasse 1",
        title: "Office -> BER",
      },
      {
        destinationAddress: "Messe Berlin",
        id: "route-messe",
        pickupAddress: "Alexanderplatz 1",
        title: "Alexanderplatz -> Messe",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Open the guest-count mode in the cockpit and set eight guests to inspect automatic vehicle planning.",
      },
    },
  },
};

export const VehicleCategories: Story = {
  args: {
    initialDraft: {
      destinationAddress: "Hotel Adlon",
      passengerIds: ["ada", "grace"],
      pickupAddress: "Hauptbahnhof Berlin",
    },
  },
};

export const ReviewReady: Story = {
  args: {
    initialDraft: {
      destinationAddress: "Flughafen BER",
      passengerIds: ["ada", "grace", "katherine"],
      pickupAddress: "Chausseestrasse 1",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Prefilled cockpit state for checking the review step after clicking Weiter zur Übersicht.",
      },
    },
  },
};

export const VerifiedRoute: Story = {
  args: {
    addressAutocomplete: verifiedAutocomplete,
    requireVerifiedAddresses: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use the address suggestions for pickup and destination to inspect the confirmed Google address and detected house-number states.",
      },
    },
  },
};

export const MissingGoogleSelection: Story = {
  args: {
    addressAutocomplete: verifiedAutocomplete,
    initialDraft: {
      destinationAddress: "Alexanderplatz 1",
      pickupAddress: "Chausseestrasse 1",
    },
    requireVerifiedAddresses: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Click Weiter zur Übersicht without selecting suggestions to inspect the field-local Google-selection validation state.",
      },
    },
  },
};

export const MissingHouseNumber: Story = {
  args: {
    addressAutocomplete: missingHouseNumberAutocomplete,
    requireVerifiedAddresses: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Select a route-only suggestion to inspect the immediate missing-house-number state.",
      },
    },
  },
};

export const GoogleUnavailable: Story = {
  args: {
    addressAutocomplete: unavailableAutocomplete,
    initialDraft: {
      destinationAddress: "Alexanderplatz 1",
      pickupAddress: "Chausseestrasse 1",
    },
    requireVerifiedAddresses: true,
  },
};

export const Loading: Story = {
  args: {
    isSubmitting: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    disabledReason: "Only company bookers can create bookings.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled primary CTA with a footer status reason. The cancel control stays available so the overlay can always be dismissed.",
      },
    },
  },
};

export const FooterCtaHierarchy: Story = {
  args: {
    errorMessage:
      "Buchung konnte nicht erstellt werden. Bitte Verbindung prüfen und erneut versuchen.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Footer rhythm under an assertive error: the danger status message sits on the left while the secondary cancel and primary brand CTA keep their right-aligned hierarchy.",
      },
    },
  },
};

const longRoutePassengers = [
  { id: "ada", name: "Ada Lovelace-Montgomery-Featherstonehaugh" },
  { id: "grace", name: "Grace Brewster Murray Hopper" },
  { id: "katherine", name: "Katherine Coleman Goble Johnson" },
];

export const LongRouteLabels: Story = {
  args: {
    availablePassengers: longRoutePassengers,
    favoriteRoutes: [
      {
        destinationAddress:
          "Berlin Brandenburg Flughafen Willy Brandt, Terminal 1, Ebene E0, Schönefeld",
        id: "route-long",
        pickupAddress:
          "Konzernzentrale Untere Hauptstraße 145b, Aufgang C, 4. Obergeschoss, 10117 Berlin-Mitte",
        title:
          "Konzernzentrale Berlin-Mitte → Flughafen BER Terminal 1 (Sammeltransfer)",
      },
    ],
    initialDraft: {
      destinationAddress:
        "Berlin Brandenburg Flughafen Willy Brandt, Terminal 1, Ebene E0, Schönefeld",
      passengerIds: ["ada", "grace", "katherine"],
      pickupAddress:
        "Konzernzentrale Untere Hauptstraße 145b, Aufgang C, 4. Obergeschoss, 10117 Berlin-Mitte",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Stress test for long route labels, long passenger names and a long favorite-route title. Verifies truncation and section rhythm hold without breaking layout.",
      },
    },
  },
};

export const NarrowWidth: Story = {
  decorators: [
    (StoryComponent) => (
      <div
        style={{
          height: 760,
          margin: "0 auto",
          overflow: "hidden",
          position: "relative",
          // A non-none transform makes this box the containing block for the
          // overlay's position: fixed shell, giving a real narrow sanity frame.
          transform: "translateZ(0)",
          width: 420,
        }}
      >
        <StoryComponent />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Compact/narrow width sanity. Confirms the wizard shell, section rhythm and stacked footer CTA order survive a phone-sized frame. Mobile product redesign is out of scope.",
      },
    },
  },
};

function setNativeInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function waitForFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export const ValidationErrors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Real interaction: advancing to the review step with empty required fields surfaces the existing field-local validation copy. No validation logic is changed by this story.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const nextButton = Array.from(
      canvasElement.querySelectorAll<HTMLButtonElement>("button"),
    ).find((button) => button.textContent?.includes("Weiter zur Übersicht"));

    if (!nextButton) {
      throw new Error("Review CTA was not rendered.");
    }

    nextButton.click();
    await waitForFrame();

    const hasPickupError = Array.from(
      canvasElement.querySelectorAll("*"),
    ).some((node) => node.textContent === "Abholung ist erforderlich.");

    if (!hasPickupError) {
      throw new Error("Expected the required-field validation copy to render.");
    }
  },
};

export const ReviewStepRhythm: Story = {
  args: {
    initialDraft: {
      destinationAddress: "Flughafen BER Terminal 1",
      passengerIds: ["ada", "grace"],
      pickupAddress: "Chausseestrasse 1, Berlin",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Real interaction: prefilled route and passengers, then the date/time are set and the review step is opened to inspect wizard step/section rhythm and the review CTA hierarchy.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const dateInput =
      canvasElement.querySelector<HTMLInputElement>('input[type="date"]');
    const timeInput =
      canvasElement.querySelector<HTMLInputElement>('input[type="time"]');

    if (!dateInput || !timeInput) {
      throw new Error("Date/time inputs were not rendered.");
    }

    setNativeInputValue(dateInput, "2026-06-01");
    setNativeInputValue(timeInput, "09:30");
    await waitForFrame();

    const nextButton = Array.from(
      canvasElement.querySelectorAll<HTMLButtonElement>("button"),
    ).find((button) => button.textContent?.includes("Weiter zur Übersicht"));

    if (!nextButton) {
      throw new Error("Review CTA was not rendered.");
    }

    nextButton.click();
    await waitForFrame();

    const hasReviewHeading = Array.from(
      canvasElement.querySelectorAll("h2, h3"),
    ).some((node) => node.textContent === "Übersicht");

    if (!hasReviewHeading) {
      throw new Error("Expected the review step heading to render.");
    }
  },
};
