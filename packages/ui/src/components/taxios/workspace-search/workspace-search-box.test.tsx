import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import type { WorkspaceSearchGroup } from "../../../contracts/workspace-search";
import { WorkspaceSearchBox } from "./workspace-search-box";

const groups: WorkspaceSearchGroup[] = [
  {
    label: "Buchung",
    results: [
      {
        href: "/company-rides?booking=BKG-123ABC",
        meta: ["Ada Search"],
        publicId: "BKG-123ABC",
        resultId: "search-doc-1",
        statusKey: "booked",
        statusLabel: "Gebucht",
        subtitle: "Werrastrasse 36 -> Linkstrasse 5",
        targetType: "booking",
        title: "BKG-123ABC",
        tone: "navy",
        typeLabel: "Buchung",
      },
    ],
    targetType: "booking",
    total: 1,
  },
];

describe("WorkspaceSearchBox", () => {
  test("renders grouped suggestions and selects a result", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    const onResultSelect = vi.fn();

    render(
      <WorkspaceSearchBox
        groups={groups}
        onQueryChange={onQueryChange}
        onResultSelect={onResultSelect}
        query="BKG"
        state="ready"
      />,
    );

    await user.click(screen.getByRole("combobox", { name: "Workspace durchsuchen" }));

    expect(screen.getByText("Buchung")).not.toBeNull();
    expect(screen.getAllByText("BKG-123ABC").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("option", { name: /BKG-123ABC/ }));

    expect(onResultSelect).toHaveBeenCalledWith(groups[0].results[0]);
  });

  test("renders empty state and all-results action", async () => {
    const user = userEvent.setup();
    const onAllResultsSelect = vi.fn();

    render(
      <WorkspaceSearchBox
        groups={[]}
        onAllResultsSelect={onAllResultsSelect}
        onQueryChange={() => undefined}
        query="abc"
        state="empty"
      />,
    );

    await user.click(screen.getByRole("combobox", { name: "Workspace durchsuchen" }));

    expect(screen.getByText("Keine Treffer im aktiven Workspace.")).not.toBeNull();

    await user.click(screen.getByRole("option", { name: /Alle Ergebnisse anzeigen/ }));

    expect(onAllResultsSelect).toHaveBeenCalledTimes(1);
  });

  test("exposes aria-selected on active search options and aria-activedescendant on combobox", async () => {
    const user = userEvent.setup();

    render(
      <WorkspaceSearchBox
        groups={groups}
        onQueryChange={() => undefined}
        onResultSelect={() => undefined}
        query="BKG"
        state="ready"
      />,
    );

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);

    const activeOption = options.find(
      (option) => option.getAttribute("aria-selected") === "true",
    );
    expect(activeOption).toBeTruthy();

    const activeId = activeOption?.getAttribute("id");
    expect(activeId).toBeTruthy();
    expect(combobox.getAttribute("aria-activedescendant")).toBe(activeId);
  });
});
