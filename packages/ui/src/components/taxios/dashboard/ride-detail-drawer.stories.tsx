import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "./company-dashboard.css";
import {
  demoCompanyDashboardCopyDe,
  demoRideDetailTrip,
} from "../../../storybook/fixtures/company-dashboard.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { createRideDetailViewModel, RideDetailDrawer } from "./ride-detail-drawer";

const meta = {
  title: "Taxios/TaxiOS/Company Dashboard/Ride Detail Drawer",
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1400px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function RideDetailDrawerOpenStatefulDemo() {
  const [open, setOpen] = useState(true);
  return (
    <RideDetailDrawer
      copy={demoCompanyDashboardCopyDe.rides}
      detail={createRideDetailViewModel(
        demoRideDetailTrip,
        demoCompanyDashboardCopyDe.rides,
      )}
      isOpen={open}
      onClose={() => setOpen(false)}
    />
  );
}

export const RideDetailDrawerOpenStory: Story = {
  name: "Open",
  render: () => <RideDetailDrawerOpenStatefulDemo />,
};

export const RideDetailDrawerClosedHiddenStory: Story = {
  name: "Closed",
  render: () => (
    <RideDetailDrawer
      copy={demoCompanyDashboardCopyDe.rides}
      detail={createRideDetailViewModel(
        demoRideDetailTrip,
        demoCompanyDashboardCopyDe.rides,
      )}
      isOpen={false}
      onClose={() => {}}
    />
  ),
};

export const RideDetailDrawerNoSelectionStory: Story = {
  name: "No detail",
  render: () => (
    <RideDetailDrawer
      copy={demoCompanyDashboardCopyDe.rides}
      detail={null}
      isOpen={false}
      onClose={() => {}}
    />
  ),
};
