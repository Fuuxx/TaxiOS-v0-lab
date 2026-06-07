import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import type {
  CompanyBookingRow,
  CompanyBookingsCopy,
} from "../../../contracts/company-bookings";
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
    history: [
      {
        actorName: "Ada Lovelace",
        dateLabel: "07.05.2026",
        id: `${bookingId}-history-created`,
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
    vehicleUnits: [
      {
        driverName: null,
        driverVehicleVisible: false,
        label: "Fahrzeug 1",
        ordinal: 1,
        passengers: ["Ada Lovelace"],
        publicId: "BKU-7K4Q2M",
        statusColor: "navy",
        statusIndicators: [
          {
            color: "navy",
            id: `${bookingId}-unit-1-status`,
            label: "Gebucht",
            status: "booked",
          },
        ],
        statusLabel: "Gebucht",
        unitId: `${bookingId}-unit-1`,
        vehicleDisplayName: null,
        vehicleLicensePlate: null,
      },
    ],
    ...rowOverrides,
  };
}

const rows = [
  bookingRow({ bookingId: "booking-1" }),
  bookingRow({
    bookingId: "booking-2",
    driverName: "Mina Driver",
    driverVehicleVisible: true,
    from: "Leipziger Platz 1",
    history: [
      {
        actorName: "Ada Lovelace",
        dateLabel: "07.05.2026",
        id: "booking-2-history-created",
        label: "Buchung erstellt",
        timeLabel: "09:20",
        tone: "navy",
      },
      {
        actorName: "Mina Driver",
        dateLabel: "07.05.2026",
        id: "booking-2-history-enroute",
        label: "In Anfahrt",
        timeLabel: "10:45",
        tone: "blue",
      },
      {
        actorName: "Mina Driver",
        dateLabel: "07.05.2026",
        id: "booking-2-history-completed",
        label: "Abgeschlossen",
        timeLabel: "11:15",
        tone: "green",
      },
    ],
    lifecycleStatus: "completed",
    passengers: ["Grace Hopper", "Katherine Johnson"],
    pickupTimeLabel: "11:00",
    publicId: null,
    status: "completed",
    statusColor: "green",
    allowedActions: [
      {
        disabled: true,
        id: "cancel_booking",
        label: "Buchung stornieren",
        reason: "Nur angefragte Buchungen können storniert werden.",
      },
    ],
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
    vehicleDisplayName: "TX 500",
    vehicleLicensePlate: "B TX 500",
    vehicleUnits: [
      {
        driverName: "Mina Driver",
        driverVehicleVisible: true,
        label: "Fahrzeug 1",
        ordinal: 1,
        passengers: ["Grace Hopper", "Katherine Johnson"],
        publicId: "BKU-TX500",
        statusColor: "green",
        statusIndicators: [
          {
            color: "green",
            id: "booking-2-unit-1-status",
            label: "Abgeschlossen",
            status: "completed",
          },
        ],
        statusLabel: "Abgeschlossen",
        unitId: "booking-2-unit-1",
        vehicleDisplayName: "TX 500",
        vehicleLicensePlate: "B TX 500",
      },
    ],
  }),
  bookingRow({
    bookedByEmail: "mina@example.test",
    bookedByName: "Mina Requested",
    bookingId: "booking-3",
    createdTimeLabel: "09:30",
    from: "TaxiOS Smoke HQ",
    lifecycleStatus: "cancelled",
    passengers: ["Mina Requested"],
    pickupTimeLabel: "12:00",
    publicId: "BKG-CANCEL",
    status: "cancelled",
    statusColor: "red",
    statusIndicators: [
      {
        color: "red",
        id: "primary",
        label: "Storniert",
        status: "cancelled",
      },
    ],
    statusLabel: "Storniert",
    to: "BER Terminal 1",
  }),
];

