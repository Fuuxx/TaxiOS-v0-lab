import type { Meta, StoryObj } from "@storybook/react-vite";

import "./company-dashboard.css";
import {
  demoCompanyDashboardCopyDe,
  demoFastbookingMembersExpanded,
} from "../../../storybook/fixtures/company-dashboard.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { CompanyDashboardFastbookingMemberPicker } from "./company-dashboard-fastbooking-member-picker";

const noopConfirm = (): void => {
  // Storybook static state.
};

const noopToggle = (_id: string): void => {
  // Storybook static state.
};

const fastbookingCopy = demoCompanyDashboardCopyDe.fastbooking;

const meta = {
  title: "Taxios/TaxiOS/Company Dashboard/Fastbooking Member Picker Overlay",
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1200px" tone="dashboard">
        <div className="relative mx-auto min-h-[360px] w-full max-w-[380px] overflow-hidden rounded-[28px] border border-[var(--taxis-workspace-surface-sheen)] bg-[var(--taxis-workspace-glass)] shadow-[var(--taxis-workspace-shadow-overlay)]">
          <Story />
        </div>
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const CompanyDashboardFastbookingMemberPickerManyOpenStory: Story = {
  name: "Open - many members",
  render: () => (
    <CompanyDashboardFastbookingMemberPicker
      bookLabel={fastbookingCopy.bookLabel}
      isOpen
      membersLabel={fastbookingCopy.membersLabel}
      noMembersFoundLabel={fastbookingCopy.noMembersFound}
      onConfirm={noopConfirm}
      onToggleMember={noopToggle}
      selectedMemberIds={[]}
      visibleMembers={[...demoFastbookingMembersExpanded]}
    />
  ),
};

export const CompanyDashboardFastbookingMemberPickerSelectedOpenStory: Story = {
  name: "Open - selected members",
  render: () => (
    <CompanyDashboardFastbookingMemberPicker
      bookLabel={fastbookingCopy.bookLabel}
      isOpen
      membersLabel={fastbookingCopy.membersLabel}
      noMembersFoundLabel={fastbookingCopy.noMembersFound}
      onConfirm={noopConfirm}
      onToggleMember={noopToggle}
      selectedMemberIds={["PL", "MK", "VB"]}
      visibleMembers={[...demoFastbookingMembersExpanded]}
    />
  ),
};

export const CompanyDashboardFastbookingMemberPickerEmptyOpenStory: Story = {
  name: "Open - empty",
  render: () => (
    <CompanyDashboardFastbookingMemberPicker
      bookLabel={fastbookingCopy.bookLabel}
      isOpen
      membersLabel={fastbookingCopy.membersLabel}
      noMembersFoundLabel={fastbookingCopy.noMembersFound}
      onConfirm={noopConfirm}
      onToggleMember={noopToggle}
      selectedMemberIds={[]}
      visibleMembers={[]}
    />
  ),
};
