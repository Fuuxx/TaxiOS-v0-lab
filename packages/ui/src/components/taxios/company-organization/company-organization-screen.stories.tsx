import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  demoCompanyMemberInviteFormCopy,
  demoCompanyMemberRoleOptions,
  demoCompanyMemberUnitOptions,
  demoCompanyOrganizationCopy,
  demoCompanyOrganizationDisabledPayload,
  demoCompanyOrganizationEmptyPayload,
  demoCompanyOrganizationPayload,
  demoCompanyUnitFormCopy,
} from "../../../storybook/fixtures/company-organization.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { Button } from "../../ui/button";
import { CompanyMemberInviteForm } from "./company-member-invite-form";
import { CompanyOrganizationScreen } from "./company-organization-screen";
import { CompanyUnitForm } from "./company-unit-form";

const meta = {
  title: "Taxios/TaxiOS/Company Organization/Screen",
  component: CompanyOrganizationScreen,
  decorators: [
    (Story) => (
      <StoryCanvas contentClassName="p-0" maxWidth="none" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CompanyOrganizationScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultInviteForm = (
  <CompanyMemberInviteForm
    copy={demoCompanyMemberInviteFormCopy}
    onSubmit={() => {
      return;
    }}
    roleOptions={demoCompanyMemberRoleOptions}
    unitOptions={demoCompanyMemberUnitOptions}
  />
);

const defaultUnitForm = (
  <CompanyUnitForm
    copy={demoCompanyUnitFormCopy}
    onSubmit={() => {
      return;
    }}
  />
);

const defaultArgs = {
  activeSection: "overview" as const,
  copy: demoCompanyOrganizationCopy,
  inviteForm: defaultInviteForm,
  onRenderInvitationAction: ({ action }: { action: { id: string; label: string; disabled?: boolean } }) => (
    <Button disabled={action.disabled} size="sm" variant="outline">
      {action.label}
    </Button>
  ),
  payload: demoCompanyOrganizationPayload,
  unitForm: defaultUnitForm,
};

export const WithOrganizationData: Story = {
  args: defaultArgs,
};

export const EmptyOrganization: Story = {
  args: {
    ...defaultArgs,
    payload: demoCompanyOrganizationEmptyPayload,
  },
};

export const DisabledAdminActions: Story = {
  args: {
    ...defaultArgs,
    inviteForm: (
      <CompanyMemberInviteForm
        action={demoCompanyOrganizationDisabledPayload.allowedActions[1]}
        copy={demoCompanyMemberInviteFormCopy}
        onSubmit={() => {
          return;
        }}
        roleOptions={demoCompanyMemberRoleOptions}
        unitOptions={demoCompanyMemberUnitOptions}
      />
    ),
    payload: demoCompanyOrganizationDisabledPayload,
    unitForm: (
      <CompanyUnitForm
        action={demoCompanyOrganizationDisabledPayload.allowedActions[0]}
        copy={demoCompanyUnitFormCopy}
        onSubmit={() => {
          return;
        }}
      />
    ),
  },
};

export const InviteCreated: Story = {
  args: {
    activeSection: "invites",
    copy: demoCompanyOrganizationCopy,
    inviteForm: (
      <CompanyMemberInviteForm
        copy={demoCompanyMemberInviteFormCopy}
        inviteUrl="http://localhost:3001/company-invite/example-token"
        onCopyInviteUrl={() => {
          return;
        }}
        onSubmit={() => {
          return;
        }}
        roleOptions={demoCompanyMemberRoleOptions}
        successMessage={demoCompanyMemberInviteFormCopy.successLabel}
        unitOptions={demoCompanyMemberUnitOptions}
      />
    ),
    payload: demoCompanyOrganizationPayload,
    unitForm: defaultUnitForm,
  },
};

export const StandorteFocused: Story = {
  args: {
    ...defaultArgs,
    activeSection: "standorte",
  },
};

export const MembersFocused: Story = {
  args: {
    ...defaultArgs,
    activeSection: "members",
  },
};

export const InvitesFocused: Story = {
  args: {
    ...defaultArgs,
    activeSection: "invites",
  },
};

export const MemberAddDrawerOpen: Story = {
  args: {
    ...defaultArgs,
    activeSection: "members",
    initialAddDialogMode: "member",
    initialAddDialogOpen: true,
  },
};

export const StandortAddDrawerOpen: Story = {
  args: {
    ...defaultArgs,
    activeSection: "standorte",
    initialAddDialogMode: "unit",
    initialAddDialogOpen: true,
  },
};

export const UnitDetailDrawerOpen: Story = {
  args: {
    ...defaultArgs,
    activeSection: "standorte",
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.ownerDocument?.body ?? canvasElement;
    const button = canvas.querySelector<HTMLButtonElement>(
      '[aria-label*="HQ Berlin"]',
    );
    if (!button) throw new Error("Unit card action not found");
    button.click();
  },
};

export const MemberDetailDrawerOpen: Story = {
  args: {
    ...defaultArgs,
    activeSection: "members",
    onSelectMember: () => {
      return;
    },
    selectedMemberDetail: {
      access: demoCompanyOrganizationPayload.members[1].access,
      auditHistory: [
        {
          createdAt: 1_800_010_000_000,
          decision: "company_member_access_updated",
          publicId: "AUD-3M9P2A",
          reason: null,
        },
      ],
      companyContactEmail: "accepted.member@example.com",
      displayName: "Accepted Member",
      email: "accepted.member@example.com",
      imageUrl: null,
      memberPublicId: "MEM-W4C8MJ",
      membershipCreatedAt: 1_800_000_000_000,
      membershipId: "membership_member",
      membershipUpdatedAt: 1_800_010_000_000,
      status: "active",
      unitName: "Airport Desk",
      userPublicId: "USR-8J2KQ4",
    },
    selectedMemberId: "membership_member",
  },
};

export const NarrowWidth: Story = {
  args: defaultArgs,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const LongLabels: Story = {
  args: {
    ...defaultArgs,
    copy: {
      ...demoCompanyOrganizationCopy,
      title: "Very Long Company Organization Name That Exceeds Normal Width",
    },
    payload: {
      ...demoCompanyOrganizationPayload,
      members: [
        {
          ...demoCompanyOrganizationPayload.members[0],
          displayName:
            "Extremely Long Display Name That Will Test Truncation Behavior In The Table Cell",
        },
        ...demoCompanyOrganizationPayload.members.slice(1),
      ],
      organizationName: "Very Long Company Organization Name That Exceeds Normal Width",
      units: [
        {
          ...demoCompanyOrganizationPayload.units[0],
          name: "Extremely Long Unit Name That Tests Card Title Truncation And Layout Stability",
        },
        ...demoCompanyOrganizationPayload.units.slice(1),
      ],
    },
  },
};

export const TabSwitchingInteraction: Story = {
  args: defaultArgs,
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.ownerDocument?.body ?? canvasElement;

    const membersTab = canvas.querySelector<HTMLButtonElement>(
      '[data-company-organization-section-link="members"]',
    );
    if (!membersTab) throw new Error("Members tab not found");
    membersTab.click();

    const root = canvas.querySelector("[data-company-organization-root]");
    if (!root) throw new Error("Organization root not found");
    if (root.getAttribute("data-company-organization-active-section") !== "members") {
      throw new Error("Expected active section to be members after click");
    }

    const invitesTab = canvas.querySelector<HTMLButtonElement>(
      '[data-company-organization-section-link="invites"]',
    );
    if (!invitesTab) throw new Error("Invites tab not found");
    invitesTab.click();

    if (root.getAttribute("data-company-organization-active-section") !== "invites") {
      throw new Error("Expected active section to be invites after click");
    }
  },
};
