import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { demoCompanyDashboardCopyDe } from "../../../storybook/fixtures/company-dashboard.fixtures";
import { FastBookingCard } from "./company-dashboard-fastbooking-card";
import { FastBookingGrid } from "./company-dashboard-fastbooking-client";

const fastbookingCopy = demoCompanyDashboardCopyDe.fastbooking;

test("renders the fastbooking grid empty state from provided copy", () => {
  render(
    <FastBookingGrid
      availableMembers={[]}
      copy={fastbookingCopy}
      fastRoutes={[]}
    />,
  );

  expect(screen.getByText(fastbookingCopy.emptyTitle)).toBeTruthy();
  expect(screen.getByText(fastbookingCopy.emptyDescription)).toBeTruthy();
});

test("notifies the caller when a member is added to a fastbooking route", async () => {
  const user = userEvent.setup();
  const onRouteMembersChange = vi.fn();

  render(
    <FastBookingCard
      availableMembers={[{ id: "member-grace", name: "Grace Hopper" }]}
      avatars={["AL"]}
      copy={fastbookingCopy}
      from="Office fast route"
      memberIds={[]}
      onRouteMembersChange={onRouteMembersChange}
      title="Airport fast route"
      to="Airport fast route"
    />,
  );

  await user.click(screen.getByLabelText(fastbookingCopy.addMemberLabel));
  await user.click(screen.getByRole("button", { name: "Grace Hopper" }));
  await user.click(screen.getByRole("button", { name: /\(1\)/ }));

  expect(onRouteMembersChange).toHaveBeenCalledWith({
    from: "Office fast route",
    memberIds: ["member-grace"],
    to: "Airport fast route",
  });
  expect(
    screen.getByRole("button", {
      name: `Grace Hopper ${fastbookingCopy.selectAvatarLabel}`,
    }),
  ).toBeTruthy();
  expect(screen.getByRole("img", { name: "Grace Hopper" })).toBeTruthy();
});

test("toggles persisted fastbooking member icons as booking passengers", async () => {
  const user = userEvent.setup();
  const onBookingStart = vi.fn();

  render(
    <FastBookingCard
      availableMembers={[{ id: "member-grace", name: "Grace Hopper" }]}
      avatars={[]}
      copy={fastbookingCopy}
      from="Office fast route"
      memberIds={["member-grace"]}
      onBookingStart={onBookingStart}
      title="Airport fast route"
      to="Airport fast route"
    />,
  );

  const graceButton = screen.getByRole("button", {
    name: `Grace Hopper ${fastbookingCopy.selectAvatarLabel}`,
  });

  expect(graceButton.getAttribute("aria-pressed")).toBe("false");
  expect(graceButton.getAttribute("data-selected")).toBe("false");

  await user.click(graceButton);

  const footerAction = screen.getByTestId("fastbooking-member-selector-toggle");

  expect(footerAction.getAttribute("aria-label")).toBe(
    `${fastbookingCopy.bookLabel} (1)`,
  );
  expect(document.querySelector(".fastbooking-booking-toggle")).toBeNull();

  await user.click(footerAction);

  expect(graceButton.getAttribute("aria-pressed")).toBe("true");
  expect(graceButton.getAttribute("data-selected")).toBe("true");
  expect(screen.queryByRole("button", { name: /entfernen \(1\)/i })).toBeNull();
  expect(onBookingStart).toHaveBeenCalledWith({
    from: "Office fast route",
    memberIds: ["member-grace"],
    title: "Airport fast route",
    to: "Airport fast route",
  });
});

