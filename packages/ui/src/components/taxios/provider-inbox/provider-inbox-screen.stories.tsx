import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  demoProviderInboxActiveRows,
  demoProviderInboxCopy,
  demoProviderDriverOptions,
  demoProviderInboxReadOnlyRows,
  demoProviderInboxTerminalHistoryRows,
  demoProviderJobFormCopy,
  demoProviderVehicleOptions,
} from "../../../storybook/fixtures/provider-inbox.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { ProviderJobForm } from "./provider-job-form";
import { ProviderInboxScreen } from "./provider-inbox-screen";

const meta = {
  title: "Taxios/TaxiOS/Provider Inbox/Screen",
  component: ProviderInboxScreen,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1240px">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProviderInboxScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithProviderActions: Story = {
  args: {
    activeRows: demoProviderInboxActiveRows,
    activeVisibleCount: demoProviderInboxActiveRows.length,
    copy: demoProviderInboxCopy,
    driverOptions: demoProviderDriverOptions,
    vehicleOptions: demoProviderVehicleOptions,
    organizationName: "City Funk Berlin",
    terminalHistoryRows: demoProviderInboxTerminalHistoryRows,
    terminalHistoryVisibleCount: demoProviderInboxTerminalHistoryRows.length,
  },
};

export const WithProviderJobForm: Story = {
  args: {
    activeRows: demoProviderInboxActiveRows,
    activeVisibleCount: demoProviderInboxActiveRows.length,
    copy: demoProviderInboxCopy,
    driverOptions: demoProviderDriverOptions,
    vehicleOptions: demoProviderVehicleOptions,
    organizationName: "City Funk Berlin",
    providerJobForm: (
      <ProviderJobForm
        copy={demoProviderJobFormCopy}
        onSubmit={() => {
          return;
        }}
      />
    ),
    terminalHistoryRows: demoProviderInboxTerminalHistoryRows,
    terminalHistoryVisibleCount: demoProviderInboxTerminalHistoryRows.length,
  },
};

export const EmptyInbox: Story = {
  args: {
    activeRows: [],
    activeVisibleCount: 0,
    copy: demoProviderInboxCopy,
    organizationName: "City Funk Berlin",
    terminalHistoryRows: [],
    terminalHistoryVisibleCount: 0,
  },
};

export const ReadOnlyDriver: Story = {
  args: {
    activeRows: demoProviderInboxReadOnlyRows,
    activeVisibleCount: demoProviderInboxReadOnlyRows.length,
    copy: demoProviderInboxCopy,
    organizationName: "City Funk Berlin",
    terminalHistoryRows: [],
    terminalHistoryVisibleCount: 0,
  },
};

export const TerminalRows: Story = {
  args: {
    activeRows: [],
    activeVisibleCount: 0,
    copy: demoProviderInboxCopy,
    organizationName: "City Funk Berlin",
    terminalHistoryRows: demoProviderInboxTerminalHistoryRows,
    terminalHistoryVisibleCount: demoProviderInboxTerminalHistoryRows.length,
  },
};
