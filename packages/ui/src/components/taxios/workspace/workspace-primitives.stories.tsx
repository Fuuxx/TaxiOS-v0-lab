import type { Meta, StoryObj } from "@storybook/react-vite";

import { StoryCanvas } from "../../../storybook/story-canvas";
import {
  WorkspaceStateChip,
  WorkspaceSummaryChip,
  workspaceChipClassForTone,
} from "./workspace-status";
import "./workspace.css";
import {
  WorkspaceInnerCard,
  WorkspaceSectionHeader,
  WorkspaceSurface,
} from "./workspace-primitives";

const meta = {
  title: "Taxios/TaxiOS/Workspace/Primitives",
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="960px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const WorkspaceSurfaceStory: Story = {
  name: "WorkspaceSurface",
  render: () => (
    <WorkspaceSurface className="max-w-lg rounded-[28px] p-6">
      <p className="font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)]">
        Workspace surface
      </p>
      <p className="mt-2 text-[13px] text-[var(--taxis-workspace-text-muted)] leading-6">
        Product-wide porcelain material for Company, Provider, Driver, Search,
        Notifications, and Invite workspace surfaces.
      </p>
    </WorkspaceSurface>
  ),
};

export const WorkspaceInnerCardStory: Story = {
  name: "WorkspaceInnerCard",
  render: () => (
    <WorkspaceSurface className="max-w-xl rounded-[30px] p-5">
      <WorkspaceInnerCard className="rounded-[22px] p-5">
        <p className="font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
          Workspace inner card
        </p>
        <p className="mt-2 text-[13px] text-[var(--taxis-workspace-text-muted)] leading-6">
          Nested operational content can reuse this material without importing
          dashboard primitives.
        </p>
      </WorkspaceInnerCard>
    </WorkspaceSurface>
  ),
};

export const WorkspaceSectionHeaderStory: Story = {
  name: "WorkspaceSectionHeader",
  render: () => (
    <WorkspaceSurface className="max-w-xl rounded-[30px] p-6">
      <WorkspaceSectionHeader
        badge={
          <span className={workspaceChipClassForTone("neutral")}>
            12 sichtbar
          </span>
        }
        subtitle="Shared section rhythm for table, card, form, and static workspace surfaces."
        title="Operational section"
      />
    </WorkspaceSurface>
  ),
};

export const WorkspaceStatusChipsStory: Story = {
  name: "Workspace status chips",
  render: () => (
    <WorkspaceSurface className="max-w-xl rounded-[30px] p-6">
      <WorkspaceSectionHeader title="Workspace status chips" />
      <div className="mt-5 flex flex-wrap gap-2">
        {(
          [
            "neutral",
            "muted",
            "info",
            "success",
            "attention",
            "danger",
            "strong",
          ] as const
        ).map((tone) => (
          <WorkspaceStateChip key={tone} tone={tone}>
            {tone}
          </WorkspaceStateChip>
        ))}
      </div>
    </WorkspaceSurface>
  ),
};

export const SummaryChipStory: Story = {
  name: "SummaryChip",
  render: () => (
    <WorkspaceSurface className="max-w-xl rounded-[30px] p-6">
      <WorkspaceSectionHeader
        subtitle="Passive context only. SummaryChip is always neutral and has no tone prop."
        title="SummaryChip"
      />
      <div className="mt-5 flex flex-wrap gap-2">
        <WorkspaceSummaryChip>
          <span>
            <span className="taxis-data-inline">3</span> Fahrgäste
          </span>
        </WorkspaceSummaryChip>
        <WorkspaceSummaryChip>
          <span>
            <span className="taxis-data-inline">1</span> Fahrzeug
          </span>
        </WorkspaceSummaryChip>
        <WorkspaceSummaryChip>Zeit offen</WorkspaceSummaryChip>
        <WorkspaceSummaryChip className="max-w-44">
          <span className="min-w-0 truncate">
            Sehr langer neutraler Zusammenfassungswert
          </span>
        </WorkspaceSummaryChip>
      </div>
    </WorkspaceSurface>
  ),
};

export const StateChipStory: Story = {
  name: "StateChip",
  render: () => (
    <WorkspaceSurface className="max-w-xl rounded-[30px] p-6">
      <WorkspaceSectionHeader
        subtitle="StateChip is tone-driven and uses existing status tokens."
        title="StateChip"
      />
      <div className="mt-5 flex flex-wrap gap-2">
        {(
          [
            "neutral",
            "accent",
            "success",
            "attention",
            "danger",
          ] as const
        ).map((tone) => (
          <WorkspaceStateChip key={tone} tone={tone}>
            {tone}
          </WorkspaceStateChip>
        ))}
        <WorkspaceStateChip tone="accent">live</WorkspaceStateChip>
      </div>
    </WorkspaceSurface>
  ),
};
