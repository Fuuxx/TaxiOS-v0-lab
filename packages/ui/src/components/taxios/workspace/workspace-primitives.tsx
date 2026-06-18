import type React from "react";
import type { ElementType } from "react";

import { cn } from "../../../lib/utils";

type WorkspacePolymorphicOwnProps<E extends ElementType = "div"> = {
  as?: E;
  className?: string;
  children?: React.ReactNode;
};

export type WorkspaceSurfaceProps<E extends ElementType = "div"> =
  WorkspacePolymorphicOwnProps<E> &
    Omit<
      React.ComponentPropsWithoutRef<E>,
      keyof WorkspacePolymorphicOwnProps<E> | "children"
    > & {
      children?: React.ReactNode;
    };

export function WorkspaceSurface<E extends ElementType = "div">({
  as,
  className,
  children,
  ...props
}: WorkspaceSurfaceProps<E>) {
  const Component = as ?? "div";

  return (
    <Component
      {...(props as React.ComponentPropsWithoutRef<E>)}
      className={cn(
        "taxis-workspace-surface taxis-company-workspace-surface",
        className,
      )}
    >
      {children}
    </Component>
  );
}

export type WorkspaceInnerCardProps<E extends ElementType = "div"> =
  WorkspacePolymorphicOwnProps<E> &
    Omit<
      React.ComponentPropsWithoutRef<E>,
      keyof WorkspacePolymorphicOwnProps<E> | "children"
    > & {
      children?: React.ReactNode;
    };

export function WorkspaceInnerCard<E extends ElementType = "div">({
  as,
  className,
  children,
  ...props
}: WorkspaceInnerCardProps<E>) {
  const Component = as ?? "div";

  return (
    <Component
      {...(props as React.ComponentPropsWithoutRef<E>)}
      className={cn(
        "taxis-workspace-inner-card taxis-company-workspace-inner-card",
        className,
      )}
    >
      {children}
    </Component>
  );
}

export type WorkspaceSectionHeaderProps = {
  /** Section title rendered as `<h3>`. */
  title: string;
  /** Optional supporting copy under the title. */
  subtitle?: string;
  /** Inline badge/content next to the title (plain text chip or richer nodes). */
  badge?: React.ReactNode;
  /** Trailing controls (prefer pass-through nodes; shell does not wire click handlers here). */
  action?: React.ReactNode;
  className?: string;
};

export function WorkspaceSectionHeader({
  action,
  badge,
  className,
  subtitle,
  title,
}: WorkspaceSectionHeaderProps) {
  return (
    <div className={cn("taxis-company-section-header", className)}>
      <div className="taxis-company-section-heading">
        <div className="taxis-company-section-title-row">
          <h3 className="taxis-company-section-title truncate">{title}</h3>
          {badge ?? null}
        </div>
        {subtitle ? (
          <p className="taxis-company-section-description truncate">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="taxis-company-section-action">{action}</div>
      ) : null}
    </div>
  );
}
