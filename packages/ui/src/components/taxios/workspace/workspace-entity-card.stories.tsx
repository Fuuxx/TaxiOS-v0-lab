import type { Meta, StoryObj } from "@storybook/react-vite";
import { Building2, CarFront } from "lucide-react";

import { StoryCanvas } from "../../../storybook/story-canvas";
import "./workspace.css";
import {
  WorkspaceEntityCard,
  WorkspaceEntityCardAction,
  WorkspaceEntityCardDetails,
  WorkspaceEntityCardIcon,
  WorkspaceEntityCardLabel,
  WorkspaceEntityCardMetric,
  WorkspaceEntityCardMetrics,
  WorkspaceEntityGrid,
} from "./workspace-entity-card";

const meta = {
  title: "Taxios/TaxiOS/Workspace/Entity Card",
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="920px" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const EntityCards: Story = {
  name: "Entity cards",
  render: () => (
    <WorkspaceEntityGrid>
      <WorkspaceEntityCard aria-labelledby="entity-card-hq-title">
        <WorkspaceEntityCardAction
          aria-haspopup="dialog"
          aria-label="Standort: HQ Berlin"
        />
        <div className="flex min-w-0 items-start gap-3">
          <WorkspaceEntityCardIcon aria-hidden="true">
            <Building2 size={18} strokeWidth={1.9} />
          </WorkspaceEntityCardIcon>
          <div className="min-w-0 flex-1">
            <h3
              className="truncate font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)] tracking-tight"
              id="entity-card-hq-title"
            >
              HQ Berlin
            </h3>
            <span className="mt-1 block text-[12px] text-[var(--taxis-workspace-text-muted)] leading-snug">
              BER-HQ
            </span>
          </div>
        </div>

        <WorkspaceEntityCardMetrics>
          <WorkspaceEntityCardMetric label="Mitglieder" value="12" />
          <WorkspaceEntityCardMetric label="Einladungen" value="2" />
        </WorkspaceEntityCardMetrics>

        <WorkspaceEntityCardDetails>
          <div className="min-w-0">
            <WorkspaceEntityCardLabel>Adresse</WorkspaceEntityCardLabel>
            <p className="mt-1 text-[13px] text-[var(--taxis-workspace-text-secondary)] leading-snug">
              Invalidenstrasse 1, 10115 Berlin
            </p>
          </div>
          <div className="min-w-0">
            <WorkspaceEntityCardLabel>Kontakt</WorkspaceEntityCardLabel>
            <p className="mt-1 font-medium text-[13px] text-[var(--taxis-workspace-text-secondary)] leading-snug">
              Smoke Ops
            </p>
            <p className="mt-1 text-[12px] text-[var(--taxis-workspace-text-muted)] leading-snug">
              ops@example.com / +49 30 123456
            </p>
          </div>
        </WorkspaceEntityCardDetails>
      </WorkspaceEntityCard>

      <WorkspaceEntityCard aria-labelledby="entity-card-car-title" selected>
        <WorkspaceEntityCardAction
          aria-haspopup="dialog"
          aria-label="Fahrzeug: TX631"
        />
        <div className="flex min-w-0 items-start gap-3">
          <WorkspaceEntityCardIcon aria-hidden="true">
            <CarFront size={18} strokeWidth={1.9} />
          </WorkspaceEntityCardIcon>
          <div className="min-w-0 flex-1">
            <h3
              className="truncate font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)] tracking-tight"
              id="entity-card-car-title"
            >
              TX631
            </h3>
            <span className="mt-1 block text-[12px] text-[var(--taxis-workspace-text-muted)] leading-snug">
              E-Klasse
            </span>
          </div>
        </div>

        <WorkspaceEntityCardMetrics>
          <WorkspaceEntityCardMetric label="Plätze" value="4" />
          <WorkspaceEntityCardMetric label="Aktiv" value="1" />
        </WorkspaceEntityCardMetrics>

        <WorkspaceEntityCardDetails>
          <div className="min-w-0">
            <WorkspaceEntityCardLabel>Status</WorkspaceEntityCardLabel>
            <p className="mt-1 text-[13px] text-[var(--taxis-workspace-text-secondary)] leading-snug">
              Aktive Schicht, bereit für Buchungen.
            </p>
          </div>
          <div className="min-w-0">
            <WorkspaceEntityCardLabel>Zuordnung</WorkspaceEntityCardLabel>
            <p className="mt-1 font-medium text-[13px] text-[var(--taxis-workspace-text-secondary)] leading-snug">
              Provider Fleet
            </p>
          </div>
        </WorkspaceEntityCardDetails>
      </WorkspaceEntityCard>
    </WorkspaceEntityGrid>
  ),
};
