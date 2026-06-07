import type { Meta, StoryObj } from "@storybook/react-vite";

import type {
  CompanyBookingRow,
  CompanyBookingsCopy,
} from "../../../contracts/company-bookings";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { CompanyBookingsWorkspaceContent } from "./company-bookings-screen";

const copy: CompanyBookingsCopy = {
  allLoadedLabel: "Alle Buchungen geladen",
  detailBackdropLabel: "Buchungsdetails schließen",
  detailBookedAtLabel: "Wann gebucht",
  detailBookedByLabel: "Gebucht von",
  detailBookingIdLabel: "Fahrt ID",
  detailCancelErrorFallback:
    "Die Buchung konnte gerade nicht storniert werden.",
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

function history(
  bookingId: string,
  entries: Array<{
    actorName: string;
    label: string;
    timeLabel: string;
    tone: CompanyBookingRow["history"][number]["tone"];
  }>,
): CompanyBookingRow["history"] {
  return entries.map((entry, index) => ({
    actorName: entry.actorName,
    dateLabel: "07.05.2026",
    id: `${bookingId}-history-${index.toString()}`,
    label: entry.label,
    timeLabel: entry.timeLabel,
    tone: entry.tone,
  }));
}

function bookingRow(
  overrides: Partial<CompanyBookingRow> & Pick<CompanyBookingRow, "bookingId">,
): CompanyBookingRow {
  const { bookingId, ...rowOverrides } = overrides;

  return {
    allowedActions: [
      {
        id: "cancel_booking",
        label: "Buchung stornieren",
      },
    ],
    bookedByEmail: "ada@example.test",
    bookedByName: "Ada Lovelace",
    bookingId,
    createdDateLabel: "07.05.2026",
    createdTimeLabel: "09:10",
    driverName: null,
    driverVehicleVisible: false,
    from: "Werrastraße 36",
    history: history(bookingId, [
      {
        actorName: "Ada Lovelace",
        label: "Buchung erstellt",
        timeLabel: "09:10",
        tone: "navy",
      },
    ]),
    lifecycleStatus: "requested",
    note: "Bitte am Empfang melden.",
    passengers: ["Ada Lovelace"],
    pickupDateLabel: "07.05.2026",
    pickupTimeLabel: "10:00",
    publicId: "BKG-7K4Q2M",
    status: "requested",
    statusColor: "navy",
    statusIndicators: [
      {
        color: "navy",
        id: "primary",
        label: "Gebucht",
        status: "booked",
      },
    ],
    statusLabel: "Gebucht",
    to: "Linkstraße 5",
    vehicleDisplayName: null,
    vehicleLicensePlate: null,
    vehicleUnits: [],
    ...rowOverrides,
  };
}

const meta = {
  title: "Taxios/TaxiOS/Company Bookings/Workspace Content",
  component: CompanyBookingsWorkspaceContent,
  decorators: [
    (Story) => (
      <StoryCanvas contentClassName="p-0" maxWidth="none" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CompanyBookingsWorkspaceContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    canLoadMore: true,
    copy,
    rows: [
      bookingRow({ bookingId: "booking-1" }),
      bookingRow({
        bookingId: "booking-3",
        driverName: "Mina Driver",
        driverVehicleVisible: true,
        from: "Potsdamer Platz 1",
        history: history("booking-3", [
          {
            actorName: "Ada Lovelace",
            label: "Buchung erstellt",
            timeLabel: "09:25",
            tone: "navy",
          },
          {
            actorName: "Provider Dispatch",
            label: "Fahrer zugewiesen",
            timeLabel: "10:55",
            tone: "grey",
          },
          {
            actorName: "Mina Driver",
            label: "In Anfahrt",
            timeLabel: "11:02",
            tone: "blue",
          },
        ]),
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
      bookingRow({
        bookingId: "booking-4",
        driverName: "Noah Driver",
        driverVehicleVisible: true,
        from: "Company Smoke Office",
        history: history("booking-4", [
          {
            actorName: "Ada Lovelace",
            label: "Buchung erstellt",
            timeLabel: "09:35",
            tone: "navy",
          },
          {
            actorName: "Noah Driver",
            label: "In Anfahrt",
            timeLabel: "11:16",
            tone: "blue",
          },
          {
            actorName: "Noah Driver",
            label: "Unterwegs",
            timeLabel: "11:41",
            tone: "green",
          },
        ]),
        lifecycleStatus: "picked_up",
        passengers: ["Noah Transit"],
        pickupTimeLabel: "11:40",
        publicId: "BKG-QH9MV9",
        status: "confirmed",
        statusColor: "green",
        statusIndicators: [
          {
            color: "green",
            id: "primary",
            isPulsing: true,
            label: "Unterwegs",
            status: "underway",
          },
        ],
        statusLabel: "Unterwegs",
        to: "Provider Global Pool Destination",
        vehicleDisplayName: "TX 711",
        vehicleLicensePlate: "B TX 711",
      }),
      bookingRow({
        bookingId: "booking-2",
        driverName: "Karl Driver",
        driverVehicleVisible: true,
        from: "Leipziger Platz 1",
        history: history("booking-2", [
          {
            actorName: "Ada Lovelace",
            label: "Buchung erstellt",
            timeLabel: "09:20",
            tone: "navy",
          },
          {
            actorName: "Karl Driver",
            label: "In Anfahrt",
            timeLabel: "10:32",
            tone: "blue",
          },
          {
            actorName: "Karl Driver",
            label: "Abgeschlossen",
            timeLabel: "11:22",
            tone: "green",
          },
        ]),
        lifecycleStatus: "completed",
        passengers: ["Grace Hopper", "Katherine Johnson"],
        pickupTimeLabel: "11:00",
        publicId: "BKG-8M2Q9R",
        status: "completed",
        statusColor: "green",
        statusIndicators: [
          {
            color: "green",
            id: "primary",
            label: "Abgeschlossen",
            status: "completed",
          },
        ],
        statusLabel: "Abgeschlossen",
        to: "Berlin Central Office",
        vehicleDisplayName: "TX 900",
        vehicleLicensePlate: "B TX 900",
      }),
    ],
  },
};

export const Empty: Story = {
  args: {
    copy,
    rows: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empty state rendered through the shared WorkspaceStateView primitive, matching the Operations/Dashboard empty grammar.",
      },
    },
  },
};

const disabledCancelRow = bookingRow({
  allowedActions: [
    {
      disabled: true,
      id: "cancel_booking",
      label: "Buchung stornieren",
      reason: "Nur angefragte Buchungen können storniert werden.",
    },
  ],
  bookingId: "booking-completed",
  from: "Leipziger Platz 1",
  lifecycleStatus: "completed",
  passengers: ["Grace Hopper", "Katherine Johnson"],
  pickupTimeLabel: "11:00",
  publicId: "BKG-DONE12",
  status: "completed",
  statusColor: "green",
  statusIndicators: [
    {
      color: "green",
      id: "primary",
      label: "Abgeschlossen",
      status: "completed",
    },
  ],
  statusLabel: "Abgeschlossen",
  to: "Berlin Central Office",
});

export const LongLabels: Story = {
  args: {
    copy,
    rows: [
      bookingRow({
        bookingId: "booking-long",
        from: "Konzernzentrale Untere Hauptstraße 145b, Aufgang C, 4. OG, 10117 Berlin-Mitte",
        passengers: [
          "Ada Lovelace-Montgomery",
          "Katherine Coleman Goble Johnson",
          "Grace Brewster Murray Hopper",
          "Dorothy Vaughan",
          "Mary Jackson",
        ],
        publicId: "BKG-LONGLABEL-0001",
        to: "Berlin Brandenburg Flughafen Willy Brandt, Terminal 1, Ebene E0, Schönefeld",
      }),
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Stress test for long route, long passenger, and long public-id labels. Verifies truncation and row rhythm hold.",
      },
    },
  },
};

export const NarrowWidth: Story = {
  args: {
    copy,
    rows: [
      bookingRow({ bookingId: "booking-1" }),
      disabledCancelRow,
    ],
  },
  decorators: [
    (StoryComponent) => (
      <StoryCanvas contentClassName="p-0" maxWidth="430px" tone="dashboard">
        <StoryComponent />
      </StoryCanvas>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Narrow width sanity for the Buchungen table stacked-card layout. Mobile product redesign is out of scope.",
      },
    },
  },
};

