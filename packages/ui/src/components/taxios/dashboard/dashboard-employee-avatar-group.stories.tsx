import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserPlus } from "lucide-react";

import "./company-dashboard.css";
import {
  demoCompanyDashboardCopyDe,
  demoDashboardTrips,
} from "../../../storybook/fixtures/company-dashboard.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { CompanyDashboardAvatar } from "./dashboard-avatar";
import {
  TaxiosDashboardRidesTable,
  TaxiosDashboardRidesTableRow,
  type DashboardTrip,
} from "./taxios-dashboard-rides-table";

const DEMO_INITIALS_ROW = ["PL", "MK", "VB"] as const;
const DEMO_OVERFLOW_PASSENGERS = ["PL", "MK", "EW", "VB", "TL", "FK"] as const;

const meta = {
  title: "Taxios/TaxiOS/Company Dashboard/Avatar Stack (EmployeeAvatarGroup)",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "AvatarStack alias: stacked CompanyDashboardAvatar primitives with production dashboard spacing.",
      },
    },
  },
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1200px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function StackLegend({ children }: { children: ReactNode }) {
  return (
    <p className="mb-8 max-w-2xl font-medium text-[13px] leading-relaxed text-[var(--taxis-workspace-text-muted)]">
      {children}
    </p>
  );
}

function StackShelf({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-20 last:mb-0">
      <h2 className="mb-3 font-black text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.22em]">
        {caption}
      </h2>
      <div className="inline-flex rounded-[24px] border border-[var(--taxis-workspace-surface-sheen)] bg-[var(--taxis-workspace-glass)] p-16 shadow-[var(--taxis-workspace-shadow-overlay)] ring-1 ring-[var(--taxis-workspace-border)]">
        {children}
      </div>
    </section>
  );
}

const AVATAR_REVIEW_CLASS =
  "h-12 w-12 text-[13px] ring-[3px] ring-white shadow-sm";

export const AvatarStackDefault: Story = {
  name: "Default",
  render: () => (
    <>
      <StackLegend>
        Canonical stack spacing: overlapping circles with shared white halo ring
        matching production TaxiOS dashboards.
      </StackLegend>
      <StackShelf caption="Baseline stack">
        <div className="-space-x-2 flex">
          {DEMO_INITIALS_ROW.map((initials) => (
            <CompanyDashboardAvatar
              className={AVATAR_REVIEW_CLASS}
              initials={initials}
              key={initials}
            />
          ))}
        </div>
      </StackShelf>
    </>
  ),
};

export const AvatarStackHoverTargetDemo: Story = {
  name: "Hover - target demonstration",
  render: () => (
    <>
      <StackLegend>
        Production avatars animate scale and layering under pointer hover. This
        story freezes that emphasis for visual review.
      </StackLegend>
      <StackShelf caption="Elevated hover target - MK center">
        <div className="-space-x-2 flex items-center">
          <CompanyDashboardAvatar
            className={`${AVATAR_REVIEW_CLASS} opacity-90`}
            initials="PL"
          />
          <CompanyDashboardAvatar
            className={`${AVATAR_REVIEW_CLASS} z-30 translate-y-[-2px] shadow-lg ring-[var(--taxis-workspace-accent-ring)]`}
            initials="MK"
          />
          <CompanyDashboardAvatar
            className={`${AVATAR_REVIEW_CLASS} opacity-90`}
            initials="VB"
          />
        </div>
      </StackShelf>
    </>
  ),
};

export const AvatarStackSelected: Story = {
  name: "Selected - focus ring",
  render: () => (
    <>
      <StackLegend>
        Operational selection state mocked with the TaxiOS dashboard focus ring.
      </StackLegend>
      <StackShelf caption="Tanja TL selected emphasis">
        <div className="-space-x-2 flex">
          <CompanyDashboardAvatar className={AVATAR_REVIEW_CLASS} initials="MK" />
          <div className="-m-2 inline-flex shrink-0 rounded-full p-[5px] ring-2 ring-[var(--taxis-workspace-accent-ring)] ring-offset-[4px] ring-offset-[var(--taxis-workspace-page-bg)]">
            <CompanyDashboardAvatar
              className={`${AVATAR_REVIEW_CLASS} ring-transparent`}
              initials="TL"
            />
          </div>
          <CompanyDashboardAvatar className={AVATAR_REVIEW_CLASS} initials="PL" />
        </div>
      </StackShelf>
    </>
  ),
};

