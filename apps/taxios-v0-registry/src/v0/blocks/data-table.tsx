import { Button } from "@taxios-v2/ui/components/ui/button";
import { WorkspaceSectionHeader } from "@taxios-v2/ui/components/taxios/workspace/workspace-primitives";
import {
  WorkspaceTable,
  WorkspaceTableCell,
  WorkspaceTableHeaderCell,
  WorkspaceTableRow,
  WorkspaceTableScroll,
  WorkspaceTableShell
} from "@taxios-v2/ui/components/taxios/workspace/workspace-table";
import { workspaceChipClassForTone } from "@taxios-v2/ui/components/taxios/workspace/workspace-status";

const rides = [
  { id: "TX-2408", route: "HQ to Airport", owner: "M. Weber", status: "Assigned", tone: "success" },
  { id: "TX-2411", route: "Hotel to Messe", owner: "A. Kaya", status: "On way", tone: "accent" },
  { id: "TX-2415", route: "Station to Office", owner: "L. Chen", status: "Queued", tone: "muted" }
] as const;

export function DataTableBlock() {
  return (
    <WorkspaceTableShell>
      <WorkspaceSectionHeader
        action={<Button size="sm" variant="outline">Export</Button>}
        subtitle="Operational data table pattern for scan-heavy workspace pages."
        title="Ride operations"
      />
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
            {rides.map((ride) => (
              <WorkspaceTableRow interactive key={ride.id}>
                <WorkspaceTableCell>{ride.id}</WorkspaceTableCell>
                <WorkspaceTableCell>{ride.route}</WorkspaceTableCell>
                <WorkspaceTableCell>{ride.owner}</WorkspaceTableCell>
                <WorkspaceTableCell>
                  <span className={workspaceChipClassForTone(ride.tone, "sm")}>
                    {ride.status}
                  </span>
                </WorkspaceTableCell>
              </WorkspaceTableRow>
            ))}
          </tbody>
        </WorkspaceTable>
      </WorkspaceTableScroll>
    </WorkspaceTableShell>
  );
}

export default DataTableBlock;
