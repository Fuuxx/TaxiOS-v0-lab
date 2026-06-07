import type { Meta, StoryObj } from "@storybook/react-vite";

import { StoryCanvas } from "../../../storybook/story-canvas";
import { CompanyReportsWorkspaceContent } from "./company-reports-screen";

const meta = {
  title: "Taxios/TaxiOS/Company Reports/Screen",
  component: CompanyReportsWorkspaceContent,
  decorators: [
    (Story) => (
      <StoryCanvas contentClassName="p-0" maxWidth="none" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CompanyReportsWorkspaceContent>;

export default meta;

type Story = StoryObj<typeof meta>;

const copy = {
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
  summarySectionTitle: "Übersicht",
  title: "Berichte",
};

export const MvpReadiness: Story = {
  args: {
    copy,
    payload: {
      allowedActions: [
        {
          id: "view_company_reports",
          label: "View company reports",
        },
      ],
      bookingStatusBreakdown: [
        {
          description: "Noch nicht bestätigte Company-Buchungen.",
          id: "requested",
          label: "Angefragt",
          tone: "orange",
          value: 2,
        },
        {
          description: "Bestaetigte oder laufende Buchungen.",
          id: "active",
          label: "Aktiv",
          tone: "blue",
          value: 4,
        },
        {
          description: "Abgeschlossene Buchungen mit operativem Abschluss.",
          id: "completed",
          label: "Abgeschlossen",
          tone: "green",
          value: 6,
        },
        {
          description: "Stornierte Buchungen im Auswertungsfenster.",
          id: "cancelled",
          label: "Storniert",
          tone: "red",
          value: 1,
        },
      ],
      coverageLabel: "Neueste 13 von maximal 100 Buchungen",
      financeMetrics: [
        {
          description: "Erzeugte Rechnungssnapshots im MVP-Finance-Layer.",
          label: "Rechnungssnapshots",
          tone: "neutral",
          value: "7",
        },
        {
          description: "Snapshots ohne finalen Preis.",
          label: "Nicht bepreist",
          tone: "orange",
          value: "3",
        },
        {
          description: "Bekannter Betrag aus bereits bepreisten Snapshots.",
          label: "Bekannter Wert",
          tone: "green",
          value: "842,00 EUR",
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
        {
          bookingId: "booking_2",
          passengerSummary: "Ben Active + 1",
          pickupLabel: "08:30 - 21.05.2026",
          publicId: "BKG-REP002",
          routeLabel: "Friedrichstrasse 100 -> Alexanderplatz",
          statusLabel: "Aktiv",
          tone: "blue",
        },
        {
          bookingId: "booking_3",
          passengerSummary: "Req Passenger",
          pickupLabel: "09:00 - 22.05.2026",
          publicId: "BKG-REP003",
          routeLabel: "TaxiOS Smoke HQ -> BER Terminal 1",
          statusLabel: "Angefragt",
          tone: "orange",
        },
      ],
      summaryMetrics: [
        {
          description: "Neueste Buchungen im Reports-Auswertungsfenster.",
          label: "Ausgewertete Buchungen",
          tone: "neutral",
          value: "13",
        },
        {
          description:
            "Aktive Buchungen, die noch nicht final abgeschlossen sind.",
          label: "Aktive Buchungen",
          tone: "blue",
          value: "4",
        },
        {
          description: "Abgeschlossene Buchungen in der aktuellen Auswertung.",
          label: "Abgeschlossen",
          tone: "green",
          value: "6",
        },
        {
          description: "Rechnungssnapshots aus abgeschlossenen Buchungen.",
          label: "Finance-Snapshots",
          tone: "green",
          value: "7",
        },
      ],
    },
  },
};

export const EmptyReadOnlyMvp: Story = {
  args: {
    copy,
    payload: {
      ...MvpReadiness.args?.payload,
      recentRows: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Read-only reports placeholder rendered through the shared WorkspaceStateView primitive.",
      },
    },
  },
};
