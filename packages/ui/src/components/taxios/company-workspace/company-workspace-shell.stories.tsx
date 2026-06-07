import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef } from "react";

import { StoryCanvas } from "../../../storybook/story-canvas";
import { CompanyWorkspaceSurface } from "./company-workspace-primitives";
import { CompanyWorkspaceShell } from "./company-workspace-shell";

const meta = {
  title: "Taxios/TaxiOS/Company Workspace/Shell",
  component: CompanyWorkspaceShell,
  decorators: [
    (Story) => (
      <StoryCanvas contentClassName="p-0" maxWidth="none" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CompanyWorkspaceShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DashboardActive: Story = {
  args: {
    activeItem: "dashboard",
    children: (
      <div className="taxis-workspace-scrollbar flex-1 overflow-y-auto p-8">
        <CompanyWorkspaceSurface className="p-6">
          <h2 className="font-semibold text-xl tracking-tight">
            Company organization body
          </h2>
          <p className="mt-2 text-[13px] text-[var(--taxis-workspace-text-muted)]">
            Company workspace shell wraps organization content without changing
            the authored dashboard screen.
          </p>
        </CompanyWorkspaceSurface>
      </div>
    ),
    onNewBookingClick: () => undefined,
    organizationName: "Smoke Company HQ",
    sessionAction: <button type="button">Abmelden</button>,
    userEmail: "ayoub@example.test",
    userFirstName: "Ayoub",
    userInitials: "AA",
    userLabel: "Ayoub Amid",
    userLastName: "Amid",
    userPublicId: "USR-7K4Q2M",
    userRoleLabel: "Company Admin",
  },
};

export const OrganizationActive: Story = {
  args: {
    activeItem: "organization",
    children: (
      <div className="taxis-workspace-scrollbar flex-1 overflow-y-auto p-8">
        <CompanyWorkspaceSurface className="p-6">
          <h2 className="font-semibold text-xl tracking-tight">
            Company organization body
          </h2>
          <p className="mt-2 text-[13px] text-[var(--taxis-workspace-text-muted)]">
            Organization routes keep the dashboard corridor and mark the
            organization sidebar item active.
          </p>
        </CompanyWorkspaceSurface>
      </div>
    ),
    organizationName: "Smoke Company HQ",
  },
};

export const MemberOnlyNoSearch: Story = {
  args: {
    activeItem: "dashboard",
    children: (
      <div className="taxis-workspace-scrollbar flex-1 overflow-y-auto p-8">
        <CompanyWorkspaceSurface className="p-6">
          <h2 className="font-semibold text-xl tracking-tight">
            Member-only workspace
          </h2>
          <p className="mt-2 text-[13px] text-[var(--taxis-workspace-text-muted)]">
            A regular member sees only Dashboard and Buchungen. Search,
            organization, reports, finance, settings, and new booking stay
            hidden unless the backend payload exposes them.
          </p>
        </CompanyWorkspaceSurface>
      </div>
    ),
    organizationName: "Smoke Company HQ",
    searchComponent: false,
    sessionAction: <button type="button">Abmelden</button>,
    userEmail: "member@example.test",
    userInitials: "ME",
    userLabel: "Member Example",
    userPublicId: "USR-MEMBER",
    userRoleLabel: "Mitglied",
    visibleNavigation: ["dashboard", "rides"],
  },
};

export const AccountMenuOpen: Story = {
  args: {
    activeItem: "dashboard",
    children: <div>Workspace content</div>,
    organizationName: "Smoke Company HQ",
  },
  render: () => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const didOpen = useRef(false);

    useEffect(() => {
      if (didOpen.current) {
        return;
      }
      didOpen.current = true;
      queueMicrotask(() => {
        const trigger = rootRef.current?.querySelector(
          "[id='company-workspace-user-trigger']",
        );
        if (trigger instanceof HTMLElement) {
          trigger.click();
        }
      });
    }, []);

    return (
      <div ref={rootRef}>
        <CompanyWorkspaceShell
          activeItem="dashboard"
          onNewBookingClick={() => undefined}
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
          <div className="taxis-workspace-scrollbar flex-1 overflow-y-auto p-8">
            <CompanyWorkspaceSurface className="p-6">
              <h2 className="font-semibold text-xl tracking-tight">
                Dashboard
              </h2>
            </CompanyWorkspaceSurface>
          </div>
        </CompanyWorkspaceShell>
      </div>
    );
  },
};

export const NarrowWidth: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    activeItem: "dashboard",
    children: (
      <div className="taxis-workspace-scrollbar flex-1 overflow-y-auto p-4">
        <CompanyWorkspaceSurface className="p-4">
          <h2 className="font-semibold text-lg tracking-tight">Dashboard</h2>
          <p className="mt-2 text-[13px] text-[var(--taxis-workspace-text-muted)]">
            Narrow viewport sanity check for shell controls.
          </p>
        </CompanyWorkspaceSurface>
      </div>
    ),
    onNewBookingClick: () => undefined,
    organizationName: "Smoke Company HQ",
    sessionAction: <button type="button">Abmelden</button>,
    userEmail: "ayoub@example.test",
    userFirstName: "Ayoub",
    userInitials: "AA",
    userLabel: "Ayoub Amid",
    userLastName: "Amid",
    userPublicId: "USR-7K4Q2M",
    userRoleLabel: "Company Admin",
  },
};
