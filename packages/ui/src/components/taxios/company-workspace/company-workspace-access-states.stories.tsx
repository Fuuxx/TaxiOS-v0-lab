import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleOff, LockKeyhole, SearchX, type LucideIcon } from "lucide-react";

import { StoryCanvas } from "../../../storybook/story-canvas";
import "./company-workspace-material.css";
import { CompanyWorkspaceSurface } from "./company-workspace-primitives";

function WorkspaceAccessState({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="taxis-company-workspace-content taxis-workspace-content-area">
      <div className="taxis-company-workspace-frame">
        <CompanyWorkspaceSurface className="mx-auto max-w-2xl p-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--taxis-workspace-surface-soft)] text-[var(--taxis-workspace-text-muted)]">
            <Icon aria-hidden="true" size={20} strokeWidth={1.9} />
          </span>
          <h2 className="mt-5 font-semibold text-[24px] text-[var(--taxis-workspace-text-primary)] tracking-tight">
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-[var(--taxis-workspace-text-secondary)] leading-6">
            {description}
          </p>
        </CompanyWorkspaceSurface>
      </div>
    </div>
  );
}

const meta = {
  title: "Taxios/TaxiOS/Company Workspace/Access States",
  component: WorkspaceAccessState,
  decorators: [
    (Story) => (
      <StoryCanvas contentClassName="p-0" maxWidth="none" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WorkspaceAccessState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Forbidden: Story = {
  args: {
    description:
      "Deine Rolle hat für diesen Bereich keine Leseberechtigung. Die Navigation blendet den Bereich aus, direkte URLs zeigen diesen Zustand.",
    icon: LockKeyhole,
    title: "Kein Zugriff auf diesen Bereich",
  },
};

export const Empty: Story = {
  args: {
    description:
      "Der Bereich ist erreichbar, aber für deine aktuelle Rolle oder deinen Workspace gibt es keine sichtbaren Datensätze.",
    icon: CircleOff,
    title: "Keine sichtbaren Daten",
  },
};

export const SearchUnavailable: Story = {
  args: {
    description:
      "Workspace-Suche erscheint nur, wenn die aktive Rolle die Suchberechtigung aus dem Backend-Payload erhaelt.",
    icon: SearchX,
    title: "Suche nicht verfügbar",
  },
};
