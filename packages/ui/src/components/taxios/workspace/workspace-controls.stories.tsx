import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { StoryCanvas } from "../../../storybook/story-canvas";
import "./workspace.css";
import { WorkspaceCloseButton, WorkspaceSegmented } from "./workspace-controls";
import { WorkspaceSummaryChip } from "./workspace-status";

const meta = {
  title: "Taxios/TaxiOS/Workspace/Controls",
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="520px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const CloseButton: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <WorkspaceCloseButton label="Schliessen" />
    </div>
  ),
};

function SegmentedDemo() {
  const [trip, setTrip] = useState<"oneway" | "roundtrip">("oneway");
  const [assign, setAssign] = useState<"members" | "count">("members");

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <WorkspaceSegmented
        aria-label="Fahrttyp"
        onValueChange={setTrip}
        options={[
          { value: "oneway", label: "Hinfahrt" },
          { value: "roundtrip", label: "Hin- und Rückfahrt" },
        ]}
        value={trip}
      />
      <WorkspaceSegmented
        aria-label="Zuweisung"
        onValueChange={setAssign}
        options={[
          { value: "members", label: "Mitglieder/Gäste zuweisen" },
          { value: "count", label: "Nur Anzahl Gäste" },
        ]}
        value={assign}
      />
    </div>
  );
}

export const Segmented: Story = {
  render: () => <SegmentedDemo />,
};

export const ControlHeightScale: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <WorkspaceSummaryChip size="sm">sm / 36px</WorkspaceSummaryChip>
        <div
          className="flex min-h-[var(--taxis-control-h-sm)] items-center rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-3 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)]"
        >
          Compact control
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <WorkspaceSummaryChip size="md">md / 44px</WorkspaceSummaryChip>
        <div
          className="flex min-h-[var(--taxis-control-h-md)] items-center rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-3.5 font-semibold text-[13px] text-[var(--taxis-workspace-text-secondary)]"
        >
          Default input / button
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <WorkspaceSummaryChip size="lg">lg / 52px</WorkspaceSummaryChip>
        <div
          className="flex min-h-[var(--taxis-control-h-lg)] items-center rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-4 font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]"
        >
          Large primary action
        </div>
      </div>
    </div>
  ),
};
