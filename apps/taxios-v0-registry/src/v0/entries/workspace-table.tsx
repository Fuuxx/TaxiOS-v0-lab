import type { ReactNode } from "react";
import {
  WorkspaceTable,
  WorkspaceTableCell,
  WorkspaceTableHeaderCell,
  WorkspaceTableRow,
  WorkspaceTableScroll,
  WorkspaceTableShell
} from "@taxios-v2/ui/components/taxios/workspace/workspace-table";

function TaxiosLabCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {children}
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <TaxiosLabCanvas>
      <div className="space-y-2">
        <p className="taxis-company-page-eyebrow">TaxiOS Component Lab</p>
        <h1 className="taxis-company-page-title">Workspace Table</h1>
        <p className="taxis-company-page-description">
          Operational data table with TaxiOS workspace tokens.
        </p>
      </div>

      <WorkspaceTableShell>
        <WorkspaceTableScroll className="mt-4">
          <WorkspaceTable>
            <thead>
              <WorkspaceTableRow>
                <WorkspaceTableHeaderCell>Ride</WorkspaceTableHeaderCell>
                <WorkspaceTableHeaderCell>Route</WorkspaceTableHeaderCell>
                <WorkspaceTableHeaderCell>Owner</WorkspaceTableHeaderCell>
                <WorkspaceTableHeaderCell>Status</WorkspaceTableHeaderCell>
              </WorkspaceTableRow>
            </thead>
            <tbody>
              <WorkspaceTableRow interactive>
                <WorkspaceTableCell>TX-2408</WorkspaceTableCell>
                <WorkspaceTableCell>HQ to Airport</WorkspaceTableCell>
                <WorkspaceTableCell>M. Weber</WorkspaceTableCell>
                <WorkspaceTableCell>
                  <span className="inline-flex min-h-7 items-center rounded-full bg-[var(--taxis-status-success-bg)] px-3 font-semibold text-[11px] text-[var(--taxis-status-success-text)] ring-1 ring-[var(--taxis-status-success-ring)]">
                    Assigned
                  </span>
                </WorkspaceTableCell>
              </WorkspaceTableRow>
              <WorkspaceTableRow interactive>
                <WorkspaceTableCell>TX-2411</WorkspaceTableCell>
                <WorkspaceTableCell>Hotel to Messe</WorkspaceTableCell>
                <WorkspaceTableCell>A. Kaya</WorkspaceTableCell>
                <WorkspaceTableCell>
                  <span className="inline-flex min-h-7 items-center rounded-full bg-[var(--taxis-status-accent-bg)] px-3 font-semibold text-[11px] text-[var(--taxis-status-accent-text)] ring-1 ring-[var(--taxis-status-accent-ring)]">
                    On way
                  </span>
                </WorkspaceTableCell>
              </WorkspaceTableRow>
              <WorkspaceTableRow interactive>
                <WorkspaceTableCell>TX-2415</WorkspaceTableCell>
                <WorkspaceTableCell>Station to Office</WorkspaceTableCell>
                <WorkspaceTableCell>L. Chen</WorkspaceTableCell>
                <WorkspaceTableCell>
                  <span className="inline-flex min-h-7 items-center rounded-full bg-[var(--taxis-status-muted-bg)] px-3 font-semibold text-[11px] text-[var(--taxis-status-muted-text)] ring-1 ring-[var(--taxis-status-muted-ring)]">
                    Queued
                  </span>
                </WorkspaceTableCell>
              </WorkspaceTableRow>
            </tbody>
          </WorkspaceTable>
        </WorkspaceTableScroll>
      </WorkspaceTableShell>
    </TaxiosLabCanvas>
  );
}
