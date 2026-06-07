import type React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "../../../lib/utils";
import {
  type WorkspaceStatusTone,
  workspaceStatusSurfaceForTone,
  workspaceStatusTintForTone,
} from "./workspace-status";

export type WorkspaceAvatarDensity = "compact" | "default";

export type WorkspaceAvatarBaseProps = {
  className?: string;
  initials: string;
  /** Optional full name; revealed on hover. Falls back to `initials`. */
  name?: string;
  /** Marks this avatar as a neutral overflow chip and supplies its a11y name. */
  overflowLabel?: string;
};

export type WorkspaceAvatarPresenceProps =
  | {
      /** Optional readable context when no status marker is rendered. */
      presenceLabel?: string;
      presenceTone?: undefined;
    }
  | {
      /** Required readable status text when the presence dot carries meaning. */
      presenceLabel: string;
      /** Status marker. Avatar remains identity; the dot carries status. */
      presenceTone: WorkspaceStatusTone;
    };

export type WorkspaceAvatarProps = WorkspaceAvatarBaseProps &
  WorkspaceAvatarPresenceProps;

export type WorkspaceAvatarIdentity = {
  className?: string;
  id?: string;
  initials: string;
  name?: string;
} & WorkspaceAvatarPresenceProps;

export type WorkspaceAvatarOverflowLabel = (
  hiddenCount: number,
  hiddenItems: readonly WorkspaceAvatarIdentity[],
) => string;

export type WorkspaceAvatarStackProps = {
  /** Full source payload. Capping happens only while rendering. */
  items: readonly WorkspaceAvatarIdentity[];
  ariaLabel?: string;
  avatarClassName?: string;
  className?: string;
  density?: WorkspaceAvatarDensity;
  maxVisible?: number;
  overflowClassName?: string;
  overflowLabel?: WorkspaceAvatarOverflowLabel;
};

export type WorkspaceAccountCardProps = {
  avatarClassName?: string;
  avatarInitials?: string;
  avatarName?: string;
  className?: string;
  subtitle: string;
  title: string;
  trailingIcon?: React.ReactNode;
};

const DEFAULT_MAX_VISIBLE = 4;
const COMPACT_MAX_VISIBLE = 3;

export function normalizeWorkspaceAvatarInitials(value: string) {
  const nameParts = value
    .split(/\s+/)
    .filter((part) => /^[\p{L}]/u.test(part))
    .slice(0, 2);
  const fromName = nameParts.map((part) => part[0]?.toUpperCase()).join("");

  if (fromName.length >= 2) {
    return fromName;
  }

  return (
    value.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 2).toUpperCase() ||
    fromName ||
    "U"
  );
}

function resolveMaxVisible(
  density: WorkspaceAvatarDensity,
  maxVisible: number | undefined,
) {
  if (typeof maxVisible === "number" && Number.isFinite(maxVisible)) {
    return Math.max(0, Math.floor(maxVisible));
  }

  return density === "compact" ? COMPACT_MAX_VISIBLE : DEFAULT_MAX_VISIBLE;
}

function defaultOverflowLabel(
  hiddenCount: number,
  _hiddenItems: readonly WorkspaceAvatarIdentity[],
) {
  return `${hiddenCount} more ${hiddenCount === 1 ? "person" : "people"}`;
}

