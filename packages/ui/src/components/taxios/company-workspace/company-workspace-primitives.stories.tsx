import type { Meta, StoryObj } from "@storybook/react-vite";

import { StoryCanvas } from "../../../storybook/story-canvas";
import "./company-workspace-material.css";
import {
  CompanyWorkspaceInnerCard,
  CompanyWorkspaceSurface,
} from "./company-workspace-primitives";

const meta = {
  title: "Taxios/TaxiOS/Company Workspace/Material Primitives",
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

export const CompanyWorkspaceSurfaceStory: Story = {
  name: "CompanyWorkspaceSurface",
  render: () => (
    <CompanyWorkspaceSurface className="max-w-lg rounded-[28px] p-6">
      <p className="font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)]">
        Company Workspace surface
      </p>
      <p className="mt-2 text-[13px] text-[var(--taxis-workspace-text-muted)] leading-6">
        Shared porcelain material for shell, page sections, cards, drawers, and
        future Company workspace primitives.
      </p>
    </CompanyWorkspaceSurface>
  ),
};

export const CompanyWorkspaceInnerCardStory: Story = {
  name: "CompanyWorkspaceInnerCard",
  render: () => (
    <CompanyWorkspaceSurface className="max-w-xl rounded-[30px] p-5">
      <CompanyWorkspaceInnerCard className="rounded-[22px] p-5">
        <p className="font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
          Inner card
        </p>
        <p className="mt-2 text-[13px] text-[var(--taxis-workspace-text-muted)] leading-6">
          Used for repeated entity cards, compact summaries, and nested
          operational content without creating a new page-local material style.
        </p>
      </CompanyWorkspaceInnerCard>
    </CompanyWorkspaceSurface>
  ),
};
