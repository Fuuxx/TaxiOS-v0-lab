import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@taxios-v2/ui/components/ui/table";

import { StoryCanvas } from "../../storybook/story-canvas";
import { Badge } from "./badge";

const meta = {
  title: "TaxiOS/UI/Table",
  component: Table,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="920px" tone="neutral">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
  },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

const rows = [
  {
    costCenter: "2100",
    id: "BER-5562",
    passenger: "Patrick Lehmann",
    status: "Bestellt",
    time: "09:30",
  },
  {
    costCenter: "4200",
    id: "TX-9921",
    passenger: "Nina Keller",
    status: "Unterwegs",
    time: "14:00",
  },
  {
    costCenter: "1100",
    id: "MS-4410",
    passenger: "Tanja L.",
    status: "Wartet",
    time: "16:45",
  },
] as const;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Aktuelle Fahrten</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Fahrt</TableHead>
          <TableHead>Passagier</TableHead>
          <TableHead>Kostenstelle</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Zeit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.id}</TableCell>
            <TableCell>{row.passenger}</TableCell>
            <TableCell>{row.costCenter}</TableCell>
            <TableCell>
              <Badge variant="secondary">{row.status}</Badge>
            </TableCell>
            <TableCell className="text-right">{row.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Dense: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="h-8 py-1">Fahrt</TableHead>
          <TableHead className="h-8 py-1">Passagier</TableHead>
          <TableHead className="h-8 py-1 text-right">Zeit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.slice(0, 2).map((row) => (
          <TableRow key={row.id}>
            <TableCell className="py-2 font-medium">{row.id}</TableCell>
            <TableCell className="py-2">{row.passenger}</TableCell>
            <TableCell className="py-2 text-right">{row.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fahrt</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-muted-foreground" colSpan={2}>
            Keine Fahrten vorhanden.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
