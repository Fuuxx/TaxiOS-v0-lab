import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "@taxios-v2/ui/components/ui/label";

import { StoryCanvas } from "../../storybook/story-canvas";
import { Input } from "./input";

const meta = {
  title: "TaxiOS/UI/Label",
  component: Label,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="560px" tone="neutral">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="cost-center-default">Kostenstelle</Label>
      <Input id="cost-center-default" placeholder="2100" />
    </div>
  ),
};

export const WithRequiredMarker: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="cost-center-required">
        Kostenstelle
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      </Label>
      <Input
        aria-describedby="cost-center-required-help"
        id="cost-center-required"
        placeholder="2100"
      />
      <p className="text-muted-foreground text-xs" id="cost-center-required-help">
        Pflichtfeld für interne Abrechnung.
      </p>
    </div>
  ),
};

export const DisabledPeer: Story = {
  render: () => (
    <div className="grid gap-2">
      <Input className="peer" disabled id="cost-center-disabled" />
      <Label htmlFor="cost-center-disabled">Kostenstelle</Label>
    </div>
  ),
};
