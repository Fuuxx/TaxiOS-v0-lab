import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@taxios-v2/ui/lib/utils";
import type * as React from "react";

/**
 * TaxiOS Input — canonical text-field primitive.
 *
 * Slice 5b: aligned to the Slice 5a Select field language so every TaxiOS
 * control shares one geometry. Token-only, no new tokens introduced.
 *
 * Visual contract (identical to SelectTrigger):
 *  - height  → --taxis-control-h-md (44px)
 *  - radius  → --taxis-radius-control (9.6px)
 *  - surface → --taxis-workspace-surface (porcelain/white)
 *  - border  → --taxis-workspace-border (hairline)
 *  - focus   → --taxis-workspace-focus-ring (TaxiOS orange, replaces native blue)
 *
 * Carries data-slot="input", which the global `.taxios-premium input` rule
 * explicitly excludes so the primitive owns its own surface/border/shadow and
 * native inputs (search, date/time, file) keep the global premium treatment.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-[var(--taxis-control-h-md)] w-full min-w-0 rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-3 text-sm text-[var(--taxis-workspace-text-primary)] shadow-none outline-none transition-[border-color,box-shadow,background-color] duration-150 ease-out",
        "placeholder:text-[var(--taxis-workspace-text-secondary)]",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--taxis-workspace-text-primary)]",
        "hover:border-[var(--taxis-workspace-border-strong)]",
        "focus-visible:border-taxis-action focus-visible:ring-2 focus-visible:ring-[color:var(--taxis-workspace-focus-ring)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
