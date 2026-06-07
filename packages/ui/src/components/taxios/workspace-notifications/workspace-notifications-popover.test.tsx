import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import type { WorkspaceNotificationItem } from "../../../contracts/workspace-notifications";
import { WorkspaceNotificationsPopover } from "./workspace-notifications-popover";

const notifications: WorkspaceNotificationItem[] = [
  {
    body: "Mina Requested wartet auf einen Fahrer.",
    createdAtLabel: "gerade eben",
    entityPublicId: "BKG-QH9MV9",
    href: "/company-rides?booking=BKG-QH9MV9",
    itemId: "receipt-1",
    priority: "action_required",
    publicId: "NTF-8K2M4P",
    read: false,
    title: "Buchung braucht Aufmerksamkeit",
    type: "booking_created",
  },
  {
    body: "Die Fahrt nach Alexanderplatz wurde abgeschlossen.",
    createdAtLabel: "vor 5 Min.",
    entityPublicId: "BKG-EBUF92",
    href: "/company-rides?booking=BKG-EBUF92",
    itemId: "receipt-2",
    priority: "success",
    publicId: "NTF-4H7N2R",
    read: true,
    title: "Fahrt abgeschlossen",
    type: "booking_completed",
  },
];

describe("WorkspaceNotificationsPopover", () => {
  test("opens the inbox, shows badge, filters and marks all read", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    const onMarkAllRead = vi.fn();

    render(
      <WorkspaceNotificationsPopover
        activeFilter="important"
        items={notifications}
        onFilterChange={onFilterChange}
        onItemSelect={() => undefined}
        onMarkAllRead={onMarkAllRead}
        onMarkRead={() => undefined}
        onOpenAll={() => undefined}
        state="ready"
        unreadBadgeCount={1}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Benachrichtigungen/ }));

    expect(screen.getByText("Benachrichtigungen")).not.toBeNull();
    expect(screen.getByText("Buchung braucht Aufmerksamkeit")).not.toBeNull();
    expect(screen.getByText("1")).not.toBeNull();

    await user.click(screen.getByRole("tab", { name: "Ungelesen" }));

    expect(onFilterChange).toHaveBeenCalledWith("unread");

    await user.click(screen.getByRole("button", { name: "Alle als gelesen" }));

    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });

  test("selects and marks a single notification", async () => {
    const user = userEvent.setup();
    const onItemSelect = vi.fn();
    const onMarkRead = vi.fn();

    render(
      <WorkspaceNotificationsPopover
        activeFilter="all"
        items={notifications}
        onFilterChange={() => undefined}
        onItemSelect={onItemSelect}
        onMarkAllRead={() => undefined}
        onMarkRead={onMarkRead}
        onOpenAll={() => undefined}
        state="ready"
        unreadBadgeCount={1}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Benachrichtigungen/ }));

    const firstItem = screen.getByRole("article", {
      name: /Buchung braucht Aufmerksamkeit/,
    });

    await user.click(within(firstItem).getByRole("button", { name: "Als gelesen" }));

    expect(onMarkRead).toHaveBeenCalledWith("receipt-1");

    await user.click(within(firstItem).getByRole("link", { name: /Buchung braucht Aufmerksamkeit/ }));

    expect(onItemSelect).toHaveBeenCalledWith(notifications[0]);
  });

  test("renders the empty state", async () => {
    const user = userEvent.setup();

    render(
      <WorkspaceNotificationsPopover
        activeFilter="important"
        items={[]}
        onFilterChange={() => undefined}
        onItemSelect={() => undefined}
        onMarkAllRead={() => undefined}
        onMarkRead={() => undefined}
        onOpenAll={() => undefined}
        state="empty"
        unreadBadgeCount={0}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Benachrichtigungen/ }));

    expect(screen.getByText("Keine neuen Benachrichtigungen")).not.toBeNull();
  });

  test("connects tabs to tabpanel with aria-controls and aria-labelledby", async () => {
    const user = userEvent.setup();

    render(
      <WorkspaceNotificationsPopover
        activeFilter="unread"
        items={notifications}
        onFilterChange={() => undefined}
        onItemSelect={() => undefined}
        onMarkAllRead={() => undefined}
        onMarkRead={() => undefined}
        onOpenAll={() => undefined}
        state="ready"
        unreadBadgeCount={1}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Benachrichtigungen/ }));

    const activeTab = screen.getByRole("tab", { selected: true });
    expect(activeTab.getAttribute("aria-controls")).toBe("workspace-notif-panel");
    expect(activeTab.getAttribute("id")).toBe("workspace-notif-tab-unread");

    const panel = document.getElementById("workspace-notif-panel");
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute("role")).toBe("tabpanel");
    expect(panel?.getAttribute("aria-labelledby")).toBe("workspace-notif-tab-unread");
  });
});
