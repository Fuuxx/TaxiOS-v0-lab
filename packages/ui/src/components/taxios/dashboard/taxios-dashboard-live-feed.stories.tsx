import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "./company-dashboard.css";
import {
  demoCompanyDashboardCopyDe,
  demoDashboardFeedItems,
} from "../../../storybook/fixtures/company-dashboard.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import {
  LiveFeedPanel,
  TaxiosDashboardLiveFeedCard,
  TaxiosDashboardLiveFeedItem,
} from "./taxios-dashboard-live-feed";
import { TaxiosDashboardSectionHeader, TaxiosPorcelainSurface } from "./taxios-dashboard-primitives";

const manyFeedItems = [
  ...demoDashboardFeedItems,
  ...demoDashboardFeedItems.map((item, index) => ({
    ...item,
    time: `vor ${32 + index * 6} Min`,
    title: `${item.title} ${index + 2}`,
  })),
] satisfies ComponentProps<typeof LiveFeedPanel>["feedItems"];

const meta = {
  title: "Taxios/TaxiOS/Company Dashboard/Live Feed",
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1200px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function LiveFeedHeader({ title = "Live Feed" }: { title?: string }) {
  return (
    <TaxiosDashboardSectionHeader
      badge={
        <span className="flex items-center gap-1.5 rounded-full bg-[var(--taxis-workspace-control-dark)] px-2.5 py-1 font-black text-[9px] text-[var(--taxis-workspace-surface)] uppercase tracking-[0.18em]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 taxios-dashboard-animate-ping-slow rounded-full bg-[var(--taxis-workspace-surface)] opacity-40" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--taxis-workspace-surface)]" />
          </span>
          Live
        </span>
      }
      className="mb-6"
      title={title}
    />
  );
}

export const TaxiosDashboardLiveFeedCardStory: Story = {
  name: "TaxiosDashboardLiveFeedCard",
  render: () => (
    <div className="max-w-lg">
      <TaxiosDashboardLiveFeedCard
        copy={demoCompanyDashboardCopyDe.liveFeed}
        feedItems={demoDashboardFeedItems}
        header={<LiveFeedHeader />}
      />
    </div>
  ),
};

export const LiveFeedOneItem: Story = {
  name: "LiveFeedPanel one item",
  render: () => (
    <div className="max-w-lg">
      <LiveFeedPanel
        copy={demoCompanyDashboardCopyDe.liveFeed}
        feedItems={demoDashboardFeedItems.slice(0, 1)}
        header={<LiveFeedHeader />}
      />
    </div>
  ),
};

export const LiveFeedManyItems: Story = {
  name: "LiveFeedPanel many items",
  render: () => (
    <div className="max-w-lg">
      <LiveFeedPanel
        copy={demoCompanyDashboardCopyDe.liveFeed}
        feedItems={manyFeedItems}
        header={<LiveFeedHeader />}
      />
    </div>
  ),
};

export const LiveFeedEmpty: Story = {
  name: "LiveFeedPanel empty",
  render: () => (
    <div className="max-w-lg">
      <LiveFeedPanel
        copy={demoCompanyDashboardCopyDe.liveFeed}
        feedItems={[]}
        header={<LiveFeedHeader />}
        state={{
          description: "No operational activity was supplied by the payload.",
          title: "No feed activity",
          variant: "empty",
        }}
      />
    </div>
  ),
};

export const LiveFeedLoading: Story = {
  name: "LiveFeedPanel loading",
  render: () => (
    <div className="max-w-lg">
      <LiveFeedPanel
        copy={demoCompanyDashboardCopyDe.liveFeed}
        feedItems={[]}
        header={<LiveFeedHeader />}
        state={{
          description: "The caller supplied this pending UI state.",
          title: "Feed is loading",
          variant: "loading",
        }}
      />
    </div>
  ),
};

export const LiveFeedError: Story = {
  name: "LiveFeedPanel error",
  render: () => (
    <div className="max-w-lg">
      <LiveFeedPanel
        copy={demoCompanyDashboardCopyDe.liveFeed}
        feedItems={[]}
        header={<LiveFeedHeader />}
        state={{
          description: "The caller supplied this unavailable UI state.",
          title: "Feed unavailable",
          variant: "error",
        }}
      />
    </div>
  ),
};

export const LiveFeedNarrowWidth: Story = {
  name: "LiveFeedPanel narrow width",
  render: () => (
    <div className="max-w-[390px]">
      <LiveFeedPanel
        copy={demoCompanyDashboardCopyDe.liveFeed}
        feedItems={manyFeedItems}
        header={<LiveFeedHeader />}
      />
    </div>
  ),
};

export const TaxiosDashboardLiveFeedItemTonesStory: Story = {
  name: "TaxiosDashboardLiveFeedItem",
  render: () => (
    <TaxiosPorcelainSurface className="max-w-lg rounded-[40px] p-7 shadow-xl shadow-black/[0.02]">
      <ul className="live-feed-timeline relative space-y-1.5">
        {demoDashboardFeedItems.map((item) => (
          <TaxiosDashboardLiveFeedItem item={item} key={item.title} />
        ))}
      </ul>
    </TaxiosPorcelainSurface>
  ),
};