export function WorkspaceAvatar({
  className = "h-10 w-10",
  initials,
  name,
  overflowLabel,
  presenceLabel,
  presenceTone,
}: WorkspaceAvatarProps) {
  const isOverflow = Boolean(overflowLabel) || initials.startsWith("+");
  const reveal = name ?? initials;
  const avatarLabel = overflowLabel ?? (
    presenceLabel ? `${reveal}, ${presenceLabel}` : reveal
  );
  const displayInitials = isOverflow
    ? initials
    : normalizeWorkspaceAvatarInitials(initials);

  if (isOverflow) {
    return (
      <div
        aria-label={avatarLabel}
        className={cn(
          "taxios-avatar taxios-avatar-extra relative flex select-none items-center justify-center overflow-visible rounded-full bg-[var(--taxis-workspace-card-soft)] font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] ring-1 ring-[var(--taxis-workspace-border-warm)]",
          className,
        )}
        role="img"
      >
        <span className="taxios-avatar-initials relative z-10 uppercase tabular-nums">
          {displayInitials}
        </span>
      </div>
    );
  }

  return (
    <div
      aria-label={avatarLabel}
      className={cn(
        "taxios-avatar relative flex select-none items-center justify-center rounded-full bg-[var(--taxis-workspace-control-dark)] font-semibold text-[11px] text-white tracking-tight",
        className,
      )}
      role="img"
    >
      <span className="taxios-avatar-sheen" aria-hidden="true" />
      <span className="taxios-avatar-initials relative z-10 uppercase tabular-nums">
        {displayInitials}
      </span>
      {presenceTone ? (
        <span
          aria-hidden="true"
          className="taxios-avatar-presence-dot"
          style={
            {
              "--taxios-avatar-presence-dot":
                workspaceStatusTintForTone(presenceTone),
              "--taxios-avatar-presence-ring":
                workspaceStatusSurfaceForTone(presenceTone),
            } as React.CSSProperties
          }
        />
      ) : null}
      <span aria-hidden="true" className="taxios-avatar-name">
        {reveal}
      </span>
    </div>
  );
}

export function WorkspaceAvatarStack({
  ariaLabel,
  avatarClassName = "h-10 w-10 ring-2 ring-[var(--taxis-workspace-surface)]",
  className,
  density = "default",
  items,
  maxVisible,
  overflowClassName,
  overflowLabel = defaultOverflowLabel,
}: WorkspaceAvatarStackProps) {
  const resolvedMaxVisible = resolveMaxVisible(density, maxVisible);
  const visibleItems = items.slice(0, resolvedMaxVisible);
  const hiddenItems = items.slice(resolvedMaxVisible);
  const hiddenCount = hiddenItems.length;

  return (
    <div
      className={cn(
        "taxios-avatar-stack flex items-center",
        density === "compact" ? "-space-x-2" : "-space-x-2.5",
        className,
      )}
    >
      {ariaLabel ? <span className="sr-only">{ariaLabel}</span> : null}
      {visibleItems.map((item, index) => (
        <WorkspaceAvatar
          className={cn(avatarClassName, item.className)}
          initials={item.initials}
          key={item.id ?? `${item.initials}-${item.name ?? "avatar"}-${index}`}
          name={item.name}
          {...(item.presenceTone
            ? {
                presenceLabel: item.presenceLabel,
                presenceTone: item.presenceTone,
              }
            : { presenceLabel: item.presenceLabel })}
        />
      ))}
      {hiddenCount > 0 ? (
        <WorkspaceAvatar
          className={cn(avatarClassName, overflowClassName)}
          initials={`+${hiddenCount}`}
          overflowLabel={overflowLabel(hiddenCount, hiddenItems)}
        />
      ) : null}
    </div>
  );
}

export function WorkspaceAccountCard({
  avatarClassName = "h-10 w-10 shrink-0",
  avatarInitials,
  avatarName,
  className,
  subtitle,
  title,
  trailingIcon,
}: WorkspaceAccountCardProps) {
  const resolvedInitials =
    avatarInitials ?? normalizeWorkspaceAvatarInitials(title);

  return (
    <div
      className={cn(
        "taxis-workspace-account-card group flex w-full items-center gap-3 text-left",
        className,
      )}
    >
      <WorkspaceAvatar
        className={avatarClassName}
        initials={resolvedInitials}
        name={avatarName ?? title}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[14px] text-zinc-900 transition-colors group-hover:text-zinc-950">
          {title}
        </p>
        <p className="truncate font-medium text-[12px] text-zinc-500">
          {subtitle}
        </p>
      </div>
      {trailingIcon ?? (
        <ChevronRight
          aria-hidden="true"
          className="text-slate-400 transition-colors group-hover:text-slate-600"
          size={14}
        />
      )}
    </div>
  );
}
