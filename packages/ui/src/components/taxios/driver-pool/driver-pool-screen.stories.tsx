import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  demoDriverPoolCopy,
  demoDriverPoolEmptyPayload,
  demoDriverPoolPayload,
} from "../../../storybook/fixtures/driver-pool.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { DriverPoolScreen } from "./driver-pool-screen";

const meta = {
  title: "Taxios/TaxiOS/Driver Pool/Screen",
  component: DriverPoolScreen,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1240px">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DriverPoolScreen>;

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

export const AvailableJobs: Story = {
  args: {
    activeContextSwitcher: demoContextSwitcher,
    copy: demoDriverPoolCopy,
    organizationName: "City Funk Berlin",
    payload: demoDriverPoolPayload,
    sessionAction: demoSessionAction,
  },
};

export const Empty: Story = {
  args: {
    activeContextSwitcher: demoContextSwitcher,
    copy: demoDriverPoolCopy,
    organizationName: "City Funk Berlin",
    payload: demoDriverPoolEmptyPayload,
    sessionAction: demoSessionAction,
  },
};
