import type { Meta, StoryObj } from "@storybook/react-vite";

import type { WorkspaceSearchResult } from "../../../contracts/workspace-search";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { WorkspaceSearchResultsScreen } from "./workspace-search-results-screen";

const results: WorkspaceSearchResult[] = [
  {
    href: "/company-rides/BKG-8HTXCR",
    meta: ["Heute", "20:05", "Eigene Buchung"],
    publicId: "BKG-8HTXCR",
    resultId: "booking_1",
    statusKey: "requested",
    statusLabel: "Gebucht",
    subtitle: "test 1 -> test 2",
    targetType: "booking",
    title: "BKG-8HTXCR",
    tone: "navy",
    typeLabel: "Buchung",
  },
  {
    href: null,
    meta: ["Kein members.view"],
    publicId: "MEM-HIDDEN",
    resultId: "member_hidden",
    statusKey: null,
    statusLabel: "Gesperrt",
    subtitle: "Dieses Ergebnis ist für den aktuellen Benutzer nicht offenbar.",
    targetType: "member",
    title: "Mitgliederdetails gesperrt",
    tone: "grey",
    typeLabel: "Mitglied",
  },
];

const meta = {
  title: "Taxios/TaxiOS/Workspace Search/Results",
  component: WorkspaceSearchResultsScreen,
  decorators: [
    (Story) => (
      <StoryCanvas contentClassName="p-0" maxWidth="none" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
  args: {
    canLoadMore: false,
    isLoadingMore: false,
    onLoadMore: () => undefined,
    onResultSelect: () => undefined,
    onTargetTypeChange: () => undefined,
    query: "ay",
    results,
    selectedTargetType: null,
  },
} satisfies Meta<typeof WorkspaceSearchResultsScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Empty: Story = {
  args: {
    query: "zz",
    results: [],
  },
};

export const FilteredBookings: Story = {
  args: {
    query: "bkg",
    results: results.filter((result) => result.targetType === "booking"),
    selectedTargetType: "booking",
  },
};

export const LoadingMore: Story = {
  args: {
    canLoadMore: true,
    isLoadingMore: true,
  },
};
