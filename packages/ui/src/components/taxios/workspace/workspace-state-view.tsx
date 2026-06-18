import type { ReactNode } from "react";

import { cn } from "../../../lib/utils";

export type WorkspaceStateVariant = "empty" | "error" | "loading";

export type WorkspaceStateViewProps = {
  /** Visual + semantic state. Defaults to "empty". */
  variant?: WorkspaceStateVariant;
  /** Primary heading, and the live message announced while loading. */
  title: string;
  /** Optional supporting copy under the title. */
  description?: string;
  /** Optional leading glyph for empty/error states (ignored while loading). */
  icon?: ReactNode;
  /** Optional trailing control (e.g. a retry Button) rendered under the copy. */
  action?: ReactNode;
  className?: string;
};

const roleByVariant: Record<
  WorkspaceStateVariant,
  "alert" | "status" | undefined
> = {
  empty: undefined,
  error: "alert",
  loading: "status",
};

function WorkspaceStateSpinner() {
  return (
    <span
      aria-hidden="true"
      className="size-8 animate-spin rounded-full border-2 border-[var(--taxis-workspace-border)] border-t-[var(--taxis-workspace-text-strong)] motion-reduce:animate-none"
    />
  );
}

/**
 * Shared, backend-free Empty / Error / Loading state for workspace surfaces
 * (Company dashboard, Provider, Driver, ...). Token-backed and prop-driven;
 * no product data, no business logic.
 */
export function WorkspaceStateView({
  action,
  className,
  description,
  icon,
  title,
  variant = "empty",
}: WorkspaceStateViewProps) {
  const isLoading = variant === "loading";

  return (
    <div
      aria-busy={isLoading || undefined}
      aria-live={isLoading ? "polite" : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-taxis-card border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-soft)] px-6 py-10 text-center",
        className,
      )}
      role={roleByVariant[variant]}
    >
      {isLoading ? <WorkspaceStateSpinner /> : null}

      {!isLoading && icon ? (
        <span
          aria-hidden="true"
          className={cn(
            "flex size-10 items-center justify-center rounded-xl [&_svg]:size-5",
            variant === "error"
              ? "bg-destructive/10 text-destructive"
              : "bg-[var(--taxis-workspace-surface-deep)] text-[var(--taxis-workspace-text-muted)] ring-1 ring-[var(--taxis-workspace-border)]",
          )}
        >
          {icon}
        </span>
      ) : null}

      <p className="font-semibold text-sm text-[var(--taxis-workspace-text-strong)] tracking-tight">
        {title}
      </p>

      {description ? (
        <p className="max-w-md font-medium text-taxis-body-sm text-[var(--taxis-workspace-text-muted)] leading-relaxed">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
