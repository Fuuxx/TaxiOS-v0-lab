import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  WorkspaceSectionHeader,
  WorkspaceSurface,
} from "../workspace/workspace-primitives";
import { ProviderWorkspaceShell } from "./provider-workspace-shell";

const meta = {
  title: "Taxios/TaxiOS/Provider Workspace/Shell",
  component: ProviderWorkspaceShell,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProviderWorkspaceShell>;

export default meta;

type Story = StoryObj<typeof meta>;

function DemoContent({ title }: { title: string }) {
  return (
    <div className="taxis-workspace-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden">
      <div className="taxis-workspace-content-area mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-6 pb-16 pt-10 xl:px-12">
        <WorkspaceSurface className="rounded-[30px] p-6">
          <WorkspaceSectionHeader
            subtitle="City Funk Berlin is ready for dispatch intake and fleet coordination."
            title={title}
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-4">
              <p className="font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.16em]">
                Intake
              </p>
              <p className="mt-2 font-semibold text-[18px] text-[var(--taxis-workspace-text-strong)]">
                4 open requests
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-4">
              <p className="font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.16em]">
                Fleet
              </p>
              <p className="mt-2 font-semibold text-[18px] text-[var(--taxis-workspace-text-strong)]">
                12 active vehicles
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-4">
              <p className="font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.16em]">
                Driver Pool
              </p>
              <p className="mt-2 font-semibold text-[18px] text-[var(--taxis-workspace-text-strong)]">
                7 assigned jobs
              </p>
            </div>
          </div>
        </WorkspaceSurface>
      </div>
    </div>
  );
}

function DemoSessionAction() {
  return (
    <button
      className="inline-flex h-8 w-full items-center justify-start rounded-lg border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-3 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)]"
      type="button"
    >
      Sign out
    </button>
  );
}

export const OrderPoolActive: Story = {
  args: {
    activeItem: "order_pool",
    children: <DemoContent title="Order Pool active" />,
    orderPoolBadgeCount: 4,
    organizationName: "City Funk Berlin",
    sessionAction: <DemoSessionAction />,
  },
};

export const VehiclesActive: Story = {
  args: {
    activeItem: "vehicles",
    children: <DemoContent title="Vehicles active" />,
    organizationName: "City Funk Berlin",
    sessionAction: <DemoSessionAction />,
  },
};
