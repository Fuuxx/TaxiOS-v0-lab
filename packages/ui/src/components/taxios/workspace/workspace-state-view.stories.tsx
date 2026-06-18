import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inbox, TriangleAlert } from "lucide-react";

import { Button } from "../../ui/button";
import { StoryCanvas } from "../../../storybook/story-canvas";
import "./workspace.css";
import { WorkspaceStateView } from "./workspace-state-view";

const meta = {
  title: "Taxios/TaxiOS/Workspace/StateView",
  component: WorkspaceStateView,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="720px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WorkspaceStateView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    variant: "empty",
    icon: <Inbox />,
    title: "Keine aktiven Fahrten",
    description:
      "Sobald eine Buchung startet, erscheint sie hier in Echtzeit.",
  },
};

export const ErrorState: Story = {
  name: "Error",
  args: {
    variant: "error",
    icon: <TriangleAlert />,
    title: "Fahrten konnten nicht geladen werden",
    description:
      "Bitte versuche es erneut. Falls das Problem bestehen bleibt, lade die Seite neu.",
  },
};

export const Loading: Story = {
  args: {
    variant: "loading",
    title: "Fahrten werden geladen",
  },
};

export const WithAction: Story = {
  args: {
    variant: "error",
    icon: <TriangleAlert />,
    title: "Verbindung unterbrochen",
    description: "Die Live-Daten sind aktuell nicht verfügbar.",
    action: (
      <Button size="sm" variant="outline">
        Erneut versuchen
      </Button>
    ),
  },
};

export const Narrow: Story = {
  args: {
    variant: "empty",
    icon: <Inbox />,
    title: "Keine Einträge",
    description: "Hier ist noch nichts vorhanden.",
  },
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="360px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
};
