import { Badge } from "@taxios-v2/ui/components/ui/badge";
import { Button } from "@taxios-v2/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@taxios-v2/ui/components/ui/card";
import { Input } from "@taxios-v2/ui/components/ui/input";
import { Label } from "@taxios-v2/ui/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@taxios-v2/ui/components/ui/table";
import {
  WorkspaceEntityCard,
  WorkspaceEntityCardDetails,
  WorkspaceEntityCardIcon,
  WorkspaceEntityCardLabel,
  WorkspaceEntityCardMetric,
  WorkspaceEntityCardMetrics
} from "@taxios-v2/ui/components/taxios/workspace/workspace-entity-card";
import {
  WorkspaceInnerCard,
  WorkspaceSectionHeader,
  WorkspaceSurface
} from "@taxios-v2/ui/components/taxios/workspace/workspace-primitives";
import {
  WorkspaceTable,
  WorkspaceTableCell,
  WorkspaceTableHeaderCell,
  WorkspaceTableRow,
  WorkspaceTableScroll,
  WorkspaceTableShell
} from "@taxios-v2/ui/components/taxios/workspace/workspace-table";
import {
  WorkspaceWizardBody,
  WorkspaceWizardFooter,
  WorkspaceWizardHeader,
  WorkspaceWizardLayout,
  WorkspaceWizardMainPanel,
  WorkspaceWizardPanel,
  WorkspaceWizardRail,
  WorkspaceWizardScroll,
  WorkspaceWizardSection,
  WorkspaceWizardStatusGrid,
  WorkspaceWizardStatusItem
} from "@taxios-v2/ui/components/taxios/workspace/workspace-wizard";
import { workspaceChipClassForTone } from "@taxios-v2/ui/components/taxios/workspace/workspace-status";
import { Building2, Car, Route } from "lucide-react";

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="default">Confirm ride</Button>
      <Button variant="brand">Priority action</Button>
      <Button variant="outline">Secondary</Button>
      <Button variant="ghost">Quiet action</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Issue</Badge>
    </div>
  );
}

export function InputDemo() {
  return (
    <div className="grid max-w-md gap-2">
      <Label htmlFor="registry-pickup">Pickup address</Label>
      <Input id="registry-pickup" placeholder="Berlin Central Station" />
    </div>
  );
}

export function LabelDemo() {
  return (
    <div className="grid max-w-md gap-2">
      <Label htmlFor="registry-label-demo">Operational label</Label>
      <Input id="registry-label-demo" placeholder="Labeled input" />
    </div>
  );
}

export function CardDemo() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Ride command</CardTitle>
        <CardDescription>Compact operational card using TaxiOS tokens.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--taxis-workspace-text-muted)]">
          3 active rides, 1 provider pending, 0 permission issues.
        </p>
      </CardContent>
    </Card>
  );
}

export function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ride</TableHead>
          <TableHead>Route</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>TX-2408</TableCell>
          <TableCell>HQ to Airport</TableCell>
          <TableCell>Assigned</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export function WorkspaceSurfaceDemo() {
  return (
    <WorkspaceSurface className="p-6">
      <WorkspaceSectionHeader
        subtitle="Porcelain surface for workspace pages."
        title="Workspace surface"
      />
    </WorkspaceSurface>
  );
}

export function WorkspaceInnerCardDemo() {
  return (
    <WorkspaceSurface className="p-5">
      <WorkspaceInnerCard className="p-5">
        <p className="text-sm font-semibold text-[var(--taxis-workspace-text-strong)]">
          Inner content card
        </p>
        <p className="mt-1 text-sm text-[var(--taxis-workspace-text-muted)]">
          Used for grouped details inside workspace material.
        </p>
      </WorkspaceInnerCard>
    </WorkspaceSurface>
  );
}

export function WorkspaceSectionHeaderDemo() {
  return (
    <WorkspaceSurface className="p-5">
      <WorkspaceSectionHeader
        action={<Button size="sm" variant="outline">Export</Button>}
        badge={<span className={workspaceChipClassForTone("info", "sm")}>Live</span>}
        subtitle="Header, supporting copy, optional badge, and action."
        title="Workspace section"
      />
    </WorkspaceSurface>
  );
}

