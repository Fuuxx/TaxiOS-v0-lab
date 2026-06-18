import {
  WorkspaceInnerCard,
  WorkspaceSectionHeader,
  WorkspaceSurface
} from "@taxios-v2/ui/components/taxios/workspace/workspace-primitives";

const loadingRows = ["w-8/12", "w-6/12", "w-7/12"];

export function LoadingStateBlock() {
  return (
    <WorkspaceSurface className="p-6">
      <WorkspaceSectionHeader
        subtitle="Compact in-page loading state; no full-screen route fallback."
        title="Loading ride queue"
      />
      <WorkspaceInnerCard className="mt-5 grid gap-3 p-5" aria-busy="true">
        {loadingRows.map((width) => (
          <div
            className="h-11 rounded-xl border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-soft)] p-3"
            key={width}
          >
            <div className={`h-3 ${width} animate-pulse rounded-full bg-[var(--taxis-workspace-border)]`} />
          </div>
        ))}
      </WorkspaceInnerCard>
    </WorkspaceSurface>
  );
}

export default LoadingStateBlock;
