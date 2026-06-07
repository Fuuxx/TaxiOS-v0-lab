import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { CompanyWorkspaceShell } from "./company-workspace-shell";

describe("CompanyWorkspaceShell", () => {
  test("moves account actions into the topbar avatar menu and shows organization and finance navigation", async () => {
    const user = userEvent.setup();
    const onNewBookingClick = vi.fn();

    render(
      <CompanyWorkspaceShell
        activeItem="dashboard"
        onNewBookingClick={onNewBookingClick}
        organizationName="Smoke Company HQ"
        sessionAction={<button type="button">Abmelden</button>}
        userEmail="ayoub@example.test"
        userFirstName="Ayoub"
        userInitials="AA"
        userLabel="Ayoub Amid"
        userLastName="Amid"
        userPublicId="USR-7K4Q2M"
        userRoleLabel="Company Admin"
      >
        <div>Workspace content</div>
      </CompanyWorkspaceShell>,
    );

    expect(screen.getByText("Finanzen")).not.toBeNull();
    expect(screen.getByText("Organisation")).not.toBeNull();
    expect(screen.getByText("Buchungen")).not.toBeNull();
    expect(screen.queryByText("Mitglieder")).toBeNull();
    expect(screen.queryByText("Standorte")).toBeNull();
    expect(
      screen
        .getByLabelText("Benachrichtigungen")
        .compareDocumentPosition(
          screen.getByLabelText("Angemeldeter Benutzer: Ayoub Amid"),
        ) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    await user.click(
      screen.getAllByRole("button", { name: "Neue Buchung" })[0],
    );
    expect(onNewBookingClick).toHaveBeenCalledTimes(1);

    await user.click(
      screen.getByLabelText("Angemeldeter Benutzer: Ayoub Amid"),
    );

    expect(screen.getByText("Mein Profil")).not.toBeNull();
    expect(screen.getByText("Company Einstellungen")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Abmelden" })).not.toBeNull();

    await user.click(screen.getByText("Mein Profil"));

    expect(screen.getByText("Vorname")).not.toBeNull();
    expect(screen.getByText("Ayoub")).not.toBeNull();
    expect(screen.getByText("Nachname")).not.toBeNull();
    expect(screen.getByText("Amid")).not.toBeNull();
    expect(screen.getByText("ayoub@example.test")).not.toBeNull();
    expect(screen.getByText("USR-7K4Q2M")).not.toBeNull();
    expect(screen.getAllByText("Smoke Company HQ").length).toBeGreaterThan(0);
    expect(screen.getByText("Company Admin")).not.toBeNull();
    expect(
      screen.getByLabelText("Profilbild hochladen oder bearbeiten"),
    ).not.toBeNull();
    expect(screen.getByText("Passwort ändern")).not.toBeNull();

    const avatarTrigger = screen.getByLabelText(
      "Angemeldeter Benutzer: Ayoub Amid",
    );
    expect(avatarTrigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(avatarTrigger.getAttribute("aria-controls")).toBe(
      "company-workspace-user-menu",
    );
    expect(
      document.getElementById("company-workspace-user-menu"),
    ).not.toBeNull();
  });

  test("hides workspace search when the shell receives an explicit disabled search component", () => {
    render(
      <CompanyWorkspaceShell
        activeItem="dashboard"
        organizationName="Smoke Company HQ"
        searchComponent={false}
        userInitials="AA"
      >
        <div>Workspace content</div>
      </CompanyWorkspaceShell>,
    );

    expect(screen.queryByLabelText("Suchen...")).toBeNull();
  });

  test("renders only backend-visible navigation items", () => {
    render(
      <CompanyWorkspaceShell
        activeItem="dashboard"
        organizationName="Smoke Company HQ"
        searchComponent={false}
        userInitials="AA"
        visibleNavigation={["dashboard", "rides"]}
      >
        <div>Workspace content</div>
      </CompanyWorkspaceShell>,
    );

    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Buchungen").length).toBeGreaterThan(0);
    expect(screen.queryByText("Organisation")).toBeNull();
    expect(screen.queryByText("Berichte")).toBeNull();
    expect(screen.queryByText("Finanzen")).toBeNull();
    expect(screen.queryByText("Einstellungen")).toBeNull();
    expect(screen.queryByText("Neue Buchung")).toBeNull();
  });
});