export const AvatarStackDisabledOffline: Story = {
  name: "Disabled - offline",
  render: () => (
    <>
      <StackLegend>
        Muted saturation and lower opacity for offline drivers or dormant
        corporate seats.
      </StackLegend>
      <StackShelf caption="Muted stack">
        <div className="pointer-events-none -space-x-2 flex saturate-50 opacity-[0.42]">
          {(["VB", "PL", "MK"] as const).map((initials) => (
            <CompanyDashboardAvatar
              className={AVATAR_REVIEW_CLASS}
              initials={initials}
              key={initials}
            />
          ))}
        </div>
      </StackShelf>
    </>
  ),
};

export const AvatarStackPresenceDots: Story = {
  name: "Presence dots",
  render: () => (
    <>
      <StackLegend>
        Avatar remains identity; the small bottom-right dot carries status.
        This mirrors the same neutral/info/success/attention language used by
        chips, feed markers, and table medallions.
      </StackLegend>
      <StackShelf caption="Identity plus status marker">
        <div className="flex items-center gap-5">
          {(
            [
              ["PL", "success", "Status: active"],
              ["MK", "attention", "Status: delayed"],
              ["VB", "info", "Status: assigned"],
              ["TL", "neutral", "Status: offline"],
            ] as const
          ).map(([initials, tone, label]) => (
            <CompanyDashboardAvatar
              className={AVATAR_REVIEW_CLASS}
              initials={initials}
              key={initials}
              presenceLabel={label}
              presenceTone={tone}
            />
          ))}
        </div>
      </StackShelf>
    </>
  ),
};

export const AvatarStackOverflow: Story = {
  name: "Overflow - +N",
  render: () => (
    <>
      <StackLegend>
        Mirrors TaxiosDashboardRidesTableRow passenger cell: first three
        initials plus compact overflow chip.
      </StackLegend>
      <StackShelf caption="+3 zusätzliche Fahrgäste">
        <div className="-space-x-2 flex">
          {[...DEMO_OVERFLOW_PASSENGERS].slice(0, 3).map((initials) => (
            <CompanyDashboardAvatar
              className={AVATAR_REVIEW_CLASS}
              initials={initials}
              key={initials}
            />
          ))}
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--taxis-workspace-surface-deep)] font-semibold text-[13px] text-[var(--taxis-workspace-text-muted)] ring-[3px] ring-white">
            +{DEMO_OVERFLOW_PASSENGERS.length - 3}
          </span>
        </div>
      </StackShelf>
    </>
  ),
};

const TABLE_DEMO_TRIP: DashboardTrip = {
  ...demoDashboardTrips[1],
  passengers: [...DEMO_OVERFLOW_PASSENGERS],
};

export const AvatarStackTableContext: Story = {
  name: "Table - rides row context",
  render: () => (
    <>
      <StackLegend>
        Full taxonomy from TaxiosDashboardRidesTable; passenger column inherits
        production spacing.
      </StackLegend>
      <div className="max-w-5xl origin-top-left scale-110 rounded-[32px] border border-[var(--taxis-workspace-surface-sheen)] bg-[var(--taxis-workspace-glass)] p-10 shadow-[var(--taxis-workspace-shadow-overlay)] ring-1 ring-[var(--taxis-workspace-border)]">
        <TaxiosDashboardRidesTable copy={demoCompanyDashboardCopyDe.rides}>
          <TaxiosDashboardRidesTableRow
            copy={demoCompanyDashboardCopyDe.rides}
            onSelect={() => undefined}
            trip={TABLE_DEMO_TRIP}
          />
        </TaxiosDashboardRidesTable>
      </div>
    </>
  ),
};

export const AvatarStackFastbookingContext: Story = {
  name: "Fastbooking - footer ribbon",
  render: () => (
    <>
      <StackLegend>
        Matches FastBookingCard footer strip: initials plus add-seat
        affordance.
      </StackLegend>
      <StackShelf caption="Schnellbuchung Fussbereich - h-8 tokens">
        <div className="flex min-w-[360px] origin-top-left scale-[1.35] items-center gap-2 rounded-b-[20px] border-[var(--taxis-workspace-border)] border-t bg-[var(--taxis-workspace-glass)] px-3.5 py-3 shadow-inner shadow-white">
          <div className="-space-x-2 flex">
            {(["PL", "BS", "MK"] as const).map((avatar) => (
              <CompanyDashboardAvatar
                className="h-8 w-8 ring-2 ring-white"
                initials={avatar}
                key={avatar}
              />
            ))}
          </div>
          <button
            aria-label="Zusätzlichen Mitarbeiter auswählen"
            className="group/quick flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-deep)] text-[var(--taxis-workspace-text-muted)] transition-colors duration-200 hover:border-[var(--taxis-workspace-accent-ring)] hover:bg-[var(--taxis-workspace-accent)] hover:text-white active:scale-95"
            type="button"
          >
            <UserPlus
              className="transition-colors group-hover/quick:text-white"
              size={13}
            />
          </button>
        </div>
      </StackShelf>
    </>
  ),
};
