import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@taxios-v2/ui/components/ui/card";

import { StoryCanvas } from "../../storybook/story-canvas";
import { Button } from "./button";

const meta = {
  title: "TaxiOS/UI/Card",
  component: Card,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="760px" tone="neutral">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Monatsübersicht</CardTitle>
        <CardDescription>Aktuelle Mobilitätskosten</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          218 Fahrten, 7.142 EUR Ausgaben, keine offenen Limits.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Freigabe erforderlich</CardTitle>
        <CardDescription>Eine Fahrt wartet auf Prüfung.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Kostenstelle 2100, Abholung 14:00 Uhr.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="brand">
          Freigeben
        </Button>
        <Button size="sm" variant="outline">
          Ablehnen
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Compact: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">Heute</CardTitle>
        <CardDescription>4 geplante Fahrten</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="font-semibold text-2xl text-foreground">Nominal</p>
      </CardContent>
    </Card>
  ),
};
