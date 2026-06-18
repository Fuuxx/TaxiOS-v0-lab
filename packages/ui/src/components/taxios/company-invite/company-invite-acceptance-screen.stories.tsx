import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  demoCompanyInviteAccepted,
  demoCompanyInviteAcceptanceCopy,
  demoCompanyInviteClaimed,
  demoCompanyInviteExpired,
  demoCompanyInvitePending,
  demoCompanyInviteRejected,
  demoCompanyInviteRevoked,
} from "../../../storybook/fixtures/company-invite.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { Button } from "../../ui/button";
import { CompanyInviteAcceptanceScreen } from "./company-invite-acceptance-screen";

const meta = {
  title: "Taxios/TaxiOS/Company Invite/Acceptance Screen",
  component: CompanyInviteAcceptanceScreen,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="920px">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CompanyInviteAcceptanceScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SignedInPending: Story = {
  args: {
    acceptAction: (
      <Button type="button" variant="brand">
        {demoCompanyInviteAcceptanceCopy.acceptLabel}
      </Button>
    ),
    copy: demoCompanyInviteAcceptanceCopy,
    invite: demoCompanyInvitePending,
    signedIn: true,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const SignedOutPending: Story = {
  args: {
    copy: demoCompanyInviteAcceptanceCopy,
    invite: demoCompanyInvitePending,
    signedIn: false,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const Accepted: Story = {
  args: {
    copy: demoCompanyInviteAcceptanceCopy,
    invite: demoCompanyInviteAccepted,
    signedIn: true,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const Claimed: Story = {
  args: {
    copy: demoCompanyInviteAcceptanceCopy,
    invite: demoCompanyInviteClaimed,
    signedIn: true,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const Rejected: Story = {
  args: {
    copy: demoCompanyInviteAcceptanceCopy,
    invite: demoCompanyInviteRejected,
    signedIn: true,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const Revoked: Story = {
  args: {
    copy: demoCompanyInviteAcceptanceCopy,
    invite: demoCompanyInviteRevoked,
    signedIn: true,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const Expired: Story = {
  args: {
    copy: demoCompanyInviteAcceptanceCopy,
    invite: demoCompanyInviteExpired,
    signedIn: true,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};

export const Invalid: Story = {
  args: {
    copy: demoCompanyInviteAcceptanceCopy,
    invite: null,
    signedIn: true,
    signInHref: "/sign-in",
    signUpHref: "/sign-up",
  },
};
