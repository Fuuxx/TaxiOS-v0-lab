import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@taxios-v2/ui/components/ui/badge";

const meta = {
  title: "TaxiOS/UI/Badge",
  component: Badge,
  args: { children: "Label" },
  parameters: {
    a11y: { test: "error" },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Destructive: Story = {
  args: { variant: "destructive" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};
