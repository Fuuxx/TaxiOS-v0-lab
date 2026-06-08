import type { Meta, StoryObj } from "@storybook/react-vite";

import { StoryCanvas } from "../../../storybook/story-canvas";
import { CompanyFinanceWorkspaceContent } from "./company-finance-screen";

const meta = {
  title: "Taxios/TaxiOS/Company Finance/Screen",
  component: CompanyFinanceWorkspaceContent,
  decorators: [
    (Story) => (
      <StoryCanvas contentClassName="p-0" maxWidth="none" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CompanyFinanceWorkspaceContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReadOnlyMvp: Story = {
  args: {
    copy: {
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
    },
    payload: {
      costRows: [
        {
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
        },
      ],
      invoiceRows: [
        {
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
        },
      ],
      organizationId: "organization_1",
      organizationName: "Smoke Company HQ",
      summary: {
        invoiceCount: 1,
        latestInvoiceLabel: "20.05.2026",
        pricedCount: 0,
        totalKnownAmountLabel: "—",
        unpricedCount: 1,
      },
    },
  },
};

export const EmptyReadOnlyMvp: Story = {
  args: {
    copy: ReadOnlyMvp.args?.copy,
    payload: {
      ...ReadOnlyMvp.args?.payload,
      costRows: [],
      invoiceRows: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Read-only finance placeholder rendered through the shared WorkspaceStateView primitive.",
      },
    },
  },
};
