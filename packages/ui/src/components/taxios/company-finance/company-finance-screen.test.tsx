import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import type {
  CompanyFinanceCopy,
  CompanyFinancePayload,
} from "../../../contracts/company-finance";
import { CompanyFinanceWorkspaceContent } from "./company-finance-screen";

const copy: CompanyFinanceCopy = {
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
  subtitle:
    "Rechnungen und Buchungskosten bleiben für Admins nachvollziehbar.",
  summarySectionTitle: "Übersicht",
  title: "Finanzen",
  totalKnownAmountLabel: "Bepreister Gesamtwert",
  unpricedCountLabel: "Nicht bepreist",
  vehicleColumn: "Fahrzeug",
};

const payload: CompanyFinancePayload = {
  costRows: [],
  invoiceRows: [],
  organizationId: "organization_1",
  organizationName: "Smoke Company HQ",
  summary: {
    invoiceCount: 1,
    latestInvoiceLabel: "20.05.2026",
    pricedCount: 0,
    totalKnownAmountLabel: "—",
    unpricedCount: 1,
  },
};

const row = {
  amountLabel: "Noch nicht bepreist",
  billingStatusLabel: "Rechnungssnapshot erstellt",
  bookingId: "booking_1",
  bookingPublicId: "BKG-FIN001",
  completedDateLabel: "20.05.2026",
  completedTimeLabel: "11:00",
  costStatusLabel: "Noch nicht bepreist",
  createdDateLabel: "20.05.2026",
  createdTimeLabel: "11:05",
  destinationAddress: "Berlin Hauptbahnhof",
  invoiceId: "invoice_1",
  passengerSummary: "Ada Finance",
  pickupAddress: "Potsdamer Platz 1",
  pickupDateLabel: "20.05.2026",
  pickupTimeLabel: "10:00",
  providerName: "City Funk Berlin",
  publicId: "IVC-FIN001",
  vehicleLabel: "Taxi 500 / B TX 500",
};

describe("CompanyFinanceWorkspaceContent", () => {
  test("renders summary, invoices, and booking costs", () => {
    render(
      <CompanyFinanceWorkspaceContent
        copy={copy}
        payload={{
          ...payload,
          costRows: [row],
          invoiceRows: [row],
        }}
      />,
    );

    expect(screen.getByText("Finanzen")).not.toBeNull();
    expect(screen.getByText("Rechnungssnapshots")).not.toBeNull();
    expect(screen.getByText("IVC-FIN001")).not.toBeNull();
    expect(screen.getAllByText("BKG-FIN001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Noch nicht bepreist").length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText("City Funk Berlin")).not.toBeNull();
  });

  test("renders empty states for invoices and costs", () => {
    render(<CompanyFinanceWorkspaceContent copy={copy} payload={payload} />);

    expect(screen.getAllByText("Noch keine Rechnungen")).toHaveLength(2);
    expect(screen.getAllByText("Noch keine Rechnungen")[0]?.parentElement?.className).toContain(
      "bg-[var(--taxis-workspace-surface-soft)]",
    );
  });
});
