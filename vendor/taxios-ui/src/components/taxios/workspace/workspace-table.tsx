import type React from "react";

import { cn } from "../../../lib/utils";
import { WorkspaceSurface } from "./workspace-primitives";

export type WorkspaceTableShellProps =
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceTableShell({
  children,
  className,
  ...props
}: WorkspaceTableShellProps) {
  return (
    <WorkspaceSurface
      {...props}
      className={cn(
        "taxis-company-surface-section taxis-workspace-table-shell overflow-hidden p-5",
        className,
      )}
    >
      {children}
    </WorkspaceSurface>
  );
}

export type WorkspaceTableScrollProps =
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceTableScroll({
  children,
  className,
  ...props
}: WorkspaceTableScrollProps) {
  return (
    <div
      {...props}
      className={cn(
        "taxis-workspace-table-scroll taxis-company-table-scroll taxis-workspace-scrollbar overflow-x-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type WorkspaceTableProps =
  React.TableHTMLAttributes<HTMLTableElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceTable({
  children,
  className,
  ...props
}: WorkspaceTableProps) {
  return (
    <table
      {...props}
      className={cn(
        "taxis-workspace-table taxis-company-table w-full border-separate text-left",
        className,
      )}
    >
      {children}
    </table>
  );
}

export type WorkspaceTableRowProps =
  React.HTMLAttributes<HTMLTableRowElement> & {
    children?: React.ReactNode;
    interactive?: boolean;
  };

export function WorkspaceTableRow({
  children,
  className,
  interactive = false,
  ...props
}: WorkspaceTableRowProps) {
  return (
    <tr
      {...props}
      className={cn(
        "taxis-workspace-table-row taxis-company-table-row",
        interactive && "taxis-workspace-table-row-interactive",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export type WorkspaceTableHeaderCellProps =
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceTableHeaderCell({
  children,
  className,
  ...props
}: WorkspaceTableHeaderCellProps) {
  return (
    <th
      {...props}
      className={cn("taxis-workspace-table-header-cell", className)}
    >
      {children}
    </th>
  );
}

export type WorkspaceTableCellProps =
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceTableCell({
  children,
  className,
  ...props
}: WorkspaceTableCellProps) {
  return (
    <td {...props} className={cn("taxis-workspace-table-cell", className)}>
      {children}
    </td>
  );
}
