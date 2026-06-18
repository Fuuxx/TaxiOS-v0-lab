import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  demoProviderFleetCopy,
  demoProviderFleetDisabledPayload,
  demoProviderFleetEmptyPayload,
  demoProviderFleetPayload,
  demoProviderVehicleFormCopy,
} from "../../../storybook/fixtures/provider-fleet.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { ProviderFleetScreen } from "./provider-fleet-screen";
import { ProviderVehicleForm } from "./provider-vehicle-form";

const meta = {
  title: "Taxios/TaxiOS/Provider Fleet/Screen",
  component: ProviderFleetScreen,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1240px">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProviderFleetScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithVehicles: Story = {
  args: {
    copy: demoProviderFleetCopy,
    organizationName: "City Funk Berlin",
    payload: demoProviderFleetPayload,
    registerVehicleForm: (
      <ProviderVehicleForm
        copy={demoProviderVehicleFormCopy}
        onSubmit={() => {
          return;
        }}
      />
    ),
  },
};

export const EmptyFleet: Story = {
  args: {
    copy: demoProviderFleetCopy,
    organizationName: "City Funk Berlin",
    payload: demoProviderFleetEmptyPayload,
    registerVehicleForm: (
      <ProviderVehicleForm
        copy={demoProviderVehicleFormCopy}
        onSubmit={() => {
          return;
        }}
      />
    ),
  },
};

export const DisabledRegisterAction: Story = {
  args: {
    copy: demoProviderFleetCopy,
    organizationName: "City Funk Berlin",
    payload: demoProviderFleetDisabledPayload,
    registerVehicleForm: (
      <ProviderVehicleForm
        copy={demoProviderVehicleFormCopy}
        disabled
        disabledReason={
          demoProviderFleetDisabledPayload.allowedActions[0]?.reason
        }
        onSubmit={() => {
          return;
        }}
      />
    ),
  },
};

export const FormError: Story = {
  args: {
    copy: demoProviderFleetCopy,
    organizationName: "City Funk Berlin",
    payload: demoProviderFleetPayload,
    registerVehicleForm: (
      <ProviderVehicleForm
        copy={demoProviderVehicleFormCopy}
        errorMessage="Vehicle registration failed."
        onSubmit={() => {
          return;
        }}
      />
    ),
  },
};

export const FormSuccess: Story = {
  args: {
    copy: demoProviderFleetCopy,
    organizationName: "City Funk Berlin",
    payload: demoProviderFleetPayload,
    registerVehicleForm: (
      <ProviderVehicleForm
        copy={demoProviderVehicleFormCopy}
        onSubmit={() => {
          return;
        }}
        successMessage={demoProviderVehicleFormCopy.successLabel}
      />
    ),
  },
};
