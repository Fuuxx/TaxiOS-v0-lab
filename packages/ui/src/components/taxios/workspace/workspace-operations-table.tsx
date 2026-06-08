import type React from "react";

import { cn } from "../../../lib/utils";
import { WorkspaceSectionHeader } from "./workspace-primitives";
import { WorkspaceStateView, type WorkspaceStateVariant } from "./workspace-state-view";
import {
  WorkspaceStateChip,
  type WorkspaceChipSize,
  type WorkspaceStatusTone,
} from "./workspace-status";
import {
  WorkspaceTable,
  WorkspaceTableCell,
  type WorkspaceTableCellProps,
  WorkspaceTableHeaderCell,
  type WorkspaceTableHeaderCellProps,
  WorkspaceTableRow,
  type WorkspaceTableRowProps,
  WorkspaceTableScroll,
  WorkspaceTableShell,
} from "./workspace-table";

export type RideStatusBadgeProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "aria-label" | "children"
> & {
  ariaLabel?: string;
  description?: string;
  icon?: React.ReactNode;
  label: string;
  size?: WorkspaceChipSize;
  tone: WorkspaceStatusTone;
};

export type StatusCellProps = React.HTMLAttributes<HTMLDivElement> & {
  status: RideStatusBadgeProps;
};

export type TableStatusCellProps = Omit<WorkspaceTableCellProps, "children"> & {
  align?: "left" | "right";
  status: RideStatusBadgeProps;
};

export type OperationsDataTableState = {
  action?: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  title: string;
  variant: WorkspaceStateVariant;
};

export type OperationsDataTableProps =
  React.HTMLAttributes<HTMLDivElement> & {
    action?: React.ReactNode;
    badge?: React.ReactNode;
    children?: React.ReactNode;
    description?: string;
    state?: OperationsDataTableState;
    tableClassName?: string;
    tableMinWidthClassName?: string;
    title?: string;
  };

export type OperationsDataTableHeaderProps =
  React.HTMLAttributes<HTMLTableSectionElement> & {
    children?: React.ReactNode;
    rowClassName?: string;
  };

export type OperationsDataTableBodyProps =
  React.HTMLAttributes<HTMLTableSectionElement> & {
    children?: React.ReactNode;
  };

export type OperationsDataTableHeaderCellProps =
  WorkspaceTableHeaderCellProps & {
    edge?: "end" | "start";
  };

export type OperationsDataTableCellProps = WorkspaceTableCellProps & {
  edge?: "end" | "start";
};

export type OperationsDataTableRowProps = WorkspaceTableRowProps;

export type OperationsDataTableActionCellProps = Omit<
  WorkspaceTableCellProps,
  "children"
> & {
  children?: React.ReactNode;
};

export function RideStatusBadge({
  ariaLabel,
  className,
  description,
  icon,
  label,
  size = "sm",
  tone,
  ...props
}: RideStatusBadgeProps) {
  return (
    <WorkspaceStateChip
      {...props}
      className={cn(
        "max-w-full items-center gap-1.5 whitespace-nowrap",
        className,
      )}
      size={size}
      tone={tone}
    >
      {icon ? (
        <span aria-hidden="true" className="inline-flex shrink-0 [&_svg]:size-3.5">
          {icon}
        </span>
      ) : null}
      <span
        aria-hidden={ariaLabel ? "true" : undefined}
        className="min-w-0 truncate"
      >
        {label}
      </span>
      {ariaLabel ? <span className="sr-only">{ariaLabel}</span> : null}
      {description ? <span className="sr-only">{description}</span> : null}
    </WorkspaceStateChip>
  );
}

export function StatusCell({ className, status, ...props }: StatusCellProps) {
  return (
    <div
      {...props}
      className={cn("flex min-w-0 items-center", className)}
    >
      <RideStatusBadge {...status} />
    </div>
  );
}

export function TableStatusCell({
  align = "right",
  className,
  status,
  ...props
}: TableStatusCellProps) {
  return (
    <WorkspaceTableCell
      {...props}
      className={cn(
        "border-y px-4 py-3.5",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
    >
      <StatusCell
        className={align === "right" ? "justify-end" : "justify-start"}
        status={status}
      />
    </WorkspaceTableCell>
  );
}

export function OperationsDataTable({
  action,
  badge,
  children,
  className,
  description,
  state,
  tableClassName,
  tableMinWidthClassName = "min-w-[780px]",
  title,
  ...props
}: OperationsDataTableProps) {
  return (
    <WorkspaceTableShell {...props} className={className}>
      {title ? (
        <WorkspaceSectionHeader
          action={action}
          badge={badge}
          subtitle={description}
          title={title}
        />
      ) : null}
      {state ? (
        <WorkspaceStateView
          action={state.action}
          className={title ? "mt-4" : undefined}
          description={state.description}
          icon={state.icon}
          title={state.title}
          variant={state.variant}
        />
      ) : (
        <WorkspaceTableScroll className={title ? "mt-4" : undefined}>
          <WorkspaceTable
            className={cn(tableMinWidthClassName, tableClassName)}
          >
            {children}
          </WorkspaceTable>
        </WorkspaceTableScroll>
      )}
    </WorkspaceTableShell>
  );
}

export function OperationsDataTableHeader({
  children,
  className,
  rowClassName,
  ...props
}: OperationsDataTableHeaderProps) {
  return (
    <thead {...props} className={className}>
      <tr
        className={cn(
          "font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]",
          rowClassName,
        )}
      >
        {children}
      </tr>
    </thead>
  );
}

export function OperationsDataTableBody({
  children,
  className,
  ...props
}: OperationsDataTableBodyProps) {
  return (
    <tbody {...props} className={className}>
      {children}
    </tbody>
  );
}

export function OperationsDataTableHeaderCell({
  children,
  className,
  edge,
  ...props
}: OperationsDataTableHeaderCellProps) {
  return (
    <WorkspaceTableHeaderCell
      {...props}
      className={cn(
        "border-y px-4 py-2.5",
        edge === "start" && "rounded-l-xl border-l",
        edge === "end" && "rounded-r-xl border-r text-right",
        className,
      )}
    >
      {children}
    </WorkspaceTableHeaderCell>
  );
}

export function OperationsDataTableRow({
  children,
  className,
  ...props
}: OperationsDataTableRowProps) {
  return (
    <WorkspaceTableRow {...props} className={className}>
      {children}
    </WorkspaceTableRow>
  );
}

export function OperationsDataTableCell({
  children,
  className,
  edge,
  ...props
}: OperationsDataTableCellProps) {
  return (
    <WorkspaceTableCell
      {...props}
      className={cn(
        "border-y px-4 py-3.5 text-[13px] text-[var(--taxis-workspace-text-secondary)]",
        edge === "start" && "rounded-l-[18px] border-l",
        edge === "end" && "rounded-r-[18px] border-r",
        className,
      )}
    >
      {children}
    </WorkspaceTableCell>
  );
}

export function OperationsDataTableActionCell({
  children,
  className,
  ...props
}: OperationsDataTableActionCellProps) {
  return (
    <WorkspaceTableCell
      {...props}
      className={cn(
        "rounded-r-[18px] border-y border-r px-4 py-3.5 text-right",
        className,
      )}
    >
      <div className="flex justify-end gap-2">{children}</div>
    </WorkspaceTableCell>
  );
}
