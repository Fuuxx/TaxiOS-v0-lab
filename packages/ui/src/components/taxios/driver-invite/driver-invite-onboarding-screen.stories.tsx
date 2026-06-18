import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  demoDriverInvite,
  demoDriverInviteCopy,
  demoDriverOnboardingFormCopy,
} from "../../../storybook/fixtures/driver-invite.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { DriverInviteOnboardingScreen } from "./driver-invite-onboarding-screen";
import { DriverOnboardingForm } from "./driver-onboarding-form";

const meta = {
  title: "Taxios/TaxiOS/Driver Invite/Onboarding",
  component: DriverInviteOnboardingScreen,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="960px">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DriverInviteOnboardingScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SignedOut: Story = {
  args: {
    copy: demoDriverInviteCopy,
    invite: demoDriverInvite,
    signedIn: false,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const OnboardingForm: Story = {
  args: {
    copy: demoDriverInviteCopy,
    invite: demoDriverInvite,
    onboardingForm: (
      <DriverOnboardingForm
        copy={demoDriverOnboardingFormCopy}
        onSubmit={() => {
          return;
        }}
      />
    ),
    signedIn: true,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const Submitted: Story = {
  args: {
    copy: demoDriverInviteCopy,
    invite: {
      ...demoDriverInvite,
      status: "onboarding_submitted",
    },
    signedIn: true,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const Approved: Story = {
  args: {
    copy: demoDriverInviteCopy,
    invite: {
      ...demoDriverInvite,
      status: "approved",
    },
    signedIn: true,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const Revoked: Story = {
  args: {
    copy: demoDriverInviteCopy,
    invite: {
      ...demoDriverInvite,
      status: "revoked",
    },
    signedIn: true,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const Expired: Story = {
  args: {
    copy: demoDriverInviteCopy,
    invite: {
      ...demoDriverInvite,
      status: "expired",
    },
    signedIn: true,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const Invalid: Story = {
  args: {
    copy: demoDriverInviteCopy,
    invite: null,
    signedIn: false,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};
