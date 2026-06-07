import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  demoProviderDriverInviteFormCopy,
  demoProviderDriversCopy,
  demoProviderDriversDisabledPayload,
  demoProviderDriversEmptyPayload,
  demoProviderDriversPayload,
} from "../../../storybook/fixtures/provider-drivers.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { Button } from "../../ui/button";
import { ProviderDriverInviteForm } from "./provider-driver-invite-form";
import { ProviderDriversScreen } from "./provider-drivers-screen";

const meta = {
  title: "Taxios/TaxiOS/Provider Drivers/Screen",
  component: ProviderDriversScreen,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1240px">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProviderDriversScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithInvites: Story = {
  args: {
    copy: demoProviderDriversCopy,
    inviteForm: (
      <ProviderDriverInviteForm
        copy={demoProviderDriverInviteFormCopy}
        onSubmit={() => {
          return;
        }}
      />
    ),
    onRenderAction: ({ action }) => (
      <Button disabled={action.disabled} size="sm" variant="outline">
        {action.label}
      </Button>
    ),
    organizationName: "City Funk Berlin",
    payload: demoProviderDriversPayload,
  },
};

export const EmptyRoster: Story = {
  args: {
    copy: demoProviderDriversCopy,
    inviteForm: (
      <ProviderDriverInviteForm
        copy={demoProviderDriverInviteFormCopy}
        onSubmit={() => {
          return;
        }}
      />
    ),
    organizationName: "City Funk Berlin",
    payload: demoProviderDriversEmptyPayload,
  },
};

export const DisabledInviteAction: Story = {
  args: {
    copy: demoProviderDriversCopy,
    inviteForm: (
      <ProviderDriverInviteForm
        copy={demoProviderDriverInviteFormCopy}
        disabled
        disabledReason={demoProviderDriversDisabledPayload.allowedActions[0]?.reason}
        onSubmit={() => {
          return;
        }}
      />
    ),
    organizationName: "City Funk Berlin",
    payload: demoProviderDriversDisabledPayload,
  },
};

export const InviteCreated: Story = {
  args: {
    copy: demoProviderDriversCopy,
    inviteForm: (
      <ProviderDriverInviteForm
        copy={demoProviderDriverInviteFormCopy}
        inviteUrl="http://localhost:3001/driver-invite/example-token"
        onCopyInviteUrl={() => {
          return;
        }}
        onSubmit={() => {
          return;
        }}
        successMessage={demoProviderDriverInviteFormCopy.successLabel}
      />
    ),
    organizationName: "City Funk Berlin",
    payload: demoProviderDriversPayload,
  },
};
