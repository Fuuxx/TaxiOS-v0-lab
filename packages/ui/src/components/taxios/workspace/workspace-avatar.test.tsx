import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { WorkspaceAvatarStack } from "./workspace-avatar";

const AVATARS = Object.freeze([
  { id: "passenger-1", initials: "AL", name: "Ada Lovelace" },
  { id: "passenger-2", initials: "GH", name: "Grace Hopper" },
  { id: "passenger-3", initials: "KJ", name: "Katherine Johnson" },
  { id: "passenger-4", initials: "MJ", name: "Mary Jackson" },
  { id: "passenger-5", initials: "DT", name: "Dorothy Vaughan" },
  { id: "passenger-6", initials: "CR", name: "Christine Darden" },
] as const);

describe("WorkspaceAvatarStack", () => {
  test("keeps source data intact while default density renders four avatars plus overflow", () => {
    render(
      <WorkspaceAvatarStack
        items={AVATARS}
        overflowLabel={(hiddenCount, hiddenItems) =>
          `${hiddenCount} more: ${hiddenItems.map((item) => item.name).join(", ")}`
        }
      />,
    );

    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Grace Hopper" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Katherine Johnson" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Mary Jackson" })).toBeTruthy();
    expect(
      screen.getByRole("img", {
        name: "2 more: Dorothy Vaughan, Christine Darden",
      }),
    ).toBeTruthy();
    expect(screen.queryByRole("img", { name: "Dorothy Vaughan" })).toBeNull();
    expect(AVATARS).toHaveLength(6);
    expect(AVATARS[4]?.name).toBe("Dorothy Vaughan");
  });

  test("compact density renders three avatars plus overflow", () => {
    render(<WorkspaceAvatarStack density="compact" items={AVATARS} />);

    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Grace Hopper" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Katherine Johnson" })).toBeTruthy();
    expect(screen.queryByRole("img", { name: "Mary Jackson" })).toBeNull();
    expect(screen.getByRole("img", { name: "3 more people" })).toBeTruthy();
  });

  test("maxVisible overrides the documented density default without acting as a token", () => {
    render(
      <WorkspaceAvatarStack
        density="compact"
        items={AVATARS}
        maxVisible={5}
      />,
    );

    expect(screen.getByRole("img", { name: "Dorothy Vaughan" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "1 more person" })).toBeTruthy();
  });

  test("renders an empty stack without fabricating placeholder avatars", () => {
    const { container } = render(<WorkspaceAvatarStack items={[]} />);

    expect(container.querySelectorAll(".taxios-avatar")).toHaveLength(0);
  });
});
