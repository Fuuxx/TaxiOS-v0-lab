"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "@taxios-v2/ui/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import type * as React from "react";

/**
 * TaxiOS Select — centralized wrapper around Base UI Select.
 *
 * Slice 5a proof: porcelain field language on the existing token system.
 * Do NOT import `@base-ui/react/select` directly into screens — always use
 * this wrapper so the control language stays in one place.
 *
 * Visual contract (token-only, no new tokens introduced):
 *  - height  → --taxis-control-h-md
 *  - radius  → --taxis-radius-control
 *  - surface → --taxis-workspace-surface (porcelain)
 *  - border  → --taxis-workspace-border (hairline)
 *  - focus   → --taxis-workspace-focus-ring (TaxiOS orange, replaces native blue)
 *  - popup   → --taxis-workspace-surface + --taxis-workspace-shadow-overlay
 *
 * Motion: 140–180ms, opacity + small translate only, chevron rotation,
 * respects prefers-reduced-motion (see motion-reduce: resets below).
 */

function Select<Value, Multiple extends boolean | undefined = false>(
  props: SelectPrimitive.Root.Props<Value, Multiple>,
) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup(props: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue(props: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  children,
  className,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "group/select-trigger flex h-[var(--taxis-control-h-md)] w-full items-center justify-between gap-2 rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-3 text-sm text-[var(--taxis-workspace-text-primary)] outline-none transition-[border-color,box-shadow,background-color] duration-150 ease-out select-none",
        "hover:border-[var(--taxis-workspace-border-strong)]",
        "focus-visible:border-taxis-action focus-visible:ring-2 focus-visible:ring-[color:var(--taxis-workspace-focus-ring)]",
        "data-[popup-open]:border-taxis-action data-[popup-open]:ring-2 data-[popup-open]:ring-[color:var(--taxis-workspace-focus-ring)]",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        "motion-reduce:transition-none",
        className,
      )}
      data-slot="select-trigger"
      {...props}
    >
      <span className="truncate text-left">{children}</span>
      <SelectPrimitive.Icon className="flex shrink-0 text-[var(--taxis-workspace-text-secondary)]">
        <ChevronDown className="size-4 transition-transform duration-150 ease-out group-data-[popup-open]/select-trigger:rotate-180 motion-reduce:transition-none" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  children,
  className,
  sideOffset = 6,
  ...props
}: SelectPrimitive.Popup.Props & {
  sideOffset?: number;
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        alignItemWithTrigger={false}
        className="z-50 outline-none"
        sideOffset={sideOffset}
      >
        <SelectPrimitive.Popup
          className={cn(
            "max-h-[min(var(--available-height),20rem)] min-w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-y-auto rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] p-1 text-[var(--taxis-workspace-text-primary)] shadow-[var(--taxis-workspace-shadow-overlay)] outline-none",
            "transition-[transform,opacity] duration-150 ease-out",
            "data-[starting-style]:translate-y-1 data-[starting-style]:opacity-0",
            "data-[ending-style]:translate-y-1 data-[ending-style]:opacity-0",
            "motion-reduce:transition-none motion-reduce:data-[starting-style]:translate-y-0 motion-reduce:data-[ending-style]:translate-y-0",
            className,
          )}
          data-slot="select-content"
          {...props}
        >
          {children}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  children,
  className,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[calc(var(--taxis-radius-control)-3px)] py-2 pr-8 pl-3 text-sm outline-none transition-colors duration-150 ease-out select-none",
        "data-[highlighted]:bg-[var(--taxis-workspace-surface-soft)] data-[highlighted]:text-[var(--taxis-workspace-text-strong)]",
        "data-[selected]:font-medium data-[selected]:text-[var(--taxis-workspace-text-strong)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "motion-reduce:transition-none",
        className,
      )}
      data-slot="select-item"
      {...props}
    >
      <SelectPrimitive.ItemText className="truncate">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2.5 flex items-center text-taxis-action">
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
};