test("opens normal member mode from the right footer toggle with neutral alphabetical members", async () => {
  const user = userEvent.setup();

  render(
    <FastBookingCard
      availableMembers={[
        { id: "member-zoe", name: "Zoe Zebra" },
        { id: "member-grace", name: "Grace Hopper" },
        { id: "member-ada", name: "Ada Lovelace" },
      ]}
      avatars={["AL"]}
      copy={fastbookingCopy}
      from="Office fast route"
      memberIds={["member-grace"]}
      title="Airport fast route"
      to="Airport fast route"
    />,
  );

  await user.click(screen.getByTestId("fastbooking-member-selector-toggle"));

  expect(
    screen.getByLabelText(fastbookingCopy.searchMembersLabel).getAttribute("disabled"),
  ).toBeNull();
  expect(
    screen
      .getByTestId("fastbooking-member-selector-toggle")
      .getAttribute("aria-expanded"),
  ).toBe("true");
  expect(
    screen.queryByRole("button", {
      name: `AL ${fastbookingCopy.selectAvatarLabel}`,
    }),
  ).toBeNull();
  expect(
    screen.queryByRole("button", {
      name: `Grace Hopper ${fastbookingCopy.selectAvatarLabel}`,
    }),
  ).toBeNull();
  expect(screen.queryByRole("img", { name: "AL" })).toBeNull();
  expect(screen.queryByRole("img", { name: "Grace Hopper" })).toBeNull();
  expect(screen.queryByLabelText(fastbookingCopy.addMemberLabel)).toBeNull();
  expect(
    screen
      .getByRole("button", { name: "Grace Hopper" })
      .getAttribute("data-committed"),
  ).toBe("false");
  expect(
    screen
      .getAllByRole("button")
      .map((button) => button.textContent?.trim())
      .filter((label) =>
        ["Ada Lovelace", "Grace Hopper", "Zoe Zebra"].includes(label ?? ""),
      ),
  ).toEqual(["Ada Lovelace", "Grace Hopper", "Zoe Zebra"]);
});

test("locks the picker into add mode after selecting an unassigned member", async () => {
  const user = userEvent.setup();
  const onRouteMembersChange = vi.fn();

  render(
    <FastBookingCard
      availableMembers={[
        { id: "member-grace", name: "Grace Hopper" },
        { id: "member-ada", name: "Ada Lovelace" },
      ]}
      avatars={[]}
      copy={fastbookingCopy}
      from="Office fast route"
      memberIds={["member-ada"]}
      onRouteMembersChange={onRouteMembersChange}
      title="Airport fast route"
      to="Airport fast route"
    />,
  );

  await user.click(screen.getByLabelText(fastbookingCopy.addMemberLabel));

  expect(
    screen
      .getByRole("button", { name: "Ada Lovelace" })
      .getAttribute("data-committed"),
  ).toBe("true");

  await user.click(screen.getByRole("button", { name: "Grace Hopper" }));

  expect(screen.queryByRole("button", { name: "Ada Lovelace" })).toBeNull();

  await user.click(screen.getByRole("button", { name: /\(1\)/ }));

  expect(onRouteMembersChange).toHaveBeenCalledWith({
    from: "Office fast route",
    memberIds: ["member-ada", "member-grace"],
    to: "Airport fast route",
  });
});

test("locks the picker into remove mode after selecting a pinned member", async () => {
  const user = userEvent.setup();
  const onRouteMembersChange = vi.fn();

  render(
    <FastBookingCard
      availableMembers={[
        { id: "member-grace", name: "Grace Hopper" },
        { id: "member-ada", name: "Ada Lovelace" },
      ]}
      avatars={[]}
      copy={fastbookingCopy}
      from="Office fast route"
      memberIds={["member-ada"]}
      onRouteMembersChange={onRouteMembersChange}
      title="Airport fast route"
      to="Airport fast route"
    />,
  );

  await user.click(screen.getByLabelText(fastbookingCopy.addMemberLabel));
  await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));

  expect(screen.queryByRole("button", { name: "Grace Hopper" })).toBeNull();

  await user.click(screen.getByRole("button", { name: /entfernen \(1\)/i }));

  expect(onRouteMembersChange).toHaveBeenCalledWith({
    from: "Office fast route",
    memberIds: [],
    to: "Airport fast route",
  });
});

