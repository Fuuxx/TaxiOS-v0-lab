import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  demoCompanyBookingActionCopyDe,
  demoCompanyBookingFormCopyDe,
  demoCompanyDashboardCopyDe,
  demoCompanyDashboardCopyEn,
  demoCompanyDashboardData,
} from "../../../storybook/fixtures/company-dashboard.fixtures";
import type {
  CompanyBookingAction,
  CompanyDashboardPayload,
} from "../../../contracts/company-dashboard";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { WorkspaceStateView } from "../workspace/workspace-state-view";
import { CompanyBookingActionButton } from "./company-booking-action-button";
import { CompanyBookingForm } from "./company-booking-form";
import { CompanyWorkspaceShell } from "../company-workspace/company-workspace-shell";
import {
  CompanyDashboardScreen,
  CompanyDashboardWorkspaceContent,
} from "./company-dashboard-screen";

const meta = {
  title: "Taxios/TaxiOS/Company Dashboard (canonical)",
  component: CompanyDashboardScreen,
  decorators: [
    (Story) => (
      <StoryCanvas contentClassName="p-0" maxWidth="none" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
  args: {
    copy: demoCompanyDashboardCopyDe,
    dashboardData: demoCompanyDashboardData,
    headerDateLabel: "Samstag, 02. Mai",
  },
} satisfies Meta<typeof CompanyDashboardScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBookingForm: Story = {
  args: {
    bookingForm: (
      <CompanyBookingForm
        copy={demoCompanyBookingFormCopyDe}
        onSubmit={() => {
          return;
        }}
      />
    ),
  },
};

const cancelAction = {
  id: "cancel_booking",
  label: "Cancel",
} satisfies CompanyBookingAction;

export const WithCancelAction: Story = {
  args: {
    rideActionSlots: {
      [demoCompanyDashboardData.upcomingTrips[0].id]: (
        <CompanyBookingActionButton
          action={cancelAction}
          copy={demoCompanyBookingActionCopyDe}
          onRun={() => {
            return;
          }}
        />
      ),
    },
  },
};

export const WithCancelActionLoading: Story = {
  args: {
    rideActionSlots: {
      [demoCompanyDashboardData.upcomingTrips[0].id]: (
        <CompanyBookingActionButton
          action={cancelAction}
          copy={demoCompanyBookingActionCopyDe}
          isWorking
          onRun={() => {
            return;
          }}
        />
      ),
    },
  },
};

export const WithCancelActionError: Story = {
  args: {
    rideActionSlots: {
      [demoCompanyDashboardData.upcomingTrips[0].id]: (
        <CompanyBookingActionButton
          action={cancelAction}
          copy={demoCompanyBookingActionCopyDe}
          errorMessage="Nur angefragte Buchungen können storniert werden."
          onRun={() => {
            return;
          }}
        />
      ),
    },
  },
};

export const WithCancelActionDisabled: Story = {
  args: {
    rideActionSlots: {
      [demoCompanyDashboardData.upcomingTrips[0].id]: (
        <CompanyBookingActionButton
          action={{
            ...cancelAction,
            disabled: true,
            reason: "Diese Buchung kann nicht mehr storniert werden.",
          }}
          copy={demoCompanyBookingActionCopyDe}
          onRun={() => {
            return;
          }}
        />
      ),
    },
  },
};

const emptyActiveWithHistoryData = {
  ...demoCompanyDashboardData,
  upcomingTrips: [],
} satisfies CompanyDashboardPayload;

const activeWithEmptyHistoryData = {
  ...demoCompanyDashboardData,
  recentBookingHistory: [],
  recentBookingHistorySummary: {
    label: "No completed or cancelled bookings shown",
    visibleCount: 0,
  },
} satisfies CompanyDashboardPayload;

const emptyDashboardData = {
  ...demoCompanyDashboardData,
  fastRoutes: [],
  feedItems: [],
  recentBookingHistory: [],
  recentBookingHistorySummary: {
    label: "No completed or cancelled bookings shown",
    visibleCount: 0,
  },
  upcomingTrips: [],
} satisfies CompanyDashboardPayload;

const memberOwnBookingsOnlyData = {
  ...demoCompanyDashboardData,
  allowedActions: [
    {
      id: "view_own_bookings",
      label: "Eigene Buchungen ansehen",
    },
  ],
  availableMembers: [],
  fastRoutes: [],
  feedItems: demoCompanyDashboardData.feedItems.slice(0, 1),
  recentBookingHistory: [],
  recentBookingHistorySummary: {
    label: "Keine abgeschlossene Historie für diesen Benutzer",
    visibleCount: 0,
  },
  upcomingTrips: demoCompanyDashboardData.upcomingTrips.slice(0, 2),
} satisfies CompanyDashboardPayload;

function DashboardStateFrame({
  description,
  title,
  variant,
}: {
  description: string;
  title: string;
  variant: "error" | "loading";
}) {
  return (
    <CompanyWorkspaceShell
      activeItem="dashboard"
      organizationName="Smoke Company HQ"
      userEmail="ops@example.test"
      userInitials="OS"
      userLabel="Operations"
      userPublicId="USR-OPS"
      userRoleLabel="Dispatcher"
    >
      <div className="taxis-company-workspace-content taxios-dashboard-content-area">
        <div className="taxis-company-workspace-frame">
          <WorkspaceStateView
            description={description}
            title={title}
            variant={variant}
          />
        </div>
      </div>
    </CompanyWorkspaceShell>
  );
}

export const German: Story = {
  name: "Deutsch",
  args: {
    copy: demoCompanyDashboardCopyDe,
    headerDateLabel: "Samstag, 02. Mai",
  },
};

export const English: Story = {
  name: "English",
  args: {
    copy: demoCompanyDashboardCopyEn,
    headerDateLabel: "Saturday, May 02",
  },
};

export const EmptyActiveWithHistory: Story = {
  args: {
    copy: demoCompanyDashboardCopyEn,
    dashboardData: emptyActiveWithHistoryData,
    headerDateLabel: "Saturday, May 02",
  },
};

export const ActiveWithEmptyHistory: Story = {
  args: {
    copy: demoCompanyDashboardCopyEn,
    dashboardData: activeWithEmptyHistoryData,
    headerDateLabel: "Saturday, May 02",
  },
};

export const DashboardEmpty: Story = {
  name: "Dashboard empty",
  args: {
    copy: demoCompanyDashboardCopyEn,
    dashboardData: emptyDashboardData,
    headerDateLabel: "Saturday, May 02",
  },
};

export const DashboardLoading: Story = {
  name: "Dashboard loading",
  render: () => (
    <DashboardStateFrame
      description="The route supplied this pending UI state."
      title="Dashboard is loading"
      variant="loading"
    />
  ),
};

export const DashboardError: Story = {
  name: "Dashboard error",
  render: () => (
    <DashboardStateFrame
      description="The route supplied this unavailable UI state."
      title="Dashboard unavailable"
      variant="error"
    />
  ),
};

export const NarrowViewport: Story = {
  args: {
    copy: demoCompanyDashboardCopyDe,
    headerDateLabel: "Samstag, 02. Mai",
  },
  decorators: [
    (Story) => (
      <StoryCanvas contentClassName="p-0" maxWidth="390px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
};

export const MemberOwnBookingsOnly: Story = {
  name: "Member: own bookings only",
  args: {
    copy: demoCompanyDashboardCopyDe,
    dashboardData: memberOwnBookingsOnlyData,
    headerDateLabel: "Samstag, 02. Mai",
  },
  render: (args) => (
    <CompanyWorkspaceShell
      activeItem="dashboard"
      organizationName="Smoke Company HQ"
      searchComponent={false}
      userEmail="member@example.test"
      userInitials="ME"
      userLabel="Member Example"
      userPublicId="USR-MEMBER"
      userRoleLabel="Mitglied"
      visibleNavigation={["dashboard", "rides"]}
    >
      <CompanyDashboardWorkspaceContent
        copy={args.copy}
        dashboardData={args.dashboardData}
        headerDateLabel={args.headerDateLabel}
      />
    </CompanyWorkspaceShell>
  ),
};
