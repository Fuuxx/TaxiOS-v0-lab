import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import {
  demoCompanyOrganizationCopy,
  demoCompanyOrganizationPayload,
} from "../../../storybook/fixtures/company-organization.fixtures";
import {
  CompanyOrganizationWorkspaceContent,
  type CompanyOrganizationWorkspaceContentProps,
} from "./company-organization-screen";

describe("CompanyOrganizationWorkspaceContent", () => {
  test("pre-renders all section panels for instant local tab switching", () => {
    const { container } = render(
      <CompanyOrganizationWorkspaceContent
        activeSection="members"
        copy={demoCompanyOrganizationCopy}
        payload={demoCompanyOrganizationPayload}
      />,
    );

    const root = container.querySelector("[data-company-organization-root]");

    expect(root).toBeTruthy();
    expect(root?.getAttribute("data-company-organization-active-section")).toBe(
      "members",
    );
    expect(
      container.querySelector(
        '[data-company-organization-section-link="standorte"]',
      ),
    ).toBeTruthy();
    expect(
      screen.getByRole("tab", { name: "Standorte" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("tab", { selected: true }).getAttribute("data-company-organization-section-link"),
    ).toBe("members");
    expect(
      container.querySelector(
        '[data-company-organization-section-panel~="standorte"]',
      ),
    ).toBeTruthy();
    expect(screen.getByText("COM-2H6R9A")).toBeTruthy();
    expect(screen.getByText("UNT-6K3Q8P")).toBeTruthy();
    expect(screen.getByText("MEM-W4C8MJ")).toBeTruthy();
    expect(screen.getByText("IVT-5M8Q2A")).toBeTruthy();
    expect(screen.getByText("Invalidenstrasse 1, 10115 Berlin")).toBeTruthy();
    expect(screen.getByText("employee.pending@example.com")).toBeTruthy();
  });

  test("renders organization units as entity cards", () => {
    const { container } = render(
      <CompanyOrganizationWorkspaceContent
        activeSection="standorte"
        copy={demoCompanyOrganizationCopy}
        payload={demoCompanyOrganizationPayload}
      />,
    );

    const unitGrid = container.querySelector(
      '[data-company-organization-units-layout="cards"]',
    );

    expect(unitGrid).toBeTruthy();
    expect(unitGrid?.querySelector("table")).not.toBeTruthy();
    expect(screen.getByRole("article", { name: "HQ Berlin" })).toBeTruthy();
    expect(screen.getByRole("article", { name: "Airport Desk" })).toBeTruthy();
    expect(screen.getByText("BER-HQ")).toBeTruthy();
    expect(screen.getByText("ops@example.com / +49 30 123456")).toBeTruthy();

    const hqCard = screen.getByRole("article", { name: "HQ Berlin" });
    const airportCard = screen.getByRole("article", { name: "Airport Desk" });

    expect(hqCard.classList.contains("taxis-workspace-entity-card")).toBe(
      true,
    );
    expect(within(hqCard).getByText("Active members")).toBeTruthy();
    expect(within(hqCard).getByText("Open invites")).toBeTruthy();
    expect(within(hqCard).getByText("0")).toBeTruthy();
    expect(within(hqCard).getByText("1")).toBeTruthy();
    expect(within(airportCard).getAllByText("1").length).toBeGreaterThanOrEqual(
      2,
    );

    const standorteTab = screen.getByRole("tab", { name: "Standorte" });
    const standortePanel = container.querySelector(
      '[data-company-organization-section-panel~="standorte"]',
    );
    expect(standorteTab.getAttribute("aria-selected")).toBe("true");
    expect(standorteTab.getAttribute("aria-controls")).toBe(
      "taxios-org-panel-standorte",
    );
    expect(standortePanel?.getAttribute("role")).toBe("tabpanel");
    expect(standortePanel?.getAttribute("aria-labelledby")).toBe(
      "taxios-org-tab-standorte",
    );
  });

  test("opens a unit detail drawer from a unit card", () => {
    render(
      <CompanyOrganizationWorkspaceContent
        activeSection="standorte"
        copy={demoCompanyOrganizationCopy}
        payload={demoCompanyOrganizationPayload}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Standort: HQ Berlin" }),
    );

    const drawer = screen.getByRole("dialog", { name: "HQ Berlin" });

    expect(
      within(drawer).getByText("Invalidenstrasse 1, 10115 Berlin"),
    ).toBeTruthy();
    expect(within(drawer).getByText("Pending Employee")).toBeTruthy();
    expect(
      within(drawer).getByText("employee.pending@example.com"),
    ).toBeTruthy();
    expect(within(drawer).getByText("No company members")).toBeTruthy();

    fireEvent.click(within(drawer).getByRole("button", { name: "Close" }));

    expect(
      screen.queryByRole("dialog", { name: "HQ Berlin" }),
    ).not.toBeTruthy();
  });

  test("renders empty states through WorkspaceStateView", () => {
    const payload = {
      ...demoCompanyOrganizationPayload,
      members: [],
      units: [],
      invitations: [],
    } as CompanyOrganizationWorkspaceContentProps["payload"];

    render(
      <CompanyOrganizationWorkspaceContent
        activeSection="overview"
        copy={demoCompanyOrganizationCopy}
        payload={payload}
      />,
    );

    expect(
      screen.getByText(demoCompanyOrganizationCopy.membersEmptyTitle),
    ).toBeTruthy();
    expect(
      screen.getByText(demoCompanyOrganizationCopy.unitsEmptyTitle),
    ).toBeTruthy();
    expect(
      screen.getByText(demoCompanyOrganizationCopy.invitationsEmptyTitle),
    ).toBeTruthy();
  });

  test("uses danger token for invitation email delivery error", () => {
    const payload = {
      ...demoCompanyOrganizationPayload,
      invitations: [
        {
          ...demoCompanyOrganizationPayload.invitations[0],
          emailDeliveryError: "SMTP connection failed",
        },
      ],
    } as CompanyOrganizationWorkspaceContentProps["payload"];

    render(
      <CompanyOrganizationWorkspaceContent
        activeSection="invites"
        copy={demoCompanyOrganizationCopy}
        payload={payload}
      />,
    );

    const errorText = screen.getByText("SMTP connection failed");
    expect(errorText.className).toContain("var(--taxis-status-danger-text)");
  });

  test("renders only backend-visible organization sections", () => {
    const payload = {
      ...demoCompanyOrganizationPayload,
      invitations: [],
      members: [],
      units: [],
      visibleSections: ["roles"],
    } as CompanyOrganizationWorkspaceContentProps["payload"];
    const { container } = render(
      <CompanyOrganizationWorkspaceContent
        activeSection="members"
        copy={demoCompanyOrganizationCopy}
        payload={payload}
      />,
    );

    expect(
      container.querySelector(
        '[data-company-organization-section-link="roles"]',
      ),
    ).toBeTruthy();
    expect(
      container.querySelector(
        '[data-company-organization-section-link="members"]',
      ),
    ).not.toBeTruthy();
    expect(
      container.querySelector(
        '[data-company-organization-section-link="standorte"]',
      ),
    ).not.toBeTruthy();
    expect(
      container
        .querySelector("[data-company-organization-root]")
        ?.getAttribute("data-company-organization-active-section"),
    ).toBe("roles");
    expect(screen.getAllByText("Roles & permissions").length).toBeGreaterThan(
      0,
    );
    expect(screen.queryByText("Members")).not.toBeTruthy();
    expect(screen.queryByText("Standorte")).not.toBeTruthy();
  });

  test("keeps create and invite forms out of the overview surface", () => {
    render(
      <CompanyOrganizationWorkspaceContent
        activeSection="overview"
        copy={demoCompanyOrganizationCopy}
        inviteForm={<div>Invite member form</div>}
        payload={demoCompanyOrganizationPayload}
        unitForm={<div>Create Standort form</div>}
      />,
    );

    expect(screen.queryByText("Invite member form")).not.toBeTruthy();
    expect(screen.queryByText("Create Standort form")).not.toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Hinzufügen" }),
    ).not.toBeTruthy();
  });

  test("shows the unit add action after local navigation to standorte", () => {
    const { container } = render(
      <CompanyOrganizationWorkspaceContent
        activeSection="overview"
        copy={demoCompanyOrganizationCopy}
        inviteForm={<div>Invite member form</div>}
        payload={demoCompanyOrganizationPayload}
        unitForm={<div>Create Standort form</div>}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Standorte" }));

    expect(
      container
        .querySelector("[data-company-organization-root]")
        ?.getAttribute("data-company-organization-active-section"),
    ).toBe("standorte");
    fireEvent.click(screen.getByRole("button", { name: /Hinzuf/ }));

    expect(
      screen.getByRole("dialog", { name: /Standort hinzuf/ }),
    ).toBeTruthy();
    expect(screen.getByText("Create Standort form")).toBeTruthy();
    expect(screen.queryByText("Invite member form")).not.toBeTruthy();
  });

  test("shows the member add action after local navigation to members", () => {
    const { container } = render(
      <CompanyOrganizationWorkspaceContent
        activeSection="overview"
        copy={demoCompanyOrganizationCopy}
        inviteForm={<div>Invite member form</div>}
        payload={demoCompanyOrganizationPayload}
        unitForm={<div>Create Standort form</div>}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Members" }));

    expect(
      container
        .querySelector("[data-company-organization-root]")
        ?.getAttribute("data-company-organization-active-section"),
    ).toBe("members");
    fireEvent.click(screen.getByRole("button", { name: /Hinzuf/ }));

    expect(
      screen.getByRole("dialog", { name: /Mitglied hinzuf/ }),
    ).toBeTruthy();
    expect(screen.getByText("Invite member form")).toBeTruthy();
    expect(screen.queryByText("Create Standort form")).not.toBeTruthy();
  });

  test("opens the add dialog on member mode from the members section", () => {
    render(
      <CompanyOrganizationWorkspaceContent
        activeSection="members"
        copy={demoCompanyOrganizationCopy}
        inviteForm={<div>Invite member form</div>}
        payload={demoCompanyOrganizationPayload}
        unitForm={<div>Create Standort form</div>}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Hinzufügen" }));

    expect(
      screen.getByRole("dialog", { name: "Mitglied hinzufügen" }),
    ).toBeTruthy();
    expect(screen.getByText("Invite member form")).toBeTruthy();
    expect(screen.queryByText("Create Standort form")).not.toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "Standort" }));

    expect(
      screen.getByRole("dialog", { name: "Standort hinzufügen" }),
    ).toBeTruthy();
    expect(screen.getByText("Create Standort form")).toBeTruthy();
  });

  test("opens the add dialog on unit mode from the standorte section", () => {
    render(
      <CompanyOrganizationWorkspaceContent
        activeSection="standorte"
        copy={demoCompanyOrganizationCopy}
        inviteForm={<div>Invite member form</div>}
        payload={demoCompanyOrganizationPayload}
        unitForm={<div>Create Standort form</div>}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Hinzufügen" }));

    expect(
      screen.getByRole("dialog", { name: "Standort hinzufügen" }),
    ).toBeTruthy();
    expect(screen.getByText("Create Standort form")).toBeTruthy();
    expect(screen.queryByText("Invite member form")).not.toBeTruthy();
  });

  test("renders claimed invite approval actions and hides private login email in members", () => {
    const payload = {
      ...demoCompanyOrganizationPayload,
      invitations: [
        {
          allowedActions: [
            {
              id: "approve_company_member_invite",
              label: "Approve",
            },
            {
              id: "reject_company_member_invite",
              label: "Reject",
            },
          ],
          claimantName: "Wrong Recipient",
          companyOrganizationId: "company_org_berlin",
          createdAt: 1_800_000_000_000,
          emailDeliveryError: null,
          emailDeliveryProvider: "clerk",
          emailDeliveryStatus: "sent",
          emailDeliveryUpdatedAt: 1_800_000_100_000,
          expiresAt: 1_801_209_600_000,
          invitationId: "company_invitation_claimed",
          invitedEmail: "employee.pending@example.com",
          invitedName: "Pending Employee",
          publicId: "IVT-K7N4PC",
          role: "company_booker",
          status: "claimed",
          unitId: "company_unit_hq_berlin",
          unitName: "HQ Berlin",
          updatedAt: 1_800_000_000_000,
        },
      ],
      members: [
        {
          access: {
            effectivePermissions: ["workspace.view", "members.view"],
            extraPermissions: [],
            roleKey: "system_user",
            roleName: "User",
            rolePermissions: ["workspace.view", "members.view"],
            rolePublicId: "ROL-USER01",
            systemRole: true,
          },
          companyContactEmail: "company.delivery@example.test",
          displayName: "Wrong Recipient",
          imageUrl: null,
          membershipId: "membership_member",
          publicId: "MEM-W4C8MJ",
          role: "company_user",
          status: "active",
          unitId: "company_unit_airport",
          unitName: "Airport Desk",
          userId: "user_member",
        },
      ],
    } as unknown as CompanyOrganizationWorkspaceContentProps["payload"];

    render(
      <CompanyOrganizationWorkspaceContent
        activeSection="invites"
        copy={
          {
            ...demoCompanyOrganizationCopy,
            memberAccountColumn: "Company contact email",
            statusLabels: {
              ...demoCompanyOrganizationCopy.statusLabels,
              claimed: "Waiting for approval",
              rejected: "Rejected",
            },
          } as CompanyOrganizationWorkspaceContentProps["copy"]
        }
        onRenderInvitationAction={({ action }) => (
          <button type="button">{action.label}</button>
        )}
        payload={payload}
      />,
    );

    expect(screen.getAllByText("Wrong Recipient").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Approve" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reject" })).toBeTruthy();
    expect(screen.getByText("company.delivery@example.test")).toBeTruthy();
    expect(screen.queryByText("wrong.recipient@example.test")).not.toBeTruthy();
  });

  test("renders members as read-only text when no member selection handler is provided", () => {
    render(
      <CompanyOrganizationWorkspaceContent
        activeSection="members"
        copy={demoCompanyOrganizationCopy}
        payload={demoCompanyOrganizationPayload}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Accepted Member" }),
    ).not.toBeTruthy();
    expect(screen.getByText("Accepted Member")).toBeTruthy();
  });

  test("calls member selection only when member detail access is enabled", () => {
    const onSelectMember = vi.fn();

    render(
      <CompanyOrganizationWorkspaceContent
        activeSection="members"
        copy={demoCompanyOrganizationCopy}
        onSelectMember={onSelectMember}
        payload={demoCompanyOrganizationPayload}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Accepted Member" }));

    expect(onSelectMember).toHaveBeenCalledWith("membership_member");
  });

  test("hides custom role edit and archive actions without role management access", () => {
    const onArchiveCompanyRole = vi.fn();
    const onUpdateCompanyRole = vi.fn();
    const payload = {
      ...demoCompanyOrganizationPayload,
      access: {
        ...demoCompanyOrganizationPayload.access,
        allowedActions:
          demoCompanyOrganizationPayload.access.allowedActions.map((action) =>
            action.id === "manage_company_member_access" ||
            action.id === "create_company_role"
              ? { ...action, disabled: true }
              : action,
          ),
        roles: [
          ...demoCompanyOrganizationPayload.access.roles,
          {
            assignedMemberCount: 0,
            createdAt: 1_800_000_000_000,
            description: "Readonly custom role",
            name: "Dispatcher",
            permissions: ["workspace.view"],
            publicId: "ROL-DISPATCH",
            roleId: "company_role_dispatcher",
            roleKey: "custom_dispatcher",
            status: "active",
            systemRole: false,
            updatedAt: 1_800_000_000_000,
          },
        ],
      },
    } as CompanyOrganizationWorkspaceContentProps["payload"];

    render(
      <CompanyOrganizationWorkspaceContent
        activeSection="roles"
        copy={demoCompanyOrganizationCopy}
        onArchiveCompanyRole={onArchiveCompanyRole}
        onUpdateCompanyRole={onUpdateCompanyRole}
        payload={payload}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Dispatcher bearbeiten" }),
    ).not.toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Dispatcher archivieren" }),
    ).not.toBeTruthy();
  });

  test("renders roles section and member access drawer", () => {
    render(
      <CompanyOrganizationWorkspaceContent
        activeSection="roles"
        copy={demoCompanyOrganizationCopy}
        payload={demoCompanyOrganizationPayload}
        selectedMemberDetail={{
          access: demoCompanyOrganizationPayload.members[1].access,
          auditHistory: [
            {
              createdAt: 1_800_010_000_000,
              decision: "company_member_access_updated",
              publicId: "AUD-3M9P2A",
              reason: null,
            },
          ],
          companyContactEmail: "accepted.member@example.com",
          displayName: "Accepted Member",
          email: "accepted.member@example.com",
          imageUrl: null,
          memberPublicId: "MEM-W4C8MJ",
          membershipCreatedAt: 1_800_000_000_000,
          membershipId: "membership_member",
          membershipUpdatedAt: 1_800_010_000_000,
          status: "active",
          unitName: "Airport Desk",
          userPublicId: "USR-8J2KQ4",
        }}
        selectedMemberId="membership_member"
      />,
    );

    expect(screen.getAllByText("Roles & permissions").length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
    expect(screen.getAllByText("View finance").length).toBeGreaterThan(0);
    expect(screen.getByText("Effective permissions")).toBeTruthy();
    expect(screen.getByText("company_member_access_updated")).toBeTruthy();
  });
});
