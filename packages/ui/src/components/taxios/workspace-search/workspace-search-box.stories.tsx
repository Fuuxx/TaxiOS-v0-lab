import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";

import type {
  WorkspaceSearchGroup,
  WorkspaceSearchState,
} from "../../../contracts/workspace-search";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { WorkspaceSearchBox } from "./workspace-search-box";

const searchGroups: WorkspaceSearchGroup[] = [
  {
    label: "Buchung",
    results: [
      {
        href: "/company-rides/BKG-8HTXCR",
        meta: ["Heute", "20:05"],
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
        href: "/company-rides/BKG-6GVKR7",
        meta: ["Heute", "08:40"],
        publicId: "BKG-6GVKR7",
        resultId: "booking_2",
        statusKey: "cancelled",
        statusLabel: "Storniert",
        subtitle: "Werrastrasse 36 -> Linkstrasse 5",
        targetType: "booking",
        title: "BKG-6GVKR7",
        tone: "orange",
        typeLabel: "Buchung",
      },
    ],
    targetType: "booking",
    total: 2,
  },
  {
    label: "Mitglied",
    results: [
      {
        href: null,
        meta: ["Keine Detailrechte"],
        publicId: "MEM-HIDDEN",
        resultId: "member_hidden",
        statusKey: null,
        statusLabel: "Kein Zugriff",
        subtitle: "Mitgliederdetails sind ohne members.view gesperrt.",
        targetType: "member",
        title: "Member result hidden by permissions",
        tone: "grey",
        typeLabel: "Mitglied",
      },
    ],
    targetType: "member",
    total: 1,
  },
];

function SearchBoxStory({
  groups,
  query,
  state,
}: {
  groups: readonly WorkspaceSearchGroup[];
  query: string;
  state: WorkspaceSearchState;
}) {
  const [currentQuery, setCurrentQuery] = useState(query);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    rootRef.current?.querySelector("input")?.focus();
  }, []);

  return (
    <div className="mx-auto h-[32rem] max-w-2xl pt-10" ref={rootRef}>
      <WorkspaceSearchBox
        groups={groups}
        onAllResultsSelect={() => undefined}
        onQueryChange={setCurrentQuery}
        onResultSelect={() => undefined}
        query={currentQuery}
        state={state}
      />
    </div>
  );
}

const meta = {
  title: "Taxios/TaxiOS/Workspace Search/Box",
  component: WorkspaceSearchBox,
  decorators: [
    (Story) => (
      <StoryCanvas contentClassName="p-0" maxWidth="none" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
  args: {
    groups: searchGroups,
    onAllResultsSelect: () => undefined,
    onQueryChange: () => undefined,
    onResultSelect: () => undefined,
    query: "ay",
    state: "ready",
  },
} satisfies Meta<typeof WorkspaceSearchBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  render: () => (
    <SearchBoxStory groups={searchGroups} query="ay" state="ready" />
  ),
};

export const Empty: Story = {
  render: () => <SearchBoxStory groups={[]} query="zz" state="empty" />,
};

export const Loading: Story = {
  render: () => <SearchBoxStory groups={[]} query="ay" state="loading" />,
};

export const ErrorState: Story = {
  render: () => <SearchBoxStory groups={[]} query="ay" state="error" />,
};

export const ActiveOption: Story = {
  render: () => {
    const [currentQuery, setCurrentQuery] = useState("BKG");
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const input = rootRef.current?.querySelector("input");
      if (input) {
        input.focus();
        // Simulate ArrowDown to move to second option
        const event = new KeyboardEvent("keydown", {
          bubbles: true,
          key: "ArrowDown",
        });
        input.dispatchEvent(event);
      }
    }, []);

    return (
      <div className="mx-auto h-[32rem] max-w-2xl pt-10" ref={rootRef}>
        <WorkspaceSearchBox
          groups={searchGroups}
          onAllResultsSelect={() => undefined}
          onQueryChange={setCurrentQuery}
          onResultSelect={() => undefined}
          query={currentQuery}
          state="ready"
        />
      </div>
    );
  },
};
