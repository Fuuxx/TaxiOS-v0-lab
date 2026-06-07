/**
 * Compatibility export for dashboard-local avatar imports.
 * New reusable work should import WorkspaceAvatar/WorkspaceAvatarStack from
 * the workspace layer instead of this dashboard path.
 */

import {
  WorkspaceAvatar,
  type WorkspaceAvatarProps,
} from "../workspace/workspace-avatar";

export type CompanyDashboardAvatarProps = WorkspaceAvatarProps;

export function CompanyDashboardAvatar({
  initials,
  overflowLabel,
  ...props
}: CompanyDashboardAvatarProps) {
  return (
    <WorkspaceAvatar
      initials={initials}
      overflowLabel={
        overflowLabel ??
        (initials.startsWith("+") ? `${initials} weitere Mitarbeiter` : undefined)
      }
      {...props}
    />
  );
}
