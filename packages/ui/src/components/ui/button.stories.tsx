import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@taxios-v2/ui/components/ui/button";

const meta = {
  title: "TaxiOS/UI/Button",
  component: Button,
  args: { children: "Action" },
  parameters: {
    a11y: { test: "error" },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Destructive: Story = {
  args: { variant: "destructive" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Small: Story = {
  args: { size: "sm" },
};
