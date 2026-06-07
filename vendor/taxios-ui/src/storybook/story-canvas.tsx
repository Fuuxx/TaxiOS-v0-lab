import type { ReactNode } from "react";

import { cn } from "../lib/utils";

export type StoryCanvasProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: string;
  tone?: "dashboard" | "neutral";
};

export function StoryCanvas({
  children,
  className,
  contentClassName,
  maxWidth = "1200px",
  tone = "neutral",
}: StoryCanvasProps) {
  return (
    <div
      className={cn(
        "box-border min-h-screen w-full",
        tone === "dashboard"
          ? "bg-[var(--taxis-workspace-page-bg)] text-[var(--taxis-workspace-text-primary)]"
          : "bg-[var(--taxis-color-surface-muted)] text-[var(--taxis-color-charcoal-950)]",
        className,
      )}
    >
      <div
        className={cn("mx-auto box-border w-full px-8 py-12", contentClassName)}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
