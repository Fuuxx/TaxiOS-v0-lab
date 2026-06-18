import type React from "react";
import type { ElementType } from "react";

import { cn } from "../../../lib/utils";
import { WorkspaceInnerCard } from "./workspace-primitives";

export type WorkspaceEntityGridProps =
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceEntityGrid({
  children,
  className,
  ...props
}: WorkspaceEntityGridProps) {
  return (
    <div
      {...props}
      className={cn("taxis-workspace-entity-grid", className)}
    >
      {children}
    </div>
  );
}

export type WorkspaceEntityCardProps = React.HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children?: React.ReactNode;
  selected?: boolean;
};

export function WorkspaceEntityCard({
  as = "article",
  children,
  className,
  selected = false,
  ...props
}: WorkspaceEntityCardProps) {
  return (
    <WorkspaceInnerCard
      {...props}
      as={as}
      className={cn("taxis-workspace-entity-card", className)}
      data-selected={selected ? "true" : undefined}
    >
      {children}
    </WorkspaceInnerCard>
  );
}

export type WorkspaceEntityCardActionProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceEntityCardAction({
  children,
  className,
  ...props
}: WorkspaceEntityCardActionProps) {
  return (
    <button
      {...props}
      className={cn("taxis-workspace-entity-card-action", className)}
      type={props.type ?? "button"}
    >
      {children}
    </button>
  );
}

export type WorkspaceEntityCardIconProps =
  React.HTMLAttributes<HTMLSpanElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceEntityCardIcon({
  children,
  className,
  ...props
}: WorkspaceEntityCardIconProps) {
  return (
    <span
      {...props}
      className={cn("taxis-workspace-entity-card-icon", className)}
    >
      {children}
    </span>
  );
}

export type WorkspaceEntityCardMetricsProps =
  React.HTMLAttributes<HTMLDListElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceEntityCardMetrics({
  children,
  className,
  ...props
}: WorkspaceEntityCardMetricsProps) {
  return (
    <dl
      {...props}
      className={cn("taxis-workspace-entity-card-metrics", className)}
    >
      {children}
    </dl>
  );
}

export type WorkspaceEntityCardMetricProps =
  React.HTMLAttributes<HTMLDivElement> & {
    label: React.ReactNode;
    value: React.ReactNode;
  };

export function WorkspaceEntityCardMetric({
  className,
  label,
  value,
  ...props
}: WorkspaceEntityCardMetricProps) {
  return (
    <div
      {...props}
      className={cn("taxis-workspace-entity-card-metric", className)}
    >
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export type WorkspaceEntityCardDetailsProps =
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceEntityCardDetails({
  children,
  className,
  ...props
}: WorkspaceEntityCardDetailsProps) {
  return (
    <div
      {...props}
      className={cn("taxis-workspace-entity-card-details", className)}
    >
      {children}
    </div>
  );
}

export type WorkspaceEntityCardLabelProps =
  React.HTMLAttributes<HTMLSpanElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceEntityCardLabel({
  children,
  className,
  ...props
}: WorkspaceEntityCardLabelProps) {
  return (
    <span
      {...props}
      className={cn("taxis-workspace-entity-card-label", className)}
    >
      {children}
    </span>
  );
}
