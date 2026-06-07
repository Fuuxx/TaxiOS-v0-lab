import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  demoDriverJobsCopy,
  demoDriverJobsEmptyPayload,
  demoDriverJobsHistoryPayload,
  demoDriverJobsMissingVehiclePayload,
  demoDriverJobsPayload,
} from "../../../storybook/fixtures/driver-jobs.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { DriverJobsScreen } from "./driver-jobs-screen";

const meta = {
  title: "Taxios/TaxiOS/Driver Jobs/Screen",
  component: DriverJobsScreen,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1240px">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DriverJobsScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

const demoContextSwitcher = (
  <div className="inline-flex min-h-11 items-center rounded-2xl border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-4 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)]">
    City Funk Berlin - Driver
  </div>
);

const demoSessionAction = (
  <button
    className="inline-flex min-h-10 items-center rounded-xl border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-3 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)]"
    type="button"
  >
    Sign out
  </button>
);

export const ActiveJob: Story = {
  args: {
    activeContextSwitcher: demoContextSwitcher,
    copy: demoDriverJobsCopy,
    organizationName: "City Funk Berlin",
    payload: demoDriverJobsPayload,
    sessionAction: demoSessionAction,
  },
};

export const MissingVehicleDisabled: Story = {
  args: {
    activeContextSwitcher: demoContextSwitcher,
    copy: demoDriverJobsCopy,
    organizationName: "City Funk Berlin",
    payload: demoDriverJobsMissingVehiclePayload,
    sessionAction: demoSessionAction,
  },
};

export const TerminalHistory: Story = {
  args: {
    activeContextSwitcher: demoContextSwitcher,
    copy: demoDriverJobsCopy,
    organizationName: "City Funk Berlin",
    payload: demoDriverJobsHistoryPayload,
    sessionAction: demoSessionAction,
  },
};

export const NoAccessState: Story = {
  args: {
    activeContextSwitcher: demoContextSwitcher,
    copy: demoDriverJobsCopy,
    organizationName: "No active driver context",
    payload: demoDriverJobsEmptyPayload,
    sessionAction: demoSessionAction,
  },
};
