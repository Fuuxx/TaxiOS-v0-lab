"use client";

/**
 * ThemeToggle — drop-in theme switcher styled to match the workspace controls.
 *
 * Two variants:
 *   - "switch" (default): a single icon button that flips light <-> dark.
 *     Compact, ideal for a top bar / header.
 *   - "segmented": a 3-way Hell / Auto / Dunkel control using the same
 *     `.taxis-segmented-*` look as the rest of the workspace toggles.
 *
 * Usage:
 *   import { ThemeToggle } from "@taxios-v2/ui/components/taxios/theme/theme-toggle";
 *   <ThemeToggle />                       // icon switch
 *   <ThemeToggle variant="segmented" />   // Hell / Auto / Dunkel
 */

import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "../../../lib/utils";
import { type ThemeMode, useTheme } from "./use-theme";

const SEGMENTS: ReadonlyArray<{
  value: ThemeMode;
  label: string;
  Icon: typeof Sun;
}> = [
  { value: "light", label: "Hell", Icon: Sun },
  { value: "system", label: "Auto", Icon: Monitor },
  { value: "dark", label: "Dunkel", Icon: Moon },
];

export type ThemeToggleProps = {
  className?: string;
  variant?: "switch" | "segmented";
};

export function ThemeToggle({
  className,
  variant = "switch",
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggle } = useTheme();

  if (variant === "segmented") {
    return (
      <div
        aria-label="Farbschema"
        className={cn(
          "taxis-segmented-track inline-flex items-stretch gap-1 rounded-[var(--taxis-radius-control)] border p-1",
          className,
        )}
        role="radiogroup"
      >
        {SEGMENTS.map((segment) => {
          const isActive = theme === segment.value;

          return (
            <button
              aria-checked={isActive}
              className={cn(
                "taxis-segmented-item inline-flex min-h-[var(--taxis-control-h-sm)] items-center justify-center gap-1.5 rounded-[calc(var(--taxis-radius-control)-4px)] px-3 text-[13px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--taxis-workspace-focus-ring)]",
                isActive
                  ? "taxis-segmented-active bg-[var(--taxis-workspace-control-dark)] text-[var(--taxis-workspace-on-dark)]"
                  : "text-[var(--taxis-workspace-text-secondary)]",
              )}
              key={segment.value}
              onClick={() => setTheme(segment.value)}
              role="radio"
              type="button"
            >
              <segment.Icon aria-hidden="true" size={15} strokeWidth={1.9} />
              {segment.label}
            </button>
          );
        })}
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label={isDark ? "Zu hellem Design wechseln" : "Zu dunklem Design wechseln"}
      aria-pressed={isDark}
      className={cn(
        "inline-flex h-[var(--taxis-control-h-md)] w-[var(--taxis-control-h-md)] items-center justify-center rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:border-[var(--taxis-workspace-border-strong)] hover:text-[var(--taxis-workspace-text-strong)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--taxis-workspace-focus-ring)]",
        className,
      )}
      onClick={toggle}
      title={isDark ? "Helles Design" : "Dunkles Design"}
      type="button"
    >
      {isDark ? (
        <Sun aria-hidden="true" size={18} strokeWidth={1.9} />
      ) : (
        <Moon aria-hidden="true" size={18} strokeWidth={1.9} />
      )}
    </button>
  );
}
