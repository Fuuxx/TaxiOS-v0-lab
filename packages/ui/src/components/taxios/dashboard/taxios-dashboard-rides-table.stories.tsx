import type { Meta, StoryObj } from "@storybook/react-vite";

import "./company-dashboard.css";
import {
  demoCompanyDashboardCopyDe,
  demoDashboardTrips,
} from "../../../storybook/fixtures/company-dashboard.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import {
  TaxiosDashboardRidesTable,
  TaxiosDashboardRidesTableRow,
  type DashboardTrip,
} from "./taxios-dashboard-rides-table";

const noopOnSelect = (_trip: DashboardTrip): void => {
  // Storybook row selection is intentionally static.
};

const meta = {
  title: "Taxios/TaxiOS/Company Dashboard/Rides Table",
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1200px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const TaxiosDashboardRidesTableStory: Story = {
  name: "Rides table - multiple rows",
  render: () => (
    <TaxiosDashboardRidesTable copy={demoCompanyDashboardCopyDe.rides}>
      {demoDashboardTrips.slice(0, 4).map((trip) => (
        <TaxiosDashboardRidesTableRow
          copy={demoCompanyDashboardCopyDe.rides}
          key={trip.id}
          onSelect={noopOnSelect}
          trip={trip}
        />
      ))}
    </TaxiosDashboardRidesTable>
  ),
};

export const TaxiosDashboardRidesTableRowStory: Story = {
  name: "Rides table row - single",
  render: () => (
    <TaxiosDashboardRidesTable copy={demoCompanyDashboardCopyDe.rides}>
      <TaxiosDashboardRidesTableRow
        copy={demoCompanyDashboardCopyDe.rides}
        onSelect={noopOnSelect}
        trip={demoDashboardTrips[0]}
      />
    </TaxiosDashboardRidesTable>
  ),
};
