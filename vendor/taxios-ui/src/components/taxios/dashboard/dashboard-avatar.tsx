/**
 * Shared dashboard avatar primitive (company dashboard surface only).
 * No "use client" — safe to import from both the main dashboard client module and rides island.
 *
 * Premium chip language:
 *  - Every person or company avatar uses the same dark ceramic disc.
 *  - Long names are normalized to compact initials before rendering.
 *  - The "+N" overflow chip is treated as a neutral plate.
 */

import {
  type CompanyWorkspaceStatusTone,
  companyWorkspaceStatusSurfaceForTone,
  companyWorkspaceStatusTintForTone,
} from "../company-workspace/company-workspace-status";

type CompanyDashboardAvatarBaseProps = {
  className?: string;
  initials: string;
  /** Optional full name; revealed on hover. Falls back to `initials` when omitted. */
  name?: string;
};

type CompanyDashboardAvatarPresenceProps =
  | {
      /** Optional readable context when no status marker is rendered. */
      presenceLabel?: string;
      presenceTone?: undefined;
    }
  | {
      /** Required readable status text when the presence dot carries meaning. */
      presenceLabel: string;
      /** Status marker. Avatar remains identity; the dot carries status. */
      presenceTone: CompanyWorkspaceStatusTone;
    };

type CompanyDashboardAvatarProps = CompanyDashboardAvatarBaseProps &
  CompanyDashboardAvatarPresenceProps;

function normalizeAvatarInitials(value: string) {
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

export function CompanyDashboardAvatar({
  className = "w-10 h-10",
  initials,
  name,
  presenceLabel,
  presenceTone,
}: CompanyDashboardAvatarProps) {
  const isExtra = initials.startsWith("+");
  const reveal = name ?? initials;
  const avatarLabel = presenceLabel ? `${reveal}, ${presenceLabel}` : reveal;
  const displayInitials = isExtra ? initials : normalizeAvatarInitials(initials);

  if (isExtra) {
    return (
      <div
        aria-label={`${initials} weitere Mitarbeiter`}
        className={`taxios-avatar taxios-avatar-extra ${className} relative flex select-none items-center justify-center overflow-visible rounded-full bg-[var(--taxis-workspace-card-soft)] font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] ring-1 ring-[var(--taxis-workspace-border-warm)]`}
        role="img"
      >
        <span className="taxios-avatar-initials relative z-10 uppercase tabular-nums">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div
      aria-label={avatarLabel}
      className={`taxios-avatar ${className} relative flex select-none items-center justify-center rounded-full bg-[var(--taxis-workspace-control-dark)] font-semibold text-[11px] text-white tracking-tight`}
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
          style={{
            ["--taxios-avatar-presence-dot" as never]:
              companyWorkspaceStatusTintForTone(presenceTone),
            ["--taxios-avatar-presence-ring" as never]:
              companyWorkspaceStatusSurfaceForTone(presenceTone),
          }}
        />
      ) : null}
      <span aria-hidden="true" className="taxios-avatar-name">
        {reveal}
      </span>
    </div>
  );
}
