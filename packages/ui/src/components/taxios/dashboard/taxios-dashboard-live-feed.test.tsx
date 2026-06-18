import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import {
  demoCompanyDashboardCopyDe,
  demoDashboardFeedItems,
} from "../../../storybook/fixtures/company-dashboard.fixtures";
import { LiveFeedPanel } from "./taxios-dashboard-live-feed";

const liveFeedCopy = demoCompanyDashboardCopyDe.liveFeed;

function LiveFeedTestHeader() {
  return <h2>{liveFeedCopy.title}</h2>;
}

test("renders provided live feed items without deriving domain state", () => {
  const firstFeedItem = demoDashboardFeedItems[0];

  if (!firstFeedItem) {
    throw new Error("Expected at least one demo feed item.");
  }

  render(
    <LiveFeedPanel
      copy={liveFeedCopy}
      feedItems={[firstFeedItem]}
      header={<LiveFeedTestHeader />}
    />,
  );

  expect(screen.getByText(firstFeedItem.title)).toBeTruthy();
  expect(screen.getByText(firstFeedItem.sub)).toBeTruthy();
  expect(screen.getByText("1")).toBeTruthy();
});

test("renders caller-provided loading state instead of feed rows", () => {
  render(
    <LiveFeedPanel
      copy={liveFeedCopy}
      feedItems={[]}
      header={<LiveFeedTestHeader />}
      state={{
        description: "The caller supplied this pending UI state.",
        title: "Feed is loading",
        variant: "loading",
      }}
    />,
  );

  expect(screen.getByRole("status")).toBeTruthy();
  expect(screen.getByText("Feed is loading")).toBeTruthy();
  expect(screen.queryByRole("list")).toBeNull();
});
