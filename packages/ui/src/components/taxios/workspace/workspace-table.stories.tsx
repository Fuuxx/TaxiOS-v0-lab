import type { Meta, StoryObj } from "@storybook/react-vite";

import { StoryCanvas } from "../../../storybook/story-canvas";
import "./workspace.css";
import { WorkspaceSectionHeader } from "./workspace-primitives";
import {
  WorkspaceTable,
  WorkspaceTableCell,
  WorkspaceTableHeaderCell,
  WorkspaceTableRow,
  WorkspaceTableScroll,
  WorkspaceTableShell,
} from "./workspace-table";

const meta = {
  title: "Taxios/TaxiOS/Workspace/Table",
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1180px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const rows = [
  {
    id: "BKG-8HTXCR",
    passenger: "Ayoub Amhid",
    route: "test 1 -> test 2",
    status: "Aktiv",
    time: "20:05",
  },
  {
    id: "BKG-2VU66A",
    passenger: "Xenia Yilmaz",
    route: "Werrastraße 36 -> Linkstraße 5",
    status: "Geplant",
    time: "08:40",
  },
  {
    id: "BKG-WBYD39",
    passenger: "Gina Gomez",
    route: "Leipziger Platz 1 -> Berlin Central Office",
    status: "Abgeschlossen",
    time: "13:00",
  },
];

export const OperationalTable: Story = {
  name: "Operational table",
  render: () => (
    <WorkspaceTableShell>
      <WorkspaceSectionHeader
        badge={
          <span className="rounded-full border border-[var(--taxis-workspace-surface-rim)] px-3 py-1 font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.12em]">
            3 sichtbar
          </span>
        }
        title="Workspace table"
      />
      <WorkspaceTableScroll className="mt-4">
        <WorkspaceTable className="min-w-[780px]">
          <thead>
            <tr className="font-semibold text-[10px] uppercase tracking-[0.15em]">
              <WorkspaceTableHeaderCell className="rounded-l-xl border-y border-l px-4 py-2.5">
                Zeit
              </WorkspaceTableHeaderCell>
              <WorkspaceTableHeaderCell className="border-y px-4 py-2.5">
                Route
              </WorkspaceTableHeaderCell>
              <WorkspaceTableHeaderCell className="border-y px-4 py-2.5">
                Passagier
              </WorkspaceTableHeaderCell>
              <WorkspaceTableHeaderCell className="border-y px-4 py-2.5">
                ID
              </WorkspaceTableHeaderCell>
              <WorkspaceTableHeaderCell className="rounded-r-xl border-y border-r px-4 py-2.5 text-right">
                Status
              </WorkspaceTableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <WorkspaceTableRow interactive key={row.id}>
                <WorkspaceTableCell className="rounded-l-[18px] border-y border-l px-4 py-3.5">
                  <span className="taxis-data-inline block font-semibold text-[16px] text-[var(--taxis-workspace-text-strong)]">
                    {row.time}
                  </span>
                </WorkspaceTableCell>
                <WorkspaceTableCell className="border-y px-4 py-3.5 font-semibold text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                  {row.route}
                </WorkspaceTableCell>
                <WorkspaceTableCell className="border-y px-4 py-3.5 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                  {row.passenger}
                </WorkspaceTableCell>
                <WorkspaceTableCell className="taxis-data-id border-y px-4 py-3.5 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)]">
                  {row.id}
                </WorkspaceTableCell>
                <WorkspaceTableCell className="rounded-r-[18px] border-y border-r px-4 py-3.5 text-right font-semibold text-[12px] text-[var(--taxis-workspace-text-strong)]">
                  {row.status}
                </WorkspaceTableCell>
              </WorkspaceTableRow>
            ))}
          </tbody>
        </WorkspaceTable>
      </WorkspaceTableScroll>
    </WorkspaceTableShell>
  ),
};
