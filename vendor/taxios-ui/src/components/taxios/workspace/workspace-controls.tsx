import { X } from "lucide-react";
import type React from "react";
import { forwardRef } from "react";

import { cn } from "../../../lib/utils";

/**
 * Shared workspace controls so overlays, drawers, and panels stop rolling their
 * own close buttons and segmented toggles. Visual treatment is token-backed and
 * consistent; focus/cursor/press come from the global interaction contract.
 */

export type WorkspaceCloseButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
  };

export const WorkspaceCloseButton = forwardRef<
  HTMLButtonElement,
  WorkspaceCloseButtonProps
>(function WorkspaceCloseButton(
  { className, label, type = "button", ...props },
  ref,
) {
  return (
    <button
      {...props}
      aria-label={label}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] text-[var(--taxis-workspace-text-muted)] shadow-[var(--taxis-shadow-soft)] transition-all hover:border-[var(--taxis-workspace-border-strong)] hover:text-[var(--taxis-workspace-text-strong)] active:scale-[0.98]",
        className,
      )}
      ref={ref}
      title={label}
      type={type}
    >
      <X aria-hidden="true" size={18} strokeWidth={2} />
    </button>
  );
});

export type WorkspaceSegmentedOption<TValue extends string> = {
  disabled?: boolean;
  label: React.ReactNode;
  value: TValue;
};

export type WorkspaceSegmentedProps<TValue extends string> = {
  "aria-label": string;
  className?: string;
  onValueChange: (value: TValue) => void;
  options: readonly WorkspaceSegmentedOption<TValue>[];
  value: TValue;
};

export function WorkspaceSegmented<TValue extends string>({
  "aria-label": ariaLabel,
  className,
  onValueChange,
  options,
  value,
}: WorkspaceSegmentedProps<TValue>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a styled segmented toggle is an ARIA group, not a fieldset/form control set
    <div
      aria-label={ariaLabel}
      className={cn(
        "taxis-segmented-track grid grid-flow-col auto-cols-fr items-stretch gap-1 rounded-[var(--taxis-radius-control)] border p-1",
        className,
      )}
      role="group"
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            aria-pressed={isSelected}
            className={cn(
              "taxis-segmented-item inline-flex h-full min-h-[var(--taxis-control-h-sm)] items-center justify-center rounded-[calc(var(--taxis-radius-control)-4px)] px-4 text-center font-semibold text-[13px] transition-all",
              isSelected
                ? "taxis-segmented-active bg-[var(--taxis-workspace-control-dark)] text-[var(--taxis-workspace-surface)]"
                : "text-[var(--taxis-workspace-text-secondary)]",
            )}
            disabled={option.disabled}
            key={option.value}
            onClick={() => onValueChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
