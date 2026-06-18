import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpRight, Calendar, Clock, Wallet } from "lucide-react";

import "./company-dashboard.css";
import { StoryCanvas } from "../../../storybook/story-canvas";
import {
  TaxiosDashboardMetricTile,
  TaxiosDashboardSectionHeader,
  TaxiosPorcelainInnerCard,
  TaxiosPorcelainSurface,
} from "./taxios-dashboard-primitives";

const meta = {
  title: "Taxios/TaxiOS/Company Dashboard/Primitives",
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="1200px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const TaxiosPorcelainSurfaceStory: Story = {
  name: "TaxiosPorcelainSurface",
  render: () => (
    <TaxiosPorcelainSurface className="max-w-md rounded-[32px] p-8 shadow-2xl shadow-black/5">
      <p className="font-bold text-[14px] text-[var(--taxis-workspace-text-secondary)]">
        Porcelain surface
      </p>
      <p className="mt-2 font-medium text-[13px] text-[var(--taxis-workspace-text-muted)]">
        Used for sidebar shells, feeds, and icon buttons with production
        dashboard material tokens.
      </p>
    </TaxiosPorcelainSurface>
  ),
};

export const TaxiosPorcelainInnerCardStory: Story = {
  name: "TaxiosPorcelainInnerCard",
  render: () => (
    <TaxiosPorcelainInnerCard className="max-w-md rounded-[28px] border border-[var(--taxis-workspace-surface-sheen)] p-6 shadow-[var(--taxis-workspace-shadow-overlay)]">
      <p className="font-black text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.16em]">
        Inner card
      </p>
      <p className="mt-3 font-semibold text-[13px] text-[var(--taxis-workspace-text-secondary)] leading-relaxed">
        Matches KPI tile porcelain; outer layout classes stay on the host.
      </p>
    </TaxiosPorcelainInnerCard>
  ),
};

export const TaxiosDashboardSectionHeaderStory: Story = {
  name: "TaxiosDashboardSectionHeader",
  render: () => (
    <TaxiosPorcelainSurface className="max-w-lg rounded-[40px] p-7 shadow-xl shadow-black/[0.02]">
      <TaxiosDashboardSectionHeader
        action={
          <button
            className="rounded-full px-2.5 py-1 font-black text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.16em] transition-colors hover:bg-[var(--taxis-workspace-surface-deep)] hover:text-[var(--taxis-workspace-text-primary)]"
            type="button"
          >
            Alles ansehen
          </button>
        }
        badge={
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 font-black text-[9px] text-emerald-600 uppercase tracking-[0.18em]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 taxios-dashboard-animate-ping-slow rounded-full bg-emerald-400 opacity-60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Live
          </span>
        }
        className="mb-4"
        title="Live Feed"
      />
      <p className="border-[var(--taxis-workspace-divider)] border-t pt-4 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
        Badge and action slots match the canonical dashboard section header
        layout.
      </p>
    </TaxiosPorcelainSurface>
  ),
};

export const TaxiosDashboardMetricTileStory: Story = {
  name: "TaxiosDashboardMetricTile",
  render: () => (
    <div className="grid w-full max-w-4xl grid-cols-2 gap-6">
      <TaxiosDashboardMetricTile
        delta="+12 %"
        icon={<Calendar className="text-zinc-700" size={20} />}
        label="Gebucht"
        sub="Fahrten gesamt"
        trend="up"
        value="218"
      />
      <TaxiosDashboardMetricTile
        delta="+4,2 %"
        icon={<Wallet className="text-zinc-700" size={20} />}
        label="Ausgaben"
        sub="Laufender Monat"
        trend="up"
        value="7.142 EUR"
      />
      <TaxiosDashboardMetricTile
        delta="im Plan"
        icon={<Clock className="text-zinc-700" size={20} />}
        label="Heute"
        sub="Geplante Touren"
        trend="flat"
        value="4"
      />
      <TaxiosDashboardMetricTile
        delta="kein Limit"
        icon={<ArrowUpRight className="text-zinc-700" size={20} />}
        label="Budget"
        sub="Aktueller Monat"
        trend="flat"
        value="Open"
      />
    </div>
  ),
};
