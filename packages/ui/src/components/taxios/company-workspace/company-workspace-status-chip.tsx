import type * as React from "react";

import { cn } from "../../../lib/utils";
import {
  companyWorkspaceChipClassForTone,
  type CompanyWorkspaceChipSize,
  type CompanyWorkspaceStatusTone,
} from "./company-workspace-status";

export type CompanyWorkspaceSummaryChipProps =
  React.ComponentPropsWithoutRef<"span"> & {
    size?: CompanyWorkspaceChipSize;
  };

export function CompanyWorkspaceSummaryChip({
  children,
  className,
  size = "sm",
  ...props
}: CompanyWorkspaceSummaryChipProps) {
  return (
    <span
      {...props}
      className={cn(companyWorkspaceChipClassForTone("neutral", size), className)}
    >
      {children}
    </span>
  );
}

export type CompanyWorkspaceStateChipProps =
  React.ComponentPropsWithoutRef<"span"> & {
    size?: CompanyWorkspaceChipSize;
    tone: CompanyWorkspaceStatusTone;
  };

export function CompanyWorkspaceStateChip({
  children,
  className,
  size = "sm",
  tone,
  ...props
}: CompanyWorkspaceStateChipProps) {
  return (
    <span
      {...props}
      className={cn(
        "taxis-status-chip",
        companyWorkspaceChipClassForTone(tone, size),
        className,
      )}
    >
      {children}
    </span>
  );
}