describe("CompanyBookingsWorkspaceContent", () => {
  test("renders the bookings table with public IDs between route and status", () => {
    render(<CompanyBookingsWorkspaceContent copy={copy} rows={rows} />);

    expect(
      screen.getAllByRole("columnheader").map((header) => header.textContent),
    ).toEqual(["Abholung", "Erstellt", "Passagiere", "Route", "ID", "Status"]);
    expect(screen.getByText("BKG-7K4Q2M")).toBeTruthy();
    expect(screen.getByText("-")).toBeTruthy();
    expect(screen.getByTitle("Taxi-Status: Gebucht")).toBeTruthy();
    expect(screen.getByTitle("Status: Abgeschlossen")).toBeTruthy();
    expect(screen.getByTitle("Status: Storniert")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Stornieren" })).toBeNull();
  });

  test("exposes hidden status labels on compact overflow chips", () => {
    const overflowRow = bookingRow({
      bookingId: "booking-overflow",
      statusIndicators: [
        { color: "navy", id: "s1", label: "Gebucht", status: "booked" },
        { color: "blue", id: "s2", label: "In Anfahrt", status: "enroute" },
        { color: "orange", id: "s3", label: "Angekommen", status: "arrived" },
        { color: "green", id: "s4", label: "Unterwegs", status: "underway" },
        { color: "grey", id: "s5", label: "Zusatzstatus", status: "completed" },
      ],
    });

    render(<CompanyBookingsWorkspaceContent copy={copy} rows={[overflowRow]} />);

    expect(screen.getByText("Zusatzstatus")).toBeTruthy();
  });

  test("calls load more when more paginated bookings are available", async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();

    render(
      <CompanyBookingsWorkspaceContent
        canLoadMore
        copy={copy}
        onLoadMore={onLoadMore}
        rows={rows}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Mehr laden" }));

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  test("opens a booking detail drawer from a table row", async () => {
    const user = userEvent.setup();

    render(<CompanyBookingsWorkspaceContent copy={copy} rows={rows} />);

    await user.click(
      screen.getByRole("button", { name: "booking-2 Details öffnen" }),
    );

    const dialog = screen.getByRole("dialog", { name: "booking-2" });
    expect(dialog).toBeTruthy();
    expect(within(dialog).getByText("Gebucht von")).toBeTruthy();
    expect(within(dialog).getByText("Ada Lovelace")).toBeTruthy();
    expect(within(dialog).getByText("ada@example.test")).toBeTruthy();
    expect(within(dialog).getByText("Fahrzeug 1")).toBeTruthy();
    expect(within(dialog).getByText("BKU-TX500")).toBeTruthy();
    expect(within(dialog).getByText("Fahrer: Mina Driver")).toBeTruthy();
    expect(within(dialog).getByText("TX 500 · B TX 500")).toBeTruthy();
    expect(within(dialog).getByText("Notiz")).toBeTruthy();
    expect(within(dialog).getByText("Bitte am Empfang melden.")).toBeTruthy();
    expect(within(dialog).getByText("Buchungshistorie")).toBeTruthy();
    expect(within(dialog).getByText("In Anfahrt")).toBeTruthy();
    expect(
      within(dialog).getByRole<HTMLButtonElement>("button", {
        name: "Buchung stornieren",
      }).disabled,
    ).toBe(true);

    await user.click(
      within(dialog).getByRole("button", {
        name: "Buchungsdetails schließen",
      }),
    );

    expect(screen.queryByRole("dialog", { name: "booking-2" })).toBeNull();
  });

  test("runs the cancel action from the booking detail drawer", async () => {
    const user = userEvent.setup();
    const onCancelBooking = vi.fn();

    render(
      <CompanyBookingsWorkspaceContent
        copy={copy}
        onCancelBooking={onCancelBooking}
        rows={rows}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "BKG-7K4Q2M Details öffnen" }),
    );
    await user.click(
      within(screen.getByRole("dialog", { name: "BKG-7K4Q2M" })).getByRole(
        "button",
        { name: "Buchung stornieren" },
      ),
    );

    expect(onCancelBooking).toHaveBeenCalledWith(rows[0]);
  });

  test("renders the shared workspace empty state when there are no bookings", () => {
    render(<CompanyBookingsWorkspaceContent copy={copy} rows={[]} />);

    expect(screen.getByText(copy.emptyTitle)).toBeTruthy();
    expect(screen.getByText(copy.emptyDescription)).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });

  test("surfaces a failed cancel with the shared danger token, not raw red", async () => {
    const user = userEvent.setup();
    const onCancelBooking = vi.fn(() => {
      throw new Error("Storno fehlgeschlagen");
    });

    render(
      <CompanyBookingsWorkspaceContent
        copy={copy}
        onCancelBooking={onCancelBooking}
        rows={rows}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "BKG-7K4Q2M Details öffnen" }),
    );
    await user.click(
      within(screen.getByRole("dialog", { name: "BKG-7K4Q2M" })).getByRole(
        "button",
        { name: "Buchung stornieren" },
      ),
    );

    const errorMessage = await screen.findByText("Storno fehlgeschlagen");

    expect(errorMessage.className).toContain(
      "text-[var(--taxis-status-danger-text)]",
    );
    expect(errorMessage.className).not.toContain("text-red-700");
  });

  test("renders the detail drawer with workspace tokens instead of raw zinc or white surface utilities", async () => {
    const user = userEvent.setup();

    render(<CompanyBookingsWorkspaceContent copy={copy} rows={rows} />);

    await user.click(
      screen.getByRole("button", { name: /BKG-7K4Q2M Details/ }),
    );

    const dialog = screen.getByRole("dialog", { name: "BKG-7K4Q2M" });
    const rawClassDebtPattern = /\b(?:bg-white|text-zinc|border-zinc)-?/;
    const elementsWithClassDebt = Array.from(
      dialog.querySelectorAll<HTMLElement>("[class]"),
    ).filter((element) => rawClassDebtPattern.test(element.className));

    expect(elementsWithClassDebt).toHaveLength(0);
  });
});
