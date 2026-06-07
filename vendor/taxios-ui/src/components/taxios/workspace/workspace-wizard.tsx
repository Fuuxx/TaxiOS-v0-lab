import * as React from "react";

import { cn } from "../../../lib/utils";
import { WorkspaceSummaryChip } from "./workspace-status";

export type WorkspaceWizardOverlayProps =
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceWizardOverlay({
  children,
  className,
  ...props
}: WorkspaceWizardOverlayProps) {
  return (
    <div
      {...props}
      className={cn("taxis-workspace-wizard-overlay", className)}
    >
      {children}
    </div>
  );
}

export type WorkspaceWizardBackdropProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceWizardBackdrop({
  children,
  className,
  ...props
}: WorkspaceWizardBackdropProps) {
  return (
    <button
      {...props}
      className={cn("taxis-workspace-wizard-backdrop", className)}
      type={props.type ?? "button"}
    >
      {children}
    </button>
  );
}

export type WorkspaceWizardPanelProps =
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

export const WorkspaceWizardPanel = React.forwardRef<
  HTMLDivElement,
  WorkspaceWizardPanelProps
>(function WorkspaceWizardPanel({ children, className, ...props }, ref) {
  return (
    <div
      {...props}
      className={cn("taxis-workspace-wizard-panel", className)}
      ref={ref}
    >
      <div aria-hidden="true" className="taxis-workspace-wizard-panel-rim" />
      {children}
    </div>
  );
});

export type WorkspaceWizardFormProps =
  React.FormHTMLAttributes<HTMLFormElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceWizardForm({
  children,
  className,
  ...props
}: WorkspaceWizardFormProps) {
  return (
    <form
      {...props}
      className={cn("taxis-workspace-wizard-form", className)}
    >
      {children}
    </form>
  );
}

export type WorkspaceWizardHeaderProps =
  React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceWizardHeader({
  children,
  className,
  ...props
}: WorkspaceWizardHeaderProps) {
  return (
    <header
      {...props}
      className={cn("taxis-workspace-wizard-header", className)}
    >
      {children}
    </header>
  );
}

export type WorkspaceWizardBodyProps =
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceWizardBody({
  children,
  className,
  ...props
}: WorkspaceWizardBodyProps) {
  return (
    <div {...props} className={cn("taxis-workspace-wizard-body", className)}>
      {children}
    </div>
  );
}

export type WorkspaceWizardScrollProps =
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceWizardScroll({
  children,
  className,
  ...props
}: WorkspaceWizardScrollProps) {
  return (
    <div
      {...props}
      className={cn(
        "taxis-workspace-wizard-scroll taxis-workspace-scrollbar",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type WorkspaceWizardLayoutProps =
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceWizardLayout({
  children,
  className,
  ...props
}: WorkspaceWizardLayoutProps) {
  return (
    <div {...props} className={cn("taxis-workspace-wizard-layout", className)}>
      {children}
    </div>
  );
}

export type WorkspaceWizardMainPanelProps =
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceWizardMainPanel({
  children,
  className,
  ...props
}: WorkspaceWizardMainPanelProps) {
  return (
    <div
      {...props}
      className={cn("taxis-workspace-wizard-main-panel", className)}
    >
      {children}
    </div>
  );
}

export type WorkspaceWizardSectionProps =
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

export const WorkspaceWizardSection = React.forwardRef<
  HTMLDivElement,
  WorkspaceWizardSectionProps
>(function WorkspaceWizardSection({ children, className, ...props }, ref) {
  return (
    <div
      {...props}
      className={cn("taxis-workspace-wizard-section", className)}
      ref={ref}
    >
      {children}
    </div>
  );
});

export type WorkspaceWizardRailProps =
  React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceWizardRail({
  children,
  className,
  ...props
}: WorkspaceWizardRailProps) {
  return (
    <aside
      {...props}
      className={cn("taxis-workspace-wizard-rail", className)}
    >
      {children}
    </aside>
  );
}

export type WorkspaceWizardFooterProps =
  React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceWizardFooter({
  children,
  className,
  ...props
}: WorkspaceWizardFooterProps) {
  return (
    <footer
      {...props}
      className={cn("taxis-workspace-wizard-footer", className)}
    >
      {children}
    </footer>
  );
}

export type WorkspaceWizardStatusGridProps =
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

export function WorkspaceWizardStatusGrid({
  children,
  className,
  ...props
}: WorkspaceWizardStatusGridProps) {
  return (
    <div
      {...props}
      className={cn("taxis-workspace-wizard-status-grid", className)}
    >
      {children}
    </div>
  );
}

export type WorkspaceWizardStatusItemProps =
  React.HTMLAttributes<HTMLSpanElement> & {
    children?: React.ReactNode;
    /** Kept for compatibility; wizard summary chips stay neutral by design. */
    ready?: boolean;
  };

export function WorkspaceWizardStatusItem({
  children,
  className,
  ready: _ready = false,
  ...props
}: WorkspaceWizardStatusItemProps) {
  return (
    <WorkspaceSummaryChip
      {...props}
      className={cn("taxis-workspace-wizard-status-item", className)}
      size="md"
    >
      {children}
    </WorkspaceSummaryChip>
  );
}