export function WorkspaceEntityCardDemo() {
  return (
    <WorkspaceEntityCard className="max-w-xl p-5" selected>
      <div className="flex items-start gap-4">
        <WorkspaceEntityCardIcon>
          <Building2 size={18} />
        </WorkspaceEntityCardIcon>
        <WorkspaceEntityCardDetails>
          <WorkspaceEntityCardLabel>Company unit</WorkspaceEntityCardLabel>
          <h3 className="mt-1 text-base font-semibold text-[var(--taxis-workspace-text-strong)]">
            Executive Mobility
          </h3>
          <WorkspaceEntityCardMetrics>
            <WorkspaceEntityCardMetric label="Members" value="24" />
            <WorkspaceEntityCardMetric label="Active rides" value="8" />
          </WorkspaceEntityCardMetrics>
        </WorkspaceEntityCardDetails>
      </div>
    </WorkspaceEntityCard>
  );
}

export function WorkspaceTableDemo() {
  return (
    <WorkspaceTableShell>
      <WorkspaceSectionHeader subtitle="Workspace table composition." title="Ride queue" />
      <WorkspaceTableScroll className="mt-4">
        <WorkspaceTable>
          <thead>
            <WorkspaceTableRow>
              <WorkspaceTableHeaderCell>Ride</WorkspaceTableHeaderCell>
              <WorkspaceTableHeaderCell>Route</WorkspaceTableHeaderCell>
              <WorkspaceTableHeaderCell>Status</WorkspaceTableHeaderCell>
            </WorkspaceTableRow>
          </thead>
          <tbody>
            <WorkspaceTableRow interactive>
              <WorkspaceTableCell>TX-2408</WorkspaceTableCell>
              <WorkspaceTableCell>HQ to Airport</WorkspaceTableCell>
              <WorkspaceTableCell>
                <span className={workspaceChipClassForTone("success", "sm")}>Assigned</span>
              </WorkspaceTableCell>
            </WorkspaceTableRow>
          </tbody>
        </WorkspaceTable>
      </WorkspaceTableScroll>
    </WorkspaceTableShell>
  );
}

export function WorkspaceWizardDemo() {
  return (
    <WorkspaceWizardPanel className="relative h-auto max-h-none w-full max-w-4xl">
      <WorkspaceWizardHeader>
        <div>
          <p className="taxis-company-page-eyebrow">Wizard shell</p>
          <h2 className="text-xl font-semibold text-[var(--taxis-workspace-text-strong)]">
            Booking setup
          </h2>
        </div>
      </WorkspaceWizardHeader>
      <WorkspaceWizardBody>
        <WorkspaceWizardScroll>
          <WorkspaceWizardLayout>
            <WorkspaceWizardMainPanel>
              <WorkspaceWizardSection>
                <Label htmlFor="wizard-demo-route">Route</Label>
                <Input id="wizard-demo-route" placeholder="HQ to Airport" />
              </WorkspaceWizardSection>
            </WorkspaceWizardMainPanel>
            <WorkspaceWizardRail>
              <WorkspaceWizardStatusGrid>
                <WorkspaceWizardStatusItem ready>Route</WorkspaceWizardStatusItem>
                <WorkspaceWizardStatusItem>Passengers</WorkspaceWizardStatusItem>
              </WorkspaceWizardStatusGrid>
            </WorkspaceWizardRail>
          </WorkspaceWizardLayout>
        </WorkspaceWizardScroll>
      </WorkspaceWizardBody>
      <WorkspaceWizardFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Continue</Button>
      </WorkspaceWizardFooter>
    </WorkspaceWizardPanel>
  );
}

export function WorkspaceStatusChipsDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <span className={workspaceChipClassForTone("success", "sm")}>Assigned</span>
      <span className={workspaceChipClassForTone("accent", "sm")}>On way</span>
      <span className={workspaceChipClassForTone("attention", "sm")}>Arrived</span>
      <span className={workspaceChipClassForTone("danger", "sm")}>Issue</span>
      <span className={workspaceChipClassForTone("muted", "sm")}>Queued</span>
    </div>
  );
}

export function WorkspacePrimitiveIconRow() {
  return (
    <div className="flex gap-2 text-[var(--taxis-workspace-text-muted)]">
      <Car size={18} />
      <Route size={18} />
    </div>
  );
}
