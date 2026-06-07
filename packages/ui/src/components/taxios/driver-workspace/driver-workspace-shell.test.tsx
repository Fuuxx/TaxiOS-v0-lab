import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { DriverWorkspaceShell } from "./driver-workspace-shell";

describe("DriverWorkspaceShell", () => {
  test("renders shared driver navigation with the active route marked", () => {
    render(
      <DriverWorkspaceShell
        activeItem="jobs"
        organizationName="City Funk Berlin"
        title="Driver jobs"
      >
        <div>Driver content</div>
      </DriverWorkspaceShell>,
    );

    const jobsLink = screen.getByRole("link", { name: "Meine Jobs" });
    const poolLink = screen.getByRole("link", { name: "Driver Pool" });

    expect(jobsLink.getAttribute("href")).toBe("/driver-jobs");
    expect(jobsLink.getAttribute("aria-current")).toBe("page");
    expect(poolLink.getAttribute("href")).toBe("/driver-pool");
    expect(poolLink.getAttribute("aria-current")).toBeNull();
    expect(screen.getByText("Driver content")).not.toBeNull();
  });
});
