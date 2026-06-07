import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";

import type {
  WorkspaceNotificationFilter,
  WorkspaceNotificationItem,
  WorkspaceNotificationsState,
} from "../../../contracts/workspace-notifications";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { WorkspaceNotificationsPopover } from "./workspace-notifications-popover";

const items: WorkspaceNotificationItem[] = [
  {
    body: "BKG-8HTXCR wurde für den aktiven Workspace erstellt.",
    createdAtLabel: "gerade eben",
    entityPublicId: "BKG-8HTXCR",
    href: "/company-rides/BKG-8HTXCR",
    itemId: "notification_1",
    priority: "info",
    publicId: "NTF-1",
    read: false,
    title: "Company rides loaded",
    type: "booking_created",
  },
  {
    body: "Eine Einladung wartet auf Freigabe.",
    createdAtLabel: "vor 12 Min.",
    entityPublicId: "IVT-K7N4PC",
    href: "/company-organization?section=invitations",
    itemId: "notification_2",
    priority: "action_required",
    publicId: "NTF-2",
    read: false,
    title: "Invite approval required",
    type: "company_member_invitation_claimed",
  },
];

function OpenPopoverStory({
  activeFilter,
  state,
  unreadBadgeCount,
  visibleItems,
}: {
  activeFilter: WorkspaceNotificationFilter;
  state: WorkspaceNotificationsState;
  unreadBadgeCount: number;
  visibleItems: readonly WorkspaceNotificationItem[];
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const didOpen = useRef(false);

  useEffect(() => {
    if (didOpen.current) {
      return;
    }

    didOpen.current = true;
    queueMicrotask(() => {
      rootRef.current?.querySelector("button")?.click();
    });
  }, []);

  return (
    <div className="flex min-h-[32rem] justify-end p-12" ref={rootRef}>
      <WorkspaceNotificationsPopover
        activeFilter={activeFilter}
        items={visibleItems}
        onFilterChange={() => undefined}
        onItemSelect={() => undefined}
        onMarkAllRead={() => undefined}
        onMarkRead={() => undefined}
        onOpenAll={() => undefined}
        state={state}
        unreadBadgeCount={unreadBadgeCount}
      />
    </div>
  );
}

const meta = {
  title: "Taxios/TaxiOS/Workspace Notifications/Popover",
  component: WorkspaceNotificationsPopover,
  decorators: [
    (Story) => (
      <StoryCanvas contentClassName="p-0" maxWidth="none" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
  args: {
    activeFilter: "all",
    items,
    onFilterChange: () => undefined,
    onItemSelect: () => undefined,
    onMarkAllRead: () => undefined,
    onMarkRead: () => undefined,
    onOpenAll: () => undefined,
    state: "ready",
    unreadBadgeCount: 2,
  },
} satisfies Meta<typeof WorkspaceNotificationsPopover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReadyUnread: Story = {
  render: () => (
    <OpenPopoverStory
      activeFilter="all"
      state="ready"
      unreadBadgeCount={2}
      visibleItems={items}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <OpenPopoverStory
      activeFilter="all"
      state="empty"
      unreadBadgeCount={0}
      visibleItems={[]}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <OpenPopoverStory
      activeFilter="all"
      state="loading"
      unreadBadgeCount={0}
      visibleItems={[]}
    />
  ),
};

export const ErrorState: Story = {
  render: () => (
    <OpenPopoverStory
      activeFilter="important"
      state="error"
      unreadBadgeCount={1}
      visibleItems={[]}
    />
  ),
};

export const TabSwitching: Story = {
  render: () => {
    const [activeFilter, setActiveFilter] = useState<WorkspaceNotificationFilter>("all");
    const rootRef = useRef<HTMLDivElement | null>(null);
    const didClick = useRef(false);

    useEffect(() => {
      if (didClick.current) {
        return;
      }
      didClick.current = true;
      queueMicrotask(() => {
        rootRef.current?.querySelector("button")?.click();
      });
    }, []);

    return (
      <div className="flex min-h-[32rem] justify-end p-12" ref={rootRef}>
        <WorkspaceNotificationsPopover
          activeFilter={activeFilter}
          items={items}
          onFilterChange={setActiveFilter}
          onItemSelect={() => undefined}
          onMarkAllRead={() => undefined}
          onMarkRead={() => undefined}
          onOpenAll={() => undefined}
          state="ready"
          unreadBadgeCount={2}
        />
      </div>
    );
  },
};
