import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "@taxios-v2/ui/components/ui/input";

import { StoryCanvas } from "../../storybook/story-canvas";
import { Label } from "./label";

const meta = {
  title: "TaxiOS/UI/Input",
  component: Input,
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
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="route-from-default">Abholung</Label>
      <Input id="route-from-default" placeholder="Adresse eingeben" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="route-from-disabled">Abholung</Label>
      <Input
        disabled
        id="route-from-disabled"
        placeholder="Adresse gesperrt"
      />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="route-from-invalid">Abholung</Label>
      <Input
        aria-describedby="route-from-invalid-error"
        aria-invalid
        id="route-from-invalid"
        placeholder="Adresse eingeben"
      />
      <p
        className="text-destructive text-sm"
        id="route-from-invalid-error"
      >
        Adresse ist erforderlich.
      </p>
    </div>
  ),
};

export const FocusVisibleDemo: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="route-from-focus">Abholung</Label>
      <Input
        autoFocus
        id="route-from-focus"
        placeholder="Fokus sichtbar"
      />
    </div>
  ),
};
