import type React from "react";
import { Car, Check, Clock } from "lucide-react";

import type {
  CompanyDashboardCopy,
  ProviderFeedIcon,
  ProviderFeedItem,
  ProviderFeedTone,
} from "../../../contracts/company-dashboard";
import {
  WorkspaceStateView,
  type WorkspaceStateViewProps,
} from "../workspace/workspace-state-view";
import { TaxiosPorcelainSurface } from "./taxios-dashboard-primitives";

export type DashboardFeedTone = ProviderFeedTone;
export type DashboardFeedIcon = ProviderFeedIcon;
export type DashboardFeedItem = ProviderFeedItem;

/**
 * Live Feed is a calm, read-only activity list — not a timeline gimmick.
 * Each row carries a single subtle status marker (the avatar accent dot),
 * not duplicate signals. Tone palette uses neutral fills only; the brand
 * `live` marker uses the dark workspace control treatment.
 */
const feedToneStyles: Record<
  DashboardFeedTone,
  {
    avatarClass: string;
    iconClass: string;
    dotClass: string;
  }
> = {
  brand: {
    avatarClass: "from-white to-[var(--taxis-status-accent-bg)]",
    iconClass: "text-[var(--taxis-status-accent-text)]",
    dotClass: "bg-[var(--taxis-status-accent)]",
  },
  neutral: {
    avatarClass: "from-white to-[var(--taxis-status-neutral-bg)]",
    iconClass: "text-[var(--taxis-status-neutral)]",
    dotClass: "bg-[var(--taxis-status-neutral)]",
  },
  ok: {
    avatarClass: "from-white to-[var(--taxis-status-success-bg)]",
    iconClass: "text-[var(--taxis-status-success-text)]",
    dotClass: "bg-[var(--taxis-status-success)]",
  },
};

const feedIconByKind: Record<DashboardFeedIcon, typeof Car> = {
  approval: Check,
  booking: Clock,
  vehicle: Car,
};

export type TaxiosDashboardLiveFeedItemProps = {
  item: DashboardFeedItem;
};

export function TaxiosDashboardLiveFeedItem({ item }: TaxiosDashboardLiveFeedItemProps) {
  const tone = feedToneStyles[item.tone];
  const Icon = feedIconByKind[item.icon];

  return (
    <li className="live-feed-item relative grid grid-cols-[48px_1fr_auto] items-center gap-3.5 px-3.5 py-3.5">
      <div className="live-feed-timeline-marker-shell relative" aria-hidden="true">
        <span
          className={`live-feed-avatar relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b ${tone.avatarClass}`}
        >
          <Icon className={`h-4 w-4 ${tone.iconClass}`} strokeWidth={1.9} />
        </span>
        <span className={`live-feed-avatar-accent ${tone.dotClass}`} />
      </div>

      <div className="live-feed-copy min-w-0">
        <p className="truncate font-semibold text-taxis-section-sm text-[var(--taxis-workspace-text-strong)] leading-tight tracking-tight">
          {item.title}
        </p>
        <p className="mt-1 truncate font-medium text-taxis-body-sm text-[var(--taxis-workspace-text-muted)] leading-snug">
          {item.sub}
        </p>
      </div>
      <time className="live-feed-time taxis-data-inline whitespace-nowrap font-medium text-[12px] text-[var(--taxis-workspace-text-muted)] tracking-tight">
        {item.time}
      </time>
    </li>
  );
}

export type LiveFeedPanelProps = {
  copy: CompanyDashboardCopy["liveFeed"];
  feedItems: readonly DashboardFeedItem[];
  header: React.ReactNode;
  state?: WorkspaceStateViewProps;
};

export function LiveFeedPanel({
  copy,
  feedItems,
  header,
  state,
}: LiveFeedPanelProps) {
  const eventCount = feedItems.length;

  return (
    <TaxiosPorcelainSurface
      aria-label={copy.ariaLabel}
      className="live-feed-card taxios-dashboard-animate-fade-up flex flex-1 flex-col rounded-[24px] px-5 pt-5 pb-4"
      role="region"
    >
      {header}

      <div className="live-feed-meta">
        <span className="live-feed-meta-item">
          <span className="live-feed-meta-num taxis-data-inline">{eventCount}</span>
          <span>{copy.eventsLabel}</span>
        </span>
        <span className="live-feed-meta-item live-feed-meta-now">
          <span aria-hidden="true" className="live-feed-meta-pulse">
            <span className="live-feed-meta-pulse-ring" />
            <span className="live-feed-meta-pulse-dot" />
          </span>
          {copy.updatedNow}
        </span>
      </div>

      {state ? (
        <WorkspaceStateView
          {...state}
          className="mt-3 min-h-[220px]"
        />
      ) : (
        <ul className="live-feed-timeline relative mt-2 space-y-1">
          {feedItems.map((item) => (
            <TaxiosDashboardLiveFeedItem
              item={item}
              key={item.title}
            />
          ))}
        </ul>
      )}
    </TaxiosPorcelainSurface>
  );
}

export type TaxiosDashboardLiveFeedCardProps = LiveFeedPanelProps;

export function TaxiosDashboardLiveFeedCard(
  props: TaxiosDashboardLiveFeedCardProps,
) {
  return <LiveFeedPanel {...props} />;
}