export const RowActionDrawer: Story = {
  args: {
    copy,
    rows: [bookingRow({ bookingId: "booking-1" })],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Existing row action: opening a booking row reveals the detail drawer with the payload-provided cancel action. No new action semantics are introduced.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const openButton = canvasElement.querySelector<HTMLButtonElement>(
      'button[aria-label$="Details öffnen"]',
    );

    if (!openButton) {
      throw new Error("Row open-detail affordance was not rendered.");
    }

    openButton.click();
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    const dialog = canvasElement.querySelector('[role="dialog"]');

    if (!dialog) {
      throw new Error("Booking detail drawer did not open.");
    }

    const hasCancelAction = Array.from(
      dialog.querySelectorAll<HTMLButtonElement>("button"),
    ).some((button) => button.textContent?.includes("Buchung stornieren"));

    if (!hasCancelAction) {
      throw new Error("Payload-provided cancel action was not rendered.");
    }
  },
};

export const DisabledCancelAction: Story = {
  args: {
    copy,
    rows: [disabledCancelRow],
  },
  parameters: {
    docs: {
      description: {
        story:
          "A completed booking whose payload marks cancel as disabled. The drawer renders the cancel action as disabled with its provided reason; availability is never inferred.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const openButton = canvasElement.querySelector<HTMLButtonElement>(
      'button[aria-label$="Details öffnen"]',
    );

    if (!openButton) {
      throw new Error("Row open-detail affordance was not rendered.");
    }

    openButton.click();
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    const dialog = canvasElement.querySelector('[role="dialog"]');

    if (!dialog) {
      throw new Error("Booking detail drawer did not open.");
    }

    const cancelButton = Array.from(
      dialog.querySelectorAll<HTMLButtonElement>("button"),
    ).find((button) => button.textContent?.includes("Buchung stornieren"));

    if (!cancelButton?.disabled) {
      throw new Error("Expected the cancel action to render as disabled.");
    }
  },
};
