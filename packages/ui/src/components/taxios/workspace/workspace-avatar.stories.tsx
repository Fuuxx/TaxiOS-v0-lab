import type React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { StoryCanvas } from "../../../storybook/story-canvas";
import { WorkspaceAccountCard, WorkspaceAvatarStack } from "./workspace-avatar";
import "./workspace.css";

const PEOPLE = [
  { id: "member-ada", initials: "AL", name: "Ada Lovelace" },
  { id: "member-grace", initials: "GH", name: "Grace Hopper" },
  { id: "member-katherine", initials: "KJ", name: "Katherine Johnson" },
  { id: "member-mary", initials: "MJ", name: "Mary Jackson" },
  { id: "member-dorothy", initials: "DV", name: "Dorothy Vaughan" },
  { id: "member-christine", initials: "CD", name: "Christine Darden" },
  { id: "member-margaret", initials: "MH", name: "Margaret Hamilton" },
  { id: "member-annie", initials: "AE", name: "Annie Easley" },
  { id: "member-joan", initials: "JC", name: "Joan Clarke" },
  { id: "member-radia", initials: "RP", name: "Radia Perlman" },
] as const;

const meta = {
  title: "Taxios/TaxiOS/Workspace/AvatarStack",
  component: WorkspaceAvatarStack,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="960px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Workspace-owned AvatarStack foundation. Default density shows four identities plus overflow; compact density shows three plus overflow. maxVisible is a component prop, not a token.",
      },
    },
    layout: "fullscreen",
  },
} satisfies Meta<typeof WorkspaceAvatarStack>;

export default meta;

type Story = StoryObj<typeof meta>;

function StackReviewFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <section className="mb-10 last:mb-0">
      <h2 className="mb-3 font-bold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.18em]">
        {label}
      </h2>
      <div className="inline-flex min-h-24 min-w-64 items-center rounded-[24px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-8 shadow-[var(--taxis-workspace-shadow-overlay)]">
        {children}
      </div>
    </section>
  );
}

export const Empty: Story = {
  args: {
    items: [],
  },
  render: (args) => (
    <StackReviewFrame label="0 avatars">
      <WorkspaceAvatarStack {...args} />
    </StackReviewFrame>
  ),
};

export const OneAvatar: Story = {
  args: {
    items: PEOPLE.slice(0, 1),
  },
  render: (args) => (
    <StackReviewFrame label="1 avatar">
      <WorkspaceAvatarStack {...args} />
    </StackReviewFrame>
  ),
};

export const ThreeAvatars: Story = {
  args: {
    items: PEOPLE.slice(0, 3),
  },
  render: (args) => (
    <StackReviewFrame label="3 avatars">
      <WorkspaceAvatarStack {...args} />
    </StackReviewFrame>
  ),
};

export const FourAvatarsDefault: Story = {
  args: {
    items: PEOPLE.slice(0, 4),
  },
  render: (args) => (
    <StackReviewFrame label="default density, 4 visible">
      <WorkspaceAvatarStack {...args} />
    </StackReviewFrame>
  ),
};

export const FiveAvatarsDefaultOverflow: Story = {
  args: {
    items: PEOPLE.slice(0, 5),
  },
  render: (args) => (
    <StackReviewFrame label="default density, 4 + overflow">
      <WorkspaceAvatarStack {...args} />
    </StackReviewFrame>
  ),
};

export const TenAvatarsDefaultOverflow: Story = {
  args: {
    items: PEOPLE,
  },
  render: (args) => (
    <StackReviewFrame label="default density, 4 + overflow">
      <WorkspaceAvatarStack {...args} />
    </StackReviewFrame>
  ),
};

export const CompactOverflow: Story = {
  args: {
    density: "compact",
    items: PEOPLE.slice(0, 6),
  },
  render: (args) => (
    <StackReviewFrame label="compact density, 3 + overflow">
      <WorkspaceAvatarStack {...args} />
    </StackReviewFrame>
  ),
};

export const FastBookingDefaultDensity: Story = {
  args: {
    avatarClassName: "h-[38px] w-[38px] ring-2 ring-[var(--taxis-workspace-surface)]",
    items: PEOPLE.slice(0, 7),
  },
  render: (args) => (
    <StackReviewFrame label="FastBooking card density, 4 + overflow">
      <WorkspaceAvatarStack {...args} />
    </StackReviewFrame>
  ),
};

export const TableCompactDensity: Story = {
  args: {
    avatarClassName: "h-8 w-8 ring-2 ring-[var(--taxis-workspace-surface)]",
    density: "compact",
    items: PEOPLE.slice(0, 5),
  },
  render: (args) => (
    <StackReviewFrame label="table density, 3 + overflow">
      <WorkspaceAvatarStack {...args} />
    </StackReviewFrame>
  ),
};

export const PresenceDots: Story = {
  args: {
    items: [
      {
        id: "member-ada",
        initials: "AL",
        name: "Ada Lovelace",
        presenceLabel: "Active",
        presenceTone: "success",
      },
      {
        id: "member-grace",
        initials: "GH",
        name: "Grace Hopper",
        presenceLabel: "Delayed",
        presenceTone: "attention",
      },
      {
        id: "member-katherine",
        initials: "KJ",
        name: "Katherine Johnson",
        presenceLabel: "Assigned",
        presenceTone: "info",
      },
      {
        id: "member-mary",
        initials: "MJ",
        name: "Mary Jackson",
        presenceLabel: "Offline",
        presenceTone: "neutral",
      },
    ],
  },
  render: (args) => (
    <StackReviewFrame label="identity with provided presence tone">
      <WorkspaceAvatarStack {...args} />
    </StackReviewFrame>
  ),
};

export const NarrowWidth: Story = {
  args: {
    density: "compact",
    items: PEOPLE,
  },
  render: (args) => (
    <div className="w-[390px] max-w-full">
      <StackReviewFrame label="390px narrow sanity">
        <WorkspaceAvatarStack {...args} />
      </StackReviewFrame>
    </div>
  ),
};

export const AccountCard: Story = {
  args: {
    items: [],
  },
  render: () => (
    <StackReviewFrame label="workspace account card">
      <div className="w-[292px]">
        <WorkspaceAccountCard
          subtitle="Geschäftskonto"
          title="Smoke Company Headquarters International"
        />
      </div>
    </StackReviewFrame>
  ),
};
