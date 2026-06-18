import { Button } from "@taxios-v2/ui/components/ui/button";
import {
  WorkspaceInnerCard,
  WorkspaceSectionHeader,
  WorkspaceSurface
} from "@taxios-v2/ui/components/taxios/workspace/workspace-primitives";

export function EmptyStateBlock() {
  return (
    <WorkspaceSurface className="p-6">
      <WorkspaceSectionHeader
        subtitle="Use for empty operational sections where the shell and context remain visible."
        title="No rides in this queue"
      />
      <WorkspaceInnerCard className="taxis-company-surface-empty mt-5 p-8 text-center">
        <p className="text-sm font-semibold text-[var(--taxis-workspace-text-strong)]">
          Nothing needs dispatch right now.
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--taxis-workspace-text-muted)]">
          New company bookings and provider updates will appear here as compact rows.
        </p>
        <div className="mt-5 flex justify-center">
          <Button variant="outline">Review all rides</Button>
        </div>
      </WorkspaceInnerCard>
    </WorkspaceSurface>
  );
}

export default EmptyStateBlock;
