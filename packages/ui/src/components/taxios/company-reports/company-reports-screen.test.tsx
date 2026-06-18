import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import type {
  CompanyReportsCopy,
  CompanyReportsPayload,
} from "../../../contracts/company-reports";
import { CompanyReportsWorkspaceContent } from "./company-reports-screen";

const copy: CompanyReportsCopy = {
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
    "Buchungen, Status und Finance-Signale bleiben für Admins sichtbar.",
  summarySectionTitle: "Übersicht",
  title: "Berichte",
};

const payload: CompanyReportsPayload = {
  allowedActions: [{ id: "view_company_reports", label: "View reports" }],
  bookingStatusBreakdown: [
    {
      description: "Noch nicht bestätigte Company-Buchungen.",
      id: "requested",
      label: "Angefragt",
      tone: "orange",
      value: 1,
    },
    {
      description: "Bestaetigte oder laufende Buchungen.",
      id: "active",
      label: "Aktiv",
      tone: "blue",
      value: 1,
    },
    {
      description: "Abgeschlossene Buchungen mit operativem Abschluss.",
      id: "completed",
      label: "Abgeschlossen",
      tone: "green",
      value: 1,
    },
    {
      description: "Stornierte Buchungen im Auswertungsfenster.",
      id: "cancelled",
      label: "Storniert",
      tone: "red",
      value: 0,
    },
  ],
  coverageLabel: "Neueste 3 von maximal 100 Buchungen",
  financeMetrics: [
    {
      description: "Erzeugte Rechnungssnapshots im MVP-Finance-Layer.",
      label: "Rechnungssnapshots",
      tone: "neutral",
      value: "1",
    },
  ],
  organizationId: "organization_1",
  organizationName: "Smoke Company HQ",
  recentRows: [
    {
      bookingId: "booking_1",
      passengerSummary: "Ada Reports",
      pickupLabel: "10:00 - 20.05.2026",
      publicId: "BKG-REP001",
      routeLabel: "Potsdamer Platz 1 -> Berlin Hauptbahnhof",
      statusLabel: "Abgeschlossen",
      tone: "green",
    },
  ],
  summaryMetrics: [
    {
      description: "Neueste Buchungen im Reports-Auswertungsfenster.",
      label: "Ausgewertete Buchungen",
      tone: "neutral",
      value: "3",
    },
  ],
};

describe("CompanyReportsWorkspaceContent", () => {
  test("renders reports metrics, status breakdown, and recent rows", () => {
    render(<CompanyReportsWorkspaceContent copy={copy} payload={payload} />);

    expect(screen.getByText("Berichte")).not.toBeNull();
    expect(screen.getByText("Smoke Company HQ")).not.toBeNull();
    expect(screen.getByText("Neueste 3 von maximal 100 Buchungen")).not.toBeNull();
    expect(screen.getByText("Ausgewertete Buchungen")).not.toBeNull();
    expect(screen.getByText("Buchungsstatus")).not.toBeNull();
    expect(screen.getByText("BKG-REP001")).not.toBeNull();
    expect(screen.getByText("Ada Reports")).not.toBeNull();
    expect(screen.getAllByText("Abgeschlossen").length).toBeGreaterThan(0);
  });

  test("renders empty state when no recent rows exist", () => {
    render(
      <CompanyReportsWorkspaceContent
        copy={copy}
        payload={{ ...payload, recentRows: [] }}
      />,
    );

    const emptyTitle = screen.getByText("Noch keine Reports-Daten");

    expect(emptyTitle).not.toBeNull();
    expect(emptyTitle.parentElement?.className).toContain(
      "bg-[var(--taxis-workspace-surface-soft)]",
    );
  });
});