test("reorders persisted member icons with drag and drop", () => {
  const onRouteMembersChange = vi.fn();

  render(
    <FastBookingCard
      availableMembers={[
        { id: "member-ada", name: "Ada Lovelace" },
        { id: "member-grace", name: "Grace Hopper" },
        { id: "member-zoe", name: "Zoe Zebra" },
      ]}
      avatars={[]}
      copy={fastbookingCopy}
      from="Office fast route"
      memberIds={["member-ada", "member-grace", "member-zoe"]}
      onRouteMembersChange={onRouteMembersChange}
      title="Airport fast route"
      to="Airport fast route"
    />,
  );

  const adaButton = screen.getByRole("button", {
    name: `Ada Lovelace ${fastbookingCopy.selectAvatarLabel}`,
  });
  const zoeButton = screen.getByRole("button", {
    name: `Zoe Zebra ${fastbookingCopy.selectAvatarLabel}`,
  });

  fireEvent.dragStart(zoeButton);
  fireEvent.dragOver(adaButton);
  fireEvent.drop(adaButton);

  expect(onRouteMembersChange).toHaveBeenCalledWith({
    from: "Office fast route",
    memberIds: ["member-zoe", "member-ada", "member-grace"],
    to: "Airport fast route",
  });
  expect(
    screen
      .getAllByRole("button")
      .map((button) => button.getAttribute("aria-label"))
      .filter((label) => label?.includes(fastbookingCopy.selectAvatarLabel)),
  ).toEqual([
    `Zoe Zebra ${fastbookingCopy.selectAvatarLabel}`,
    `Ada Lovelace ${fastbookingCopy.selectAvatarLabel}`,
    `Grace Hopper ${fastbookingCopy.selectAvatarLabel}`,
  ]);
});

test("starts direct fastbooking with all selected passengers across standard taxis", async () => {
  const user = userEvent.setup();
  const onBookingStart = vi.fn();

  render(
    <FastBookingCard
      availableMembers={[
        { id: "member-ada", name: "Ada Lovelace" },
        { id: "member-grace", name: "Grace Hopper" },
        { id: "member-katherine", name: "Katherine Johnson" },
        { id: "member-mary", name: "Mary Jackson" },
      ]}
      avatars={[]}
      copy={fastbookingCopy}
      from="Office fast route"
      memberIds={[
        "member-ada",
        "member-grace",
        "member-katherine",
        "member-mary",
      ]}
      onBookingStart={onBookingStart}
      title="Airport fast route"
      to="Airport fast route"
    />,
  );

  await user.click(
    screen.getByRole("button", {
      name: `Ada Lovelace ${fastbookingCopy.selectAvatarLabel}`,
    }),
  );
  await user.click(
    screen.getByRole("button", {
      name: `Grace Hopper ${fastbookingCopy.selectAvatarLabel}`,
    }),
  );
  await user.click(
    screen.getByRole("button", {
      name: `Katherine Johnson ${fastbookingCopy.selectAvatarLabel}`,
    }),
  );
  await user.click(
    screen.getByRole("button", {
      name: `Mary Jackson ${fastbookingCopy.selectAvatarLabel}`,
    }),
  );

  expect(
    screen
      .getByRole("button", {
        name: `Ada Lovelace ${fastbookingCopy.selectAvatarLabel}`,
      })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  expect(
    screen
      .getByRole("button", {
        name: `Grace Hopper ${fastbookingCopy.selectAvatarLabel}`,
      })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  expect(
    screen
      .getByRole("button", {
        name: `Katherine Johnson ${fastbookingCopy.selectAvatarLabel}`,
      })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  expect(
    screen
      .getByRole("button", {
        name: `Mary Jackson ${fastbookingCopy.selectAvatarLabel}`,
      })
      .getAttribute("aria-pressed"),
  ).toBe("true");

  const bookingAction = screen.getByRole("button", {
    name: `${fastbookingCopy.bookLabel} (4)`,
  });

  expect(bookingAction).toBeTruthy();
  expect(document.querySelector(".fastbooking-booking-toggle")).toBeNull();

  await user.click(bookingAction);

  expect(onBookingStart).toHaveBeenCalledWith({
    from: "Office fast route",
    memberIds: [
      "member-ada",
      "member-grace",
      "member-katherine",
      "member-mary",
    ],
    title: "Airport fast route",
    to: "Airport fast route",
  });
});
