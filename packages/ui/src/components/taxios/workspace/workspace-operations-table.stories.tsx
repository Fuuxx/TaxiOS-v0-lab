import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CarFront,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Inbox,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";

import { Button } from "../../ui/button";
import { StoryCanvas } from "../../../storybook/story-canvas";
import {
  OperationsDataTable,
  OperationsDataTableActionCell,
  OperationsDataTableBody,
  OperationsDataTableCell,
  OperationsDataTableHeader,
  OperationsDataTableHeaderCell,
  OperationsDataTableRow,
  RideStatusBadge,
  TableStatusCell,
} from "./workspace-operations-table";
import "./workspace.css";

const STATUS_TONES = [
  "neutral",
  "muted",
  "info",
  "success",
  "attention",
  "danger",
  "strong",
  "accent",
] as const;

const rows = [
  {
    id: "BKG-8HTXCR",
    passenger: "Ayoub Amhid",
    route: "Potsdamer Platz 1 -> Berlin Hauptbahnhof",
    status: {
      description: "Provided by the operations payload.",
      icon: <Clock3 />,
      label: "Scheduled",
      tone: "info",
    },
    time: "09:20",
  },
  {
    id: "BKG-2VU66A",
    passenger: "Xenia Yilmaz",
    route: "Werrastraße 36 -> Linkstraße 5",
    status: {
      description: "Provided by the operations payload.",
      icon: <CarFront />,
      label: "Driver assigned",
      tone: "success",
    },
    time: "10:00",
  },
  {
    id: "BKG-WBYD39",
    passenger: "Gina Gomez",
    route: "Leipziger Platz 1 -> Berlin Central Office",
    status: {
      description: "Provided by the operations payload.",
      icon: <CircleDashed />,
      label: "Awaiting provider confirmation",
      tone: "attention",
    },
    time: "13:40",
  },
] as const;

const meta = {
  title: "Taxios/TaxiOS/Workspace/Operations Clarity",
  component: OperationsDataTable,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1180px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Presentational operations status and table recipe. It renders provided labels, tones, icons, descriptions, and slots only; it does not define lifecycle, allowed actions, sorting, filtering, or pagination.",
      },
    },
    layout: "fullscreen",
  },
} satisfies Meta<typeof OperationsDataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

function OperationsRowsTable() {
  return (
    <OperationsDataTable
      badge={
        <span className="rounded-full border border-[var(--taxis-workspace-surface-rim)] px-3 py-1 font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.12em]">
          3 visible
        </span>
      }
      title="Operations"
    >
      <OperationsDataTableHeader>
        <OperationsDataTableHeaderCell edge="start">
          Time
        </OperationsDataTableHeaderCell>
        <OperationsDataTableHeaderCell>Route</OperationsDataTableHeaderCell>
        <OperationsDataTableHeaderCell>Passenger</OperationsDataTableHeaderCell>
        <OperationsDataTableHeaderCell>ID</OperationsDataTableHeaderCell>
        <OperationsDataTableHeaderCell>Status</OperationsDataTableHeaderCell>
        <OperationsDataTableHeaderCell edge="end">Action</OperationsDataTableHeaderCell>
      </OperationsDataTableHeader>
      <OperationsDataTableBody>
        {rows.map((row) => (
          <OperationsDataTableRow interactive key={row.id}>
            <OperationsDataTableCell edge="start">
              <span className="taxis-data-inline block font-semibold text-[16px] text-[var(--taxis-workspace-text-strong)]">
                {row.time}
              </span>
            </OperationsDataTableCell>
            <OperationsDataTableCell className="font-semibold">
              {row.route}
            </OperationsDataTableCell>
            <OperationsDataTableCell>{row.passenger}</OperationsDataTableCell>
            <OperationsDataTableCell className="taxis-data-id font-semibold text-[11px]">
              {row.id}
            </OperationsDataTableCell>
            <TableStatusCell
              status={row.status}
            />
            <OperationsDataTableActionCell>
              <Button size="sm" variant="outline">
                Details
              </Button>
            </OperationsDataTableActionCell>
          </OperationsDataTableRow>
        ))}
      </OperationsDataTableBody>
    </OperationsDataTable>
  );
}

export const StatusBadgeDefault: Story = {
  name: "Status badge default",
  render: () => (
    <RideStatusBadge
      description="This text is provided by the caller."
      icon={<Clock3 />}
      label="Driver assigned"
      tone="info"
    />
  ),
};

export const AllProvidedTones: Story = {
  name: "Status badge tones",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_TONES.map((tone) => (
        <RideStatusBadge key={tone} label={tone} tone={tone} />
      ))}
    </div>
  ),
};

export const LongLabel: Story = {
  name: "Status badge long label",
  render: () => (
    <div className="max-w-[280px]">
      <RideStatusBadge
        ariaLabel="Ride status: provider confirmation is still pending after dispatch review"
        description="The long label is supplied by the payload and truncated visually."
        icon={<ShieldAlert />}
        label="Provider confirmation is still pending after dispatch review"
        tone="attention"
      />
    </div>
  ),
};

export const TableStatusCellStory: Story = {
  name: "Table status cell",
  render: () => (
    <OperationsDataTable title="Status cell">
      <OperationsDataTableHeader>
        <OperationsDataTableHeaderCell edge="start">
          Booking
        </OperationsDataTableHeaderCell>
        <OperationsDataTableHeaderCell edge="end">
          Status
        </OperationsDataTableHeaderCell>
      </OperationsDataTableHeader>
      <OperationsDataTableBody>
        <OperationsDataTableRow>
          <OperationsDataTableCell edge="start">BKG-8HTXCR</OperationsDataTableCell>
          <TableStatusCell
            className="rounded-r-[18px] border-r"
            status={{ icon: <CheckCircle2 />, label: "Confirmed", tone: "success" }}
          />
        </OperationsDataTableRow>
      </OperationsDataTableBody>
    </OperationsDataTable>
  ),
};

export const RowWithStatus: Story = {
  name: "Table row with status",
  render: () => <OperationsRowsTable />,
};

export const EmptyTable: Story = {
  name: "Empty table",
  render: () => (
    <OperationsDataTable
      state={{
        description: "No rows were provided for this table state.",
        icon: <Inbox />,
        title: "No operations",
        variant: "empty",
      }}
      title="Operations"
    />
  ),
};

export const LoadingTable: Story = {
  name: "Loading table",
  render: () => (
    <OperationsDataTable
      state={{
        title: "Operations are loading",
        variant: "loading",
      }}
      title="Operations"
    />
  ),
};

export const ErrorTable: Story = {
  name: "Error table",
  render: () => (
    <OperationsDataTable
      state={{
        action: (
          <Button size="sm" variant="outline">
            Retry
          </Button>
        ),
        description: "The caller supplied this error state.",
        icon: <TriangleAlert />,
        title: "Operations unavailable",
        variant: "error",
      }}
      title="Operations"
    />
  ),
};

export const NarrowWidth: Story = {
  name: "390px narrow sanity",
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="390px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  render: () => <OperationsRowsTable />,
};
