import type React from "react";
import type { ElementType } from "react";

import { cn } from "../../../lib/utils";

type CompanyWorkspacePolymorphicOwnProps<E extends ElementType = "div"> = {
  as?: E;
  className?: string;
  children?: React.ReactNode;
};

export type CompanyWorkspaceSurfaceProps<E extends ElementType = "div"> =
  CompanyWorkspacePolymorphicOwnProps<E> &
  Omit<
    React.ComponentPropsWithoutRef<E>,
    keyof CompanyWorkspacePolymorphicOwnProps<E> | "children"
  > & {
    children?: React.ReactNode;
  };

export function CompanyWorkspaceSurface<E extends ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: CompanyWorkspaceSurfaceProps<E>) {
  const Component = as ?? "div";

  return (
    <Component
      {...(rest as React.ComponentPropsWithoutRef<E>)}
      className={cn("taxis-company-workspace-surface", className)}
    >
      {children}
    </Component>
  );
}

export type CompanyWorkspaceInnerCardProps<E extends ElementType = "div"> =
  CompanyWorkspacePolymorphicOwnProps<E> &
  Omit<
    React.ComponentPropsWithoutRef<E>,
    keyof CompanyWorkspacePolymorphicOwnProps<E> | "children"
  > & {
    children?: React.ReactNode;
  };

export function CompanyWorkspaceInnerCard<E extends ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: CompanyWorkspaceInnerCardProps<E>) {
  const Component = as ?? "div";

  return (
    <Component
      {...(rest as React.ComponentPropsWithoutRef<E>)}
      className={cn("taxis-company-workspace-inner-card", className)}
    >
      {children}
    </Component>
  );
}
