import type { ComponentProps, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "./company-dashboard.css";
import {
  demoCompanyDashboardCopyDe,
  demoFastbookingMembers,
  demoFastbookingMembersExpanded,
  demoFastbookingRoute,
} from "../../../storybook/fixtures/company-dashboard.fixtures";
import { StoryCanvas } from "../../../storybook/story-canvas";
import { FastBookingCard } from "./company-dashboard-fastbooking-card";
import { FastBookingGrid } from "./company-dashboard-fastbooking-client";

const FASTBOOKING_HOVER_VISUAL_SHIM_CSS = `
  .taxios-fastbooking-story-hover-shim-card h4[class*="truncate"] {
    color: var(--taxis-workspace-accent) !important;
  }

  .taxios-fastbooking-story-hover-shim-card div.fastbooking-route-copy.fastbooking-route-line > div.relative:first-child > p.font-semibold {
    color: var(--taxis-workspace-text-primary) !important;
  }
`;

const LARGE_CARD_SHELL =
  "mx-auto w-full max-w-[440px] scale-[1.12] origin-top [&_[data-testid=fastbooking-card]]:shadow-2xl";

const longRouteSet = [
  {
    avatars: ["PL", "BS", "MK", "TL", "VB", "EW"],
    from: "Alexanderplatz 7, Berlin-Mitte, Eingang Nord am Brunnen",
    memberIds: ["PL", "BS", "MK", "TL", "VB", "EW"],
    title: "Board shuttle to Brandenburg Airport operations terminal",
    to: "Flughafen BER Terminal 1-2, Ebene E1, Gate A security desk",
  },
  {
    avatars: ["FK", "GS", "HW", "IZ"],
    from: "Friedrichstrasse 110, Berlin",
    memberIds: ["FK", "GS", "HW", "IZ"],
    title: "Messe executive route",
    to: "Messedamm 22, Berlin",
  },
] satisfies ComponentProps<typeof FastBookingGrid>["fastRoutes"];

const meta = {
  title: "Taxios/TaxiOS/Company Dashboard/Fastbooking Card",
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1320px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function HoverShimDecorator({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{FASTBOOKING_HOVER_VISUAL_SHIM_CSS}</style>
      <div className="taxios-fastbooking-story-hover-shim-card">{children}</div>
    </>
  );
}

function DemoFastBookingCard({
  avatars = demoFastbookingRoute.avatars,
  availableMembers = demoFastbookingMembers,
  from = demoFastbookingRoute.from,
  title = demoFastbookingRoute.title,
  to = demoFastbookingRoute.to,
  ...props
}: Partial<ComponentProps<typeof FastBookingCard>>) {
  return (
    <FastBookingCard
      availableMembers={[...availableMembers]}
      avatars={[...avatars]}
      copy={demoCompanyDashboardCopyDe.fastbooking}
      from={from}
      title={title}
      to={to}
      {...props}
    />
  );
}

export const FastbookingDefault: Story = {
  name: "Default",
  render: () => (
    <div className={LARGE_CARD_SHELL}>
      <DemoFastBookingCard />
    </div>
  ),
};

export const FastbookingGridDefault: Story = {
  name: "Grid default",
  render: () => (
    <div className="mx-auto w-full max-w-[480px]">
      <FastBookingGrid
        availableMembers={demoFastbookingMembers}
        copy={demoCompanyDashboardCopyDe.fastbooking}
        fastRoutes={[demoFastbookingRoute]}
      />
    </div>
  ),
};

export const FastbookingGridManyLongRoute: Story = {
  name: "Grid many / long route",
  render: () => (
    <div className="mx-auto w-full max-w-[520px]">
      <FastBookingGrid
        availableMembers={demoFastbookingMembersExpanded}
        copy={demoCompanyDashboardCopyDe.fastbooking}
        fastRoutes={longRouteSet}
      />
    </div>
  ),
};

export const FastbookingGridEmptyState: Story = {
  name: "Grid empty",
  render: () => (
    <div className="mx-auto w-full max-w-[520px]">
      <FastBookingGrid
        availableMembers={demoFastbookingMembers}
        copy={demoCompanyDashboardCopyDe.fastbooking}
        fastRoutes={[]}
      />
    </div>
  ),
};

export const FastbookingNarrowWidth: Story = {
  name: "Narrow width sanity",
  render: () => (
    <div className="mx-auto w-full max-w-[390px]">
      <FastBookingGrid
        availableMembers={demoFastbookingMembersExpanded}
        copy={demoCompanyDashboardCopyDe.fastbooking}
        fastRoutes={[longRouteSet[0]]}
      />
    </div>
  ),
};

export const FastbookingHoverVisualState: Story = {
  name: "Hover visual state",
  render: () => (
    <HoverShimDecorator>
      <div className={LARGE_CARD_SHELL}>
        <DemoFastBookingCard />
      </div>
    </HoverShimDecorator>
  ),
};

export const FastbookingActiveOpen: Story = {
  name: "Active/open",
  render: () => (
    <div className={LARGE_CARD_SHELL}>
      <DemoFastBookingCard
        availableMembers={demoFastbookingMembersExpanded}
        initialIsSelecting
      />
    </div>
  ),
};

export const FastbookingPassengerPickerOpen: Story = {
  name: "Passenger picker open",
  render: () => (
    <div className={LARGE_CARD_SHELL}>
      <DemoFastBookingCard
        availableMembers={demoFastbookingMembersExpanded}
        avatars={["PL"]}
        from="Alexanderplatz, Berlin-Mitte"
        initialIsSelecting
        title="Congress Center Hamburg"
        to="Flughafen HAM Terminal 2"
      />
    </div>
  ),
};

export const FastbookingInteractionSelectPassenger: Story = {
  name: "Interaction - select passenger",
  render: () => (
    <div className={LARGE_CARD_SHELL}>
      <DemoFastBookingCard
        availableMembers={demoFastbookingMembersExpanded}
        avatars={[]}
        memberIds={["PL", "BS"]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const waitForFrame = () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    const pickerToggle = canvasElement.querySelector<HTMLButtonElement>(
      "[data-testid='fastbooking-member-selector-toggle']",
    );

    if (!pickerToggle) {
      throw new Error("FastBooking picker toggle was not rendered.");
    }

    pickerToggle.click();
    await waitForFrame();

    const passengerButton = Array.from(
      canvasElement.querySelectorAll<HTMLButtonElement>("button"),
    ).find((button) => button.textContent?.includes("Patrick Lehmann"));

    if (!passengerButton) {
      throw new Error("FastBooking passenger option was not rendered.");
    }

    passengerButton.click();
    await waitForFrame();

    const bookingAction = Array.from(
      canvasElement.querySelectorAll<HTMLButtonElement>("button"),
    ).find((button) => button.textContent?.includes("(1)"));

    if (!bookingAction) {
      throw new Error("FastBooking selected passenger count was not rendered.");
    }
  },
};

export const FastbookingSelectedPassengers: Story = {
  name: "Selected passengers",
  render: () => (
    <div className={LARGE_CARD_SHELL}>
      <DemoFastBookingCard
        availableMembers={demoFastbookingMembersExpanded}
        initialIsSelecting
        initialSelectedMemberIds={["MK", "EW", "TL"]}
      />
    </div>
  ),
};

export const FastbookingEmptyPassengerState: Story = {
  name: "Empty passenger state",
  render: () => (
    <div className={`${LARGE_CARD_SHELL} grid gap-20`}>
      <div>
        <p className="mb-6 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.26em]">
          Route ohne zugewiesene Initialen - Fussbereich leer ausser
          Zusammenfassungs-Badge.
        </p>
        <DemoFastBookingCard
          avatars={[]}
          from="Potsdamer Platz, Berlin"
          title="Olympiastadion Berlin"
          to="Olympischer Platz 3"
        />
      </div>
      <div>
        <p className="mb-6 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.26em]">
          Picker-Suche ohne Treffer - Mitgliedsliste leer angezeigt.
        </p>
        <DemoFastBookingCard
          availableMembers={demoFastbookingMembersExpanded}
          avatars={["VB"]}
          from="Alexanderplatz, Berlin-Mitte"
          initialIsSelecting
          initialMemberQuery="__taxios_storybook_no_matches__"
          title="Congress Center Hamburg"
          to="Lubecker Hauptbahnhof"
        />
      </div>
    </div>
  ),
};

export const FastbookingDisabled: Story = {
  name: "Disabled",
  render: () => (
    <div
      className={`${LARGE_CARD_SHELL} pointer-events-none saturate-75 opacity-[0.48]`}
    >
      <DemoFastBookingCard />
      <p className="pointer-events-none mt-16 text-center font-semibold text-[12px] text-[var(--taxis-workspace-text-muted)]">
        Subdued chrome surrogate; Produkt kennt keine disabled Prop.
      </p>
    </div>
  ),
};

export const FastbookingLoading: Story = {
  name: "Loading",
  render: () => (
    <div className={`${LARGE_CARD_SHELL} relative`}>
      <DemoFastBookingCard />
      <div className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center rounded-[36px]">
        <div className="flex min-w-[220px] translate-y-[6%] flex-col items-center rounded-[26px] border border-[var(--taxis-workspace-surface-sheen)] bg-[var(--taxis-workspace-glass)] px-6 py-5 text-center shadow-[var(--taxis-workspace-shadow-overlay)] ring-1 ring-[var(--taxis-workspace-border)] backdrop-blur-md">
          <span className="mb-4 flex h-9 w-9 animate-pulse rounded-full bg-[var(--taxis-workspace-accent)]" />
          <span className="font-bold text-[13px] text-[var(--taxis-workspace-text-primary)] tracking-tight">
            Routenkatalog laedt ...
          </span>
          <span className="mt-2 max-w-[200px] font-medium text-[11px] leading-snug text-[var(--taxis-workspace-text-muted)]">
            Blocking veil nur im Story; echte Datenlogik liegt später in
            Convex.
          </span>
        </div>
      </div>
    </div>
  ),
};
